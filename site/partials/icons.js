'use strict';

// Небольшая библиотека инлайн-SVG-иконок. stroke="currentColor" — цвет
// наследуется от родителя. У каждой иконки задан размер по умолчанию
// (через width/height) — там, где нужен другой размер, его переопределяет
// CSS свойство width/height у более конкретного селектора (например
// .trust-item__icon svg), которое имеет приоритет над HTML-атрибутом.

const icons = {
  chevronDown: `<svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowRight: `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true"><path d="M9 1l5.5 5-5.5 5M1 6h13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1v12M1 7h12" stroke="#181818" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  check: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor" opacity=".12"/><path d="M6 10.2l2.6 2.6L14 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  checkPlain: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10.5l4 4L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  phone: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M4 4.5c0 7.5 6 13.5 13.5 13.5l2-3-4.7-2-1.6 1.9a11 11 0 01-5.6-5.6L9.5 7 7.5 2.5l-3 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  pin: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M11 20s7-6.3 7-11.5A7 7 0 004 8.5C4 13.7 11 20 11 20z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="11" cy="8.3" r="2.4" stroke="currentColor" stroke-width="1.5"/></svg>`,
  clock: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8.3" stroke="currentColor" stroke-width="1.5"/><path d="M11 6.7V11l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  shield: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M11 2.6l7 2.5v5.4c0 5-3 7.9-7 9-4-1.1-7-4-7-9V5.1l7-2.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7.8 11.2l2.2 2.2 4.2-4.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  doc: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M6 2.5h7l4 4v12.4a.6.6 0 01-.6.6H6.6a.6.6 0 01-.6-.6V3.1a.6.6 0 01.6-.6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 2.5V7h4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  gear: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M11 2.5v2.3M11 17.2v2.3M19.5 11h-2.3M4.8 11H2.5M17 5l-1.6 1.6M6.6 15.4L5 17M17 17l-1.6-1.6M6.6 6.6L5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  users: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="8.5" cy="7.5" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M2.8 18c.6-3 2.8-4.8 5.7-4.8s5.1 1.8 5.7 4.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14.5 5a3 3 0 010 5.6M17.5 18c-.4-2.3-1.6-3.9-3.4-4.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  car: `<svg width="24" height="22" viewBox="0 0 24 22" fill="none" aria-hidden="true"><path d="M3 13.5l1.6-5A2 2 0 016.5 7h11a2 2 0 011.9 1.5l1.6 5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="2" y="13.5" width="20" height="4.7" rx="1.4" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="18.3" r="1.6" fill="currentColor"/><circle cx="17.5" cy="18.3" r="1.6" fill="currentColor"/></svg>`,
  route: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="5" cy="17" r="2.2" stroke="currentColor" stroke-width="1.5"/><circle cx="17" cy="5" r="2.2" stroke="currentColor" stroke-width="1.5"/><path d="M6.8 15.4S13 11 13 7.4a4 4 0 00-6.2-3.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  calendar: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="3" y="4.5" width="16" height="14.5" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 9h16M7 2.5V6M15 2.5V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  medical: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M11 7v8M7 11h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  tractor: `<svg width="24" height="22" viewBox="0 0 24 22" fill="none" aria-hidden="true"><circle cx="6" cy="16.5" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="17.5" r="2.7" stroke="currentColor" stroke-width="1.5"/><path d="M6 12.7V6h4l3 4.3h4.3L20 13.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  play: `<svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden="true"><path d="M2 2.4v17.2a1 1 0 001.5.9l14.8-8.6a1 1 0 000-1.8L3.5 1.5A1 1 0 002 2.4z" fill="#181818"/></svg>`,
  menu: `<svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true"><path d="M1 1h18M1 7h18M1 13h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M1 1l16 16M17 1L1 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

module.exports = icons;
