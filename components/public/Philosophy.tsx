import type { ContentMap } from '@/lib/types';
import ScrollReveal from './ScrollReveal';

export default function Philosophy({ content }: { content: ContentMap }) {
  return (
    <section className="philosophy" id="about">
      <div className="philosophy__deco" />
      <ScrollReveal>
        <span className="philosophy__eyebrow">{content.philosophy_eyebrow}</span>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <blockquote dangerouslySetInnerHTML={{ __html: content.philosophy_quote }} />
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="philosophy__line" />
      </ScrollReveal>
      <ScrollReveal delay={0.3}>
        <p className="philosophy__attr">{content.philosophy_attr}</p>
      </ScrollReveal>
    </section>
  );
}
