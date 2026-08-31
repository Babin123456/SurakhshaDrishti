import { useEffect, useRef, useState } from 'react';

/**
 * Animated counter hook — counts from 0 to `target` over `duration` ms.
 * Triggered when the element attached to the returned ref enters the viewport.
 * @param {number} target - final number to count to
 * @param {number} duration - animation duration in ms (default 1500)
 * @returns {[React.RefObject, number]} - ref to attach, current display value
 */
export function useCountUp(target, duration = 1500) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          observer.unobserve(element);

          const startTime = performance.now();
          const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(easedProgress * target));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setValue(target);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [target, duration]);

  return [ref, value];
}
