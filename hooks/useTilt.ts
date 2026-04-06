'use client';
import { useCallback } from 'react';

export function useTilt() {
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
  }, []);

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  }, []);

  return { onMouseMove, onMouseLeave };
}
