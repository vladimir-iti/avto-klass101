(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Дата ближайшего набора группы в первом экране.

     Источник — веб-приложение Google Apps Script, привязанное к отдельной
     таблице «Автокласс даты набора» (не к таблице заявок с форм: правка
     дат не должна задевать приём заявок). Две даты лежат в ячейках B1 и
     B2 первого листа: одна на все автомобильные категории, вторая на все
     тракторные. Инструкция по настройке — docs/intake-dates-setup.md.

     Заказчику для смены даты достаточно отредактировать ячейку:
     скрипт и сайт править не нужно.

     Пока адрес не вставлен, строка с датой на сайте не показывается —
     первый экран выглядит так же, как до её появления. Адрес выдаёт
     Google при развёртывании скрипта (шаг 2 инструкции), он заканчивается
     на /exec.
     --------------------------------------------------------------------- */
  var INTAKE_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbyjqZ_EUh5EtQo0XfrfdTB5xmNQlxFkmHYkH81lni2-3I-2-AT3k7DeXJk0NJsfC4YK/exec';

  var CACHE_KEY = 'ak-intake-v1';
  // Сколько живёт запись в кеше. Кеш нужен, чтобы на повторных визитах
  // дата появлялась сразу, без ожидания сети, и чтобы сайт пережил
  // недоступность Google. Неделя — потолок: после неё дата слишком
  // вероятно устарела, и лучше не показывать ничего.
  var CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
  var REQUEST_TIMEOUT_MS = 8000;

  var slots = document.querySelectorAll('[data-intake]');
  if (!slots.length) return;

  // Внешние контейнеры строки: на главной внутри одного лежат две даты
  // (автомобили и трактор), на остальных страницах — одна.
  var groups = document.querySelectorAll('[data-intake-group]');

  /** Контейнер виден, только пока внутри осталась хотя бы одна дата. */
  function syncGroups() {
    Array.prototype.forEach.call(groups, function (group) {
      var items = group.querySelectorAll('[data-intake]');
      var anyVisible = false;
      Array.prototype.forEach.call(items, function (item) {
        if (!item.hidden) anyVisible = true;
      });
      group.hidden = !anyVisible;
    });
  }

  /* --- хранилище: в приватном режиме доступ к localStorage бросает --- */
  function readCache() {
    try {
      var raw = window.localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      if (!parsed.savedAt || Date.now() - parsed.savedAt > CACHE_MAX_AGE_MS) return null;
      return parsed.data;
    } catch (e) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data: data }));
    } catch (e) {
      /* приватный режим или переполненное хранилище — не повод падать */
    }
  }

  /* ---------------------------------------------------------------------
     Отрисовка

     Ответ на каждую группу — объект { text, iso }:
       text — то, что видит посетитель («15 сентября»), готовую строку
              собирает Apps Script, чтобы сайт не занимался склонением
              месяцев и разбором того, что именно заказчик ввёл в ячейку;
       iso  — та же дата как YYYY-MM-DD, если в ячейке настоящая дата,
              а не произвольный текст. Нужна только для проверки ниже.
     --------------------------------------------------------------------- */

  /** Прошедшую дату не показываем: забытая в таблице дата хуже пустого места. */
  function isExpired(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false; // текст вместо даты — проверить нечем
    var today = new Date();
    var todayIso =
      today.getFullYear() +
      '-' + String(today.getMonth() + 1).padStart(2, '0') +
      '-' + String(today.getDate()).padStart(2, '0');
    return iso < todayIso;
  }

  /**
   * @param {object|null} data      — ответ источника
   * @param {boolean} authoritative — данные только что пришли из источника
   *        и считаются истиной. Тогда слот, для которого показывать
   *        нечего, прячется. Для данных из кеша это false: кеш не повод
   *        убирать то, что уже на экране.
   */
  function render(data, authoritative) {
    var hasData = !!data && typeof data === 'object';
    var shown = false;

    slots.forEach(function (slot) {
      var entry = hasData ? data[slot.getAttribute('data-intake')] : null;
      var text =
        entry && typeof entry === 'object' && typeof entry.text === 'string'
          ? entry.text.trim()
          : '';
      var dateEl = slot.querySelector('.intake__date');

      if (!text || isExpired(entry.iso)) {
        // Показывать нечего: дату убрали из таблицы или она уже прошла.
        // Прячем плашку, даже если на ней стоит дата, показанная ранее
        // из кеша, — иначе прошедший набор висел бы на сайте до тех пор,
        // пока не протухнет кеш.
        if (authoritative) {
          slot.hidden = true;
          if (dateEl) dateEl.textContent = '';
        }
        return;
      }

      if (!dateEl) return;
      dateEl.textContent = text;
      slot.hidden = false;   // появление анимирует CSS, см. @keyframes intake-in
      shown = true;
    });

    syncGroups();
    return shown;
  }

  /* --- сначала кеш (мгновенно), потом сеть (актуальное) --- */
  render(readCache(), false);

  if (!INTAKE_ENDPOINT_URL || !window.fetch) return;

  var controller = null;
  var timer = null;
  if ('AbortController' in window) {
    controller = new AbortController();
    timer = window.setTimeout(function () {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);
  }

  /* ---------------------------------------------------------------------
     Запасной путь — JSONP.

     Apps Script отдаёт CORS-заголовок не во всех случаях: страница
     ошибки («Не удалось найти функцию скрипта: doGet») приходит вообще
     без него, и обычный fetch на ней падает. Подключение <script> — это
     не межсайтовый запрос в смысле CORS, поэтому работает независимо
     от заголовков. Используется только если fetch не удался.
     --------------------------------------------------------------------- */
  function loadViaJsonp() {
    var callbackName = '__akIntakeCb' + Date.now();
    var script = document.createElement('script');
    var jsonpTimer = null;

    function cleanup() {
      if (jsonpTimer) window.clearTimeout(jsonpTimer);
      try {
        delete window[callbackName];
      } catch (e) {
        window[callbackName] = undefined;
      }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = function (data) {
      cleanup();
      if (!data || typeof data !== 'object') return;
      render(data, true);
      writeCache(data);
    };

    script.src =
      INTAKE_ENDPOINT_URL +
      (INTAKE_ENDPOINT_URL.indexOf('?') === -1 ? '?' : '&') +
      'callback=' + callbackName;
    script.async = true;
    script.onerror = cleanup;
    jsonpTimer = window.setTimeout(cleanup, REQUEST_TIMEOUT_MS);
    document.head.appendChild(script);
  }

  fetch(INTAKE_ENDPOINT_URL, {
    method: 'GET',
    // Без no-store браузер может отдать вчерашний ответ из своего кеша,
    // и новая дата из таблицы появилась бы у посетителя с задержкой.
    cache: 'no-store',
    signal: controller ? controller.signal : undefined,
  })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      // Apps Script отдаёт свои ошибки HTML-страницей с кодом 200
      // («Не удалось найти функцию скрипта: doGet»), поэтому на
      // успешный статус полагаться нельзя — разбираем именно JSON.
      return response.json();
    })
    .then(function (data) {
      if (timer) window.clearTimeout(timer);
      if (!data || typeof data !== 'object') return;
      render(data, true);
      // Кеш перезаписываем всегда, а не только когда что-то показали:
      // иначе прошедшая дата вернулась бы из старого кеша при следующем
      // заходе и висела бы до конца недели.
      writeCache(data);
    })
    .catch(function () {
      /* Сеть, CORS, таймаут, невалидный JSON, отозванное развёртывание.
         Пробуем второй путь; если и он молчит — просто остаёмся без
         плашки. Консоль не сорим: для посетителя это не ошибка. */
      if (timer) window.clearTimeout(timer);
      loadViaJsonp();
    });
})();
