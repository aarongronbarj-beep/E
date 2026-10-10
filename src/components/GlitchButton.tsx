import { useRef } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStatic } from '../lib/motion';

gsap.registerPlugin(ScrambleTextPlugin, useGSAP);

/** One tear, start to finish, in ms. Short — it answers a hover. */
const BURST = 0.42;

/**
 * Primary call to action that tears when you reach for it.
 *
 * The label scrambles in place and resolves; the arrow steps sideways in hard
 * jumps rather than sliding. Nothing changes size or position, so the button's
 * hit area is identical before, during and after — a control that moves under
 * the cursor is a control you miss.
 *
 * Accessibility: mid-tween the label is nonsense, so the animated span is
 * aria-hidden and the accessible name comes from the anchor's aria-label. The
 * tear fires on focus as well as hover, so it is not mouse-only feedback, and
 * reduced motion (or `?static`) skips it entirely — the button still has its
 * colour shift and focus ring.
 */
export default function GlitchButton({
  href,
  label,
  className = '',
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const isStatic = useStatic();
  const root = useRef<HTMLAnchorElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const arrow = useRef<SVGSVGElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  // Assigned inside useGSAP via contextSafe — a handler that fires after the
  // hook has run is outside the context unless it is wrapped.
  const fire = useRef<() => void>(() => {});

  useGSAP(
    (_context, contextSafe) => {
      if (isStatic) return;

      const build = () =>
        gsap
          .timeline()
          .to(
            text.current,
            {
              duration: BURST,
              ease: 'none',
              scrambleText: {
                text: label,
                // ASCII only: block glyphs are missing from most grotesks and
                // would render as tofu.
                chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>{}',
                speed: 1.2,
                // Fixed length, so the label cannot reflow mid-scramble and
                // shove the arrow around.
                tweenLength: false,
              },
            },
            0,
          )
          .to(
            arrow.current,
            {
              x: 5,
              duration: 0.22,
              // Stepped, so the arrow jumps rather than slides.
              ease: 'steps(2)',
            },
            0,
          )
          .to(arrow.current, { x: 0, duration: 0.2, ease: 'steps(2)' }, 0.22);

      tl.current = build();

      fire.current = contextSafe
        ? contextSafe(() => tl.current?.invalidate().restart())
        : () => tl.current?.invalidate().restart();

      return () => {
        tl.current?.kill();
        if (text.current) text.current.textContent = label;
        gsap.set(arrow.current, { x: 0 });
      };
    },
    { scope: root, dependencies: [isStatic, label] },
  );

  return (
    <Link
      ref={root}
      to={href}
      aria-label={label}
      onPointerEnter={() => fire.current()}
      onFocus={() => fire.current()}
      className={`group inline-flex items-center gap-3 bg-blue px-9 py-5 font-body text-base font-medium text-white transition-colors duration-200 hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue ${className}`}
    >
      {/* An invisible copy of the real label holds the width open, and the
          animated one is laid over it. Scramble's intermediate strings are not
          always the full length, so without this the button narrows mid-tear
          and the arrow walks — a control must not resize under the cursor. */}
      <span className="relative inline-block">
        <span aria-hidden className="invisible whitespace-nowrap">
          {label}
        </span>
        {/* Scramble rewrites this node's text, so it must not carry the name. */}
        <span
          ref={text}
          aria-hidden
          className="absolute inset-0 whitespace-nowrap"
        >
          {label}
        </span>
      </span>
      <ArrowRight ref={arrow} aria-hidden className="h-4 w-4" />
    </Link>
  );
}
