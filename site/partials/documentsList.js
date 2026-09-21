'use strict';

/**
 * Раздел «Сведения об образовательной организации».
 *
 * Здесь перечислено всё, что публикуется на /documents/. Это же список —
 * единственный источник для сборщика: build.js копирует на хостинг ровно
 * эти файлы и ничего больше. Раньше он выкладывал два каталога целиком,
 * и на сервере лежали 38 файлов, на которые нет ни одной ссылки.
 *
 * Пути даны относительно documents/files/. Всё, что начинается с
 * «scans/», берётся из каталога сканов, остальное — из каталога PDF
 * (см. DOCS_SRC и SCANS_SRC в build.js).
 *
 * Структура подразделов повторяет ту, что была на старом сайте
 * (`/o-nas`), — она уже следовала требованиям к сайту образовательной
 * организации, поэтому используется как готовый чек-лист.
 */

const SECTIONS = [
  {
    id: 'osnovnye',
    title: 'Основные сведения',
    items: [
      { title: 'Основные сведения об образовательной организации', files: ['06_Osnovnye-svedeniya.pdf'] },
    ],
  },
  {
    id: 'struktura',
    title: 'Структура и органы управления',
    items: [
      { title: 'Структура и органы управления образовательной организацией', files: ['13_Struktura-i-organy-upravleniya.pdf'] },
    ],
  },
  {
    id: 'dokumenty',
    title: 'Документы',
    items: [
      {
        title: 'Устав АНО ДПО «Авто-класс»',
        // Титульный лист и восемь страниц. Взят фотокомплект, а не
        // сканы: в сканах отсутствует вторая страница.
        files: [
          'scans/ustav-titul.jpg',
          'scans/ustav-foto-1.jpeg',
          'scans/ustav-foto-2.jpeg',
          'scans/ustav-foto-3.jpeg',
          'scans/ustav-foto-4.jpeg',
          'scans/ustav-foto-5.jpeg',
          'scans/ustav-foto-6.jpeg',
          'scans/ustav-foto-7.jpeg',
          'scans/ustav-foto-8.jpeg',
        ],
        labels: ['Титул', 'с. 1', 'с. 2', 'с. 3', 'с. 4', 'с. 5', 'с. 6', 'с. 7', 'с. 8'],
      },
      {
        title: 'Лицензия на образовательную деятельность № 3846 от 26.02.2015 (бессрочная)',
        files: ['scans/licenziya-3846-str1.jpg', 'scans/licenziya-3846-str2.jpg', 'scans/licenziya-prilozhenie-1.jpg'],
        labels: ['Лист 1', 'Оборот', 'Приложение № 1'],
      },
      { title: 'Заключение ГИБДД № 366/59 (бессрочное)', files: ['scans/zaklyuchenie-gibdd-366-59-skan.jpg'] },
      { title: 'Положение о правилах приёма, перевода и отчисления обучающихся', files: ['18_Polozhenie-o-pravilah-priema.pdf'] },
      { title: 'Положение о формах, периодичности и порядке текущего контроля и аттестации', files: ['19_Polozhenie-o-attestacii.pdf'] },
      { title: 'Положение о режиме занятий обучающихся', files: ['21_Polozhenie-o-rezhime-zanyatiy.pdf'] },
      { title: 'Правила внутреннего распорядка обучающихся', files: ['22_Pravila-vnutrennego-rasporyadka-obuchayushchihsya.pdf'] },
      { title: 'Правила внутреннего трудового распорядка', files: ['20_Pravila-vnutrennego-trudovogo-rasporyadka.pdf'] },
      { title: 'Отчёт о результатах самообследования за 2024 год', files: ['12_Otchet-samoobsledovaniya-2024.pdf'] },
      { title: 'Отчёт о результатах самообследования за 2020 год', files: ['23_Otchet-samoobsledovaniya-2020.pdf'] },
      { title: 'Акт обследования Госавтоинспекцией, март 2026', files: ['24_Akt-obsledovaniya-Mart-2026.pdf'] },
      { title: 'Акт обследования Госавтоинспекцией, январь 2026', files: ['25_Akt-obsledovaniya-Yanvar-2026.pdf'] },
    ],
  },
  {
    id: 'obrazovanie',
    title: 'Образование',
    items: [
      { title: 'Сведения об образовательной деятельности', files: ['08_Obrazovanie.pdf'] },
      { title: 'Календарный учебный график', files: ['07_Kalendarnyy-uchebnyy-grafik.pdf'] },
      { title: 'Программы профессиональной подготовки водителей', files: ['11_Programmy-professionalnoy-podgotovki.pdf'] },
      { title: 'Рабочие учебные планы подготовки — по категориям', files: ['09_RUP-podgotovki.rar'] },
      { title: 'Рабочие учебные планы переподготовки — по категориям', files: ['10_RUP-perepodgotovki.rar'] },
    ],
  },
  {
    id: 'rukovodstvo',
    title: 'Руководство. Педагогический состав',
    items: [
      { title: 'Руководство и педагогический (научно-педагогический) состав', files: ['05_Rukovodstvo-pedagogicheskiy-sostav.pdf'] },
    ],
  },
  {
    id: 'matbaza',
    title: 'Материально-техническое обеспечение',
    items: [
      { title: 'Материально-техническое обеспечение и оснащённость образовательного процесса', files: ['04_Materialno-tehnicheskoe-obespechenie.pdf'] },
    ],
  },
  {
    id: 'platnye',
    title: 'Платные образовательные услуги',
    items: [
      { title: 'Положение об оказании платных образовательных услуг', files: ['02_Platnye-obrazovatelnye-uslugi.pdf'] },
      { title: 'Договор об оказании платных образовательных услуг', files: ['03_Dogovor-ob-okazanii-platnyh-uslug.pdf'] },
      // Дата вынесена в название намеренно: прейскурант давно не
      // обновлялся, и посетитель должен видеть это до того, как
      // примет цены за действующие.
      { title: 'Прейскурант стоимости обучения от 01.04.2021', files: ['01_Preyskurant-stoimosti-obucheniya.pdf'] },
    ],
  },
  {
    id: 'fhd',
    title: 'Финансово-хозяйственная деятельность',
    items: [
      { title: 'Сведения о финансово-хозяйственной деятельности', files: ['14_Finansovo-hozyaystvennaya-deyatelnost.pdf'] },
    ],
  },
  {
    id: 'vakantnye',
    title: 'Вакантные места для приёма',
    items: [
      { title: 'Вакантные места для приёма (перевода) обучающихся', files: ['15_Vakantnye-mesta.pdf'] },
    ],
  },
  {
    id: 'dostupnaya-sreda',
    title: 'Доступная среда',
    items: [
      { title: 'Сведения об обеспечении доступной среды', files: ['16_Dostupnaya-sreda.pdf'] },
    ],
  },
  {
    id: 'mezhdunarodnoe',
    title: 'Международное сотрудничество',
    items: [
      { title: 'Сведения о международном сотрудничестве', files: ['17_Mezhdunarodnoe-sotrudnichestvo.pdf'] },
    ],
  },
];

