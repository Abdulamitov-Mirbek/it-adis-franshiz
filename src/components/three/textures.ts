import * as THREE from 'three';

/**
 * Текстуры 3D-сцены рисуются на canvas 2D: тексты карточек берутся из
 * content.ts, поэтому не нужны ни шрифтовые атласы, ни лишние зависимости.
 */

const SCALE = 2;

interface CardLine {
  t: 'comment' | 'code' | 'code-indent';
  v: string;
}

const MONO = '500 15px "JetBrains Mono", ui-monospace, monospace';
const DISPLAY = '700 20px Unbounded, "Inter Tight", system-ui, sans-serif';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function surface(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w * SCALE;
  canvas.height = h * SCALE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.scale(SCALE, SCALE);
  return [canvas, ctx];
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** Тёмная «стеклянная» карточка с кодом. */
export function makeCodeCardTexture(lang: string, lines: readonly CardLine[]): THREE.CanvasTexture {
  const pad = 28;
  const lh = 27;
  const width = 500;
  const height = pad * 2 + 34 + lines.length * lh;
  const [canvas, ctx] = surface(width, height);

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, 'rgba(23,24,58,0.94)');
  grad.addColorStop(1, 'rgba(11,11,36,0.94)');
  ctx.fillStyle = grad;
  roundRect(ctx, 1, 1, width - 2, height - 2, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ['#FF5F57', '#FEBC2E', '#83E40A'].forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(pad + i * 17, pad + 4, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillStyle = '#8E93CC';
  ctx.textAlign = 'right';
  ctx.fillText(lang.toUpperCase(), width - pad, pad + 8);
  ctx.textAlign = 'left';

  ctx.font = MONO;
  lines.forEach((line, index) => {
    const y = pad + 50 + index * lh;
    const x = pad + (line.t === 'code-indent' ? 22 : 0);

    if (line.t === 'comment') {
      ctx.fillStyle = '#6E73A8';
      ctx.fillText(line.v, x, y);
      return;
    }

    const keywords = /\b(for|in|const|await|void|main|runApp)\b/g;
    let last = 0;
    let cursor = x;
    let match: RegExpExecArray | null;
    while ((match = keywords.exec(line.v)) !== null) {
      const plain = line.v.slice(last, match.index);
      ctx.fillStyle = '#E7E8FF';
      ctx.fillText(plain, cursor, y);
      cursor += ctx.measureText(plain).width;
      ctx.fillStyle = '#83E40A';
      ctx.fillText(match[0], cursor, y);
      cursor += ctx.measureText(match[0]).width;
      last = match.index + match[0].length;
    }
    ctx.fillStyle = '#E7E8FF';
    ctx.fillText(line.v.slice(last), cursor, y);
  });

  return toTexture(canvas);
}

/** Карточка диплома. */
export function makeDiplomaTexture(title: string, sub: string, langs: readonly string[]): THREE.CanvasTexture {
  const width = 340;
  const height = 210;
  const [canvas, ctx] = surface(width, height);

  ctx.fillStyle = 'rgba(255,255,255,0.97)';
  roundRect(ctx, 1, 1, width - 2, height - 2, 20);
  ctx.fill();

  ctx.strokeStyle = 'rgba(13,9,213,0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  roundRect(ctx, 14, 14, width - 28, height - 28, 14);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.font = DISPLAY;
  ctx.fillStyle = '#12112A';
  ctx.fillText(title, width / 2, 82);

  ctx.font = '500 13px "Inter Tight", system-ui, sans-serif';
  ctx.fillStyle = '#4A5068';
  ctx.fillText(sub, width / 2, 112);

  ctx.font = '700 14px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillStyle = '#0D09D5';
  ctx.fillText(langs.join('   '), width / 2, 150);

  ctx.fillStyle = '#83E40A';
  roundRect(ctx, width / 2 - 26, 166, 52, 6, 3);
  ctx.fill();

  return toTexture(canvas);
}

/** Зелёный круглый стикер «80–90% практика». */
export function makeStickerTexture(top: string, bottom: string): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = surface(size, size);

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = '#83E40A';
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#07071A';
  ctx.font = '800 42px Unbounded, "Inter Tight", system-ui, sans-serif';
  ctx.fillText(top, size / 2, size / 2 + 2);
  ctx.font = '700 17px "Inter Tight", system-ui, sans-serif';
  ctx.fillText(bottom, size / 2, size / 2 + 32);

  return toTexture(canvas);
}

/** Мягкое радиальное свечение (аддитивная плоскость). */
export function makeGlowTexture(color = '131,228,10'): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = surface(size, size);
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${color},0.55)`);
  grad.addColorStop(0.45, `rgba(${color},0.12)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return toTexture(canvas);
}
