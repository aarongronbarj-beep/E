import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** Centered 1200px editorial container with consistent gutters. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-container px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

/** Uppercase tracked overline label. */
export function Eyebrow({
  children,
  className = '',
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2 ${
        dark ? 'text-white/55' : 'text-ink/45'
      } ${className}`}
    >
      <span className={`h-px w-6 ${dark ? 'bg-white/30' : 'bg-ink/25'}`} />
      {children}
    </span>
  );
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'solid' | 'outline' | 'ghost' | 'white';
  className?: string;
};

/** Primary action: square-ish Nordic button, blue solid by default. */
export function Button({
  children,
  href = '#',
  variant = 'solid',
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 rounded-[6px] px-5 py-3 text-sm font-medium font-body transition-colors duration-200';
  const variants: Record<string, string> = {
    solid: 'bg-blue text-white hover:bg-blue-600',
    outline: 'border border-line text-ink hover:border-ink/40',
    ghost: 'text-ink/70 hover:text-ink',
    white: 'bg-white text-ink hover:bg-paper-2',
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  // In-app routes go through the router so the page doesn't reload.
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}
