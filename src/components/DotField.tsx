import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useStatic } from '../lib/motion';

/**
 * Off-register halftone dot field, sized by a shape mask and swollen by the
 * pointer.
 *
 * Dot size comes from two fields: coverage of a mask built offscreen from an
 * image or from text, and a radial swell under the pointer. The mask is what
 * makes the grid read as a picture rather than a texture — dots are fat where
 * the subject is dark and shrink to a faint background grid where it is empty.
 *
 * Every dot is drawn three times, slightly out of alignment, the way a
 * misprinted halftone separates. The reference uses CMYK; this brand is
 * single-hue, so all three plates are blues.
 *
 * ## Why it is fast enough to be detailed
 *
 * A fine grid is thousands of dots, and three plates each. Redrawing all of
 * them every frame does not fit in a frame: measured at an 11px pitch, the
 * arcs alone cost about as much as the entire 60fps budget.
 *
 * It is also unnecessary. The mask never changes between frames — only the
 * pointer moves. So the whole field is rendered once into an offscreen canvas,
 * and each frame only the neighbourhood the pointer actually touches is
 * restored from it and redrawn swollen. The per-frame cost then depends on the
 * pointer's reach, not on how detailed the picture is, which is what makes a
 * fine pitch affordable at all.
 *
 * The cost of that trade is the idle ripple: a wave over the whole field would
 * dirty every cell every frame and put us straight back where we started. With
 * a detailed subject it added nothing, so it is gone.
 *
 * Reduced motion (and `?static`) blits the base once and never starts the
 * ticker.
 */

/** The three plates, back to front. Cobalt carries the dot; the deep blue and
 *  the pale tint are the misregistered copies behind it. */
const PLATE_DEEP = '#0026B0';
const PLATE_PALE = '#E8ECFF';
const DOT = '#002FD6';

/** Grid pitch in CSS pixels. Lower is more detailed. */
const SPACING = 9;
const DOT_MIN = 0.3;
const DOT_MAX = 5.2;
/** How far the pointer's swell reaches, in CSS pixels. */
const REACH = 130;
/** Plate misalignment, as a fraction of each dot's own radius. Relative, not
 *  absolute, so the misprint reads the same at any grid pitch. */
const PLATE_SHIFT = 0.42;

