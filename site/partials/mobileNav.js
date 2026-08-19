'use strict';

const { CONTACTS, DIRECTIONS } = require('./data');

function mobileNav(hasForm = true) {
  const leadHref = hasForm ? '#lead-form' : '/#lead-form';
  const dirLinks = DIRECTIONS.map((d) => `<a href="${d.href}">${d.label}</a>`).join('\n            ');

  return `<div class="mobile-nav" id="mobile-nav" data-mobile-nav role="dialog" aria-modal="true" aria-label="Меню сайта" hidden>
    <div class="mobile-nav__top">
      <a href="/" aria-label="Авто-Класс — на главную">
        <img src="/images/logo/logo-color-web.webp" width="140" height="80" alt="Авто-Класс" />
      </a>
      <button type="button" class="nav-toggle" data-nav-close aria-label="Закрыть меню">
        <span class="nav-toggle__bars" style="transform:rotate(45deg)"><span style="top:5px"></span><span style="opacity:0"></span><span style="top:5px;transform:rotate(90deg)"></span></span>
      </button>
    </div>
    <nav class="mobile-nav__body" aria-label="Мобильная навигация">
      <div class="mobile-nav__link">Обучение</div>
      <div class="mobile-nav__sub">
            ${dirLinks}
      </div>
      <a class="mobile-nav__link" href="/#about">Об автошколе</a>
      <a class="mobile-nav__link" href="#contacts">Контакты</a>

      <div class="mobile-nav__foot">
        <a class="mobile-nav__phone" href="${CONTACTS.phoneMainHref}">${CONTACTS.phoneMain}</a>
        <a class="btn btn-primary btn-block btn-lg" href="${leadHref}" data-open-lead data-nav-close>Записаться на обучение</a>
      </div>
    </nav>
  </div>`;
}

module.exports = mobileNav;
