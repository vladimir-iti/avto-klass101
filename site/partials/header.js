'use strict';

const icons = require('./icons');
const { CONTACTS, DIRECTIONS } = require('./data');

/**
 * @param {string} activeKey - 'home' | 'category-b' | 'category-a' | 'professional' | 'tractor'
 * @param {boolean} hasForm - есть ли на этой странице своя форма #lead-form
 */
function header(activeKey, hasForm = true) {
  const isDirectionsActive = DIRECTIONS.some((d) => d.key === activeKey);
  const leadHref = hasForm ? '#lead-form' : '/#lead-form';

  const dirItems = DIRECTIONS.map(
    (d) => `
              <a class="nav-dropdown__item" href="${d.href}">
                <span class="nav-dropdown__item-title">${d.label}</span>
                <span class="hint">${d.hint}</span>
              </a>`
  ).join('');

  return `<header class="site-header" data-header>
    <div class="site-header__inner">
      <a class="site-logo" href="/" aria-label="Авто-Класс — на главную">
        <img src="/images/logo/logo-color-web.webp" width="163" height="93" alt="Авто-Класс" />
      </a>

      <nav class="main-nav" aria-label="Основная навигация">
        <div class="nav-dropdown">
          <button type="button" class="main-nav__link has-menu${isDirectionsActive ? ' is-active' : ''}" aria-expanded="false" aria-controls="directions-menu">
            Обучение ${icons.chevronDown}
          </button>
          <div class="nav-dropdown__panel" id="directions-menu">${dirItems}
          </div>
        </div>
        <a class="main-nav__link" href="/#about">Об автошколе</a>
        <a class="main-nav__link" href="#contacts">Контакты</a>
      </nav>

      <div class="site-header__actions">
        <a class="site-header__phone" href="${CONTACTS.phoneMainHref}">
          <strong>${CONTACTS.phoneMain}</strong>
        </a>
        <a class="btn btn-primary btn-sm" href="${leadHref}" data-open-lead>Записаться</a>
        <button type="button" class="nav-toggle" data-nav-toggle aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-nav">
          <span class="nav-toggle__bars"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
  </header>`;
}

module.exports = header;
