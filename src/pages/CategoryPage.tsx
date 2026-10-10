import { useEffect, type ReactNode } from 'react';

/**
 * Shell for a standalone category page (Services, Work, About, Pricing,
 * Contact). Clears the fixed nav and names the browser tab; the section inside
 * keeps its own background and padding exactly as it had on the long page.
 */
export default function CategoryPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = `${title} — Ealize`;
    return () => {
      document.title = 'Ealize';
    };
  }, [title]);

  return <div className="bg-paper pt-16">{children}</div>;
}
