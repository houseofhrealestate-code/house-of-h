'use client';
import { useCountUp } from '@/hooks/useCountUp';
import type { Stat } from '@/lib/types';

function StatItem({ stat, delay }: { stat: Stat; delay: number }) {
  const { ref, display } = useCountUp(stat.count, stat.suffix);
  return (
    <div className="reveal in" style={{ transitionDelay: `${delay}s` }}>
      <div className="stat__number" ref={ref}>{display}</div>
      <div className="stat__label">{stat.label}</div>
    </div>
  );
}

export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="stats">
      <div className="stats__inner">
        {stats.map((stat, i) => (
          <StatItem key={stat.id} stat={stat} delay={0.05 + i * 0.1} />
        ))}
      </div>
    </section>
  );
}
