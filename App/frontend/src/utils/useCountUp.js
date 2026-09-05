import { useEffect, useRef, useState } from 'react';

/**
 * Animated counter hook — counts from 0 to `target` over `duration` ms.
 * Replays every time the element scrolls into view!
 * @param {number} target - final number to count to
 * @param {number} duration - animation duration in ms (default 1400)
 * @returns {[React.RefObject, number]} - ref to attach, current display value
 */
export function useCountUp(target, duration = 1400) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const element = ref.current;
    if (!element) return;

    let animFrameId = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setValue(0);
          const startTime = performance.now();
          const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(easedProgress * target));

            if (progress < 1) {
              animFrameId = requestAnimationFrame(step);
            } else {
              setValue(target);
            }
          };
          animFrameId = requestAnimationFrame(step);
        } else {
          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
          }
          setValue(0); // Reset for replay on next scroll
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
      observer.disconnect();
    };
  }, [target, duration]);

  return [ref, value];
}
