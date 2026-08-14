#!/usr/bin/env node
'use strict';

/**
 * Проверка собранного сайта: битые внутренние ссылки/картинки, дубли id,
 * незаменённые {{...}} токены, запрещённые данные из PROJECT-CONTENT.md.
 */

const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

// Сборка может быть собрана под подпуть (GitHub Pages). Тогда все внутренние
// ссылки начинаются с префикса — его нужно отбросить перед проверкой на диске.
const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/$/, '');

const PAGES = [
  'index.html',
  'category-b/index.html',
  'category-a/index.html',
  'professional/index.html',
  'tractor/index.html',
  'documents/index.html',
  'policy/index.html',
];

let errors = 0;
let warnings = 0;

function err(msg) {
  console.log('ERROR: ' + msg);
  errors++;
}
function warn(msg) {
  console.log('WARN:  ' + msg);
  warnings++;
}

const FORBIDDEN = [
  { re: /17[\s.,]?000/, label: '«17 000» выпускников' },
  { re: /23[\s.,]?000\s?(руб|₽)/i, label: 'старая цена 23 000 ₽' },
  { re: /22\s?апреля.{0,20}14\s?мая/i, label: 'старые даты наборов 2021 года' },
  { re: /за\s?2\s?месяца/i, label: 'обещание «за 2 месяца» для всех категорий' },
  { re: /работаем\s+с\s+2015/i, label: '"работаем с 2015" как год основания' },
  { re: /скидк[а-я]*\s+\d/i, label: 'числовая скидка (неподтверждённая)' },
];

for (const rel of PAGES) {
  const file = path.join(DIST, rel);
  if (!fs.existsSync(file)) {
    err(`отсутствует файл ${rel}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');

  // --- незаменённые токены ---
  const tokens = html.match(/\{\{[A-Z_]+\}\}/g);
  if (tokens) err(`${rel}: незаменённые токены ${[...new Set(tokens)].join(', ')}`);

  // --- дубли id ---
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  const dupes = new Set();
  ids.forEach((id) => (seen.has(id) ? dupes.add(id) : seen.add(id)));
  if (dupes.size) err(`${rel}: дублирующиеся id — ${[...dupes].join(', ')}`);

  // --- H1 ---
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) err(`${rel}: найдено H1 = ${h1s.length}, ожидается 1`);

  // --- title / description / canonical ---
  if (!/<title>[^<]+<\/title>/.test(html)) err(`${rel}: нет <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) err(`${rel}: нет meta description`);
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) err(`${rel}: нет canonical`);

  // --- запрещённые данные ---
  for (const rule of FORBIDDEN) {
    if (rule.re.test(html)) err(`${rel}: найдены запрещённые данные — ${rule.label}`);
  }

  // --- img без alt ---
  const imgTags = html.match(/<img\b[^>]*>/g) || [];
  imgTags.forEach((tag) => {
    if (!/\balt="/.test(tag)) err(`${rel}: <img> без alt — ${tag.slice(0, 70)}`);
  });

  // --- внутренние ссылки и src ---
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    let clean = ref.split('#')[0].split('?')[0];
    if (BASE_PATH && clean.startsWith(BASE_PATH)) {
      clean = clean.slice(BASE_PATH.length) || '/';
    }
    if (!clean) continue; // чистый якорь на этой же странице
    let target = path.join(DIST, clean);
    if (clean.endsWith('/')) target = path.join(target, 'index.html');
    if (!fs.existsSync(target) && !fs.existsSync(target + '.html')) {
      err(`${rel}: битая ссылка/asset ${ref}`);
    }
  }

  // --- локальные якоря (href="#...") существуют в этой же странице ---
  const anchors = [...html.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1]);
  for (const a of anchors) {
    const re = new RegExp(`id="${a}"`);
    if (!re.test(html)) warn(`${rel}: локальный якорь #${a} без соответствующего id`);
  }
}

console.log(`\n${errors} ошибок, ${warnings} предупреждений.`);
process.exit(errors ? 1 : 0);
