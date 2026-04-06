'use client';
import { useEffect, useRef, useState } from 'react';
import { useTilt } from '@/hooks/useTilt';
import { ArrowIcon } from './icons';
import type { Venture, ContentMap } from '@/lib/types';
import ScrollReveal from './ScrollReveal';

function VentureCard({ venture, index }: { venture: Venture; index: number }) {
  const { onMouseMove, onMouseLeave } = useTilt();
  const idx = String(index + 1).padStart(2, '0');

  const patternStyle: React.CSSProperties = {};
  if (venture.pattern_style) {
    patternStyle.backgroundImage = venture.pattern_style;
    if (venture.pattern_size) patternStyle.backgroundSize = venture.pattern_size;
  }

  return (
    <div className="v-card" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="v-card__bg" style={{ background: venture.bg_gradient }} />
      <div className="v-card__pattern" style={patternStyle} />
      <div className="v-card__glow" />
      <span className="v-card__badge">{venture.badge}</span>
      <div className="v-card__content">
        <div className="v-card__index">{idx}</div>
        <h3>{venture.title}</h3>
        <div className="v-card__subtitle">{venture.subtitle}</div>
        <p>{venture.description}</p>
        <a href={venture.button_link} className="v-card__link">
          {venture.button_text} <ArrowIcon />
        </a>
      </div>
    </div>
  );
}

export default function Ventures({ ventures, content }: { ventures: Venture[]; content: ContentMap }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isStatic, setIsStatic] = useState(false);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    function calc() {
      const cardW = window.innerWidth <= 768 ? 280 : window.innerWidth <= 1024 ? 320 : 380;
      const gap = 24;
      const totalW = ventures.length * cardW + (ventures.length - 1) * gap;
      const fits = totalW <= window.innerWidth;
      setIsStatic(fits);
      if (!fits) setDuration(Math.round(totalW / 40));
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [ventures.length]);

  const cards = isStatic ? ventures : [...ventures, ...ventures];

  return (
    <section className="verticals" id="verticals">
      <ScrollReveal>
        <div className="section-header">
          <span className="eyebrow">{content.ventures_eyebrow}</span>
          <h2 dangerouslySetInnerHTML={{ __html: content.ventures_heading }} />
          <p>{content.ventures_desc}</p>
        </div>
      </ScrollReveal>
      <div className="verticals__grid" ref={gridRef}>
        <div
          className={`ventures-track ${isStatic ? 'ventures-track--static' : ''}`}
          style={!isStatic ? { animationDuration: `${duration}s` } : undefined}
        >
          {cards.map((v, i) => (
            <VentureCard key={`${v.id}-${i}`} venture={v} index={i % ventures.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
