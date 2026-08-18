# -*- coding: utf-8 -*-
"""
Адаптивные картинки: генерирует набор размеров под srcset и считает sizes.

Зачем: браузер не должен качать файл больше, чем картинка реально занимает
на экране. Ширины отрисовки заранее измерены на собранном сайте
(scripts/image-render-widths.json) для всех брейкпоинтов вёрстки.

ВАЖНО: запускать на исходных файлах. Повторный запуск поверх уже
сжатых вариантов ухудшит качество (пережатие). Оригиналы фото —
в source-materials/.

Запуск:  python3 scripts/optimize-images.py [--apply]
Без --apply только показывает план, ничего не трогает.
"""
import json, os, re, sys, math
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, 'src', 'images')
PAGES_DIR = os.path.join(ROOT, 'pages')
CURVE = json.load(open(os.path.join(ROOT, 'scripts', 'image-render-widths.json'), encoding='utf-8'))

DPR = 2                     # готовим под retina
LADDER = [360, 480, 640, 800, 960, 1200, 1440, 1600, 1800]
QUALITY = 74
MAX_OVERSHOOT = 0.14        # допустимый перезаказ пикселей внутри сегмента sizes


def segments(curve):
    """Сжимает кривую «ширина окна -> ширина картинки» в короткий список sizes."""
    pts = sorted((int(k), v) for k, v in curve.items())
    out, i = [], 0
    while i < len(pts):
        j = i
        best = None
        while j < len(pts):
            chunk = pts[i:j + 1]
            mx_px = max(w for _, w in chunk)
            mx_vw = max(w / vp for vp, w in chunk)
            over_px = max((mx_px - w) / w for _, w in chunk)
            over_vw = max((mx_vw * vp - w) / w for vp, w in chunk)
            if min(over_px, over_vw) > MAX_OVERSHOOT:
                break
            best = (j, ('px', mx_px) if over_px <= over_vw else ('vw', mx_vw))
            j += 1
        if best is None:                     # одна точка не влезла — берём как есть
            best = (i, ('px', pts[i][1]))
        end, (kind, val) = best
        val_s = f'{int(math.ceil(val))}px' if kind == 'px' else f'{val * 100:.0f}vw'
        out.append((pts[end][0], val_s, end))
        i = end + 1
    parts = [f'(max-width: {vp}px) {v}' for vp, v, _ in out[:-1]]
    parts.append(out[-1][1])                 # последний — без медиа-условия
    return ', '.join(parts)


def plan():
    rows = []
    for src, curve in sorted(CURVE.items()):
        rel = src.replace('/images/', '')
        path = os.path.join(IMG_DIR, rel)
        if not os.path.exists(path) or not rel.endswith('.webp'):
            continue
        ow, oh = Image.open(path).size
        need = int(math.ceil(max(curve.values()) * DPR))
        cap = min(ow, need)
        widths = sorted({w for w in LADDER if w <= cap} | {cap})
        widths = [w for w in widths if w >= 300] or [cap]
        rows.append(dict(src=src, rel=rel, path=path, ow=ow, oh=oh,
                         cap=cap, widths=widths, sizes=segments(curve),
                         bytes=os.path.getsize(path)))
    return rows


def build(rows, apply):
    total_before = total_after = 0
    for r in rows:
        im = Image.open(r['path'])
        ratio = r['oh'] / r['ow']
        total_before += r['bytes']
        made = []
        for w in r['widths']:
            h = int(round(w * ratio))
            stem, ext = os.path.splitext(r['rel'])
            name = f'{stem}{ext}' if w == r['cap'] else f'{stem}-{w}{ext}'
            dst = os.path.join(IMG_DIR, name)
            if apply:
                im.resize((w, h), Image.LANCZOS).save(dst, quality=QUALITY, method=6)
                total_after += os.path.getsize(dst)
            made.append((w, h, name))
        r['made'] = made
        r['cap_h'] = int(round(r['cap'] * ratio))
    return total_before, total_after


def patch_pages(rows, apply):
    by_src = {r['src']: r for r in rows}
    changed = 0
    for fn in os.listdir(PAGES_DIR):
        if not fn.endswith('.html'):
            continue
        p = os.path.join(PAGES_DIR, fn)
        html = open(p, encoding='utf-8').read()
        orig = html

        def repl(m):
            tag = m.group(0)
            src_m = re.search(r'src="([^"]+)"', tag)
            if not src_m or src_m.group(1) not in by_src:
                return tag
            r = by_src[src_m.group(1)]
            stem, ext = os.path.splitext(r['src'])
            srcset = ', '.join(
                (f'{stem}{ext} {w}w' if w == r['cap'] else f'{stem}-{w}{ext} {w}w')
                for w, _, _ in r['made'])
            tag = re.sub(r'\s+(srcset|sizes)="[^"]*"', '', tag)
            tag = re.sub(r'width="\d+"', f'width="{r["cap"]}"', tag)
            tag = re.sub(r'height="\d+"', f'height="{r["cap_h"]}"', tag)
            return tag[:-2].rstrip() + f' srcset="{srcset}" sizes="{r["sizes"]}" />'

        html = re.sub(r'<img\s[^>]*/>', repl, html)
        if html != orig:
            changed += 1
            if apply:
                open(p, 'w', encoding='utf-8').write(html)
    return changed


if __name__ == '__main__':
    apply = '--apply' in sys.argv
    rows = plan()
    before, after = build(rows, apply)
    changed = patch_pages(rows, apply)
    for r in rows:
        print(f"{r['rel']:42s} {r['ow']:4d}px -> {r['cap']:4d}px  "
              f"варианты: {[w for w,_,_ in r['made']]}")
        print(f"{'':42s} sizes: {r['sizes']}")
    print(f"\nфайлов: {len(rows)}, страниц изменено: {changed}")
    if apply:
        print(f"было {before/1024/1024:.2f} MB -> стало {after/1024/1024:.2f} MB (все варианты вместе)")
    else:
        print("(пробный прогон, файлы не тронуты; добавьте --apply)")
