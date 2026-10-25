import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Reveal from './Reveal';
import { findProject, useProjects } from '../lib/projects';
import { useStatic } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The reel and its still, both exported from one 5s continuous take. */
const CLIP = '/videos/kokkoma-showcase.mp4';
const POSTER = '/images/kokkoma-showcase-poster.webp';

/**
 * Rule and project name, taken from the Figma "Hero card" frame (20:236).
 * Not a palette token: the design picks this blue by hand rather than binding
 * a variable, and it sits between `blue` and `navy` — same cobalt hue, lower
 * saturation. Left exact so the section matches the design.
 */
const DESIGN_BLUE = '#1b3597';

/**
 * Wider than the site's 1200px Container. The design runs the card nearly
 * edge to edge, and this section is the one place the page is allowed to
 * breathe past the editorial measure.
 */
const WIDE = 'mx-auto w-full max-w-[1440px] px-6 md:px-10';

/**
 * The name as the design sets it, which is not the name as the data stores it.
 * `projects.ts` holds "Kokkoma Oy" — correct everywhere it appears as a label.
 * Here the card's edge crops the type just under the baseline, and a lowercase
 * `y` puts its tail right in that cut, so the design uses a capital. Kept local
 * rather than changed in the data, where the lowercase form is right.
 */
const DISPLAY_NAME = 'Kokkoma OY';

/** Id for the clip that cuts the reel to the letterforms. */
const NAME_MASK_ID = 'showcase-name-clip';

/** User space the name is drawn in. Width is generous so the type never
 *  overflows it; the SVG scales to its container either way. */
const NAME_VB_W = 1200;
/**
 * Tight to the glyphs. "Kokkoma OY" has no descenders, so the box ends just
 * below the baseline — any slack here becomes a gap that stops the card from
 * cropping the name the way the design does.
 */
const NAME_VB_H = 130;

/** How far the name drops onto the card. */
const NAME_DROP = 4;

/** What the card shrinks to once it has moved into the corner. */
const CARD_END_SCALE = 0.44;

/** Scroll distance the stage holds for. Longer = slower handover. */
const RUN = 1500;

/**
 * The stage turns over to ink as the card pulls away, so the detail arrives on
 * a dark ground. Every colour that sits on it has to turn with it — text left
 * at `ink` would simply vanish — so the three text roles are tweened together
 * with the background rather than swapped by a class.
 */
const DARK_BG = '#0A0E1A';
const DARK_TITLE = '#FFFFFF';
const DARK_BODY = 'rgba(255,255,255,0.68)';
const DARK_NUM = '#E8ECFF';

/** Three facts above the rule, in the design's order. */
const FACTS = [
  { label: 'Asiakas', value: 'Kokkoma Oy' },
  { label: 'Ala', value: 'Betoniurakointi' },
  { label: 'Palvelu', value: 'Nettisivut, SEO, strategia' },
];

/**
 * The featured project: an intro that scrolls normally, then a stage that pins
 * while the reel hands the frame over to the detail.
 *
 * Pinned, the sequence is one scrubbed timeline — the name sinks behind the
 * card, the card shrinks into the top-right corner, and the four things we
 * delivered rise into the space that opens on the left. Scroll position drives
 * it rather than the clock, so the reader sets the pace and can run it back.
 *
 * The card shrinks from a `100% 0%` transform origin, so scale alone carries
 * it into the corner: its top-right edge stays put while the rest pulls in.
 * No x/y tween to keep in sync with the scale, and nothing to re-measure when
 * the viewport changes.
 *
 * ScrollTrigger rather than `motion` here because this pins, and `motion` has
 * no pin. That is also why Home keeps this section out of `Panel` — Panel
 * animates a transform on its wrapper, and a moving transformed ancestor is a
 * known way to make a trigger's measured start and end disagree.
 *
 * The clip plays as video rather than as a frame sequence: measured from this
 * source, 121 WebP frames at display width come to roughly 3.3MB and all must
 * arrive before the loop is smooth, where the re-encoded clip is 315KB and
 * streams.
 *
 * Reduced motion (and `?static`) drops the pin entirely: the card stays full
 * width, the name stays put, and the four items sit below in normal flow. The
 * poster still replaces the video — a looping clip is exactly the kind of
 * unrequested, unstoppable movement that setting exists to stop.
 */
