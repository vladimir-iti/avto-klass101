'use strict';

const icons = require('./icons');

/**
 * Блок «Из чего складывается стоимость».
 * Цены намеренно не публикуются: заказчик меняет их, и точную сумму
 * называет администратор. Вместо цифр — состав курса и кнопка запроса.
 *
 * @param {object} opts
 * @param {string} opts.hours   — часы практики по программе, например '56 часов'
 * @param {string} [opts.extra] — дополнительная строка состава (необязательно)
 * @param {string} [opts.href]  — куда ведёт кнопка (по умолчанию форма на странице)
 */
function priceBlock({ hours, extra, href = '#lead-form' } = {}) {
  const rows = [
    { icon: icons.doc, title: 'Теоретический курс', desc: 'занятия в классе и подготовка к экзамену' },
    { icon: icons.car, title: 'Практическое вождение', desc: `${hours} по программе` },
    { icon: icons.clock, title: 'Дополнительные часы', desc: 'можно взять больше или меньше' },
  ];
  if (extra) rows.push({ icon: icons.route, title: extra.title, desc: extra.value });

  const rowsHtml = rows
    .map(
      (r) => `
      <div class="price-card__row">
        <span class="price-card__row-icon">${r.icon}</span>
        <div class="price-card__row-text">
          <dt>${r.title}</dt>
          <dd>${r.desc}</dd>
        </div>
      </div>`
    )
    .join('');

  return `<div class="price-card reveal">
    <dl class="price-card__list">${rowsHtml}
    </dl>

    <div class="price-card__aside">
      <span class="price-card__aside-label">Стоимость по запросу</span>
      <p>Точную сумму назовёт администратор — она зависит от категории и текущих условий набора.</p>
      <a class="btn btn-primary btn-block" href="${href}" data-open-lead>Узнать стоимость</a>
      <p class="price-card__installment">${icons.checkPlain} Рассрочка: три платежа до конца обучения</p>
    </div>
  </div>`;
}

module.exports = priceBlock;
