import type { ContentMap } from '@/lib/types';
import ScrollReveal from './ScrollReveal';

const PILLARS = [
  { num: '01', title: 'Design-Led Thinking', desc: 'Every product, space, or platform starts with the user experience and the story behind it.' },
  { num: '02', title: 'Execution First', desc: 'Ideas are only as valuable as their execution. We prioritize speed, clarity, and consistency.' },
  { num: '03', title: 'Premium Positioning', desc: 'We operate in segments where quality and perception define value, not price.' },
  { num: '04', title: 'Future-Focused', desc: 'From real estate to AI, we invest in sectors shaping the next decade of India.' },
];

export default function About({ content }: { content: ContentMap }) {
  return (
    <section className="about">
      <div className="about__inner">
        <ScrollReveal direction="left">
          <span className="eyebrow">{content.about_eyebrow}</span>
          <h2>{content.about_headline}</h2>
          <p>{content.about_p1}</p>
          <p>{content.about_p2}</p>
          <div className="pillars">
            {PILLARS.map((p) => (
              <div key={p.num} className="pillar">
                <span className="pillar__num">{p.num}</span>
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <div className="about__vision">
            <h3>Our Vision</h3>
            <p>{content.vision_text}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