/** Все файлы раздела одним списком — для копирования в сборке. */
function allFiles() {
  return SECTIONS.flatMap((section) => section.items.flatMap((item) => item.files));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extOf(file) {
  const ext = file.slice(file.lastIndexOf('.') + 1).toUpperCase();
  return ext === 'JPEG' ? 'JPG' : ext;
}

/**
 * @param {(file: string) => number|null} sizeOf — размер файла в байтах
 *        (нужен, чтобы посетитель видел вес до скачивания)
 */
function documentsList(sizeOf) {
  const nav = SECTIONS.map(
    (s) => `<a class="docs-nav__link" href="#${s.id}">${escapeHtml(s.title)}</a>`
  ).join('\n          ');

  const sections = SECTIONS.map((section) => {
    const items = section.items
      .map((item) => {
        const single = item.files.length === 1;
        const links = item.files
          .map((file, i) => {
            const label = single
              ? extOf(file)
              : (item.labels && item.labels[i]) || `Лист ${i + 1}`;
            const bytes = sizeOf(file);
            const weight = bytes ? ` · ${Math.max(1, Math.round(bytes / 1024))} КБ` : '';
            const title = single ? `${extOf(file)}${weight}` : `${extOf(file)}${weight}`;
            return `<a class="docs-file" href="/documents/files/${file}" target="_blank" rel="noopener" title="${escapeHtml(title)}">${escapeHtml(label)}</a>`;
          })
          .join('\n              ');

        return `
          <li class="docs-item">
            <span class="docs-item__title">${escapeHtml(item.title)}</span>
            <span class="docs-item__files">
              ${links}
            </span>
          </li>`;
      })
      .join('');

    return `
      <section class="docs-section" id="${section.id}">
        <h2 class="docs-section__title">${escapeHtml(section.title)}</h2>
        <ul class="docs-list">${items}
        </ul>
      </section>`;
  }).join('\n');

  return `<nav class="docs-nav" aria-label="Подразделы сведений об организации">
          ${nav}
        </nav>
${sections}`;
}

module.exports = documentsList;
module.exports.SECTIONS = SECTIONS;
module.exports.allFiles = allFiles;
