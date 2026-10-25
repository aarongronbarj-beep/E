import { useEffect, useSyncExternalStore } from 'react';

/**
 * Lets a page override how the fixed nav paints over its first screen.
 *
 * The nav is transparent with ink text until you scroll past 8px. That is
 * right on a page that starts with white paper, and wrong on one that starts
 * with full-bleed artwork — measured over the Kokkoma reel, the ink wordmark
 * came to 1.07:1 and the links 1.2:1, which is invisible rather than merely
 * low contrast.
 *
 * Two overrides, because one colour does not cover both cases:
 *
 * - `'dark'` — artwork dark enough to carry white text. The nav inverts and
 *   stays transparent, so nothing is laid over the top of the hero. White over
 *   the Kokkoma reel is 5.28:1 at its worst frame and brightest nav pixel.
 * - `'solid'` — artwork that is light, or mixed light and dark, where neither
 *   ink nor white clears AA. Under the Kesäyrittäjät still, ink measured
 *   1.37–2.77:1 and white 1.0:1 across the same text boxes, so the bar keeps
 *   its paper background from the top instead of pretending to be transparent.
 *
 * A module-level store rather than context: the nav sits above the router in
 * the layout, so there is no shared provider to hang this off without
 * restructuring App for one value.
 */
export type NavTheme = 'dark' | 'solid';

let theme: NavTheme | null = null;
const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const set = (next: NavTheme | null) => {
  if (theme === next) return;
  theme = next;
  listeners.forEach((fn) => fn());
};

/** Call from a page whose first screen is not white paper. */
export function useNavTheme(next: NavTheme | null) {
  useEffect(() => {
    if (!next) return;
    set(next);
    return () => set(null);
  }, [next]);
}

/** Read by the nav. Null during SSR and on pages that do not override it. */
export function useNavThemeOverride() {
  return useSyncExternalStore(
    subscribe,
    () => theme,
    () => null,
  );
}
