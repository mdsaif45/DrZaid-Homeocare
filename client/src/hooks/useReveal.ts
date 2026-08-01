import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal via IntersectionObserver.
 *
 * Chosen over a motion library because this page only needs enter-once reveals
 * and hover states, which CSS transitions handle natively — the landing bundle
 * stays small, and animation runs on the compositor rather than in JS.
 *
 * Reveals once and then unobserves: re-animating content the reader has already
 * seen is a distraction on a page someone is scanning for a phone number.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {},
) {
  // `?? default` rather than a destructuring default: callers forward an
  // optional prop, so the key is often present-but-undefined, which would
  // override a destructuring default and pass undefined to the observer.
  const threshold = options.threshold ?? 0.15;
  const rootMargin = options.rootMargin ?? '0px 0px -80px 0px';

  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);
  // When true, the element is shown with no transition at all. A transition
  // started in a background tab never advances, leaving content frozen at
  // opacity 0 — so the fallback path skips animation rather than starting one
  // the browser will not finish.
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    if (revealed) return;
    const el = ref.current;
    if (!el) return;

    // Content must never depend on the observer firing. IntersectionObserver
    // does not run in background tabs, and a tab can be restored mid-page or
    // opened via a #anchor, so a failsafe reveals anything still hidden.
    const failsafe = setTimeout(() => {
      setInstant(true);
      setRevealed(true);
    }, 2500);

    if (typeof IntersectionObserver === 'undefined') {
      setInstant(true);
      setRevealed(true);
      return () => clearTimeout(failsafe);
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => {
      clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [threshold, rootMargin, revealed]);

  return { ref, revealed, instant };
}
