'use strict';

const icons = require('./icons');

// short — вариант для узких экранов: первый экран на телефоне имеет
// фиксированную высоту, и каждая лишняя строка отъедает её у фото.
const GROUPS = {
  auto: { icon: icons.car, title: 'Автомобили', short: 'Авто' },
  moto: { icon: icons.moto, title: 'Мотоциклы', short: 'Мото' },
  tractor: { icon: icons.tractor, title: 'Трактор', short: 'Трактор' },
};

/**
 * Строка «Ближайшие наборы групп» в первом экране.
 *
 * В разметку попадает пустой и скрытой: даты подставляет js/intake.js
 * после загрузки из Google Таблицы. Если дата не пришла (нет сети,
 * Google недоступен, ячейка пустая, дата уже прошла) — строка так
 * и остаётся скрытой, и первый экран выглядит ровно так же, как до
 * её появления. Поэтому запасного текста в разметке намеренно нет:
 * показать неактуальную дату хуже, чем не показать никакой.
 *
 * Внешний контейнер помечен data-intake-group, каждая дата внутри —
 * data-intake. Скрипт управляет ими по отдельности и прячет контейнер,
 * когда не осталось ни одной даты.
 *
 * @param {'auto'|'moto'|'tractor'|Array<string>} groups — какие даты показывать
 */
function intakeBadge(groups) {
  const list = Array.isArray(groups) ? groups : [groups];
  const many = list.length > 1;

  // При нескольких направлениях подписываем каждое — иначе непонятно,
  // какая дата к чему. При одном подпись уже есть в заголовке строки.
  const items = list
    .map((key) => {
      const meta = GROUPS[key];
      const what =
        meta.short === meta.title
          ? meta.title
          : `<span class="intake__what-full">${meta.title}</span><span class="intake__what-short">${meta.short}</span>`;
      const caption = many
        ? `<span class="intake__icon">${meta.icon}</span><span class="intake__what">${what}</span>`
        : '';
      return `
                <span class="intake__item" data-intake="${key}" hidden>${caption}<strong class="intake__date"></strong></span>`;
    })
    .join('');

  return `<p class="intake" data-intake-group hidden>
            <span class="intake__label">${many ? 'Ближайшие наборы групп' : 'Ближайший набор группы'}</span>
            <span class="intake__items">${items}
            </span>
          </p>`;
}

module.exports = intakeBadge;
