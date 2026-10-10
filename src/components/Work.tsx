import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { Container, Eyebrow } from './primitives';
import Reveal from './Reveal';
import { useStatic } from '../lib/motion';
import { PROJECTS } from '../lib/projects';

gsap.registerPlugin(Flip, useGSAP);

/** Filter labels, derived from the tags rather than hand-listed, so adding a
 *  project with a new discipline adds its filter automatically. */
const FILTERS = [
  'All',
  ...Array.from(new Set(PROJECTS.flatMap((p) => p.tag.split(' & ')))),
];

export default function Work() {
  const isStatic = useStatic();
  const grid = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('All');
  /** Layout captured the instant before React re-renders the grid. */
  const snapshot = useRef<Flip.FlipState | null>(null);

  const choose = (f: string) => {
    if (f === active) return;
    // FLIP's First: measure where every card is now, before the DOM changes.
    if (!isStatic && grid.current) {
      snapshot.current = Flip.getState(
        grid.current.querySelectorAll('[data-card]'),
        { props: 'opacity' },
      );
    }
    setActive(f);
  };

  useGSAP(
    () => {
      const state = snapshot.current;
      if (!state || isStatic) return;
      snapshot.current = null;

      // Last, Invert, Play — from the captured positions to wherever the cards
      // have just landed. Nothing here says what moved where; Flip works that
      // out by comparing the two measurements.
      Flip.from(state, {
        duration: 0.55,
        ease: 'power2.inOut',
        // Take the cards out of flow while they travel, so the ones that stay
        // do not jump to their new slot before the animation starts.
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
          ),
        onLeave: (els) =>
          gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.25 }),
      });
    },
    { dependencies: [active], scope: grid },
  );

  const shows = (tag: string) => active === 'All' || tag.includes(active);

  return (
    <section id="work" className="border-b border-line bg-paper py-24 md:py-32">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Recent work</Eyebrow>
            <h2 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
              Built for businesses
              <br className="hidden md:block" /> across Finland.
            </h2>
          </div>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 font-body text-sm text-ink/70 transition-colors hover:text-blue"
          >
            Start your project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap gap-2" delay={0.06}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => choose(f)}
              aria-pressed={active === f}
              className={`rounded-full border px-4 py-2 font-body text-sm transition-colors ${
                active === f
                  ? 'border-blue bg-blue text-white'
                  : 'border-line text-ink/70 hover:border-ink/30 hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </Reveal>

        <div
          ref={grid}
          className="mt-10 grid gap-6 sm:grid-cols-2"
        >
          {PROJECTS.map((p, i) => (
            // Cards stay mounted and are hidden with `display: none` rather
            // than unmounted, so Flip can measure them on both sides of the
            // change and drive its own enter/leave.
            <div
              key={p.slug}
              data-card
              className={shows(p.tag) ? '' : 'hidden'}
            >
              {/* Reveal sits inside the flip target: it animates transforms
                  too, and Flip must own the outer element's transform alone. */}
              <Reveal delay={i * 0.08}>
                <Link to={`/work/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-paper-2">
                    <img
                      src={p.img}
                      alt={`${p.name}: ${p.tag}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <h3 className="font-heading text-lg font-semibold text-ink">
                      {p.name}
                    </h3>
                    <span className="font-body text-sm text-ink/50">
                      {p.tag}
                    </span>
                  </div>
                </Link>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
