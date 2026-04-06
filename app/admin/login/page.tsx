'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const email = username.includes('@') ? username : `${username}@houseofh.com`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      router.push('/admin/submissions');
      router.refresh();
    }
  }

  return (
    <div id="loginScreen" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0B0A08',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute', width: 600, height: 600,
        background: 'radial-gradient(circle,rgba(196,155,90,.08) 0%,rgba(196,155,90,.03) 40%,transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      }} />
      <div style={{
        width: '100%', maxWidth: 420, padding: '3rem 2.5rem',
        background: '#141210', border: '1px solid #2E2A24',
        borderRadius: 6, boxShadow: '0 8px 32px rgba(0,0,0,.4)',
        position: 'relative', zIndex: 1,
        fontFamily: "'Manrope', -apple-system, sans-serif",
        color: '#EDE7DD',
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 400, letterSpacing: '.05em', marginBottom: '.3rem', textAlign: 'center' }}>
          House of H<span style={{ color: '#C49B5A' }}>.</span>
        </div>
        <div style={{ fontSize: '.68rem', fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase' as const, color: '#8A8076', textAlign: 'center', marginBottom: '2.5rem' }}>
          Admin Panel
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '1.4rem' }}>
            <label style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' as const, color: '#8A8076' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                background: '#1C1916', border: '1px solid #3D3730', color: '#EDE7DD',
                fontFamily: "'Manrope', sans-serif", fontSize: '.9rem',
                padding: '.85rem 1rem', outline: 'none', borderRadius: 6,
              }}
              placeholder="admin"
              required
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '1.4rem' }}>
            <label style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' as const, color: '#8A8076' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: '#1C1916', border: '1px solid #3D3730', color: '#EDE7DD',
                  fontFamily: "'Manrope', sans-serif", fontSize: '.9rem',
                  padding: '.85rem 1rem', paddingRight: '2.8rem',
                  outline: 'none', borderRadius: 6, width: '100%',
                }}
                required
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                position: 'absolute', right: '.8rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#8A8076', padding: '.2rem',
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {showPwd ? <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                </svg>
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '1rem', background: '#C49B5A', color: 'white',
            fontFamily: "'Manrope', sans-serif", fontSize: '.72rem', fontWeight: 700,
            letterSpacing: '.18em', textTransform: 'uppercase' as const,
            border: 'none', cursor: 'pointer', borderRadius: 6, marginTop: '.5rem',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {error && <div style={{ fontSize: '.8rem', color: '#D4634B', marginTop: '.8rem', textAlign: 'center' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
