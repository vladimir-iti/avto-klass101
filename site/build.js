#!/usr/bin/env node
'use strict';

/**
 * Статический сборщик сайта «Авто-Класс».
 *
 * Без фреймворков и зависимостей: читает шаблоны страниц из pages/*.html,
 * подставляет общие partial'ы (header/footer/mobile-nav/head) и мета-теги,
 * копирует статику (css/js/fonts/images/video) и пишет результат в dist/ —
 * чистый набор HTML/CSS/JS, готовый к загрузке на обычный хостинг (Beget).
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PAGES_DIR = path.join(ROOT, 'pages');
const DIST = path.join(ROOT, 'dist');
const DOCS_SRC = path.join(ROOT, '..', 'source-materials', 'old-site', '06-dokumenty-pdf');
const SCANS_SRC = path.join(ROOT, '..', 'source-materials', 'old-site', '05-dokumenty-skany');

const header = require('./partials/header');
const mobileNav = require('./partials/mobileNav');
const footer = require('./partials/footer');
const headCommon = require('./partials/headCommon');
const icons = require('./partials/icons');
const priceBlock = require('./partials/priceBlock');

const ICON_TOKENS = {
  '{{ICON_SHIELD}}': icons.shield,
  '{{ICON_PIN}}': icons.pin,
  '{{ICON_PHONE}}': icons.phone,
  '{{ICON_CLOCK}}': icons.clock,
  '{{ICON_ARROW}}': icons.arrowRight,
  '{{ICON_CHECK}}': icons.check,
  '{{ICON_CHECK_PLAIN}}': icons.checkPlain,
  '{{ICON_DOC}}': icons.doc,
  '{{ICON_CALENDAR}}': icons.calendar,
  '{{ICON_GEAR}}': icons.gear,
  '{{ICON_PLUS}}': icons.plus,
  '{{ICON_PLAY}}': icons.play,
  '{{ICON_MEDICAL}}': icons.medical,
  '{{ICON_TRACTOR}}': icons.tractor,
  '{{ICON_CAR}}': icons.car,
  '{{ICON_USERS}}': icons.users,
  '{{ICON_ROUTE}}': icons.route,
};

const SITE_ORIGIN = 'https://avto-klass101.ru';

// ---------------------------------------------------------------------------

const ORG_SCHEMA_BASE = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Авто-Класс',
  legalName: 'АНО ДПО «Авто-класс»',
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/images/logo/logo-color-2x.png`,
  telephone: '+7-342-27-604-05',
  email: 'avto-klass59@mail.ru',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Мира, 75',
      addressLocality: 'Пермь',
      addressCountry: 'RU',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Ветлужская, 60/1',
      addressLocality: 'Пермь',
      addressCountry: 'RU',
    },
  ],
  sameAs: ['https://vk.com/club105101529'],
};

const PAGES = [
  {
    slug: '',
    file: 'index.html',
    activeKey: 'home',
    pageCss: [],
    title: 'Автошкола «Авто-Класс» в Перми — обучение вождению категорий A, B, C, D, BE, CE, DE и трактористов',
    description: 'Автошкола «Авто-Класс» в Перми: подготовка водителей категорий A, B, C, D, BE, CE, DE и трактористов. Собственная закрытая площадка, автомобили с АКП, бессрочная лицензия. Приём круглый год.',
    ogImage: '/images/category-b/picanto-side.webp',
    priceHours: 'от 16 до 100 часов по категории',
    schema: ORG_SCHEMA_BASE,
  },
  {
    slug: 'category-b',
    file: 'category-b.html',
    activeKey: 'category-b',
    pageCss: ['category.css'],
    title: 'Обучение на категорию B в Перми — автошкола «Авто-Класс»',
    description: '190 академических часов, 56 часов практики, механика и АКП. Закрытая площадка с эстакадой, вечерние занятия, приём круглый год. Автошкола «Авто-Класс», Пермь.',
    ogImage: '/images/category-b/picanto-side.webp',
    priceHours: '56 часов',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Профессиональное обучение водителей категории B',
      description: 'Программа подготовки водителей категории B: 190/188 академических часов, 56/54 часа практического вождения.',
      provider: { '@type': 'EducationalOrganization', name: 'Авто-Класс', sameAs: SITE_ORIGIN },
    },
  },
  {
    slug: 'category-a',
    file: 'category-a.html',
    activeKey: 'category-a',
    pageCss: ['category.css'],
    title: 'Обучение на категорию A и A1 в Перми — автошкола «Авто-Класс»',
    description: 'Подготовка водителей мотоциклов категории A и A1 в Перми. Практика на закрытой площадке, собственный парк мототехники. Автошкола «Авто-Класс».',
    ogImage: '/images/category-a/motocikl-krasny.webp',
    priceHours: '18 часов',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Профессиональное обучение водителей категории A и A1',
      description: 'Программа подготовки водителей категории A: 130/128 академических часов, 18/16 часов практического вождения.',
      provider: { '@type': 'EducationalOrganization', name: 'Авто-Класс', sameAs: SITE_ORIGIN },
    },
  },
  {
    slug: 'professional',
    file: 'professional.html',
    activeKey: 'professional',
    pageCss: ['professional.css'],
    title: 'Категории C, D, BE, CE, DE — обучение и переподготовка водителей — «Авто-Класс»',
    description: 'Подготовка и переподготовка водителей категорий C, D, BE, CE, DE в Перми. Грузовики, автобусы, прицепы. Партнёры по трудоустройству. Автошкола «Авто-Класс».',
    ogImage: '/images/professional/gaz-next.webp',
    priceHours: 'от 16 до 100 часов',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Профессиональные категории обучения',
      itemListElement: ['C', 'D', 'BE', 'CE', 'DE'].map((c, i) => ({
        '@type': 'Course',
        position: i + 1,
        name: `Обучение водителей категории ${c}`,
        provider: { '@type': 'EducationalOrganization', name: 'Авто-Класс' },
      })),
    },
  },
  {
    slug: 'tractor',
    file: 'tractor.html',
    activeKey: 'tractor',
    pageCss: ['tractor.css'],
    title: 'Права тракториста-машиниста в Перми — категории B, C, D, E — «Авто-Класс»',
    description: 'Обучение на права тракториста-машиниста в Перми: категории B, C, D, E, снегоход и квадроцикл, погрузчик и экскаватор. Автодром на Леонова, 67. Срок обучения около 1,5 месяцев.',
    ogImage: '/images/tractor/t25-estakada.webp',
    priceHours: 'на площадке и маршруте',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Подготовка трактористов',
      provider: { '@type': 'EducationalOrganization', name: 'Авто-Класс', sameAs: SITE_ORIGIN },
    },
  },
  {
    slug: 'documents',
    file: 'documents.html',
    activeKey: '',
    pageCss: ['category.css'],
    title: 'Документы и лицензия — автошкола «Авто-Класс»',
    description: 'Лицензия на образовательную деятельность, заключение ГИБДД и другие документы автошколы «Авто-Класс» в Перми.',
    ogImage: '/images/logo/logo-color-2x.png',
    schema: null,
    hasForm: false,
  },
  {
    slug: 'policy',
    file: 'policy.html',
    activeKey: '',
    pageCss: [],
    title: 'Политика обработки персональных данных — автошкола «Авто-Класс»',
    description: 'Политика обработки персональных данных АНО ДПО «Авто-класс».',
    ogImage: '/images/logo/logo-color-2x.png',
    schema: null,
    hasForm: false,
  },
];

// ---------------------------------------------------------------------------

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function replaceAll(str, map) {
  let out = str;
  for (const [token, value] of Object.entries(map)) {
    out = out.split(token).join(value);
  }
  return out;
}

/**
 * Префикс для размещения не в корне домена (GitHub Pages отдаёт проект
 * по адресу вида /avto-klass101/). Для боевого домена остаётся пустым.
 * Задаётся переменной окружения BASE_PATH, например: BASE_PATH=/avto-klass101
 */
