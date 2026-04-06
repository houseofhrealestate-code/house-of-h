'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PhoneIcon, WhatsAppIcon } from './icons';
import ScrollReveal from './ScrollReveal';
import type { ContentMap, TeamMember, Venture } from '@/lib/types';

interface Props {
  content: ContentMap;
  teamMembers: TeamMember[];
  ventures: Venture[];
}

export default function Contact({ content, teamMembers, ventures }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('f_name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('f_phone') as HTMLInputElement).value,
      email: (form.elements.namedItem('f_email') as HTMLInputElement).value,
      interest: (form.elements.namedItem('f_interest') as HTMLSelectElement).value,
      message: (form.elements.namedItem('f_msg') as HTMLTextAreaElement).value,
    };
    try {
      const supabase = createClient();
      await supabase.from('submissions').insert(data);
      setSubmitted(true);
    } catch {
      // Still show success to not block the user
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <ScrollReveal direction="left">
          <div className="contact__left">
            <span className="eyebrow">{content.contact_eyebrow}</span>
            <h2 dangerouslySetInnerHTML={{ __html: content.contact_heading }} />
            <div className="contact__divider" />
            <p>Whether you are exploring a partnership, a property, or simply want to know more about our ventures — reach out. We respond within 24 hours.</p>
            <div className="contact__details">
              {teamMembers.slice(0, 3).map((m) => (
                m.phone && (
                  <div key={m.id} className="contact__detail">
                    <div className="contact__detail-icon">
                      <PhoneIcon size={18} />
                    </div>
                    <div>
                      <span className="contact__detail-label">{m.name}{m.role ? ` (${m.role})` : ''}</span>
                      <a href={`tel:${m.phone.replace(/\s/g, '')}`}>{m.phone}</a>
                    </div>
                  </div>
                )
              ))}
              <div className="contact__detail">
                <div className="contact__detail-icon">
                  <WhatsAppIcon size={18} />
                </div>
                <div>
                  <span className="contact__detail-label">WhatsApp</span>
                  <a href="https://wa.me/919945720417" target="_blank" rel="noopener noreferrer">Message Ammaar directly &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <div className="contact__form-wrap">
            <h3>{content.contact_form_title}</h3>
            <p className="sub">{content.contact_form_sub}</p>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="f_name">Full Name *</label>
                    <input type="text" id="f_name" name="f_name" placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="f_phone">Phone / WhatsApp *</label>
                    <input type="tel" id="f_phone" name="f_phone" placeholder="+91 XXXXX XXXXX" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="f_email">Email Address</label>
                  <input type="email" id="f_email" name="f_email" placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="f_interest">Area of Interest *</label>
                  <select id="f_interest" name="f_interest" required defaultValue="">
                    <option value="" disabled>Select an area</option>
                    {ventures.map((v) => (
                      <option key={v.id}>{v.title} — {v.badge}</option>
                    ))}
                    <option>Partnership / Collaboration</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="f_msg">Message <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <textarea id="f_msg" name="f_msg" placeholder="Tell us more about what you have in mind..." />
                </div>
                <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', padding: '1.1rem' }} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Enquiry'}
                </button>
                <p className="form-privacy">{content.contact_privacy}</p>
              </form>
            ) : (
              <div className="form-success show">
                <h4>Enquiry Received</h4>
                <p>Thank you. Ammaar will personally be in touch within 24 hours.</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
