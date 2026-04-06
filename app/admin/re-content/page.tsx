'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import { DEFAULT_RE_CONTENT } from '@/lib/constants';
import { uploadImage } from '@/lib/storage';

const SECTIONS = [
  { title: 'Hero', fields: [
    { key: 're_hero_headline', label: 'Headline', html: true },
    { key: 're_hero_subtitle', label: 'Subtitle', textarea: true },
    { key: 're_hero_cta_text', label: 'CTA Text' },
    { key: 're_hero_cta_link', label: 'CTA Link' },
    { key: 're_hero_image', label: 'Hero Background Image', image: true },
  ]},
  { title: 'Properties Section', fields: [
    { key: 're_properties_eyebrow', label: 'Eyebrow' },
    { key: 're_properties_heading', label: 'Heading' },
    { key: 're_properties_subheading', label: 'Subheading', textarea: true },
  ]},
  { title: 'Stats', fields: [
    { key: 're_stats_1_number', label: 'Stat 1 Number' },
    { key: 're_stats_1_suffix', label: 'Stat 1 Suffix' },
    { key: 're_stats_1_label', label: 'Stat 1 Label' },
    { key: 're_stats_2_number', label: 'Stat 2 Number' },
    { key: 're_stats_2_suffix', label: 'Stat 2 Suffix' },
    { key: 're_stats_2_label', label: 'Stat 2 Label' },
    { key: 're_stats_3_number', label: 'Stat 3 Number' },
    { key: 're_stats_3_suffix', label: 'Stat 3 Suffix' },
    { key: 're_stats_3_label', label: 'Stat 3 Label' },
  ]},
  { title: 'About', fields: [
    { key: 're_about_eyebrow', label: 'Eyebrow' },
    { key: 're_about_heading', label: 'Heading', html: true },
    { key: 're_about_text', label: 'Text', textarea: true },
  ]},
  { title: 'CTA', fields: [
    { key: 're_cta_heading', label: 'Heading' },
    { key: 're_cta_text', label: 'Text', textarea: true },
    { key: 're_cta_button_text', label: 'Button Text' },
    { key: 're_cta_button_link', label: 'Button Link' },
  ]},
  { title: 'Footer', fields: [
    { key: 're_footer_text', label: 'Footer Text' },
  ]},
];

export default function REContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { flash } = useToast();

  useEffect(() => { loadContent(); }, []);

  async function loadContent() {
    const supabase = createClient();
    const { data } = await supabase.from('re_content').select('*');
    const map: Record<string, string> = {};
    (data || []).forEach((row: { id: string; value: string }) => { map[row.id] = row.value; });
    // Fill in defaults for any missing keys
    Object.entries(DEFAULT_RE_CONTENT).forEach(([key, val]) => {
      if (!(key in map)) map[key] = val;
    });
    setValues(map);
  }

  function toggleSection(i: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 're');
      setValues((v) => ({ ...v, re_hero_image: url }));
      flash('Image uploaded');
    } catch (err: any) {
      flash(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function saveContent() {
    const supabase = createClient();
    const upserts = Object.entries(values).map(([id, value]) => ({ id, value, updated_at: new Date().toISOString() }));
    await supabase.from('re_content').upsert(upserts);
    await fetch('/api/revalidate', { method: 'POST' });
    flash('Content saved');
  }

  async function resetContent() {
    if (!confirm('Reset all RE content to defaults?')) return;
    setValues({ ...DEFAULT_RE_CONTENT });
    const supabase = createClient();
    const upserts = Object.entries(DEFAULT_RE_CONTENT).map(([id, value]) => ({ id, value, updated_at: new Date().toISOString() }));
    await supabase.from('re_content').upsert(upserts);
    await fetch('/api/revalidate', { method: 'POST' });
    flash('Content reset to defaults');
  }

  return (
    <>
      <div className="main-header">
        <h1>RE Content</h1>
        <p>Edit text content on the real estate page</p>
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
                {f.image ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      value={values[f.key] || ''}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      placeholder="Paste URL or upload"
                      style={{ flex: 1, minWidth: 200 }}
                    />
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                    <button type="button" className="save-btn secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                ) : f.textarea ? (
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

      <div className="flex mt-2">
        <button className="save-btn" onClick={saveContent}>Save All Content</button>
        <button className="save-btn secondary" onClick={resetContent}>Reset to Defaults</button>
      </div>
    </>
  );
}
