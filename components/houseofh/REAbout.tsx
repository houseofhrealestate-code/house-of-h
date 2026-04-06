import type { ContentMap } from '@/lib/types';

export default function REAbout({ content }: { content: ContentMap }) {
  return (
    <section className="re-about">
      <div className="re-container re-about__grid">
        <div className="re-about__left">
          <span className="re-eyebrow">
            {content.re_about_eyebrow || 'About Our Real Estate Division'}
          </span>
          <h2
            className="re-about__heading"
            dangerouslySetInnerHTML={{
              __html:
                content.re_about_heading ||
                'Deal-First Mindset,<br>Premium Outcomes.',
            }}
          />
        </div>
        <div className="re-about__right">
          <p className="re-about__text">{content.re_about_text}</p>
        </div>
      </div>
    </section>
  );
}
