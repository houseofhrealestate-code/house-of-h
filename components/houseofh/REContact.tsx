'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function REContact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('re_name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('re_phone') as HTMLInputElement).value,
      email: (form.elements.namedItem('re_email') as HTMLInputElement).value,
      interest: 'Real Estate',
      message: (form.elements.namedItem('re_msg') as HTMLTextAreaElement).value,
    };
    try {
      const supabase = createClient();
      await supabase.from('submissions').insert(data);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  return (
    <section className="re-contact" id="re-contact">
      <div className="re-container">
        <div className="re-contact__grid">
          <div className="re-contact__info">
            <span className="re-eyebrow">Get in Touch</span>
            <h2 className="re-contact__heading">
              Let&rsquo;s Find Your<br />Perfect Property.
            </h2>
            <p className="re-contact__desc">
              Whether you are looking for commercial spaces, residential investments, or land acquisitions &mdash; reach out and we&rsquo;ll get back to you within 24 hours.
            </p>
            <div className="re-contact__details">
              <div className="re-contact__detail">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <div>
                  <span>Ammaar Fouzan</span>
                  <a href="tel:+919945720417">+91 99457 20417</a>
                </div>
              </div>
              <div className="re-contact__detail">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <div>
                  <span>WhatsApp</span>
                  <a href="https://wa.me/919945720417" target="_blank" rel="noopener noreferrer">Message directly &rarr;</a>
                </div>
              </div>
            </div>
          </div>
          <div className="re-contact__form-wrap">
            <h3 className="re-contact__form-title">Send an Enquiry</h3>
            <p className="re-contact__form-sub">Share a few details and we&rsquo;ll personally follow up within 24 hours.</p>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="re-contact__row">
                  <div className="re-contact__field">
                    <label htmlFor="re_name">Full Name *</label>
                    <input type="text" id="re_name" name="re_name" placeholder="Your full name" required />
                  </div>
                  <div className="re-contact__field">
                    <label htmlFor="re_phone">Phone / WhatsApp *</label>
                    <input type="tel" id="re_phone" name="re_phone" placeholder="+91 XXXXX XXXXX" required />
                  </div>
                </div>
                <div className="re-contact__field">
                  <label htmlFor="re_email">Email Address</label>
                  <input type="email" id="re_email" name="re_email" placeholder="your@email.com" />
                </div>
                <div className="re-contact__field">
                  <label htmlFor="re_msg">Message <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: '0' }}>(optional)</span></label>
                  <textarea id="re_msg" name="re_msg" placeholder="Tell us what you're looking for — property type, location, budget..." rows={4} />
                </div>
                <button type="submit" className="re-contact__submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Enquiry'}
                </button>
                <p className="re-contact__privacy">Your details are kept strictly confidential. We respond within 24 hours.</p>
              </form>
            ) : (
              <div className="re-contact__success">
                <svg width="40" height="40" fill="none" stroke="#b8935a" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
                </svg>
                <h4>Enquiry Received</h4>
                <p>Thank you. We&rsquo;ll be in touch within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
