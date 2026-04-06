'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Props {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, direction = 'up', delay = 0, className = '' }: Props) {
  const ref = useScrollReveal<HTMLDivElement>();
  const cls = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal';

  return (
    <div
      ref={ref}
      className={`${cls} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
