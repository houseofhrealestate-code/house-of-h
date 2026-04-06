import type { ContentMap } from '@/lib/types';

export default function REStats({ content }: { content: ContentMap }) {
  const stats = [
    {
      number: content.re_stats_1_number,
      suffix: content.re_stats_1_suffix,
      label: content.re_stats_1_label,
    },
    {
      number: content.re_stats_2_number,
      suffix: content.re_stats_2_suffix,
      label: content.re_stats_2_label,
    },
    {
      number: content.re_stats_3_number,
      suffix: content.re_stats_3_suffix,
      label: content.re_stats_3_label,
    },
  ];

  return (
    <section className="re-stats">
      <div className="re-container re-stats__grid">
        {stats.map((stat, i) => (
          <div className="re-stats__item" key={i}>
            <span className="re-stats__number">
              {stat.number}
              {stat.suffix && (
                <span className="re-stats__suffix">{stat.suffix}</span>
              )}
            </span>
            <span className="re-stats__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
