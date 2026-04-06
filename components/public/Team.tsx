import type { TeamMember } from '@/lib/types';
import { PhoneIcon, WhatsAppIcon } from './icons';
import ScrollReveal from './ScrollReveal';
import type { ContentMap } from '@/lib/types';

export default function Team({ members, content }: { members: TeamMember[]; content: ContentMap }) {
  return (
    <section className="team" id="team">
      <ScrollReveal>
        <div className="section-header">
          <span className="eyebrow">{content.team_eyebrow}</span>
          <h2 dangerouslySetInnerHTML={{ __html: content.team_heading || '' }} />
          <p>{content.team_desc}</p>
        </div>
      </ScrollReveal>
      <div className="team__grid">
        {members.map((m, i) => (
          <ScrollReveal key={m.id} delay={0.05 + i * 0.1}>
            <div className="team-card">
              <div
                className="team-card__img"
                style={m.initials_bg && !m.image_url ? { background: m.initials_bg } : undefined}
              >
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} />
                ) : m.initials ? (
                  <div className="team-card__initials">{m.initials}</div>
                ) : null}
              </div>
              <div className="team-card__info">
                <div className="team-card__role">{m.role}</div>
                <h3>{m.name}</h3>
                {m.bio && <p>{m.bio}</p>}
                <div className="team-card__contacts">
                  {m.phone && (
                    <a href={`tel:${m.phone.replace(/\s/g, '')}`} className="team-card__contact">
                      <PhoneIcon /> {m.phone}
                    </a>
                  )}
                  {m.whatsapp && (
                    <a href={`https://wa.me/${m.whatsapp}`} target="_blank" rel="noopener noreferrer" className="team-card__contact">
                      <WhatsAppIcon /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
