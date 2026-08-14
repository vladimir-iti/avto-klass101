'use strict';

/**
 * Общая часть <head>: favicon, шрифты, CSS, базовые meta.
 * @param {string[]} pageCss - дополнительные CSS-файлы конкретной страницы
 */
function headCommon(pageCss = []) {
  const extraCss = pageCss.map((f) => `  <link rel="stylesheet" href="/css/${f}" />`).join('\n');

  return `  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#F7F7F5" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" type="image/png" href="/images/logo/favicon-192.png" sizes="192x192" />
  <link rel="icon" type="image/png" href="/images/logo/favicon-512.png" sizes="512x512" />
  <link rel="apple-touch-icon" href="/images/logo/apple-touch-icon.png" />
  <link rel="preload" href="/fonts/manrope-cyrillic.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/css/tokens.css" />
  <link rel="stylesheet" href="/css/base.css" />
  <link rel="stylesheet" href="/css/components.css" />
  <link rel="stylesheet" href="/css/header-footer.css" />
  <link rel="stylesheet" href="/css/hero.css" />
${extraCss}
  <meta name="generator" content="Авто-Класс static build" />`;
}

module.exports = headCommon;
