import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import GlitchLines from "./GlitchText";
import { useStatic } from "../lib/motion";

/**
 * Glitch-in heading line, held invisible until it is on screen, since
 * GlitchLines fires on mount. Plain text under reduced motion or `?static`.
 */
export default function GlitchIn({
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