export default function Showcase() {
  const isStatic = useStatic();
  const stage = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLParagraphElement>(null);
  const card = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      if (isStatic || !stage.current) return;

      const items = gsap.utils.toArray<HTMLElement>(
        '[data-item]',
        stage.current,
      );

      const titles = gsap.utils.toArray<HTMLElement>('[data-title]', stage.current);
      const texts = gsap.utils.toArray<HTMLElement>('[data-text]', stage.current);
      const nums = gsap.utils.toArray<HTMLElement>('[data-num]', stage.current);

      gsap.set(items, { opacity: 0, y: 28 });
      gsap.set(card.current, { transformOrigin: '100% 0%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage.current,
          start: 'top top',
          end: `+=${RUN}`,
          pin: true,
          scrub: 1,
          // Scroll still drives the sequence, but letting go settles it to one
          // end or the other, so it can never be parked half-played with the
          // card stranded mid-shrink.
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.25, max: 0.7 },
            delay: 0.06,
            ease: 'power2.inOut',
          },
          // Start and end are measured once; lazy images and the web font land
          // afterwards and move this section down the page.
          invalidateOnRefresh: true,
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh);

      tl
        // The name goes first, sinking behind the card.
        .to(
          name.current,
          { yPercent: 55, opacity: 0, ease: 'power2.in', duration: 0.16 },
          0,
        )
        // Then the card pulls into the corner, uncovering the left half.
        .to(
          card.current,
          { scale: CARD_END_SCALE, ease: 'power2.inOut', duration: 0.44 },
          0.1,
        )
        // The ground turns over with it, and the type turns with the ground.
        .to(
          stage.current,
          { backgroundColor: DARK_BG, ease: 'none', duration: 0.4 },
          0.12,
        )
        .to(titles, { color: DARK_TITLE, ease: 'none', duration: 0.4 }, 0.12)
        .to(texts, { color: DARK_BODY, ease: 'none', duration: 0.4 }, 0.12)
        .to(nums, { color: DARK_NUM, ease: 'none', duration: 0.4 }, 0.12)
        // The detail rises into the space that just opened.
        .to(
          items,
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5, stagger: 0.09 },
          0.42,
        );

      return () => window.removeEventListener('load', refresh);
    },
    { scope: stage, dependencies: [isStatic] },
  );

  const project = findProject(useProjects(), 'kokkoma');
  if (!project) return null;

  const media = isStatic ? (
    <img
      src={POSTER}
      alt={`${project.name}: ${project.tag}`}
      className="block aspect-video w-full object-cover"
    />
  ) : (
    <video
      className="block aspect-video w-full object-cover"
      src={CLIP}
      poster={POSTER}
      autoPlay
      loop
      muted
      // Without this, iOS takes the video fullscreen instead of playing it
      // inline, and autoplay is refused outright.
      playsInline
      preload="metadata"
      aria-label={`${project.name}: ${project.tag}`}
    />
  );

  const delivered = (
    <ol className="flex flex-col gap-7">
      {project.delivered.map((d, i) => (
        <li key={d.title} data-item className="flex gap-5">
          <span
            data-num
            className="mt-1 font-heading text-sm font-semibold tabular-nums"
            style={{ color: DESIGN_BLUE }}
          >
            0{i + 1}
          </span>
          <span>
            <span
              data-title
              className="block font-heading text-lg font-semibold"
              style={{ color: '#0A0E1A' }}
            >
              {d.title}
            </span>
            <span
              data-text
              className="mt-1 block max-w-md font-body text-sm leading-relaxed"
              style={{ color: 'rgba(10,14,26,0.6)' }}
            >
              {d.text}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );

  /**
   * The name is filled with the reel, not with flat colour — the design has a
   * second copy of the clip masked to the letterforms ("Mask group", 20:237).
   *
   * Built as an inline SVG mask rather than `background-clip: text`, which
   * cannot take a video, and rather than an SVG data-URI mask, which would not
   * see the page's web font. Inline `<text>` does, so the mask stays in the
   * same typeface and re-measures itself when the clamp resizes the type.
   *
   * `DESIGN_BLUE` stays underneath: it is what shows if the clip is slow to
   * arrive, and it is the colour the reduced-motion branch uses outright.
   */
  /**
   * The name is filled with the reel, not with flat colour — the design keeps a
   * second copy of the clip masked to the letterforms ("Mask group", 20:237).
   *
   * Done inside one viewBox'd SVG so every coordinate is in the same user space
   * and the whole thing scales with its width. `background-clip: text` cannot
   * take a video, and an SVG mask supplied as a data URI would not see the
   * page's web font; inline `<text>` does, so the cut stays in Space Grotesk.
   *
   * `DESIGN_BLUE` sits behind the video as the fallback the letters show while
   * the clip loads, and is what the reduced-motion branch uses outright.
   */
  const nameBlock = (
    <div
      ref={isStatic ? undefined : name}
      aria-hidden
      className="relative z-0 select-none"
      style={{ top: NAME_DROP }}
    >
      {isStatic ? (
        <p
          className="poster text-center text-[clamp(3.25rem,10vw,7rem)] leading-[0.95]"
          style={{ color: DESIGN_BLUE }}
        >
          {DISPLAY_NAME}
        </p>
      ) : (
        <svg
          viewBox={`0 0 ${NAME_VB_W} ${NAME_VB_H}`}
          className="block w-full"
          focusable="false"
        >
          <defs>
            <clipPath id={NAME_MASK_ID}>
              <text
                x={NAME_VB_W / 2}
                y={NAME_VB_H * 0.955}
                textAnchor="middle"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight={700}
                fontSize={NAME_VB_H * 1.27}
                letterSpacing="-0.03em"
              >
                {DISPLAY_NAME}
              </text>
            </clipPath>
          </defs>

          <g clipPath={`url(#${NAME_MASK_ID})`}>
            <rect x="0" y="0" width={NAME_VB_W} height={NAME_VB_H} fill={DESIGN_BLUE} />
            <foreignObject x="0" y="0" width={NAME_VB_W} height={NAME_VB_H}>
              {/* The clip is enlarged and anchored to its top edge so the
                  letters only ever sample the deep blue field above the
                  laptop. At 1:1 the strip is tall enough that the moving lid
                  rises into it part-way through the take, and the letterforms
                  briefly fill with a screenshot. */}
              <div className="h-full w-full overflow-hidden">
                <video
                  className="h-full object-cover"
                  // Zoom comes from width, not height: `cover` on a box this
                  // wide scales by width, so a taller element reveals *more*
                  // of the frame. At 250% the visible slice is about the top
                  // 55px of the source — comfortably above the laptop for the
                  // whole take. The negative margin re-centres it.
                  // `maxWidth: none` is load-bearing: Tailwind's preflight sets
                  // `video { max-width: 100% }`, which silently caps the zoom
                  // back to the wrapper's width and undoes all of this.
                  style={{
                    width: '250%',
                    maxWidth: 'none',
                    marginLeft: '-75%',
                    objectPosition: '50% 0%',
                  }}
                  src={CLIP}
                  poster={POSTER}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </foreignObject>
          </g>
        </svg>
      )}
    </div>
  );

  const cardBlock = (
    <Link
      ref={isStatic ? undefined : card}
      to={`/work/${project.slug}`}
      aria-label={`${project.name} — see the project`}
      className="relative z-10 -mt-[0.1em] block overflow-hidden rounded-[28px] border border-line bg-paper-2 text-[clamp(3.25rem,10vw,7rem)] will-change-transform"
    >
      {media}
    </Link>
  );

  return (
    <section id="showcase" className="border-b border-line bg-paper">
      <div className={`${WIDE} pt-24 md:pt-32`}>
        <Reveal>
          <h2 className="text-center font-heading text-[clamp(2.5rem,5.5vw,4rem)] font-medium tracking-tight text-ink">
            Esittelyssä
          </h2>
        </Reveal>

        <Reveal delay={0.06} className="mt-12">
          <dl className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:text-left">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="font-heading text-base font-semibold text-ink">
                  {f.label}
                </dt>
                <dd className="mt-1 font-body text-sm text-ink/55">{f.value}</dd>
              </div>
            ))}
          </dl>
          <hr
            className="mt-6 border-0"
            style={{ height: 3, backgroundColor: DESIGN_BLUE }}
          />
        </Reveal>
      </div>

      {isStatic ? (
        <div className={`${WIDE} pb-24 md:pb-32 pt-10`}>
          {nameBlock}
          {cardBlock}
          <div className="mt-14">{delivered}</div>
        </div>
      ) : (
        <div
          ref={stage}
          className="relative overflow-hidden"
          style={{ height: '100svh', backgroundColor: '#FFFFFF' }}
        >
          <div className={`${WIDE} relative h-full pt-[6svh]`}>
            {nameBlock}
            {cardBlock}

            {/* Sits under the shrinking card and is revealed as it pulls away. */}
            <div className="absolute inset-x-6 bottom-[7svh] md:inset-x-10 md:w-[48%]">
              {delivered}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
