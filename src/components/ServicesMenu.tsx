import {
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import GlitchLines from "./GlitchText";
import { useCopy } from "../lib/i18n";
import { IMG } from "../lib/assets";
import { EASE, useStatic } from "../lib/motion";

const A = IMG.servicesV2;
/** Signal green from the Figma frame — accent for this section only. */
const LIME = "#acff12";

const COPY = {
  fi: {
    tagline: "Ammattitaitoa nuorilta",
    heading: "Palvelut",
    more: "Lue lisää",
    web: {
      title: "Nettisivujen kehitys",
      body: "Teemme nettisivut suunnitelmasta toteutukseen huolella",
      link: "Nettisivujen kehitys",
    },
    seo: {
      lead: "Näkyvyys",
      accent: "edellä",
      link: "Näkyvyys ja hakukoneoptimointi",
    },
    design: {
      title: "Graafinen suunnittelu",
      body: "Yrityksille nettisivujen tekeminen alusta asti tai uudistus",
    },
  },
  en: {
    tagline: "Skill from young talent",
    heading: "Services",
    more: "Read more",
    web: {
      title: "Web development",
      body: "We build websites with care, from the plan to the finished site",
      link: "Web development",
    },
    seo: { lead: "Visibility", accent: "first", link: "Visibility and SEO" },
    design: {
      title: "Graphic design",
      body: "Websites for businesses, built from scratch or redesigned",
    },
  },
};

/**
 * Figma "Frame 9" (Ealize – Etusivu, node 82:280): a variant of the home page
 * services menu. A white band with the tagline drops into a black field
 * holding three angled service cards.
 *
 * From md up the frame is drawn at its 1440×1280 design size and scaled with
 * the section: `--p` is one design pixel, so every position below is the
 * Figma coordinate times `--p`. Below md the cards stack in normal flow, since
 * a scaled 1440 frame would shrink the copy past legibility.
 *
 * Motion, all of it skipped under reduced motion or `?static`:
 *   - headings tear in through the site's glitch and re-tear on hover;
 *   - the brushstroke paints on, rules and the black step draw from the left;
 *   - each card wipes open, its artwork settles out of a zoom, then keeps a
 *     slow drift and a scroll parallax; panels slide in, the phone springs up
 *     and floats, buttons pop;
 *   - cards tilt towards the pointer and push their artwork in on hover.
 */
const p = (n: number) => `calc(var(--p) * ${n})`;
const box = (
  left: number,
  top: number,
  width: number,
  height?: number,
): CSSProperties => ({
  position: "absolute",
  left: p(left),
  top: p(top),
  width: p(width),
  ...(height !== undefined && { height: p(height) }),
});
/** Clip to the cards' slanted edges, from the Figma mask paths. */
const slant = (topRight: number, bottomRight: number, height: number) =>
  `polygon(0 0, ${p(topRight)} 0, ${p(bottomRight)} ${p(height)}, 0 ${p(height)})`;

/* ---- Motion vocabulary ------------------------------------------------- */

const at = (delay: number, duration = 0.9) => ({ delay, duration, ease: EASE });
const OPEN = "inset(0% 0% 0% 0%)";
const FROM_LEFT = "inset(0% 100% 0% 0%)";
const FROM_BOTTOM = "inset(100% 0% 0% 0%)";
const wipe = (from: string, delay = 0): Variants => ({
  hidden: { clipPath: from },
  show: { clipPath: OPEN, transition: at(delay, 1.1) },
});
const rise = (delay: number, y = 24): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: at(delay, 0.8) },
});
const drawX = (delay: number): Variants => ({
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: at(delay) },
});
const drawY = (delay: number): Variants => ({
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: at(delay) },
});
const slideIn = (delay: number): Variants => ({
  hidden: { x: "-105%" },
  show: { x: "0%", transition: at(delay, 1) },
});
const pop = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 20, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, type: "spring", stiffness: 260, damping: 18 },
  },
});
/** Card artwork: settles out of a zoom, and leans in while the card is hovered. */
const settle: Variants = {
  hidden: { scale: 1.25 },
  show: { scale: 1, transition: { duration: 1.8, ease: EASE } },
  hover: { scale: 1.07, transition: { duration: 0.8, ease: EASE } },
};
const phoneIn: Variants = {
  hidden: { opacity: 0, y: "70%", rotate: -8 },
  show: {
    opacity: 1,
    y: "0%",
    rotate: 0,
    transition: { delay: 0.55, type: "spring", stiffness: 120, damping: 16 },
  },
};
/** The lime frame slides out from behind the green panel. */
const frameIn: Variants = {
  hidden: { opacity: 0, x: "-3.3%", y: "-1.8%" },
  show: { opacity: 1, x: "0%", y: "0%", transition: at(0.75) },
};
const fromLeft = { transformOrigin: "left center" } as const;
const fromTop = { transformOrigin: "center top" } as const;

