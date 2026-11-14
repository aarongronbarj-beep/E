import {
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import GlitchIn from "./GlitchIn";
import { useCopy } from "../lib/i18n";
import { IMG } from "../lib/assets";
import { EASE, useStatic } from "../lib/motion";

const A = IMG.servicesMenu;
/** Signal green from the Figma frame — accent for this section only. */
const LIME = "#acff12";
/** Where each card leads. Graphic design has no page of its own yet, so it opens the services overview. */
const HREF = {
  all: "/services",
  web: "/services/websites",
  seo: "/services/seo",
  data: "/services/data-analytics",
  design: "/services",
};

const COPY = {
  fi: {
    heading: "Palvelut",
    all: "Kaikki palvelut",
    more: "Lue lisää",
    web: {
      title: "Nettisivujen kehitys",
      body: "Teemme nettisivut suunnitelmasta toteutukseen huolella",
    },
    seo: "Yrityksesi ykköseksi Googlessa",
    data: "Data analytiikka",
    design: "Graafinen suunnittelu",
  },
  en: {
    heading: "Services",
    all: "All services",
    more: "Read more",
    web: {
      title: "Web development",
      body: "We build websites with care, from the plan to the finished site",
    },
    seo: "Put your business first on Google",
    data: "Data analytics",
    design: "Graphic design",
  },
};

/**
 * Figma "Frame 10" (Ealize – Etusivu, node 94:5689): the home page services
 * menu. A tall web development card on the left; on the right a wide SEO card
 * over a data analytics card and a graphic design card.
 *
 * From md up the frame is drawn at its 1440×856 design size and scaled with
 * the section: `--p` is one design pixel, so every position below is the
 * Figma coordinate times `--p`. Below md the cards stack in normal flow, since
 * a scaled 1440 frame would shrink the copy past legibility.
 *
 * Motion, all of it skipped under reduced motion or `?static`:
 *   - headings tear in through the site's glitch;
 *   - rules draw from the left, the heading's lime underline with them;
 *   - each card wipes open, its artwork settles out of a zoom, then keeps a
 *     slow drift and a scroll parallax; slanted panels slide in, the laptop,
 *     phone and dashboard spring up and float, the button pops;
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
/** Clip to a panel's slanted right edge, from the Figma mask paths. */
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
/** A device springing up into the card from below, with a slight turn. */
const springUp = (delay: number, rotate = -8): Variants => ({
  hidden: { opacity: 0, y: "70%", rotate },
  show: {
    opacity: 1,
    y: "0%",
    rotate: 0,
    transition: { delay, type: "spring", stiffness: 120, damping: 16 },
  },
});
/** Card artwork: settles out of a zoom, and leans in while the card is hovered. */
const settle: Variants = {
  hidden: { scale: 1.25 },
  show: { scale: 1, transition: { duration: 1.8, ease: EASE } },
  hover: { scale: 1.07, transition: { duration: 0.8, ease: EASE } },
};
const fromLeft = { transformOrigin: "left center" } as const;

/** Props that start a variant tree when it scrolls into view, or show it at once. */
const play = (isStatic: boolean, amount = 0.3) =>
  isStatic
    ? { initial: false as const, animate: "show" }
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, amount },
      };

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

/**
 * Card artwork: positioned in design px, settles in, drifts, and rides the
 * parallax. `turn` is the Figma layer's flip: vertical, or a half turn.
 */
