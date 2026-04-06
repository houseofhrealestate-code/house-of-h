'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';

export default function SettingsPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { flash } = useToast();

  async function changePassword() {
    if (newPassword.length < 6) { flash('Password must be at least 6 characters', 'error'); return; }
    if (newPassword !== confirmPassword) { flash('Passwords do not match', 'error'); return; }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) flash(error.message, 'error');
    else { flash('Password updated'); setNewPassword(''); setConfirmPassword(''); }
  }

  async function deleteAllSubmissions() {
    if (!confirm('Delete ALL submissions? This cannot be undone.')) return;
    const supabase = createClient();
    await supabase.from('submissions').delete().neq('id', 0);
    flash('All submissions deleted');
  }

  async function exportData() {
    const supabase = createClient();
    const [c, v, t, s, st] = await Promise.all([
      supabase.from('site_content').select('*'),
      supabase.from('ventures').select('*'),
      supabase.from('team_members').select('*'),
      supabase.from('stats').select('*'),
      supabase.from('site_settings').select('*'),
    ]);
    const data = { site_content: c.data, ventures: v.data, team_members: t.data, stats: s.data, site_settings: st.data };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `houseofh-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    flash('Data exported');
  }

  return (
    <>
      <div className="main-header">
        <h1>Settings</h1>
        <p>Account settings, integrations, and data management</p>
      </div>

      <div className="settings-section">
        <h3>Change Password</h3>
        <div className="form-row" style={{ maxWidth: 500 }}>
          <div className="form-group">
            <label style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' as const, color: '#5A5349', marginBottom: '.5rem', display: 'block' }}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ background: '#1C1916', border: '1px solid #2E2A24', color: '#EDE7DD', padding: '.75rem 1rem', borderRadius: 4, outline: 'none', width: '100%', fontFamily: "'Manrope', sans-serif", fontSize: '.85rem' }} />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' as const, color: '#5A5349', marginBottom: '.5rem', display: 'block' }}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ background: '#1C1916', border: '1px solid #2E2A24', color: '#EDE7DD', padding: '.75rem 1rem', borderRadius: 4, outline: 'none', width: '100%', fontFamily: "'Manrope', sans-serif", fontSize: '.85rem' }} />
          </div>
        </div>
        <button className="save-btn mt-1" onClick={changePassword}>Update Password</button>
      </div>

      <div className="settings-section">
        <h3>Image Storage</h3>
        <p style={{ color: '#5A5349', fontSize: '.85rem', lineHeight: 1.6 }}>
          Images are stored in <strong style={{ color: '#C49B5A' }}>Supabase Storage</strong> — no extra setup needed. Use the <strong style={{ color: '#EDE7DD' }}>Upload Photo / Upload Image</strong> buttons in the Team and Ventures pages to upload directly.
        </p>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>
        <div className="flex">
          <button className="save-btn" onClick={exportData}>Export All Data (JSON)</button>
        </div>
      </div>

      <div className="settings-section danger-zone" style={{ borderColor: '#D4634B', borderStyle: 'dashed' }}>
        <h3 style={{ color: '#D4634B' }}>Danger Zone</h3>
        <div className="flex">
          <button className="save-btn danger" onClick={deleteAllSubmissions}>Delete All Submissions</button>
        </div>
      </div>
    </>
  );
}
