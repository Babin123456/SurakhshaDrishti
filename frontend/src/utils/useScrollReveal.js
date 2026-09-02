import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook: triggers a CSS class whenever an element enters the viewport,
 * and resets it when scrolling away, ensuring animations replay EVERY SINGLE TIME on scroll.
 * @param {Object} options - IntersectionObserver options
 * @param {boolean} [options.once=false] - Whether to only animate once (default false = every time)
 * @returns {[React.RefObject, boolean]} - ref to attach, and revealed state
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const once = options.once ?? false;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          // Reset so it animates again next time you scroll to it!
          setIsRevealed(false);
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin, once]);

  return [ref, isRevealed];
}