const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/$/, '');
// Превью-сборка закрывается от индексации, чтобы не конкурировать
// с боевым доменом в поиске.
const IS_PREVIEW = process.env.PREVIEW === '1';

/** Дописывает префикс ко всем внутренним ссылкам вида href="/..." и src="/..." */
function withBasePath(html) {
  if (!BASE_PATH) return html;
  return html
    .replace(/(\s(?:href|src)=")\/(?!\/)/g, `$1${BASE_PATH}/`)
    .replace(/(\scontent=")\/(?!\/)/g, `$1${BASE_PATH}/`)
    // srcset — это список «путь дескриптор, путь дескриптор», поэтому
    // одним общим правилом для атрибутов он не покрывается: префикс
    // нужно подставить каждому пути внутри значения.
    .replace(/\ssrcset="([^"]*)"/g, (m, list) =>
      ' srcset="' + list.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE_PATH}/`) + '"');
}

/** То же для путей внутри CSS: url('/fonts/...') */
function cssWithBasePath(css) {
  if (!BASE_PATH) return css;
  return css.replace(/url\((['"]?)\/(?!\/)/g, `url($1${BASE_PATH}/`);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function outPathFor(page) {
  return page.slug === '' ? path.join(DIST, 'index.html') : path.join(DIST, page.slug, 'index.html');
}

function canonicalFor(page) {
  return page.slug === '' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/${page.slug}/`;
}

function build() {
  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });

  // --- статические каталоги ---
  copyDir(path.join(SRC, 'css'), path.join(DIST, 'css'));
  copyDir(path.join(SRC, 'js'), path.join(DIST, 'js'));
  copyDir(path.join(SRC, 'fonts'), path.join(DIST, 'fonts'));
  copyDir(path.join(SRC, 'images'), path.join(DIST, 'images'));
  copyDir(path.join(SRC, 'video'), path.join(DIST, 'video'));
  copyDir(DOCS_SRC, path.join(DIST, 'documents', 'files'));
  copyDir(SCANS_SRC, path.join(DIST, 'documents', 'files', 'scans'));

  fs.copyFileSync(path.join(SRC, 'images', 'logo', 'favicon.ico'), path.join(DIST, 'favicon.ico'));

  // --- страницы ---
  for (const page of PAGES) {
    const tplPath = path.join(PAGES_DIR, page.file);
    if (!fs.existsSync(tplPath)) {
      console.warn('WARN: missing page template', tplPath);
      continue;
    }
    let html = fs.readFileSync(tplPath, 'utf8');

    const canonical = canonicalFor(page);
    const schemaTag = page.schema
      ? `<script type="application/ld+json">${JSON.stringify(page.schema).replace(/</g, '\\u003c')}</script>`
      : '';

    html = replaceAll(html, {
      '{{HEAD_COMMON}}': headCommon(page.pageCss),
      '{{TITLE}}': escapeHtml(page.title),
      '{{DESCRIPTION}}': escapeHtml(page.description),
      '{{CANONICAL}}': escapeHtml(canonical),
      '{{OG_IMAGE}}': escapeHtml(`${SITE_ORIGIN}${page.ogImage}`),
      '{{OG_URL}}': escapeHtml(canonical),
      '{{SCHEMA_JSON}}': schemaTag,
      '{{HEADER}}': header(page.activeKey, page.hasForm !== false),
      '{{MOBILE_NAV}}': mobileNav(page.hasForm !== false),
      '{{FOOTER}}': footer(),
      '{{PRICE_BLOCK}}': page.priceHours ? priceBlock({ hours: page.priceHours }) : '',
      ...ICON_TOKENS,
    });

    if (IS_PREVIEW) {
      html = html.replace(
        /<meta name="viewport"[^>]*>/,
        '$&\n  <meta name="robots" content="noindex, nofollow" />'
      );
    }
    html = withBasePath(html);

    const outPath = outPathFor(page);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, 'utf8');
    console.log('wrote', path.relative(DIST, outPath));
  }

  // --- пути внутри CSS (шрифты) под префикс ---
  if (BASE_PATH) {
    for (const f of fs.readdirSync(path.join(DIST, 'css'))) {
      const p = path.join(DIST, 'css', f);
      fs.writeFileSync(p, cssWithBasePath(fs.readFileSync(p, 'utf8')), 'utf8');
    }
  }

  // --- robots.txt ---
  fs.writeFileSync(
    path.join(DIST, 'robots.txt'),
    IS_PREVIEW
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
    'utf8'
  );

  // --- sitemap.xml ---
  const today = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map(
    (p) => `  <url>\n    <loc>${canonicalFor(p)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  ).join('\n');
  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf8'
  );

  console.log(`\nГотово: ${PAGES.length} страниц собрано в ${path.relative(ROOT, DIST)}/`);
}

build();
