"""Rebuild the local Kyrgyz fonts: pip install fonttools brotli; python scripts/build-kyrgyz-fonts.py.

Unbounded has no Kyrgyz glyphs. This OFL derivative uses its own О/о, Н/н,
Ц/ц and Y outlines to supply six matching letters, without changing RU text.
Upstream JetBrains Mono includes Kyrgyz letters missing in Google's build.
"""

from io import BytesIO
from pathlib import Path
from urllib.request import urlopen

from fontTools import subset
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

DEST = Path(__file__).resolve().parents[1] / 'public' / 'fonts'
GOOGLE = 'https://raw.githubusercontent.com/google/fonts/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/unbounded/'
JETBRAINS = 'https://raw.githubusercontent.com/JetBrains/JetBrainsMono/19371302b95d218af43299bce79ddbddd0bc364d/'


def download(url):
    with urlopen(url, timeout=60) as response:
        return response.read()


def rectangle(pen, left, bottom, right, top):
    # Clockwise, matching the source outlines' nonzero winding.
    pen.moveTo((left, bottom))
    pen.lineTo((left, top))
    pen.lineTo((right, top))
    pen.lineTo((right, bottom))
    pen.closePath()


def build_display(source, weight):
    font = instantiateVariableFont(TTFont(BytesIO(source)), {'wght': weight}, inplace=True)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()

    def bounds(char):
        glyph = font['glyf'][cmap[ord(char)]]
        glyph.recalcBounds(font['glyf'])
        return glyph.xMin, glyph.yMin, glyph.xMax, glyph.yMax

    def add(char, source_char, draw, advance=None):
        name = f'uni{ord(char):04X}'
        pen = TTGlyphPen(glyphs)
        draw(pen)
        font['glyf'][name] = pen.glyph()
        source_metrics = font['hmtx'][cmap[ord(source_char)]]
        font['hmtx'][name] = (advance or source_metrics[0], source_metrics[1])
        for table in font['cmap'].tables:
            if table.isUnicode():
                table.cmap[ord(char)] = name

    # Barred O: preserve the exact O outlines, width, stroke and overshoot.
    for target, source_char, h in [('Ө', 'О', 'Н'), ('ө', 'о', 'н')]:
        left, _, right, top = bounds(source_char)
        h_coords, _, _ = font['glyf'][cmap[ord(h)]].getCoordinates(font['glyf'])
        # The final contour of Н/н is its horizontal crossbar.
        crossbar = h_coords[-4:]
        thickness = max(y for _, y in crossbar) - min(y for _, y in crossbar)
        center = bounds(h)[3] / 2

        def draw(pen, source_char=source_char, left=left, right=right,
                 thickness=thickness, center=center):
            glyphs[cmap[ord(source_char)]].draw(pen)
            rectangle(pen, left + (right-left)*.2, center-thickness/2,
                      right - (right-left)*.2, center+thickness/2)

        add(target, source_char, draw)

    # En with descender: reuse the corresponding Ц/ц tail dimensions.
    for target, source_char, tail_char in [('Ң', 'Н', 'Ц'), ('ң', 'н', 'ц')]:
        _, _, right, _ = bounds(source_char)
        points, _, _ = font['glyf'][cmap[ord(tail_char)]].getCoordinates(font['glyf'])
        tail_left, tail_bottom = points[5]
        tail_right = points[4][0]
        upright_right = points[0][0]
        tail_top = points[3][1]
        x0, x1 = right + tail_left-upright_right, right + tail_right-upright_right

        def draw(pen, source_char=source_char, x0=x0, x1=x1,
                 tail_bottom=tail_bottom, tail_top=tail_top):
            glyphs[cmap[ord(source_char)]].draw(pen)
            rectangle(pen, x0, tail_bottom, x1, tail_top)

        advance = font['hmtx'][cmap[ord(source_char)]][0] + round(x1-right)
        add(target, source_char, draw, advance)

    # Straight U: uppercase Y has the matching form; lowercase uses the
    # existing lowercase width/x-height and a straight descending stem.
    add('Ү', 'Y', lambda pen: glyphs[cmap[ord('Y')]].draw(pen))
    y_left, y_bottom, y_right, y_top = bounds('y')
    upper_left, _, upper_right, upper_top = bounds('Y')
    sx, sy = (y_right-y_left)/(upper_right-upper_left), y_top/upper_top
    dx = y_left-upper_left*sx

    def draw_lower_u(pen):
        glyphs[cmap[ord('Y')]].draw(TransformPen(pen, (sx, 0, 0, sy, dx, 0)))
        points, _, _ = font['glyf'][cmap[ord('Y')]].getCoordinates(font['glyf'])
        rectangle(pen, points[0][0]*sx+dx, y_bottom, points[2][0]*sx+dx, 1)

    add('ү', 'y', draw_lower_u)
    font.setGlyphOrder(font['glyf'].glyphOrder)

    # Give the derivative its own family name; retain the source copyright.
    for record in font['name'].names:
        if record.nameID in (1, 2, 3, 4, 6, 16, 17):
            value = {1: 'IT ADIS Kyrgyz', 2: str(weight),
                     3: f'ITADISKyrgyz-{weight}-1.0', 4: f'IT ADIS Kyrgyz {weight}',
                     6: f'ITADISKyrgyz-{weight}', 16: 'IT ADIS Kyrgyz',
                     17: str(weight)}[record.nameID]
            record.string = value.encode(record.getEncoding())
    options = subset.Options()
    options.name_IDs = ['*']
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text='ҢңӨөҮү')
    subsetter.subset(font)
    font.flavor = 'woff2'
    font.save(DEST / f'it-adis-kyrgyz-{weight}.woff2')


if __name__ == '__main__':
    DEST.mkdir(parents=True, exist_ok=True)
    source = download(GOOGLE + 'Unbounded%5Bwght%5D.ttf')
    for weight in (700, 800):
        build_display(source, weight)
    (DEST / 'OFL-Unbounded.txt').write_bytes(download(GOOGLE + 'OFL.txt'))
    for style in ('Medium', 'Bold'):
        (DEST / f'jetbrains-mono-{style.lower()}.woff2').write_bytes(
            download(JETBRAINS + f'fonts/webfonts/JetBrainsMono-{style}.woff2'))
    (DEST / 'OFL-JetBrainsMono.txt').write_bytes(download(JETBRAINS + 'OFL.txt'))
