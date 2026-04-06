import type { ContentMap } from '@/lib/types';
import { WhatsAppIcon } from './icons';
import ScrollReveal from './ScrollReveal';

export default function CtaBand({ content }: { content: ContentMap }) {
  return (
    <ScrollReveal>
      <section className="cta-band">
        <h2>{content.cta_heading}</h2>
        <p>{content.cta_desc}</p>
        <div className="cta-band__actions">
          <a href="https://wa.me/919945720417" className="btn btn--primary" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={16} /> WhatsApp Ammaar
          </a>
          <a href="#contact" className="btn btn--ghost">Send an Enquiry</a>
        </div>
      </section>
    </ScrollReveal>
  );
}
