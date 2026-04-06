'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import type { TeamMember } from '@/lib/types';

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: '', bio: '', phone: '', whatsapp: '', email: '', image_url: '', initials: '', initials_bg: '' });
  const { flash } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from('team_members').select('*').order('display_order');
    setMembers(data || []);
  }

  async function revalidate() { await fetch('/api/revalidate', { method: 'POST' }); }

  function autoInitials(name: string) {
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function autoWhatsapp(phone: string) {
    return phone.replace(/[\s+()-]/g, '');
  }

  function startAdd() {
    setEditingId(null);
    setForm({ name: '', role: '', bio: '', phone: '', whatsapp: '', email: '', image_url: '', initials: '', initials_bg: '' });
    setShowForm(true);
  }

  function startEdit(m: TeamMember) {
    setEditingId(m.id);
    setForm({ name: m.name, role: m.role, bio: m.bio, phone: m.phone, whatsapp: m.whatsapp, email: m.email, image_url: m.image_url, initials: m.initials, initials_bg: m.initials_bg });
    setShowForm(true);
  }

  async function save() {
    if (!form.name) { flash('Name is required', 'error'); return; }
    const supabase = createClient();
    const data = { ...form, initials: form.initials || autoInitials(form.name), whatsapp: form.whatsapp || autoWhatsapp(form.phone) };
    if (editingId) {
      await supabase.from('team_members').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editingId);
      flash('Team member updated');
    } else {
      const maxOrder = Math.max(0, ...members.map((m) => m.display_order));
      await supabase.from('team_members').insert({ ...data, display_order: maxOrder + 1 });
      flash('Team member added');
    }
    setShowForm(false);
    await load();
    await revalidate();
  }

  async function deleteMember(id: string) {
    if (!confirm('Delete this team member?')) return;
    const supabase = createClient();
    await supabase.from('team_members').delete().eq('id', id);
    flash('Team member deleted');
    await load();
    await revalidate();
  }

  async function toggleActive(m: TeamMember) {
    const supabase = createClient();
    await supabase.from('team_members').update({ is_active: !m.is_active }).eq('id', m.id);
    await load();
    await revalidate();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = members.findIndex((m) => m.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= members.length) return;
    const supabase = createClient();
    const a = members[idx], b = members[swapIdx];
    await Promise.all([
      supabase.from('team_members').update({ display_order: b.display_order }).eq('id', a.id),
      supabase.from('team_members').update({ display_order: a.display_order }).eq('id', b.id),
    ]);
    await load();
    await revalidate();
  }

  return (
    <>
      <div className="main-header">
        <h1>Team</h1>
        <p>Manage team members shown on the homepage</p>
      </div>

      {showForm && (
        <div className="admin-form">
          <h3>{editingId ? 'Edit Member' : 'Add Member'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name <span className="required">*</span></label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, initials: autoInitials(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value, whatsapp: autoWhatsapp(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>WhatsApp</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="Auto-filled from phone" />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Photo URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Cloudinary URL or /images/filename.jpg" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Initials</label>
              <input value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value })} maxLength={2} />
            </div>
            <div className="form-group">
              <label>Initials Background</label>
              <input value={form.initials_bg} onChange={(e) => setForm({ ...form, initials_bg: e.target.value })} placeholder="CSS gradient" />
              {form.initials && (
                <div style={{ marginTop: '.5rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: form.initials_bg || '#2E2A24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', fontWeight: 700, color: 'white' }}>{form.initials}</div>
                  <span style={{ fontSize: '.7rem', color: '#5A5349' }}>Preview</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex mt-2">
            <button className="save-btn" onClick={save}>Save</button>
            <button className="save-btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="manager-toolbar">
        <span className="manager-count">{members.length} member{members.length !== 1 ? 's' : ''}</span>
        <button className="save-btn add-btn" onClick={startAdd}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          Add Member
        </button>
      </div>

      <div className="manager-list">
        {members.map((m, i) => (
          <div key={m.id} className="manager-item" style={{ opacity: m.is_active ? 1 : 0.5 }}>
            <span className="manager-item__order">{i + 1}</span>
            <div className="manager-item__initials" style={{ background: m.initials_bg || '#2E2A24' }}>{m.initials}</div>
            <div className="manager-item__info">
              <div className="manager-item__title">{m.name}</div>
              <div className="manager-item__meta">{m.role}{m.phone ? ` · ${m.phone}` : ''}</div>
            </div>
            <div className="manager-item__actions">
              <button className="action-btn" onClick={() => move(m.id, -1)} disabled={i === 0}>↑</button>
              <button className="action-btn" onClick={() => move(m.id, 1)} disabled={i === members.length - 1}>↓</button>
              <label className="toggle">
                <input type="checkbox" checked={m.is_active} onChange={() => toggleActive(m)} />
                <div className="toggle__track" />
                <div className="toggle__thumb" />
              </label>
              <button className="action-btn" onClick={() => startEdit(m)}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button className="action-btn action-btn--danger" onClick={() => deleteMember(m.id)}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