/** Props that start a variant tree when it scrolls into view, or show it at once. */
const play = (isStatic: boolean, amount = 0.3) =>
  isStatic
    ? { initial: false as const, animate: "show" }
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, amount },
      };

/** Glitch-in heading, held invisible until it is on screen, since GlitchLines fires on mount. */
function GlitchIn({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const isStatic = useStatic();
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  if (isStatic) return <>{children}</>;
  return (
    <span ref={ref} className="block">
      {seen ? (
        <GlitchLines lines={[children]} delay={delay} />
      ) : (
        <span className="invisible block">{children}</span>
      )}
    </span>
  );
}

/** Pointer tilt for a card, springing back flat when the pointer leaves. */
function useTilt(isStatic: boolean, max = 4) {
  const rotateX = useSpring(0, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 18 });
  if (isStatic) return { style: {} };
  return {
    style: { rotateX, rotateY, transformPerspective: 1400 },
    whileHover: "hover",
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 2 * max);
      rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 2 * max);
    },
    onPointerLeave: () => {
      rotateX.set(0);
      rotateY.set(0);
    },
  };
}

/** Scroll parallax: artwork travels `range` px against the page while the section passes. */
function useParallax(target: RefObject<HTMLElement | null>, range: number) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], [range, -range]);
}

/** Card artwork: positioned in design px, settles in, drifts, and rides the parallax. */
function Art({
  src,
  frame,
  y,
  flip = false,
}: {
  src: string;
  frame: CSSProperties;
  y?: MotionValue<number>;
  flip?: boolean;
}) {
  const isStatic = useStatic();
  return (
    <motion.div
      aria-hidden
      variants={settle}
      style={{ ...frame, ...(y && !isStatic && { y }) }}
    >
      <motion.img
        src={src}
        alt=""
        className={`h-full w-full max-w-none object-cover ${flip ? "-scale-y-100" : ""}`}
        animate={
          isStatic
            ? undefined
            : { x: ["0%", "-1.5%", "0%"], y: ["0%", "1%", "0%"] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export default function ServicesMenu() {
  const t = useCopy(COPY);
  return (
    <section aria-labelledby="services-menu-heading" className="bg-black">
      <Desktop t={t} />
      <Mobile t={t} />
    </section>
  );
}

type Copy = (typeof COPY)["fi"];

function Desktop({ t }: { t: Copy }) {
  const isStatic = useStatic();
  const frame = useRef<HTMLDivElement>(null);
  const webY = useParallax(frame, 45);
  const seoY = useParallax(frame, 25);
  const designY = useParallax(frame, 35);
  const webTilt = useTilt(isStatic);
  const seoTilt = useTilt(isStatic, 3);
  const designTilt = useTilt(isStatic, 3);
  const heading = { fontSize: p(51.176), lineHeight: p(80) };
  const body = { fontSize: p(24), lineHeight: p(30) };
  return (
    <div className="hidden bg-white md:block">
      <div
        ref={frame}
        // Height by aspect ratio: cqw on the container itself would resolve
        // against the viewport, not this box.
        className="relative mx-auto aspect-[1440/1280] max-w-[1440px] overflow-hidden [container-type:inline-size] [--p:calc(100cqw/1440)]"
      >
        <div aria-hidden className="bg-black" style={box(0, 430, 1440, 850)} />

        {/* Top band: tagline and brushstroke, then the black field steps in
            from the left and slopes down past a hairline rule. */}
        <motion.div {...play(isStatic, 0.4)} style={box(0, 0, 1440, 560)}>
          <motion.img
            src={A.brush}
            alt=""
            aria-hidden
            className="max-w-none"
            variants={wipe(FROM_LEFT, 0.35)}
            style={box(44.892, 178.578, 433.378, 104.912)}
          />
          <p
            className="font-heading font-bold text-black"
            style={{ ...box(57, 107, 717), ...heading }}
          >
            <GlitchIn>{t.tagline}</GlitchIn>
          </p>
          <motion.div
            aria-hidden
            className="bg-black"
            variants={drawX(0.15)}
            style={{ ...box(0, 388, 755, 51), ...fromLeft }}
          />
          <motion.img
            src={A.blackNotch}
            alt=""
            aria-hidden
            variants={rise(0.55, 20)}
            style={box(653.68, 388, 202.65, 56.25)}
          />
          <motion.div
            aria-hidden
            className="bg-ink"
            variants={drawX(0.7)}
            style={{ ...box(882, 408, 471, 5), ...fromLeft }}
          />

          <h2
            id="services-menu-heading"
            className="whitespace-nowrap font-heading font-bold text-white"
            style={{ ...box(103, 463, 199), ...heading }}
          >
            <GlitchIn delay={0.2}>{t.heading}</GlitchIn>
          </h2>
          <motion.div
            aria-hidden
            variants={drawX(0.6)}
            style={{ ...box(103, 530, 239, 4), ...fromLeft, background: LIME }}
          />
        </motion.div>

        {/* Graphic design — lime frame showing past a slanted green panel. */}
        <motion.div
          {...play(isStatic)}
          {...designTilt}
          style={{ ...box(554, 883, 799, 333), ...designTilt.style }}
        >
          <motion.img
            src={A.designFrame}
            alt=""
            aria-hidden
            variants={frameIn}
            style={box(26, 6, 798, 327)}
          />
          <motion.div
            className="absolute inset-0"
            variants={wipe(FROM_LEFT, 0.15)}
          >
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: slant(666.366, 798.999, 333) }}
            >
              <Art
                src={A.green}
                frame={box(-81.135, -153.011, 953.435, 533.47)}
                y={designY}
              />
            </div>
          </motion.div>
          <motion.div
            aria-hidden
            className="bg-white"
            variants={drawY(0.6)}
            style={{ ...box(63, 54, 3, 237), ...fromTop }}
          />
          <h3
            className="font-heading font-bold text-white"
            style={{ ...box(87, 54, 552), ...heading }}
          >
            <GlitchIn delay={0.4}>{t.design.title}</GlitchIn>
          </h3>
          <motion.p
            className="font-body text-white"
            variants={rise(0.85)}
            style={{ ...box(88, 142, 480), ...body }}
          >
            {t.design.body}
          </motion.p>
        </motion.div>

        {/* Visibility / SEO — blue field, phone mockup, right edge cut by a black wedge. */}
        <motion.div
          {...play(isStatic)}
          {...seoTilt}
          style={{ ...box(554, 581, 772, 285), ...seoTilt.style }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden"
            variants={wipe(FROM_LEFT)}
          >
            <Art
              src={A.seoBg}
              frame={box(-55.35, -47.83, 1161.9, 650.1)}
              y={seoY}
            />
            <motion.div
              aria-hidden
              className="bg-[#d9d9d9]"
              variants={drawX(0.55)}
              style={{ ...box(91, 107, 400, 2), ...fromLeft }}
            />
            <motion.div variants={pop(0.95)} style={box(307, 142, 217, 69)}>
              <LearnMore
                to="/services/seo"
                label={t.more}
                name={t.seo.link}
                fill
              />
            </motion.div>
            <h3
              className="whitespace-nowrap font-heading font-bold text-white"
              style={{
                ...box(87, 43, 454, 58),
                fontSize: p(57.536),
                lineHeight: "normal",
              }}
            >
              <GlitchIn delay={0.3}>
                {t.seo.lead} <span style={{ color: LIME }}>{t.seo.accent}</span>
              </GlitchIn>
            </h3>
            <div className="overflow-hidden" style={box(81, 104, 252, 181)}>
              <motion.div className="absolute inset-0" variants={phoneIn}>
                <motion.img
                  src={A.phone}
                  alt=""
                  aria-hidden
                  className="absolute left-0 top-0 h-[184.62%] w-[100.03%] max-w-none"
                  animate={isStatic ? undefined : { y: ["0%", "-1.6%", "0%"] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.4,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        <img
          src={A.seoPolygon}
          alt=""
          aria-hidden
          style={box(1219.07, 556, 194.86, 329.25)}
        />

        {/* Web development — blue field under a green, slanted header panel. */}
        <motion.div
          {...play(isStatic)}
          {...webTilt}
          style={{ ...box(89, 581, 443, 635), ...webTilt.style }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden"
            variants={wipe(FROM_BOTTOM)}
          >
            <Art
              src={A.webBg}
              frame={box(-625.05, -118.17, 1518.06, 849.39)}
              y={webY}
            />
            <motion.img
              src={A.webHead}
              alt=""
              aria-hidden
              variants={slideIn(0.35)}
              style={box(0, 0, 428, 219)}
            />
            <motion.div
              className="overflow-hidden"
              variants={slideIn(0.45)}
              style={{
                ...box(0, 0, 412.551, 208),
                clipPath: slant(412.551, 344.067, 208),
              }}
            >
              <Art
                src={A.green}
                frame={box(-66.477, -14.515, 541.46, 302.96)}
                flip
              />
            </motion.div>
            <h3
              className="font-heading font-bold text-white"
              style={{
                ...box(16, 98, 364),
                fontSize: p(51.176),
                lineHeight: p(50),
              }}
            >
              <GlitchIn delay={0.5}>{t.web.title}</GlitchIn>
            </h3>
            <motion.div
              aria-hidden
              className="bg-white"
              variants={drawX(0.7)}
              style={{ ...box(14, 258, 216, 1), ...fromLeft }}
            />
            <motion.p
              className="font-body text-white"
              variants={rise(0.8)}
              style={{ ...box(14, 266, 350), ...body }}
            >
              {t.web.body}
            </motion.p>
            <motion.div variants={pop(1)} style={box(4, 375, 217, 69)}>
              <LearnMore
                to="/services/websites"
                label={t.more}
                name={t.web.link}
                fill
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function Mobile({ t }: { t: Copy }) {
  const isStatic = useStatic();
  return (
    <div className="md:hidden">
      <motion.div
        {...play(isStatic, 0.5)}
        className="bg-white px-4 pb-10 pt-12"
      >
        <p className="font-heading text-[2rem] font-bold leading-tight text-black">
          <GlitchIn>{t.tagline}</GlitchIn>
        </p>
        <motion.img
          src={A.brush}
          alt=""
          aria-hidden
          variants={wipe(FROM_LEFT, 0.3)}
          className="mt-2 block w-[70%] max-w-[433px]"
        />
      </motion.div>
      <div className="px-4 pb-16 pt-8">
        <motion.h2
          {...play(isStatic, 0.6)}
          className="inline-block font-heading text-[2.25rem] font-bold leading-tight text-white"
        >
          <GlitchIn delay={0.1}>{t.heading}</GlitchIn>
          <motion.span
            aria-hidden
            variants={drawX(0.4)}
            className="mt-1 block h-1 w-[118%]"
            style={{ ...fromLeft, background: LIME }}
          />
        </motion.h2>

        <div className="mt-10 flex flex-col gap-4">
          <MobileCard img={A.webBg} title={t.web.title} body={t.web.body}>
            <LearnMore
              to="/services/websites"
              label={t.more}
              name={t.web.link}
              className="mt-6 text-lg"
            />
          </MobileCard>
          <MobileCard
            img={A.seoBg}
            title={
              <>
                {t.seo.lead} <span style={{ color: LIME }}>{t.seo.accent}</span>
              </>
            }
          >
            <LearnMore
              to="/services/seo"
              label={t.more}
              name={t.seo.link}
              className="mt-6 text-lg"
            />
          </MobileCard>
          <MobileCard
            img={A.green}
            title={t.design.title}
            body={t.design.body}
            rule
          />
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  img,
  title,
  body,
  rule = false,
  children,
}: {
  img: string;
  title: ReactNode;
  body?: string;
  rule?: boolean;
  children?: ReactNode;
}) {
  const isStatic = useStatic();
  return (
    // The wipe sits one level in: an element clipped shut by its own clip-path
    // never reports as in view, so it would wait forever to open.
    <motion.div {...play(isStatic, 0.35)}>
      <motion.div
        variants={wipe(FROM_LEFT)}
        className="relative overflow-hidden px-5 py-8"
      >
        <Art src={img} frame={{ position: "absolute", inset: 0 }} />
        <div
          className={`relative ${rule ? "border-l-[3px] border-white pl-4" : ""}`}
        >
          <h3 className="font-heading text-[2rem] font-bold leading-[1.1] text-white">
            <GlitchIn delay={0.3}>{title}</GlitchIn>
          </h3>
          {body && (
            <motion.p
              variants={rise(0.6)}
              className="mt-4 font-body text-lg leading-snug text-white"
            >
              {body}
            </motion.p>
          )}
          {children && <motion.div variants={pop(0.75)}>{children}</motion.div>}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Figma "Component 8": white pill, label, and a green dot carrying a diagonal
 * arrow. Sized in em so one font size scales the whole button. The visible
 * label is generic, so the accessible name says which service it opens.
 * `fill` sizes it to a positioned wrapper on the scaled desktop frame.
 */
function LearnMore({
  to,
  label,
  name,
  fill = false,
  className = "",
}: {
  to: string;
  label: string;
  name: string;
  fill?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      aria-label={`${label}: ${name}`}
      className={`group/btn inline-flex items-center justify-between rounded-[2.39em] bg-white pl-[1.667em] pr-[1.036em] font-body leading-[1.65] text-black transition-[background-color,transform] duration-200 hover:bg-paper-2 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none ${className}`}
      style={
        fill
          ? { width: "100%", height: "100%", fontSize: p(22.2) }
          : { height: "3.108em", width: "9.775em" }
      }
    >
      <span className="whitespace-nowrap">{label}</span>
      {/* The dot swells and turns a quarter on hover, swinging the arrow to point right. */}
      <span className="relative h-[1.847em] w-[1.847em] shrink-0 transition-transform duration-300 group-hover/btn:rotate-45 group-hover/btn:scale-110 motion-reduce:transition-none">
        <img
          src={A.btnDot}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
        <img
          src={A.btnArrow}
          alt=""
          aria-hidden
          className="absolute left-1/2 top-1/2 w-[1.177em] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-[45.56deg]"
        />
      </span>
    </Link>
  );
}
