'use strict';

const { CONTACTS, DIRECTIONS } = require('./data');

function footer() {
  const year = new Date().getFullYear();
  const dirLinks = DIRECTIONS.map((d) => `<li><a href="${d.href}">${d.label}</a></li>`).join('\n            ') +
    '\n            <li><a href="/#directions">Все направления</a></li>';

  return `<footer class="site-footer" id="contacts">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="/images/logo/logo-light-web.webp" width="150" height="86" alt="Авто-Класс" />
          <p>Автошкола «Авто-Класс» в Перми. Подготовка водителей категорий A, B, C, D, BE, CE, DE и трактористов. Работаем на основании бессрочной лицензии.</p>
          <a class="footer-social" href="${CONTACTS.vk}" target="_blank" rel="noopener" aria-label="Мы во ВКонтакте">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22.9 7.3c.2-.5 0-.9-.7-.9h-2.3c-.6 0-.9.3-1 .7 0 0-1.2 2.9-2.9 4.8-.6.6-.8.8-1.1.8-.2 0-.3-.2-.3-.7V7.3c0-.6-.2-.9-.7-.9h-3.6c-.4 0-.6.3-.6.6 0 .6.9.7 1 2.3v3.4c0 .8-.1.9-.4.9-.9 0-2.9-2.9-4.1-6.2-.3-.6-.5-.9-1.1-.9H2.8c-.6 0-.8.3-.8.7 0 .7 1 4 4.5 8.4 2.4 3 5.7 4.6 8.7 4.6 1.8 0 2-.4 2-1.1v-2.5c0-.7.2-.9.6-.9.3 0 .9.2 2.2 1.5 1.5 1.5 1.7 2.1 2.6 2.1h2.3c.6 0 .9-.3.7-.9-.2-.6-.9-1.5-1.9-2.6-.5-.6-1.3-1.3-1.5-1.6-.3-.4-.2-.6 0-1 0 0 2.6-3.6 2.8-4.9z" fill="currentColor"/></svg>
          </a>
        </div>

        <div class="footer-col">
          <h2>Направления</h2>
          <ul>
            ${dirLinks}
          </ul>
        </div>

        <div class="footer-col">
          <h2>Информация</h2>
          <ul>
            <li><a href="/#about">Об автошколе</a></li>
            <li><a href="/#instructors">Инструкторы</a></li>
            <li><a href="/#fleet">Автопарк</a></li>
            <li><a href="/documents/">Документы и лицензия</a></li>
            <li><a href="/policy/">Политика конфиденциальности</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h2>Контакты</h2>
          <div class="footer-branches">
            <div class="footer-branch">
              <strong>${CONTACTS.addressMira}</strong>
              <a href="${CONTACTS.phoneMiraHref}">${CONTACTS.phoneMira}</a>
            </div>
            <div class="footer-branch">
              <strong>${CONTACTS.addressVetluzhskaya}</strong>
              <a href="${CONTACTS.phoneVetluzhskayaHref}">${CONTACTS.phoneVetluzhskaya}</a>
            </div>
            <div class="footer-branch">
              <strong>Закрытая площадка</strong>
              <span>${CONTACTS.addressPolygon}</span>
            </div>
            <div class="footer-branch">
              <strong>Автодром тракторной техники</strong>
              <span>${CONTACTS.addressTractor}</span>
              <a href="${CONTACTS.phoneTractorHref}">${CONTACTS.phoneTractor}</a>
            </div>
            <a class="footer-strong" href="mailto:${CONTACTS.email}">${CONTACTS.email}</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom__left">
          <span>© ${year} АНО ДПО «Авто-класс»</span>
          <a href="/documents/">Лицензия № 3846 от 26.02.2015</a>
          <a href="/policy/">Политика обработки персональных данных</a>
        </div>
      </div>
      <p class="footer-legal-note" style="margin-top:18px">АНО ДПО «Авто-класс», ИНН 5905279037, ОГРН 1105900001635. Юридический адрес: 614036, Пермский край, г. Пермь, ул. Мира, д. 75. Образовательная деятельность осуществляется на основании бессрочной лицензии № 3846 от 26.02.2015, выданной Государственной инспекцией по надзору и контролю в сфере образования Пермского края.</p>
    </div>
  </footer>`;
}

module.exports = footer;
