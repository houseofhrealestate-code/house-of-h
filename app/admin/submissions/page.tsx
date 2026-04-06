'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/Toast';
import type { Submission } from '@/lib/types';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { flash } = useToast();

  useEffect(() => { loadSubmissions(); }, []);

  async function loadSubmissions() {
    const supabase = createClient();
    const { data } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    setSubmissions(data || []);
  }

  async function deleteSubmission(id: number) {
    if (!confirm('Delete this submission?')) return;
    const supabase = createClient();
    await supabase.from('submissions').delete().eq('id', id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    flash('Submission deleted');
  }

  function exportCSV() {
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Interest', 'Message'];
    const rows = submissions.map((s) => [s.id, new Date(s.created_at).toLocaleDateString(), s.name, s.phone, s.email, s.interest, s.message]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const today = new Date().toDateString();
  const todayCount = submissions.filter((s) => new Date(s.created_at).toDateString() === today).length;
  const interests = submissions.map((s) => s.interest).filter(Boolean);
  const topInterest = interests.length
    ? Object.entries(interests.reduce((a, c) => ({ ...a, [c]: (a[c] || 0) + 1 }), {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
    : '—';

  return (
    <>
      <div className="main-header">
        <h1>Submissions</h1>
        <p>Contact form enquiries from your website visitors</p>
      </div>
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card__icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <div>
            <div className="stat-card__value">{submissions.length}</div>
            <div className="stat-card__label">Total Enquiries</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div>
            <div className="stat-card__value">{todayCount}</div>
            <div className="stat-card__label">Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div>
            <div className="stat-card__value" style={{ fontSize: '1rem' }}>{topInterest}</div>
            <div className="stat-card__label">Top Interest</div>
          </div>
        </div>
      </div>
      <div className="flex" style={{ marginBottom: '1rem' }}>
        <button className="save-btn secondary" onClick={exportCSV}>Export CSV</button>
      </div>
      {submissions.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <h3>No submissions yet</h3>
          <p>When visitors fill out the contact form, their enquiries will appear here.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Interest</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <>
                <tr key={s.id}>
                  <td>{submissions.length - i}</td>
                  <td>{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="name">{s.name}</td>
                  <td>{s.phone}</td>
                  <td>{s.interest}</td>
                  <td>
                    <div className="flex">
                      <button className="action-btn" onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} title="Details">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      <button className="action-btn action-btn--danger" onClick={() => deleteSubmission(s.id)} title="Delete">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                      </button>
                      {s.phone && (
                        <a href={`https://wa.me/${s.phone.replace(/[\s+()-]/g, '')}`} target="_blank" rel="noopener noreferrer" className="action-btn" title="WhatsApp" style={{ color: '#25D366' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedId === s.id && (
                  <tr key={`detail-${s.id}`}>
                    <td colSpan={6}>
                      <div className="detail-row">
                        {s.email && <div><strong>Email:</strong> {s.email}</div>}
                        {s.message && <div style={{ marginTop: '.5rem' }}><strong>Message:</strong> {s.message}</div>}
                        <div style={{ marginTop: '.5rem' }}><strong>ID:</strong> {s.id}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
