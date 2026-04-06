'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import { DEFAULT_CONTENT } from '@/lib/constants';
import type { Stat } from '@/lib/types';

const SECTIONS = [
  { title: 'Hero Section', fields: [
    { key: 'hero_eyebrow', label: 'Eyebrow' },
    { key: 'hero_headline', label: 'Headline', html: true },
    { key: 'hero_sub', label: 'Subtitle', textarea: true },
    { key: 'hero_btn1_text', label: 'Button 1 Text' },
    { key: 'hero_btn1_link', label: 'Button 1 Link' },
    { key: 'hero_btn2_text', label: 'Button 2 Text' },
    { key: 'hero_btn2_link', label: 'Button 2 Link' },
    { key: 'hero_img_tag', label: 'Image Caption' },
  ]},
  { title: 'Ventures Header', fields: [
    { key: 'ventures_eyebrow', label: 'Eyebrow' },
    { key: 'ventures_heading', label: 'Heading', html: true },
    { key: 'ventures_desc', label: 'Description', textarea: true },
  ]},
  { title: 'Philosophy', fields: [
    { key: 'philosophy_eyebrow', label: 'Eyebrow' },
    { key: 'philosophy_quote', label: 'Quote', html: true, textarea: true },
    { key: 'philosophy_attr', label: 'Attribution' },
  ]},
  { title: 'About & Vision', fields: [
    { key: 'about_eyebrow', label: 'Eyebrow' },
    { key: 'about_headline', label: 'Headline' },
    { key: 'about_p1', label: 'Paragraph 1', textarea: true },
    { key: 'about_p2', label: 'Paragraph 2', textarea: true },
    { key: 'vision_text', label: 'Vision Text', textarea: true },
  ]},
  { title: 'Team Header', fields: [
    { key: 'team_eyebrow', label: 'Eyebrow' },
    { key: 'team_heading', label: 'Heading', html: true },
    { key: 'team_desc', label: 'Description', textarea: true },
  ]},
  { title: 'CTA Band', fields: [
    { key: 'cta_heading', label: 'Heading' },
    { key: 'cta_desc', label: 'Description', textarea: true },
  ]},
  { title: 'Contact Section', fields: [
    { key: 'contact_eyebrow', label: 'Eyebrow' },
    { key: 'contact_heading', label: 'Heading', html: true },
    { key: 'contact_form_title', label: 'Form Title' },
    { key: 'contact_form_sub', label: 'Form Subtitle' },
    { key: 'contact_privacy', label: 'Privacy Text' },
  ]},
  { title: 'Footer', fields: [
    { key: 'footer_brand', label: 'Brand Name', html: true },
    { key: 'footer_tagline', label: 'Tagline', textarea: true },
    { key: 'footer_copyright', label: 'Copyright' },
  ]},
];

export default function ContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<Stat[]>([]);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const { flash } = useToast();

  useEffect(() => { loadContent(); loadStats(); }, []);

  async function loadContent() {
    const supabase = createClient();
    const { data } = await supabase.from('site_content').select('*');
    const map: Record<string, string> = {};
    (data || []).forEach((row: { id: string; value: string }) => { map[row.id] = row.value; });
    setValues(map);
  }

  async function loadStats() {
    const supabase = createClient();
    const { data } = await supabase.from('stats').select('*').order('display_order');
    setStats(data || []);
  }

  function toggleSection(i: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  async function saveContent() {
    const supabase = createClient();
    const upserts = Object.entries(values).map(([id, value]) => ({ id, value, updated_at: new Date().toISOString() }));
    await supabase.from('site_content').upsert(upserts);
    await fetch('/api/revalidate', { method: 'POST' });
    flash('Content saved');
  }

  async function resetContent() {
    if (!confirm('Reset all content to defaults?')) return;
    setValues({ ...DEFAULT_CONTENT });
    const supabase = createClient();
    const upserts = Object.entries(DEFAULT_CONTENT).map(([id, value]) => ({ id, value, updated_at: new Date().toISOString() }));
    await supabase.from('site_content').upsert(upserts);
    await fetch('/api/revalidate', { method: 'POST' });
    flash('Content reset to defaults');
  }

  async function saveStats() {
    const supabase = createClient();
    await supabase.from('stats').delete().neq('id', '');
    const inserts = stats.map((s, i) => ({ count: s.count, suffix: s.suffix, label: s.label, display_order: i + 1 }));
    await supabase.from('stats').insert(inserts);
    await loadStats();
    await fetch('/api/revalidate', { method: 'POST' });
    flash('Stats saved');
  }

  return (
    <>
      <div className="main-header">
        <h1>Content</h1>
        <p>Edit all text content on the public website</p>
      </div>

      {SECTIONS.map((section, si) => (
        <div key={si} className={`editor-section ${openSections.has(si) ? 'open' : ''}`}>
          <div className="editor-section__header" onClick={() => toggleSection(si)}>
            <h3>{section.title}</h3>
            <svg className="editor-section__chevron" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div className="editor-section__body">
            {section.fields.map((f) => (
              <div key={f.key} className="editor-field">
                <label>{f.label}</label>
                {f.textarea ? (
                  <textarea value={values[f.key] || ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                ) : (
                  <input value={values[f.key] || ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                )}
                {f.html && <div className="html-hint">Supports &lt;em&gt;, &lt;br&gt;, &lt;span&gt; tags</div>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={`editor-section ${openSections.has(99) ? 'open' : ''}`}>
        <div className="editor-section__header" onClick={() => toggleSection(99)}>
          <h3>Stats Bar</h3>
          <svg className="editor-section__chevron" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div className="editor-section__body">
          <p className="text-dim" style={{ marginBottom: '1rem' }}>Edit the numbers shown in the stats bar</p>
          {stats.map((s, i) => (
            <div key={i} className="form-row" style={{ marginBottom: '.8rem', alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Number</label>
                <input type="number" value={s.count} onChange={(e) => { const ns = [...stats]; ns[i] = { ...ns[i], count: parseInt(e.target.value) || 0 }; setStats(ns); }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Suffix</label>
                <input value={s.suffix} onChange={(e) => { const ns = [...stats]; ns[i] = { ...ns[i], suffix: e.target.value }; setStats(ns); }} placeholder="e.g. +" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Label</label>
                <input value={s.label} onChange={(e) => { const ns = [...stats]; ns[i] = { ...ns[i], label: e.target.value }; setStats(ns); }} />
              </div>
              <button className="action-btn action-btn--danger" onClick={() => setStats(stats.filter((_, j) => j !== i))} style={{ marginBottom: '2px' }}>×</button>
            </div>
          ))}
          <button className="save-btn add-btn mt-1" onClick={() => setStats([...stats, { id: '', count: 0, suffix: '', label: '', display_order: stats.length + 1, created_at: '' }])}>
            + Add Stat
          </button>
          <div className="flex mt-1">
            <button className="save-btn" onClick={saveStats}>Save Stats</button>
          </div>
        </div>
      </div>

      <div className="flex mt-2">
        <button className="save-btn" onClick={saveContent}>Save All Content</button>
        <button className="save-btn secondary" onClick={resetContent}>Reset to Defaults</button>
      </div>
    </>
  );
}