export default function DotField({
  className = '',
  image,
  imageFit = 'contain',
  imageZoom = 1,
  focal = [0.5, 0.5],
  gamma = 0.75,
  shape = 'e.',
  shapeScale = 0.5,
  shapeY = 0.4,
}: {
  className?: string;
  /** Image URL to halftone. Takes precedence over `shape`. */
  image?: string;
  /** How the image fills the box before `imageZoom` is applied. */
  imageFit?: 'contain' | 'cover';
  /** Multiplier on the fitted size, for zooming past `contain`. */
  imageZoom?: number;
  /** The point of the source, normalised, that should land at the box's
   *  horizontal centre and at `shapeY`. Lets a subject sitting off to one side
   *  of its own canvas be centred without pre-cropping the file. */
  focal?: [number, number];
  /** Curve applied after the coverage range is stretched. Below 1 lifts the
   *  mid-tones, which a pale source needs to read as a picture. */
  gamma?: number;
  /** Text rendered into the mask when no image is given. */
  shape?: string;
  /** Fraction of the box height the text fills. */
  shapeScale?: number;
  /** Vertical centre of the subject, as a fraction of the box height. */
  shapeY?: number;
}) {
  const isStatic = useStatic();
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const source = useRef<HTMLImageElement | null>(null);

  // Raw pointer target, and the eased position actually drawn.
  const target = useRef({ x: -9999, y: -9999 });
  const eased = useRef({ x: -9999, y: -9999 });
  const size = useRef({ w: 0, h: 0, dpr: 1 });

  /** Subject coverage, 0..1, one entry per grid cell. */
  const mask = useRef<Float32Array>(new Float32Array(0));
  const cols = useRef(0);
  const rows = useRef(0);
  /** Flat [x, y, radius] triples reused every frame, so drawing allocates nothing. */
  const scratch = useRef<Float32Array>(new Float32Array(0));
  /** The whole field with no pointer, rendered once. */
  const base = useRef<HTMLCanvasElement | null>(null);
  /** Region repainted last frame, so it can be restored on the next one. */
  const prevBox = useRef<[number, number, number, number] | null>(null);

  /**
   * Paint the cells in a rectangular range into a context, for a given pointer
   * position. Sizes are gathered into a scratch buffer first, then stroked in
   * three passes, one per plate: setting fillStyle and issuing beginPath/fill
   * per dot costs three state changes and three path submissions each, which
   * at a fine pitch is the whole frame. Batching makes it three, whatever the
   * dot count.
   */
  const paint = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      c0: number,
      r0: number,
      c1: number,
      r1: number,
      px: number,
      py: number,
    ) => {
      const buf = scratch.current;
      let k = 0;

      for (let r = r0; r < r1; r++) {
        const y = r * SPACING + SPACING / 2;
        for (let c = c0; c < c1; c++) {
          const x = c * SPACING + SPACING / 2;
          const shapeAt = mask.current[r * cols.current + c] ?? 0;

          const d = Math.hypot(x - px, y - py);
          const pull = d > REACH ? 0 : (1 - d / REACH) ** 2;

          const amount = Math.min(1, shapeAt + pull * 0.55);
          const rad = DOT_MIN + (DOT_MAX - DOT_MIN) * amount;
          if (rad < 0.25) continue;

          buf[k++] = x;
          buf[k++] = y;
          buf[k++] = rad;
        }
      }

      const plate = (colour: string, sx: number, sy: number) => {
        ctx.fillStyle = colour;
        ctx.beginPath();
        for (let i = 0; i < k; i += 3) {
          const rad = buf[i + 2];
          const cx = buf[i] + sx * rad * PLATE_SHIFT;
          const cy = buf[i + 1] + sy * rad * PLATE_SHIFT;
          // moveTo before each arc, or the subpaths join into one shape.
          ctx.moveTo(cx + rad, cy);
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        }
        ctx.fill();
      };

      plate(PLATE_DEEP, 1, 1);
      plate(PLATE_PALE, -1, -1);
      plate(DOT, 0, 0);
    },
    [],
  );

  /** Render the pointer-free field once. */
  const buildBase = useCallback(() => {
    const { w, h, dpr } = size.current;
    if (!w || !h) return;

    const cv = base.current ?? document.createElement('canvas');
    base.current = cv;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);

    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    paint(ctx, 0, 0, cols.current, rows.current, -99999, -99999);
    prevBox.current = null;
  }, [paint]);

  /**
   * Build the coverage grid. Rebuilt on resize and when the source lands, not
   * per frame.
   *
   * The subject is drawn at full size, then scaled down to exactly one pixel
   * per grid cell. That second step matters: letting the browser area-average
   * the whole cell is what keeps an already-dotted source from beating against
   * our grid and turning into moire. Point-sampling one pixel per cell would
   * alias badly on any textured image.
   */
  const buildMask = useCallback(() => {
    const { w, h } = size.current;
    cols.current = Math.max(1, Math.ceil(w / SPACING));
    rows.current = Math.max(1, Math.ceil(h / SPACING));
    mask.current = new Float32Array(cols.current * rows.current);
    scratch.current = new Float32Array(cols.current * rows.current * 3);
    if (w < 2 || h < 2) return;

    const hi = document.createElement('canvas');
    hi.width = Math.round(w);
    hi.height = Math.round(h);
    const hctx = hi.getContext('2d');
    if (!hctx) return;

    const img = source.current;
    if (image && img?.complete && img.naturalWidth) {
      const fit =
        imageFit === 'cover'
          ? Math.max(w / img.naturalWidth, h / img.naturalHeight)
          : Math.min(w / img.naturalWidth, h / img.naturalHeight);
      const scale = fit * imageZoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      // Place the focal point rather than the image's own centre.
      hctx.drawImage(
        img,
        w / 2 - focal[0] * dw,
        h * shapeY - focal[1] * dh,
        dw,
        dh,
      );
    } else if (!image && shape) {
      const REF = 100;
      hctx.font = `700 ${REF}px "Space Grotesk", sans-serif`;
      const width = hctx.measureText(shape).width || 1;
      const px =
        REF * Math.min((h * shapeScale) / (REF * 0.72), (w * 0.86) / width);
      hctx.font = `700 ${px}px "Space Grotesk", sans-serif`;
      hctx.textAlign = 'center';
      hctx.textBaseline = 'middle';
      hctx.fillStyle = '#000';
      hctx.fillText(shape, w / 2, h * shapeY);
    } else {
      return;
    }

    // Area-average down to one pixel per cell.
    const lo = document.createElement('canvas');
    lo.width = cols.current;
    lo.height = rows.current;
    const lctx = lo.getContext('2d', { willReadFrequently: true });
    if (!lctx) return;
    lctx.imageSmoothingEnabled = true;
    lctx.imageSmoothingQuality = 'high';
    lctx.drawImage(hi, 0, 0, hi.width, hi.height, 0, 0, lo.width, lo.height);

    const d = lctx.getImageData(0, 0, lo.width, lo.height).data;
    const n = cols.current * rows.current;
    let min = 1;
    let max = 0;

    for (let i = 0; i < n; i++) {
      const o = i * 4;
      const a = d[o + 3] / 255;
      // Perceptual luminance. Coverage is darkness weighted by opacity, so a
      // black glyph on transparent and a cobalt subject on white both read as
      // "ink here" without needing separate paths.
      const lum = (0.2126 * d[o] + 0.7152 * d[o + 1] + 0.0722 * d[o + 2]) / 255;
      const v = a * (1 - lum);
      mask.current[i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }

    // Stretch whatever range the source actually occupies to the full one. A
    // pale halftone averages into a narrow band of light values; without this
    // the dots never grow and the subject stays a ghost.
    const range = Math.max(0.001, max - min);
    for (let i = 0; i < n; i++) {
      mask.current[i] = ((mask.current[i] - min) / range) ** gamma;
    }

    buildBase();
  }, [
    image,
    imageFit,
    imageZoom,
    focal,
    gamma,
    shape,
    shapeScale,
    shapeY,
    buildBase,
  ]);

  /** Restore the last touched region from the base, then repaint under the
   *  pointer. Returns false when there was nothing to do. */
  const draw = useCallback(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    const bg = base.current;
    if (!cv || !ctx || !bg) return false;

    const { w, h, dpr } = size.current;
    const px = eased.current.x;
    const py = eased.current.y;

    // Dots bleed past their cell, so pad the region by a dot's worth.
    const pad = DOT_MAX * 2;
    const near = px > -9000;
    const box: [number, number, number, number] | null = near
      ? [
          Math.max(0, px - REACH - pad),
          Math.max(0, py - REACH - pad),
          Math.min(w, px + REACH + pad),
          Math.min(h, py + REACH + pad),
        ]
      : null;

    const prev = prevBox.current;
    if (!box && !prev) return false;

    // Repaint the union of where the swell was and where it now is.
    const x0 = Math.max(0, Math.min(box?.[0] ?? Infinity, prev?.[0] ?? Infinity));
    const y0 = Math.max(0, Math.min(box?.[1] ?? Infinity, prev?.[1] ?? Infinity));
    const x1 = Math.min(w, Math.max(box?.[2] ?? 0, prev?.[2] ?? 0));
    const y1 = Math.min(h, Math.max(box?.[3] ?? 0, prev?.[3] ?? 0));
    if (x1 <= x0 || y1 <= y0) {
      prevBox.current = box;
      return false;
    }

    // Restore that region from the pointer-free render, 1:1 in device pixels.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const sx = Math.floor(x0 * dpr);
    const sy = Math.floor(y0 * dpr);
    const sw = Math.ceil((x1 - x0) * dpr);
    const sh = Math.ceil((y1 - y0) * dpr);
    ctx.clearRect(sx, sy, sw, sh);
    ctx.drawImage(bg, sx, sy, sw, sh, sx, sy, sw, sh);
    ctx.restore();

    if (box) {
      // Clip so swollen dots cannot spill outside the region we just restored.
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, y0, x1 - x0, y1 - y0);
      ctx.clip();
      paint(
        ctx,
        Math.max(0, Math.floor(box[0] / SPACING)),
        Math.max(0, Math.floor(box[1] / SPACING)),
        Math.min(cols.current, Math.ceil(box[2] / SPACING)),
        Math.min(rows.current, Math.ceil(box[3] / SPACING)),
        px,
        py,
      );
      ctx.restore();
    }

    prevBox.current = box;
    return true;
  }, [paint]);

  /** Blit the whole pointer-free field. */
  const blitBase = useCallback(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    const bg = base.current;
    if (!cv || !ctx || !bg) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(bg, 0, 0);
    ctx.restore();
    prevBox.current = null;
  }, []);

  /** Match the backing store to the box and the device pixel ratio. */
  const resize = useCallback(() => {
    const cv = canvas.current;
    const boxEl = host.current;
    if (!cv || !boxEl) return;

    const rect = boxEl.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size.current = { w: rect.width, h: rect.height, dpr };

    cv.width = Math.round(rect.width * dpr);
    cv.height = Math.round(rect.height * dpr);
    cv.style.width = `${rect.width}px`;
    cv.style.height = `${rect.height}px`;
    cv.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildMask();
    blitBase();
  }, [buildMask, blitBase]);

  useGSAP(
    () => {
      let alive = true;
      resize();

      const refresh = () => {
        if (!alive) return;
        buildMask();
        blitBase();
      };

      if (image) {
        const el = new Image();
        el.decoding = 'async';
        el.onload = () => {
          source.current = el;
          refresh();
        };
        el.src = image;
      } else {
        // Text is measured from rendered type, so the mask is wrong until the
        // web font is in. Rebuild once it lands.
        document.fonts?.ready.then(refresh);
      }

      const ro = new ResizeObserver(() => resize());
      if (host.current) ro.observe(host.current);

      if (isStatic) {
        return () => {
          alive = false;
          ro.disconnect();
        };
      }

      const onMove = (e: PointerEvent) => {
        const rect = host.current?.getBoundingClientRect();
        if (!rect) return;
        target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };
      const onLeave = () => {
        target.current = { x: -9999, y: -9999 };
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);

      const tick = () => {
        const t = target.current;
        const e = eased.current;
        // Snap out to the parked position rather than easing 9999px back.
        if (t.x < -9000) {
          if (e.x > -9000) {
            e.x = -9999;
            e.y = -9999;
            draw();
          }
          return;
        }
        if (e.x < -9000) {
          e.x = t.x;
          e.y = t.y;
        } else {
          e.x += (t.x - e.x) * 0.14;
          e.y += (t.y - e.y) * 0.14;
        }
        draw();
      };
      gsap.ticker.add(tick);

      return () => {
        alive = false;
        gsap.ticker.remove(tick);
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', onLeave);
        ro.disconnect();
      };
    },
    { dependencies: [isStatic, resize, buildMask, blitBase, draw, image] },
  );

  return (
    <div ref={host} aria-hidden className={className}>
      <canvas ref={canvas} className="block h-full w-full" />
    </div>
  );
}
