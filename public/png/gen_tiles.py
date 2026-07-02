"""
Generate the 40 missing tile PNG files (54–93).

Edge type measurements from existing tiles:
  Open    : cols/rows 40..158  (OPEN_LO=40, OPEN_HI=159 exclusive)
  Connect : cols/rows 80..116  (CONN_LO=80, CONN_HI=117 exclusive)
  Tile split: top/left half = 0..98, bottom/right half = 99..197

White mask = union of rectangular passages:
  Top    passage → rows  0..98,   cols [type range]
  Bottom passage → rows 99..197,  cols [type range]
  Left   passage → cols  0..98,   rows [type range]
  Right  passage → cols 99..197,  rows [type range]
"""

import struct, zlib, os

N      = 198
HALF   = 99
OPEN   = (40, 159)   # range() args → cols/rows 40–158
CONN   = (80, 117)   # range() args → cols/rows 80–116

DIR = '/Users/johnchastain/dev/randomgen/public/png'

# ── PNG read/write ──────────────────────────────────────────────────────────

def read_png(path):
    with open(path, 'rb') as f:
        f.read(8); chunks = {}
        while True:
            n = struct.unpack('>I', f.read(4))[0]
            t = f.read(4).decode(); d = f.read(n); f.read(4)
            if t == 'IDAT': chunks.setdefault('IDAT', b''); chunks['IDAT'] += d
            else: chunks[t] = d
            if t == 'IEND': break
    w, h = struct.unpack('>II', chunks['IHDR'][:8])
    plte = [(chunks['PLTE'][i], chunks['PLTE'][i+1], chunks['PLTE'][i+2])
            for i in range(0, len(chunks['PLTE']), 3)]
    raw  = zlib.decompress(chunks['IDAT'])
    rows = [list(raw[r*(w+1)+1:r*(w+1)+1+w]) for r in range(h)]
    return rows, plte, w, h

def to_rgb(rows, plte):
    return [[plte[rows[r][c]] for c in range(len(rows[0]))] for r in range(len(rows))]

def write_rgb_png(path, rgb, w, h):
    def chunk(t, d):
        b = t.encode() + d
        return struct.pack('>I', len(d)) + b + struct.pack('>I', zlib.crc32(b) & 0xFFFFFFFF)
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
    raw  = b''.join(b'\x00' + bytes(v for px in row for v in px) for row in rgb)
    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk('IHDR', ihdr))
        f.write(chunk('IDAT', zlib.compress(raw, 9)))
        f.write(chunk('IEND', b''))

# ── Load background (tile 37) and key source tiles ──────────────────────────

bg  = to_rgb(*read_png(f'{DIR}/37.png')[:2])
t14 = to_rgb(*read_png(f'{DIR}/14.png')[:2])  # BL corner: B=Con, L=Opn
t04 = to_rgb(*read_png(f'{DIR}/04.png')[:2])  # cross:     T=Opn,R=Con,B=Opn,L=Con

WHITE = (255, 255, 255)

# ── White-mask helpers ──────────────────────────────────────────────────────

def passage_range(etype):
    if etype == 'O': return OPEN
    if etype == 'C': return CONN
    return None

def build_mask(top, right, bottom, left):
    mask = [[False]*N for _ in range(N)]
    if (r := passage_range(top)):
        for row in range(0, HALF):
            for col in range(*r): mask[row][col] = True
    if (r := passage_range(bottom)):
        for row in range(HALF, N):
            for col in range(*r): mask[row][col] = True
    if (r := passage_range(left)):
        for col in range(0, HALF):
            for row in range(*r): mask[row][col] = True
    if (r := passage_range(right)):
        for col in range(HALF, N):
            for row in range(*r): mask[row][col] = True
    return mask

def apply_mask(mask):
    return [[(WHITE if mask[r][c] else bg[r][c]) for c in range(N)] for r in range(N)]

