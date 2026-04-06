'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import { uploadImage } from '@/lib/storage';
import { RE_PROPERTY_TYPES } from '@/lib/constants';
import type { REProperty } from '@/lib/types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<REProperty[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', location: '', price: '', type: 'Commercial', area_sqft: 0, bedrooms: 0, bathrooms: 0, description: '', image_url: '', is_featured: false });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { flash } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from('re_properties').select('*').order('display_order');
    setProperties(data || []);
  }

  async function revalidate() {
    await fetch('/api/revalidate', { method: 'POST' });
  }

  function startAdd() {
    setEditingId(null);
    setForm({ title: '', location: '', price: '', type: 'Commercial', area_sqft: 0, bedrooms: 0, bathrooms: 0, description: '', image_url: '', is_featured: false });
    setShowForm(true);
  }

  function startEdit(p: REProperty) {
    setEditingId(p.id);
    setForm({ title: p.title, location: p.location, price: p.price, type: p.type, area_sqft: p.area_sqft, bedrooms: p.bedrooms, bathrooms: p.bathrooms, description: p.description, image_url: p.image_url, is_featured: p.is_featured });
    setShowForm(true);
  }

  async function save() {
    if (!form.title || !form.location) { flash('Title and location are required', 'error'); return; }
    const supabase = createClient();
    if (editingId) {
      await supabase.from('re_properties').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editingId);
      flash('Property updated');
    } else {
      const maxOrder = Math.max(0, ...properties.map((p) => p.display_order));
      await supabase.from('re_properties').insert({ ...form, display_order: maxOrder + 1 });
      flash('Property added');
    }
    setShowForm(false);
    await load();
    await revalidate();
  }

  async function deleteProperty(id: string) {
    if (!confirm('Delete this property?')) return;
    const supabase = createClient();
    await supabase.from('re_properties').delete().eq('id', id);
    flash('Property deleted');
    await load();
    await revalidate();
  }

  async function toggleActive(p: REProperty) {
    const supabase = createClient();
    await supabase.from('re_properties').update({ is_active: !p.is_active }).eq('id', p.id);
    await load();
    await revalidate();
  }

  async function toggleFeatured(p: REProperty) {
    const supabase = createClient();
    await supabase.from('re_properties').update({ is_featured: !p.is_featured }).eq('id', p.id);
    await load();
    await revalidate();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'properties');
      setForm((f) => ({ ...f, image_url: url }));
      flash('Image uploaded');
    } catch (err: any) {
      flash(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = properties.findIndex((p) => p.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= properties.length) return;
    const supabase = createClient();
    const a = properties[idx], b = properties[swapIdx];
    await Promise.all([
      supabase.from('re_properties').update({ display_order: b.display_order }).eq('id', a.id),
      supabase.from('re_properties').update({ display_order: a.display_order }).eq('id', b.id),
    ]);
    await load();
    await revalidate();
  }

  return (
    <>
      <div className="main-header">
        <h1>Properties</h1>
        <p>Manage property listings on the real estate page</p>
      </div>

      {showForm && (
        <div className="admin-form">
          <h3>{editingId ? 'Edit Property' : 'Add Property'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Title <span className="required">*</span></label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Marina Tower" />
            </div>
            <div className="form-group">
              <label>Location <span className="required">*</span></label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Dubai Marina" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. AED 2,500,000" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {RE_PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Area (sqft)</label>
              <input type="number" value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe this property..." />
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
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
              Featured Property
            </label>
          </div>
          <div className="flex mt-2">
            <button className="save-btn" onClick={save}>Save</button>
            <button className="save-btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="manager-toolbar">
        <span className="manager-count">{properties.length} propert{properties.length !== 1 ? 'ies' : 'y'}</span>
        <button className="save-btn add-btn" onClick={startAdd}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          Add Property
        </button>
      </div>

      <div className="manager-list">
        {properties.map((p, i) => (
          <div key={p.id} className="manager-item" style={{ opacity: p.is_active ? 1 : 0.5 }}>
            <span className="manager-item__order">{i + 1}</span>
            {p.image_url ? (
              <img src={p.image_url} alt={p.title} className="manager-item__swatch" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
            ) : (
              <div className="manager-item__swatch" style={{ background: '#3a3530' }} />
            )}
            <div className="manager-item__info">
              <div className="manager-item__title">{p.title}</div>
              <div className="manager-item__meta">{p.location} &middot; {p.type} &middot; {p.price}</div>
            </div>
            {p.is_featured && <span title="Featured" style={{ fontSize: '1.1rem' }}>&#9733;</span>}
            <div className="manager-item__actions">
              <button className="action-btn" onClick={() => move(p.id, -1)} disabled={i === 0} title="Move up">&#8593;</button>
              <button className="action-btn" onClick={() => move(p.id, 1)} disabled={i === properties.length - 1} title="Move down">&#8595;</button>
              <label className="toggle">
                <input type="checkbox" checked={p.is_active} onChange={() => toggleActive(p)} />
                <div className="toggle__track" />
                <div className="toggle__thumb" />
              </label>
              <button className="action-btn" onClick={() => startEdit(p)} title="Edit">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button className="action-btn action-btn--danger" onClick={() => deleteProperty(p.id)} title="Delete">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
