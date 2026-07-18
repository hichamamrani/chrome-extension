#!/usr/bin/env python3
"""Generate Universal Share extension icons (16, 48, 128 px)."""
from struct import pack
import zlib
import math
import os

ACCENT = (37, 99, 235)
ACCENT_DARK = (29, 78, 216)
WHITE = (255, 255, 255)


def lerp(a, b, t):
    return a + (b - a) * t


def rounded_rect_sdf(x, y, w, h, r):
    qx = abs(x - w / 2) - w / 2 + r
    qy = abs(y - h / 2) - h / 2 + r
    return min(max(qx, qy), 0) + math.hypot(max(qx, 0), max(qy, 0)) - r


def circle_sdf(x, y, cx, cy, radius):
    return math.hypot(x - cx, y - cy) - radius


def line_sdf(x, y, x1, y1, x2, y2, thickness):
    dx, dy = x2 - x1, y2 - y1
    len_sq = dx * dx + dy * dy
    if len_sq == 0:
        return circle_sdf(x, y, x1, y1, thickness / 2)
    t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / len_sq))
    px, py = x1 + t * dx, y1 + t * dy
    return circle_sdf(x, y, px, py, thickness / 2)


def smoothstep(edge0, edge1, x):
    t = max(0, min(1, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)


def render_icon(size):
    scale = 4
    ss = size * scale
    pixels = []

    pad = ss * 0.08
    w = h = ss - pad * 2
    ox = oy = pad
    radius = ss * 0.22

    # Share nodes (relative to inner square)
    nodes = [
        (ox + w * 0.28, oy + h * 0.38),
        (ox + w * 0.72, oy + h * 0.38),
        (ox + w * 0.50, oy + h * 0.72),
    ]
    node_r = ss * 0.095
    line_t = ss * 0.055
    lines = [(0, 1), (0, 2), (1, 2)]

    for j in range(ss):
        row = []
        for i in range(ss):
            x = i + 0.5
            y = j + 0.5

            bg = rounded_rect_sdf(x - ox, y - oy, w, h, radius)
            bg_a = 1 - smoothstep(-0.5, 1.2, bg)

            if bg_a <= 0:
                row.extend([0, 0, 0, 0])
                continue

            t = (x / ss + y / ss) / 2
            br = int(lerp(ACCENT[0], ACCENT_DARK[0], t))
            bg_g = int(lerp(ACCENT[1], ACCENT_DARK[1], t))
            bb = int(lerp(ACCENT[2], ACCENT_DARK[2], t))

            fg_a = 0.0
            for a, b in lines:
                d = line_sdf(x, y, nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1], line_t)
                fg_a = max(fg_a, 1 - smoothstep(-0.8, 0.8, d))
            for nx, ny in nodes:
                d = circle_sdf(x, y, nx, ny, node_r)
                fg_a = max(fg_a, 1 - smoothstep(-0.8, 0.8, d))
                inner = circle_sdf(x, y, nx, ny, node_r * 0.42)
                fg_a = max(fg_a, (1 - smoothstep(-0.8, 0.8, inner)) * 0.15)

            alpha = bg_a
            r = int(lerp(br, WHITE[0], fg_a))
            g = int(lerp(bg_g, WHITE[1], fg_a))
            bch = int(lerp(bb, WHITE[2], fg_a))
            row.extend([r, g, bch, int(alpha * 255)])

        pixels.append(bytes([0] + row))

    raw = b"".join(pixels)
    compressed = zlib.compress(raw, 9)

    def chunk(tag, data):
        c = tag + data
        return pack(">I", len(data)) + c + pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    ihdr = pack(">IIBBBBB", ss, ss, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")

    return downsample_rgba(png, ss, ss, size)


def downsample_rgba(png_data, sw, sh, target):
    """Simple box downsample from supersampled PNG bytes - re-render at target instead."""
    del png_data
    # Re-render directly at target with 2x SSAA for smaller sizes
    ss = target * 2
    pixels = []
    pad = ss * 0.08
    w = h = ss - pad * 2
    ox = oy = pad
    radius = ss * 0.22
    nodes = [
        (ox + w * 0.28, oy + h * 0.38),
        (ox + w * 0.72, oy + h * 0.38),
        (ox + w * 0.50, oy + h * 0.72),
    ]
    node_r = ss * 0.095
    line_t = ss * 0.055
    lines = [(0, 1), (0, 2), (1, 2)]

    for j in range(target):
        row = []
        for i in range(target):
            samples = []
            for sy in range(2):
                for sx in range(2):
                    x = (i + (sx + 0.5) / 2) * ss / target
                    y = (j + (sy + 0.5) / 2) * ss / target
                    bg = rounded_rect_sdf(x - ox, y - oy, w, h, radius)
                    bg_a = 1 - smoothstep(-0.5, 1.2, bg)
                    if bg_a <= 0:
                        samples.append((0, 0, 0, 0))
                        continue
                    t = (x / ss + y / ss) / 2
                    br = int(lerp(ACCENT[0], ACCENT_DARK[0], t))
                    bg_g = int(lerp(ACCENT[1], ACCENT_DARK[1], t))
                    bb = int(lerp(ACCENT[2], ACCENT_DARK[2], t))
                    fg_a = 0.0
                    for a, b in lines:
                        d = line_sdf(x, y, nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1], line_t)
                        fg_a = max(fg_a, 1 - smoothstep(-0.8, 0.8, d))
                    for nx, ny in nodes:
                        d = circle_sdf(x, y, nx, ny, node_r)
                        fg_a = max(fg_a, 1 - smoothstep(-0.8, 0.8, d))
                    r = int(lerp(br, WHITE[0], fg_a))
                    g = int(lerp(bg_g, WHITE[1], fg_a))
                    bch = int(lerp(bb, WHITE[2], fg_a))
                    samples.append((r, g, bch, int(bg_a * 255)))
            r = sum(s[0] for s in samples) // 4
            g = sum(s[1] for s in samples) // 4
            b = sum(s[2] for s in samples) // 4
            a = sum(s[3] for s in samples) // 4
            row.extend([r, g, b, a])
        pixels.append(bytes([0] + row))

    raw = b"".join(pixels)
    compressed = zlib.compress(raw, 9)

    def chunk(tag, data):
        c = tag + data
        return pack(">I", len(data)) + c + pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    ihdr = pack(">IIBBBBB", target, target, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")


def main():
    base = os.path.join(os.path.dirname(__file__), "..", "icons")
    os.makedirs(base, exist_ok=True)
    for s in [16, 48, 128]:
        path = os.path.join(base, f"icon{s}.png")
        with open(path, "wb") as f:
            f.write(render_icon(s))
        print(f"✓ icon{s}.png")


if __name__ == "__main__":
    main()
