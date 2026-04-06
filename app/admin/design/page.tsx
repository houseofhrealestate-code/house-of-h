'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import { DEFAULT_COLORS, DISPLAY_FONTS, BODY_FONTS } from '@/lib/constants';

const COLOR_FIELDS = [
  { key: '--color-bg', label: 'Background', default: '#FAF8F5' },
  { key: '--color-bg-warm', label: 'Warm Background', default: '#F3EDE6' },
  { key: '--color-bg-dark', label: 'Dark Background', default: '#0D0C0A' },
  { key: '--color-accent', label: 'Gold Accent', default: '#B8935A' },
  { key: '--color-accent-hover', label: 'Accent Hover', default: '#A07D45' },
  { key: '--color-accent-light', label: 'Light Accent', default: '#D4BC8E' },
  { key: '--color-text', label: 'Body Text', default: '#1A1714' },
  { key: '--color-text-muted', label: 'Muted Text', default: '#6B6560' },
  { key: '--color-border', label: 'Borders', default: '#E5DED5' },
];

export default function DesignPage() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [selectedDisplay, setSelectedDisplay] = useState('Cormorant Garamond');
  const [selectedBody, setSelectedBody] = useState('Manrope');
  const { flash } = useToast();

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    const supabase = createClient();
    const { data } = await supabase.from('site_settings').select('*');
    const settings: Record<string, Record<string, unknown>> = {};
    (data || []).forEach((row: { key: string; value: Record<string, unknown> }) => { settings[row.key] = row.value; });
    if (settings.colors && Object.keys(settings.colors).length > 0) setColors(settings.colors as Record<string, string>);
    else setColors({ ...DEFAULT_COLORS });
    if (settings.display_font && (settings.display_font as { name?: string }).name) setSelectedDisplay((settings.display_font as { name: string }).name);
    if (settings.body_font && (settings.body_font as { name?: string }).name) setSelectedBody((settings.body_font as { name: string }).name);
  }

  async function saveColors() {
    const supabase = createClient();
    await supabase.from('site_settings').upsert({ key: 'colors', value: colors, updated_at: new Date().toISOString() });
    await fetch('/api/revalidate', { method: 'POST' });
    flash('Colors saved');
  }

  async function resetColors() {
    setColors({ ...DEFAULT_COLORS });
    const supabase = createClient();
    await supabase.from('site_settings').upsert({ key: 'colors', value: DEFAULT_COLORS, updated_at: new Date().toISOString() });
    await fetch('/api/revalidate', { method: 'POST' });
    flash('Colors reset');
  }

  async function saveFonts() {
    const supabase = createClient();
    const df = DISPLAY_FONTS.find((f) => f.name === selectedDisplay);
    const bf = BODY_FONTS.find((f) => f.name === selectedBody);
    await Promise.all([
      supabase.from('site_settings').upsert({ key: 'display_font', value: { name: selectedDisplay, url: df?.url || '' }, updated_at: new Date().toISOString() }),
      supabase.from('site_settings').upsert({ key: 'body_font', value: { name: selectedBody, url: bf?.url || '' }, updated_at: new Date().toISOString() }),
    ]);
    await fetch('/api/revalidate', { method: 'POST' });
    flash('Fonts saved');
  }

  return (
    <>
      <div className="main-header">
        <h1>Design &amp; Fonts</h1>
        <p>Customize colors and typography — changes apply live on the website</p>
      </div>

      <div className="design-section">
        <h3>Color Palette</h3>
        <div className="color-grid">
          {COLOR_FIELDS.map((cf) => (
            <div key={cf.key} className="color-item">
              <label>{cf.label}</label>
              <div className="color-wrap">
                <input type="color" value={colors[cf.key] || cf.default} onChange={(e) => setColors({ ...colors, [cf.key]: e.target.value })} />
                <input type="text" value={colors[cf.key] || cf.default} onChange={(e) => setColors({ ...colors, [cf.key]: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <button className="save-btn" onClick={saveColors}>Save Colors</button>
          <button className="save-btn secondary" onClick={resetColors}>Reset Defaults</button>
        </div>
      </div>

      <div className="design-section">
        <h3>Display Font (Headlines)</h3>
        <p className="text-dim" style={{ marginBottom: '1.2rem' }}>Choose the font for large headings</p>
        <div className="font-grid">
          {DISPLAY_FONTS.map((f) => (
            <div key={f.name} className={`font-card ${selectedDisplay === f.name ? 'selected' : ''}`} onClick={() => setSelectedDisplay(f.name)}>
              <div className="font-card__preview" style={{ fontFamily: `'${f.name}', ${f.fallback}` }}>House of H.</div>
              <div className="font-card__name">{f.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="design-section">
        <h3>Body Font (Paragraphs &amp; UI)</h3>
        <div className="font-grid">
          {BODY_FONTS.map((f) => (
            <div key={f.name} className={`font-card ${selectedBody === f.name ? 'selected' : ''}`} onClick={() => setSelectedBody(f.name)}>
              <div className="font-card__preview" style={{ fontFamily: `'${f.name}', ${f.fallback}`, fontSize: '1.1rem' }}>The quick fox</div>
              <div className="font-card__name">{f.name}</div>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <button className="save-btn" onClick={saveFonts}>Save Fonts</button>
          <button className="save-btn secondary" onClick={() => { setSelectedDisplay('Cormorant Garamond'); setSelectedBody('Manrope'); }}>Reset Defaults</button>
        </div>
      </div>
    </>
  );
}
