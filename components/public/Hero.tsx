import type { ContentMap } from '@/lib/types';

interface Props {
  content: ContentMap;
}

export default function Hero({ content }: Props) {
  return (
    <section className="hero" id="home">
      <div className="hero__left">
        <div className="hero__eyebrow">{content.hero_eyebrow}</div>
        <h1 dangerouslySetInnerHTML={{ __html: content.hero_headline }} />
        <p className="hero__sub">{content.hero_sub}</p>
        <div className="hero__actions">
          <a href={content.hero_btn1_link} className="btn btn--primary">{content.hero_btn1_text}</a>
          <a href={content.hero_btn2_link} className="btn btn--outline">{content.hero_btn2_text}</a>
        </div>
        <div className="hero__scroll" style={{ marginTop: '3rem' }}>
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </div>
      <div className="hero__right">
        <div className="hero__img-wrap">
          <div className="hero__img-frame">
            <img src="/images/hero.jpg" alt="Ammaar Fouzan — Founder, House of H." />
          </div>
          <div className="hero__img-deco" />
          <div className="hero__img-tag">{content.hero_img_tag}</div>
        </div>
      </div>
    </section>
  );
}