function Art({
  src,
  frame,
  y,
  turn,
}: {
  src: string;
  frame: CSSProperties;
  y?: MotionValue<number>;
  turn?: "flipY" | "half";
}) {
  const isStatic = useStatic();
  const turnClass =
    turn === "flipY" ? "-scale-y-100" : turn === "half" ? "rotate-180" : "";
  return (
    <motion.div
      aria-hidden
      variants={settle}
      style={{ ...frame, ...(y && !isStatic && { y }) }}
    >
      <div className={`h-full w-full ${turnClass}`}>
        <motion.img
          src={src}
          alt=""
          className="h-full w-full max-w-none object-cover"
          animate={
            isStatic
              ? undefined
              : { x: ["0%", "-1.5%", "0%"], y: ["0%", "1%", "0%"] }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

/** A device or screenshot that floats gently once it has sprung in. */
function Float({
  src,
  className = "",
  delay = 1.4,
  distance = "-1.6%",
}: {
  src: string;
  className?: string;
  delay?: number;
  distance?: string;
}) {
  const isStatic = useStatic();
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden
      className={`pointer-events-none max-w-none ${className}`}
      animate={isStatic ? undefined : { y: ["0%", distance, "0%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export default function ServicesMenu() {
  const t = useCopy(COPY);
  return (
    <section aria-labelledby="services-menu-heading" className="bg-white">
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
  const dataY = useParallax(frame, 20);
  const designY = useParallax(frame, 35);
  const webTilt = useTilt(isStatic);
  const seoTilt = useTilt(isStatic, 3);
  const dataTilt = useTilt(isStatic, 5);
  const designTilt = useTilt(isStatic, 4);
  return (
    <div className="hidden md:block">
      <div
        ref={frame}
        // Height by aspect ratio: cqw on the container itself would resolve
        // against the viewport, not this box.
        className="relative mx-auto aspect-[1440/856] max-w-[1440px] overflow-hidden [container-type:inline-size] [--p:calc(100cqw/1440)]"
      >
        <motion.div {...play(isStatic, 0.6)} style={box(117, 51, 260, 80)}>
          <h2
            id="services-menu-heading"
            className="whitespace-nowrap font-heading font-bold text-ink"
            style={{ fontSize: p(51.176), lineHeight: p(80) }}
          >
            <GlitchIn>{t.heading}</GlitchIn>
          </h2>
          <motion.div
            aria-hidden
            variants={drawX(0.4)}
            style={{ ...box(0, 67, 239, 4), ...fromLeft, background: LIME }}
          />
        </motion.div>
        <motion.div
          {...play(isStatic, 0.6)}
          className="flex items-center justify-end"
          style={box(1070.36, 51, 300, 80)}
        >
          <motion.div variants={rise(0.5, 12)}>
            <AllServices label={t.all} style={{ fontSize: p(20) }} />
          </motion.div>
        </motion.div>

        {/* Web development — blue field under a green, slanted header panel
            edged in white, with a laptop lifted into the corner. */}
        <motion.div
          {...play(isStatic)}
          {...webTilt}
          style={{ ...box(70, 155, 459.743, 659), ...webTilt.style }}
        >
          {/* The wipe sits one level in: an element clipped shut by its own
              clip-path never reports as in view, so it would never open. */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            variants={wipe(FROM_BOTTOM)}
          >
            <Art
              src={A.webBg}
              frame={box(-648.677, -122.639, 1575.433, 881.492)}
              y={webY}
            />
            <motion.img
              src={A.webHead}
              alt=""
              aria-hidden
              variants={slideIn(0.35)}
              style={box(0, 0, 438.987, 227.277)}
            />
            <motion.div
              className="overflow-hidden"
              variants={slideIn(0.45)}
              style={{
                ...box(0, 0, 428.144, 215.861),
                clipPath: slant(428.144, 357.071, 215.861),
              }}
            >
              <Art
                src={A.green}
                frame={box(-68.989, -15.063, 561.924, 314.41)}
                turn="flipY"
              />
            </motion.div>
            <h3
              className="font-heading font-bold text-white"
              style={{
                ...box(16.6, 101.7, 377.76),
                fontSize: p(53.111),
                lineHeight: p(51.89),
              }}
            >
              <GlitchIn delay={0.5}>{t.web.title}</GlitchIn>
            </h3>
            <motion.div
              aria-hidden
              className="bg-white"
              variants={drawX(0.7)}
              style={{ ...box(14.53, 267.75, 224.16, 1.04), ...fromLeft }}
            />
            <motion.p
              className="font-body text-white"
              variants={rise(0.8)}
              style={{
                ...box(14.53, 276.05, 363.23),
                fontSize: p(24.907),
                lineHeight: p(31.134),
              }}
            >
              {t.web.body}
            </motion.p>
            <motion.div
              variants={pop(1)}
              style={box(14.53, 404, 200)}
            >
              <LearnMore
                to={HREF.web}
                label={t.more}
                name={t.web.title}
                desktop
              />
            </motion.div>
            <motion.div
              variants={springUp(0.7, 10)}
              style={box(203.41, 323.79, 252.554, 335.208)}
            >
              <Float src={A.laptop} className="h-full w-full object-cover" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* SEO — wide blue card, the phone search result rising into its
            right side. */}
        <motion.div
          {...play(isStatic)}
          {...seoTilt}
          style={{ ...box(544.27, 155, 826.085, 313.414), ...seoTilt.style }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden"
            variants={wipe(FROM_LEFT)}
          >
            <Art
              src={A.seoBg}
              frame={box(-59.23, -50.51, 1243.33, 695.66)}
              y={seoY}
            />
            <motion.div
              aria-hidden
              className="bg-[#d9d9d9]"
              variants={drawX(0.55)}
              style={{ ...box(13.49, 181.61, 422.38, 5.19), ...fromLeft }}
            />
            <h3
              className="font-heading font-bold text-white"
              style={{
                ...box(12.46, 39.44, 527),
                fontSize: p(51.89),
                lineHeight: "normal",
              }}
            >
              <GlitchIn delay={0.3}>{t.seo}</GlitchIn>
            </h3>
            <motion.div
              variants={pop(0.95)}
              style={box(13.49, 222, 200)}
            >
              <LearnMore to={HREF.seo} label={t.more} name={t.seo} desktop />
            </motion.div>
            <div
              className="overflow-hidden"
              style={box(539.66, 39.44, 261.524, 273.978)}
            >
              <motion.div className="absolute inset-0" variants={springUp(0.55)}>
                <Float
                  src={A.phone}
                  className="absolute left-0 top-0 h-[126.57%] w-[100.03%]"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Data analytics — dark square, the dashboard sliding up from its
            lower edge. */}
        <motion.div
          {...play(isStatic)}
          {...dataTilt}
          style={{ ...box(544.27, 487.09, 326.906, 326.906), ...dataTilt.style }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden"
            variants={wipe(FROM_BOTTOM, 0.1)}
          >
            <Art src={A.dataBg} frame={box(0, 0, 326.906, 326.906)} y={dataY} />
            <h3
              className="whitespace-nowrap font-heading font-bold text-white"
              style={{
                ...box(12.46, 23.86, 314),
                fontSize: p(39.843),
                lineHeight: p(49.804),
              }}
            >
              <GlitchIn delay={0.4}>{t.data}</GlitchIn>
            </h3>
            <motion.div
              variants={pop(0.9)}
              style={box(12.46, 98, 200)}
            >
              <LearnMore to={HREF.data} label={t.more} name={t.data} desktop />
            </motion.div>
            <motion.div
              variants={springUp(0.65, 0)}
              style={box(0, 173.31, 261.635, 146.391)}
            >
              <Float
                src={A.dashboard}
                className="h-full w-full object-cover"
                delay={1.6}
                distance="-3%"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Graphic design — blue poster under a green, slanted panel edged
            in white, both turned to slope the other way. */}
        <motion.div
          {...play(isStatic)}
          {...designTilt}
          style={{ ...box(888.81, 487.09, 481.547, 323.86), ...designTilt.style }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden"
            variants={wipe(FROM_LEFT, 0.2)}
          >
            <div
              className="overflow-hidden"
              style={box(0, 3.19, 481.547, 320.667)}
            >
              <Art
                src={A.designBg}
                frame={box(0, 0, 481.547, 639.15)}
                y={designY}
              />
            </div>
            {/* The half turn sits on the img: motion's own transform on the
                wrapper would otherwise overwrite it. */}
            <motion.div
              aria-hidden
              variants={slideIn(0.45)}
              style={box(1.05, 0, 403.702, 235.579)}
            >
              <img
                src={A.designHead}
                alt=""
                className="h-full w-full rotate-180"
              />
            </motion.div>
            <motion.div
              className="overflow-hidden"
              variants={slideIn(0.55)}
              style={{
                ...box(0.01, 0, 390.237, 225.116),
                clipPath: slant(390.237, 306.24, 225.116),
              }}
            >
              <Art
                src={A.green}
                frame={box(-85.977, -96.352, 624.619, 349.489)}
                turn="half"
              />
            </motion.div>
            <h3
              className="font-heading font-bold text-white"
              style={{
                ...box(21.8, 24.91, 409.93),
                fontSize: p(39.436),
                lineHeight: "normal",
              }}
            >
              <GlitchIn delay={0.6}>{t.design}</GlitchIn>
            </h3>
            <motion.div
              variants={pop(1.05)}
              style={box(21.8, 142, 200)}
            >
              <LearnMore to={HREF.design} label={t.more} name={t.design} desktop />
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
    <div className="px-4 pb-16 pt-12 md:hidden">
      <motion.h2
        {...play(isStatic, 0.6)}
        className="inline-block font-heading text-[2.25rem] font-bold leading-tight text-ink"
      >
        <GlitchIn>{t.heading}</GlitchIn>
        <motion.span
          aria-hidden
          variants={drawX(0.4)}
          className="mt-1 block h-1 w-[118%]"
          style={{ ...fromLeft, background: LIME }}
        />
      </motion.h2>
      <AllServices label={t.all} className="mt-4 flex w-fit text-base" />

      <div className="mt-8 flex flex-col gap-4">
        <MobileCard
          img={A.webBg}
          title={t.web.title}
          body={t.web.body}
          media={
            <img
              src={A.laptop}
              alt=""
              aria-hidden
              className="-mb-8 ml-auto -mt-16 block w-[48%] max-w-[220px]"
            />
          }
          action={
            <LearnMore
              to={HREF.web}
              label={t.more}
              name={t.web.title}
              className="mt-6 text-[15px]"
            />
          }
        />
        <MobileCard
          img={A.seoBg}
          title={t.seo}
          action={
            <LearnMore
              to={HREF.seo}
              label={t.more}
              name={t.seo}
              className="mt-6 text-[15px]"
            />
          }
          media={
            <div className="-mb-8 ml-auto mt-6 h-48 w-[55%] overflow-hidden">
              <img
                src={A.phone}
                alt=""
                aria-hidden
                className="block w-full"
              />
            </div>
          }
        />
        <MobileCard
          img={A.dataBg}
          title={t.data}
          action={
            <LearnMore
              to={HREF.data}
              label={t.more}
              name={t.data}
              className="mt-6 text-[15px]"
            />
          }
          media={
            <img
              src={A.dashboard}
              alt=""
              aria-hidden
              className="-mb-8 -ml-5 mt-8 block w-[85%]"
            />
          }
        />
        <MobileCard
          img={A.designBg}
          title={t.design}
          action={
            <LearnMore
              to={HREF.design}
              label={t.more}
              name={t.design}
              className="mt-6 text-[15px]"
            />
          }
        />
      </div>
    </div>
  );
}

function MobileCard({
  img,
  title,
  body,
  media,
  action,
}: {
  img: string;
  title: ReactNode;
  body?: string;
  media?: ReactNode;
  action?: ReactNode;
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
        <div className="relative">
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
          {action && <motion.div variants={pop(0.75)}>{action}</motion.div>}
          {media && <motion.div variants={springUp(0.6, 0)}>{media}</motion.div>}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Text link to the services overview; the arrow nudges right on hover. */
function AllServices({
  label,
  className = "",
  style,
}: {
  label: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Link
      to={HREF.all}
      className={`group/all items-center gap-2 font-body font-medium text-ink underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-[#acff12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue motion-reduce:transition-none ${className || "inline-flex"}`}
      style={style}
    >
      {label}
      <ArrowRight
        aria-hidden
        className="h-[1em] w-[1em] transition-transform duration-200 group-hover/all:translate-x-1 motion-reduce:transition-none"
      />
    </Link>
  );
}

/**
 * "Read more" link: a slim ghost pill — hairline white outline, white label and
 * a small lime dot carrying the arrow. Pared down from Figma "Component 8" so
 * it sits under the headings instead of competing with them. Sized in em, so
 * one font size scales the whole button; `desktop` ties that size to the
 * scaled design frame. The visible label is generic, so the accessible name
 * says which service it opens. On hover it fills white and the dot turns the
 * arrow to point right.
 */
function LearnMore({
  to,
  label,
  name,
  desktop = false,
  className = "",
}: {
  to: string;
  label: string;
  name: string;
  desktop?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      aria-label={`${label}: ${name}`}
      className={`group/btn inline-flex h-[2.5em] items-center gap-[0.7em] rounded-full border border-white/60 bg-white/5 pl-[1.1em] pr-[0.35em] font-body font-medium leading-none text-white backdrop-blur-sm transition-[background-color,border-color,color,transform] duration-200 hover:border-white hover:bg-white hover:text-ink active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none ${className}`}
      style={desktop ? { fontSize: p(16) } : undefined}
    >
      <span className="whitespace-nowrap">{label}</span>
      <span className="relative h-[1.8em] w-[1.8em] shrink-0 transition-transform duration-300 group-hover/btn:rotate-45 motion-reduce:transition-none">
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
          className="absolute left-1/2 top-1/2 w-[0.95em] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-[45.56deg]"
        />
      </span>
    </Link>
  );
}
