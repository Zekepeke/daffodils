#!/usr/bin/env python3
"""Cut individual flower heads out of a sheet of flowers on a black background.

    python3 tools/extract_heads.py SHEET.png [--crop x0,y0,x1,y1] [--skip x0,y0,x1,y1]

--crop limits the search to part of the image, and --skip drops any flower
touching that box (handy for screenshots with UI buttons on top). Heads are
written to assets/daffodils/head-NN.png, numbered left to right, top to bottom.
Needs Pillow, numpy, and scipy.
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ni

SOLID = 110       # darkest channel above this counts as flower, not glow
BLACK = 26        # brightness at or below this is background
MIN_AREA = 0.004  # ignore specks smaller than this fraction of the sheet
PAD = 14          # glow kept around each head, in source pixels
UPSCALE = 2


def box(text):
    return tuple(int(v) for v in text.split(","))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sheet")
    ap.add_argument("--crop", type=box)
    ap.add_argument("--skip", type=box)
    ap.add_argument("--out", default="assets/daffodils")
    args = ap.parse_args()

    img = Image.open(args.sheet).convert("RGB")
    ox, oy = (0, 0)
    if args.crop:
        img = img.crop(args.crop)
        ox, oy = args.crop[:2]
    rgb = np.asarray(img).astype(float)

    solid = ni.binary_opening(rgb.min(axis=2) > SOLID, iterations=2)
    labels, count = ni.label(solid)
    min_area = MIN_AREA * solid.size
    keep = [i + 1 for i in range(count) if (labels == i + 1).sum() >= min_area]

    # Each glow pixel belongs to whichever flower is closest, so a neighbour's
    # glow never ends up inside this flower's cutout.
    seeds = np.isin(labels, keep)
    nearest = ni.distance_transform_edt(~seeds, return_indices=True)[1]
    owner = labels[nearest[0], nearest[1]]

    heads = []
    for label in keep:
        ys, xs = np.where(labels == label)
        heads.append((ys.min(), xs.min(), ys.max() + 1, xs.max() + 1, label))
    # Group into rows, then read each row left to right.
    heads.sort(key=lambda h: (round((h[0] + h[2]) / 2 / (solid.shape[0] / 3)), h[1]))

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("head-*.png"):
        old.unlink()

    written = 0
    for y0, x0, y1, x1, label in heads:
        if args.skip:
            sx0, sy0, sx1, sy1 = args.skip
            if x0 + ox < sx1 and x1 + ox > sx0 and y0 + oy < sy1 and y1 + oy > sy0:
                continue
        written += 1
        mine = owner == label
        body = ni.binary_fill_holes(labels == label)
        peak = rgb.max(axis=2)
        # Solid inside the flower; outside, brightness becomes transparency so
        # the baked-in glow fades over whatever is behind it.
        alpha = np.clip((peak - BLACK) / (255 - BLACK), 0, 1)
        alpha[ni.binary_erosion(body, iterations=1)] = 1
        alpha[~mine] = 0
        color = np.where(
            alpha[..., None] > 0,
            np.clip(rgb / np.maximum(peak, 1)[..., None] * 255, 0, 255),
            0,
        )
        color[body] = rgb[body]
        rgba = np.dstack([color, alpha * 255]).astype("uint8")

        h, w = solid.shape
        crop = (max(x0 - PAD, 0), max(y0 - PAD, 0), min(x1 + PAD, w), min(y1 + PAD, h))
        tile = Image.fromarray(rgba, "RGBA").crop(crop)
        tile = tile.convert("RGBa").resize(
            (tile.width * UPSCALE, tile.height * UPSCALE), Image.LANCZOS
        ).convert("RGBA")
        tile.save(out / f"head-{written:02d}.png", optimize=True)
    print(f"wrote {written} heads to {out}")


if __name__ == "__main__":
    main()
