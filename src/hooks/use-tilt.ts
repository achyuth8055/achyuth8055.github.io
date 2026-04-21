import { useEffect, useRef } from 'react';

type TiltOptions = {
  max?: number;
  perspective?: number;
};

/**
 * Lightweight 3D tilt that throttles via RAF and pauses when offscreen.
 * Use sparingly — one or two elements per page.
 */
export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const { max = 8, perspective = 1400 } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let rafId = 0;
    let active = true;
    let pendingX = 0;
    let pendingY = 0;

    const apply = () => {
      rafId = 0;
      el.style.transform = `perspective(${perspective}px) rotateX(${pendingY}deg) rotateY(${pendingX}deg)`;
    };

    const onMove = (e: MouseEvent) => {
      if (!active) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      pendingX = (x - 0.5) * (max * 2);
      pendingY = -(y - 0.5) * (max * 2);
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      pendingX = 0;
      pendingY = 0;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const io = new IntersectionObserver(
      (entries) => {
        active = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.1 },
    );
    io.observe(el);

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [max, perspective]);

  return ref;
}