def make_tile(num, top=None, right=None, bottom=None, left=None):
    mask = build_mask(top, right, bottom, left)
    write_rgb_png(f'{DIR}/{num}.png', apply_mask(mask), N, N)
    print(f'  {num}.png  T={top} R={right} B={bottom} L={left}')

# ── Image transforms (for deriving corners from tile 14) ────────────────────

def rot_cw(img):   return [[img[N-1-j][i]     for j in range(N)] for i in range(N)]
def rot_180(img):  return [list(reversed(img[N-1-i])) for i in range(N)]
def rot_ccw(img):  return [[img[j][N-1-i]     for j in range(N)] for i in range(N)]
def flip_h(img):   return [list(reversed(row)) for row in img]
def flip_v(img):   return list(reversed(img))
def tr_main(img):  return [[img[j][i]          for j in range(N)] for i in range(N)]
def tr_anti(img):  return [[img[N-1-j][N-1-i]  for j in range(N)] for i in range(N)]

def save(num, rgb, desc):
    write_rgb_png(f'{DIR}/{num}.png', rgb, N, N)
    print(f'  {num}.png  {desc}')

# ── Generate tiles ───────────────────────────────────────────────────────────

print('Corners (derived from tile 14):')
save('54', rot_cw(t14),  'TL  T=Opn, L=Con')
save('55', rot_180(t14), 'TR  T=Con, R=Opn')
save('56', rot_ccw(t14), 'RB  R=Con, B=Opn')
save('57', flip_h(t14),  'RB  R=Opn, B=Con')
save('58', flip_v(t14),  'TL  T=Con, L=Opn')
save('59', tr_main(t14), 'TR  T=Opn, R=Con')
save('60', tr_anti(t14), 'BL  B=Opn, L=Con')

print('T-junctions — T+B+L (right=Closed):')
make_tile('61', top='O', bottom='O', left='C')
make_tile('62', top='O', bottom='C', left='O')
make_tile('63', top='O', bottom='C', left='C')
make_tile('64', top='C', bottom='O', left='O')
make_tile('65', top='C', bottom='O', left='C')
make_tile('66', top='C', bottom='C', left='O')

print('T-junctions — T+R+B (left=Closed):')
make_tile('67', top='O', right='O', bottom='C')
make_tile('68', top='O', right='C', bottom='O')
make_tile('69', top='O', right='C', bottom='C')
make_tile('70', top='C', right='O', bottom='O')
make_tile('71', top='C', right='O', bottom='C')
make_tile('72', top='C', right='C', bottom='O')

print('T-junctions — T+R+L (bottom=Closed):')
make_tile('73', top='O', right='O', left='C')
make_tile('74', top='O', right='C', left='O')
make_tile('75', top='O', right='C', left='C')
make_tile('76', top='C', right='O', left='O')
make_tile('77', top='C', right='O', left='C')
make_tile('78', top='C', right='C', left='O')

print('T-junctions — R+B+L (top=Closed):')
make_tile('79', right='O', bottom='O', left='C')
make_tile('80', right='O', bottom='C', left='O')
make_tile('81', right='O', bottom='C', left='C')
make_tile('82', right='C', bottom='O', left='O')
make_tile('83', right='C', bottom='O', left='C')
make_tile('84', right='C', bottom='C', left='O')

print('4-exit crosses:')
make_tile('85', top='O', right='O', bottom='O', left='C')
make_tile('86', top='O', right='O', bottom='C', left='O')
make_tile('87', top='C', right='O', bottom='O', left='O')
make_tile('88', top='O', right='C', bottom='O', left='O')
make_tile('89', top='O', right='O', bottom='C', left='C')
make_tile('90', top='C', right='C', bottom='O', left='O')
make_tile('91', top='O', right='C', bottom='C', left='O')
make_tile('92', top='C', right='O', bottom='O', left='C')
make_tile('93', top='C', right='O', bottom='C', left='O')  # cross COCO

print('Done — 40 tiles created (54–93).')
