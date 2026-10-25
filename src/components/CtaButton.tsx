import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Primary call to action: a white face inside a thin cobalt rim. The rim's
 * gradient (`.cta-rim` in index.css) circles the button continuously.
 *
 * On hover or focus the rim thickens inward and the label settles back
 * slightly. The rim grows by pulling the white face in, so the button's outer
 * box and hit area never change — a control that moves under the cursor is a
 * control you miss. Reduced motion keeps the state change but stops the
 * rim and drops the transition.
 */
export default function CtaButton({
  href,
  label,
  className = '',
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      to={href}
      className={`group relative isolate inline-flex items-center gap-3 rounded-[22px] px-9 py-5 font-body text-base font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue ${className}`}
    >
      <span
        aria-hidden
        className="cta-rim absolute inset-0 -z-10 rounded-[inherit] opacity-60 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="absolute inset-px -z-10 rounded-[21px] bg-white transition-[inset,border-radius,box-shadow] duration-300 ease-out group-hover:inset-[7px] group-hover:rounded-[15px] group-hover:shadow-[0_0_0_1px_rgba(10,14,26,0.06),0_1px_3px_rgba(10,14,26,0.12)] group-focus-visible:inset-[7px] group-focus-visible:rounded-[15px] motion-reduce:transition-none"
      />
      <span className="relative inline-flex items-center gap-3 transition-transform duration-300 ease-out group-hover:scale-[0.94] group-focus-visible:scale-[0.94] motion-reduce:transition-none">
        <span className="whitespace-nowrap">{label}</span>
        <ArrowRight aria-hidden className="h-4 w-4" />
      </span>
    </Link>
  );
}
