import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Text filled with a cobalt glow that follows the pointer.
 *
 * The fill is a radial gradient clipped to the glyphs; its centre is two CSS
 * custom properties written straight to the element on pointer move, so the
 * effect never re-renders React. The pointer is tracked across the whole
 * window rather than only over the word, so the glow drifts towards the cursor
 * from anywhere on the hero instead of switching on only when you touch it.
 *
 * Reduced motion does not switch it off: the glow only moves when the visitor
 * moves the pointer, so it is direct feedback rather than animation playing at
 * them. Without a pointer (touch, or `?static` screenshots) the glow rests at a
 * fixed spot, so the word still carries the gradient.
 */
export default function GradientWord({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isStatic = new URLSearchParams(window.location.search).has('static');
    if (isStatic || !window.matchMedia('(hover: hover)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        el.style.setProperty('--gx', `${e.clientX - box.left}px`);
        el.style.setProperty('--gy', `${e.clientY - box.top}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <span
      ref={ref}
      className="inline-block bg-clip-text text-transparent"
      style={{
        // Resting spot until the pointer first moves.
        ['--gx' as string]: '35%',
        ['--gy' as string]: '50%',
        backgroundImage:
          'radial-gradient(circle 18rem at var(--gx) var(--gy), #6f8bff 0%, #1d07e0 35%, #0A0E1A 80%)',
        WebkitBackgroundClip: 'text',
        // The poster's tight leading can push glyph tops and tails outside the
        // line box, where a text-clipped background doesn't paint. Grow the
        // box and pull the margins back so the layout doesn't move.
        padding: '0.15em 0',
        margin: '-0.15em 0',
      }}
    >
      {children}
    </span>
  );
}
