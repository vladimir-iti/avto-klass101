'use strict';

// Единый источник контактных данных и направлений — используется в header,
// footer, формах и Schema.org разметке. Меняется в одном месте.

const CONTACTS = {
  phoneMain: '+7 (342) 27-604-05',
  phoneMainHref: 'tel:+73422760405',
  phoneMira: '+7 (342) 22-666-99',
  phoneMiraHref: 'tel:+73422266699',
  phoneVetluzhskaya: '+7 (951) 927-22-55',
  phoneVetluzhskayaHref: 'tel:+79519272255',
  email: 'avto-klass59@mail.ru',
  vk: 'https://vk.com/club105101529',
  addressMira: 'г. Пермь, ул. Мира, 75',
  addressVetluzhskaya: 'г. Пермь, ул. Ветлужская, 60/1',
  addressPolygon: 'г. Пермь, ул. Встречная, 28',
};

const DIRECTIONS = [
  { key: 'category-b', href: '/category-b/', label: 'Категория B', hint: 'Легковой автомобиль' },
  { key: 'category-a', href: '/category-a/', label: 'Категория A', hint: 'Мотоцикл' },
  { key: 'professional', href: '/professional/', label: 'Проф. категории', hint: 'C · D · BE · CE · DE' },
  { key: 'tractor', href: '/tractor/', label: 'Тракторная техника', hint: 'Тракторы и спецтехника' },
];

module.exports = { CONTACTS, DIRECTIONS };
