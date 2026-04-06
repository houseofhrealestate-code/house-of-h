'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import { uploadImage } from '@/lib/storage';
import { GRADIENT_PRESETS } from '@/lib/constants';
import type { Venture } from '@/lib/types';

export default function VenturesPage() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', badge: '', subtitle: '', description: '', button_text: 'Learn More', button_link: '#contact', bg_gradient: GRADIENT_PRESETS[0].value, image_url: '', pattern_style: '', pattern_size: '' });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { flash } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from('ventures').select('*').order('display_order');
    setVentures(data || []);
  }

  async function revalidate() {
    await fetch('/api/revalidate', { method: 'POST' });
  }

  function startAdd() {
    setEditingId(null);
    setForm({ title: '', badge: '', subtitle: '', description: '', button_text: 'Learn More', button_link: '#contact', bg_gradient: GRADIENT_PRESETS[0].value, image_url: '', pattern_style: '', pattern_size: '' });
    setShowForm(true);
  }

  function startEdit(v: Venture) {
    setEditingId(v.id);
    setForm({ title: v.title, badge: v.badge, subtitle: v.subtitle, description: v.description, button_text: v.button_text, button_link: v.button_link, bg_gradient: v.bg_gradient, image_url: v.image_url, pattern_style: v.pattern_style, pattern_size: v.pattern_size });
    setShowForm(true);
  }

  async function save() {
    if (!form.title || !form.badge) { flash('Title and badge are required', 'error'); return; }
    const supabase = createClient();
    if (editingId) {
      await supabase.from('ventures').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editingId);
      flash('Venture updated');
    } else {
      const maxOrder = Math.max(0, ...ventures.map((v) => v.display_order));
      await supabase.from('ventures').insert({ ...form, display_order: maxOrder + 1 });
      flash('Venture added');
    }
    setShowForm(false);
    await load();
    await revalidate();
  }

  async function deleteVenture(id: string) {
    if (!confirm('Delete this venture?')) return;
    const supabase = createClient();
    await supabase.from('ventures').delete().eq('id', id);
    flash('Venture deleted');
    await load();
    await revalidate();
  }

  async function toggleActive(v: Venture) {
    const supabase = createClient();
    await supabase.from('ventures').update({ is_active: !v.is_active }).eq('id', v.id);
    await load();
    await revalidate();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'ventures');
      setForm((f) => ({ ...f, image_url: url }));
      flash('Image uploaded');
    } catch (err: any) {
      flash(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = ventures.findIndex((v) => v.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= ventures.length) return;
    const supabase = createClient();
    const a = ventures[idx], b = ventures[swapIdx];
    await Promise.all([
      supabase.from('ventures').update({ display_order: b.display_order }).eq('id', a.id),
      supabase.from('ventures').update({ display_order: a.display_order }).eq('id', b.id),
    ]);
    await load();
    await revalidate();
  }

  return (
    <>
      <div className="main-header">
        <h1>Ventures</h1>
        <p>Manage your business verticals shown on the homepage</p>
      </div>

      {showForm && (
        <div className="admin-form">
          <h3>{editingId ? 'Edit Venture' : 'Add Venture'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Title <span className="required">*</span></label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Khayal" />
            </div>
            <div className="form-group">
              <label>Badge / Category <span className="required">*</span></label>
              <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Fashion" />
            </div>
          </div>
          <div className="form-group">
            <label>Subtitle</label>
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Short tagline" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe this venture..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Button Text</label>
              <input value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Button Link</label>
              <input value={form.button_link} onChange={(e) => setForm({ ...form, button_link: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Background Gradient</label>
            <input value={form.bg_gradient} onChange={(e) => setForm({ ...form, bg_gradient: e.target.value })} />
            <div className="gradient-presets">
              {GRADIENT_PRESETS.map((p) => (
                <div key={p.name} className={`gradient-preset ${form.bg_gradient === p.value ? 'selected' : ''}`}
                  style={{ background: p.value }} onClick={() => setForm({ ...form, bg_gradient: p.value })} title={p.name} />
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Image</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Paste URL or upload" style={{ flex: 1, minWidth: 200 }} />
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <button type="button" className="save-btn secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
            {form.image_url && (
              <img src={form.image_url} alt="Preview" style={{ marginTop: '0.5rem', height: 60, borderRadius: 4, objectFit: 'cover', border: '2px solid #2E2A24' }} />
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Pattern Style (CSS)</label>
              <input value={form.pattern_style} onChange={(e) => setForm({ ...form, pattern_style: e.target.value })} placeholder="CSS background-image" />
            </div>
            <div className="form-group">
              <label>Pattern Size (CSS)</label>
              <input value={form.pattern_size} onChange={(e) => setForm({ ...form, pattern_size: e.target.value })} placeholder="e.g. 18px 18px" />
            </div>
          </div>
          <div className="flex mt-2">
            <button className="save-btn" onClick={save}>Save</button>
            <button className="save-btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="manager-toolbar">
        <span className="manager-count">{ventures.length} venture{ventures.length !== 1 ? 's' : ''}</span>
        <button className="save-btn add-btn" onClick={startAdd}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          Add Venture
        </button>
      </div>

      <div className="manager-list">
        {ventures.map((v, i) => (
          <div key={v.id} className="manager-item" style={{ opacity: v.is_active ? 1 : 0.5 }}>
            <span className="manager-item__order">{i + 1}</span>
            <div className="manager-item__swatch" style={{ background: v.bg_gradient }} />
            <div className="manager-item__info">
              <div className="manager-item__title">{v.title}</div>
              <div className="manager-item__meta">{v.badge}{v.subtitle ? ` · ${v.subtitle}` : ''}</div>
            </div>
            <div className="manager-item__actions">
              <button className="action-btn" onClick={() => move(v.id, -1)} disabled={i === 0} title="Move up">↑</button>
              <button className="action-btn" onClick={() => move(v.id, 1)} disabled={i === ventures.length - 1} title="Move down">↓</button>
              <label className="toggle">
                <input type="checkbox" checked={v.is_active} onChange={() => toggleActive(v)} />
                <div className="toggle__track" />
                <div className="toggle__thumb" />
              </label>
              <button className="action-btn" onClick={() => startEdit(v)} title="Edit">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button className="action-btn action-btn--danger" onClick={() => deleteVenture(v.id)} title="Delete">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
