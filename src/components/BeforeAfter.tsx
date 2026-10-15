import { useRef, useState, type PointerEvent } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

/**
 * Two images of the same frame, one wiped over the other by a draggable divider.
 * `before` sits on top, clipped to the left of the divider; `after` fills the rest.
 *
 * Dragging is plain pointer events on the frame (mouse, touch and pen alike).
 * `touch-action: pan-y` hands vertical swipes back to the page, so the slider
 * never traps someone scrolling past it on a phone. A visually hidden range
 * input carries the same value for keyboard and screen-reader users.
 */
export default function BeforeAfter({
  before,
  after,
  labels,
}: {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  labels: { before: string; after: string; slider: string };
}) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    setPos(Math.min(100, Math.max(0, ((clientX - box.left) / box.width) * 100)));
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };

  const badge =
    'pointer-events-none absolute top-4 rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide transition-opacity duration-300';

  return (
    <div
      ref={frame}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="group relative cursor-ew-resize select-none overflow-hidden rounded-2xl border border-line bg-white"
      style={{ touchAction: 'pan-y' }}
    >
      <img src={after.src} alt={after.alt} draggable={false} className="block w-full" />
      <img
        src={before.src}
        alt={before.alt}
        draggable={false}
        className="absolute inset-0 h-full w-full"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <span className={`${badge} left-4 bg-ink/80 text-white ${pos < 15 ? 'opacity-0' : ''}`}>
        {labels.before}
      </span>
      <span className={`${badge} right-4 bg-blue text-white ${pos > 85 ? 'opacity-0' : ''}`}>
        {labels.after}
      </span>

      {/* Divider and knob. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-blue"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blue text-white shadow-lg ring-4 ring-white group-has-[:focus-visible]:ring-blue/40">
          <ChevronsLeftRight className="h-5 w-5" strokeWidth={2.25} />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={labels.slider}
        className="sr-only"
      />
    </div>
  );
}
