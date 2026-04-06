import type { ContentMap } from '@/lib/types';

export default function REHero({ content }: { content: ContentMap }) {
  const bgImage = content.re_hero_image;
  const style: React.CSSProperties = bgImage
    ? { backgroundImage: `url(${bgImage})` }
    : {};

  return (
    <section className="re-hero" style={style}>
      <nav className="re-nav">
        <div className="re-container re-nav__inner">
          <a href="/houseofh" className="re-nav__logo">
            House of H. <span>Real Estate</span>
          </a>
          <a href="/" className="re-nav__link">
            Back to Main Site
          </a>
        </div>
      </nav>
      <div className="re-hero__content re-container">
        <h1
          dangerouslySetInnerHTML={{
            __html: content.re_hero_headline || '',
          }}
        />
        <p>{content.re_hero_subtitle}</p>
        <a
          href={content.re_hero_cta_link || '#properties'}
          className="re-btn re-btn--primary"
        >
          {content.re_hero_cta_text || 'View Properties'}
        </a>
      </div>
    </section>
  );
}
