import type { ContentMap } from '@/lib/types';

export default function RECTA({ content }: { content: ContentMap }) {
  return (
    <section className="re-cta">
      <div className="re-container re-cta__inner">
        <h2 className="re-cta__heading">
          {content.re_cta_heading || 'Looking for the Right Property?'}
        </h2>
        <p className="re-cta__text">{content.re_cta_text}</p>
        <a
          href={content.re_cta_button_link || '/#contact'}
          className="re-btn re-btn--outline"
        >
          {content.re_cta_button_text || 'Get in Touch'}
        </a>
      </div>
    </section>
  );
}
