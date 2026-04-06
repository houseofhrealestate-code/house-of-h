'use client';
import { useEffect, useState } from 'react';
import { ChevronUpIcon, WhatsAppIcon } from './icons';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="floating">
      <button
        className={`float-btn float-btn--top ${showTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to top"
      >
        <ChevronUpIcon />
      </button>
      <a
        href="https://wa.me/919945720417"
        className="float-btn float-btn--wa"
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp Ammaar"
      >
        <WhatsAppIcon size={22} />
      </a>
    </div>
  );
}
