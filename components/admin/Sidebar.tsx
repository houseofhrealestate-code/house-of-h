'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { group: 'OVERVIEW', items: [
    { href: '/admin/submissions', label: 'Submissions', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
  ]},
  { group: 'MANAGEMENT', items: [
    { href: '/admin/ventures', label: 'Ventures', icon: 'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z' },
    { href: '/admin/team', label: 'Team', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  ]},
  { group: 'REAL ESTATE', items: [
    { href: '/admin/properties', label: 'Properties', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
    { href: '/admin/re-content', label: 'RE Content', icon: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z' },
  ]},
  { group: 'CUSTOMIZE', items: [
    { href: '/admin/content', label: 'Content', icon: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z' },
    { href: '/admin/design', label: 'Design & Fonts', icon: 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z' },
  ]},
  { group: 'SYSTEM', items: [
    { href: '/admin/settings', label: 'Settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 113.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">House of H<span>.</span></div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ group, items }) => (
          <div key={group}>
            <div className="sidebar__group">{group}</div>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar__item ${pathname === item.href ? 'active' : ''}`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar__view-site">
        ↗ View Live Site
      </a>
      <div className="sidebar__footer">
        <div className="sidebar__avatar">A</div>
        <span className="sidebar__user">Admin</span>
        <button className="sidebar__logout" onClick={handleLogout} title="Sign out">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
