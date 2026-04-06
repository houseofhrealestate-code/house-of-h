'use client';
import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, suffix: string = '') {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState('0' + suffix);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            obs.unobserve(e.target);
            const dur = 1800;
            let startTime: number | null = null;
            function step(ts: number) {
              if (!startTime) startTime = ts;
              const p = Math.min((ts - startTime) / dur, 1);
              const ease = 1 - Math.pow(1 - p, 4);
              setDisplay(Math.round(ease * target) + suffix);
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix]);

  return { ref, display };
}
