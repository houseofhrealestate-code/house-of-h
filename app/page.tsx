import { createClient } from '@/lib/supabase/server';
import type { ContentMap } from '@/lib/types';
import CustomCursor from '@/components/public/CustomCursor';
import GrainOverlay from '@/components/public/GrainOverlay';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import Ticker from '@/components/public/Ticker';
import Stats from '@/components/public/Stats';
import Ventures from '@/components/public/Ventures';
import Philosophy from '@/components/public/Philosophy';
import About from '@/components/public/About';
import Team from '@/components/public/Team';
import CtaBand from '@/components/public/CtaBand';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import FloatingButtons from '@/components/public/FloatingButtons';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [contentRes, venturesRes, teamRes, statsRes] = await Promise.all([
    supabase.from('site_content').select('*'),
    supabase.from('ventures').select('*').eq('is_active', true).order('display_order'),
    supabase.from('team_members').select('*').eq('is_active', true).order('display_order'),
    supabase.from('stats').select('*').order('display_order'),
  ]);

  const content: ContentMap = {};
  (contentRes.data || []).forEach((row) => {
    content[row.id] = row.value;
  });

  const ventures = venturesRes.data || [];
  const teamMembers = teamRes.data || [];
  const stats = statsRes.data || [];

  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      <Navbar />
      <Hero content={content} />
      <Ticker />
      <Stats stats={stats} />
      <Ventures ventures={ventures} content={content} />
      <Philosophy content={content} />
      <About content={content} />
      <Team members={teamMembers} content={content} />
      <CtaBand content={content} />
      <Contact content={content} teamMembers={teamMembers} ventures={ventures} />
      <Footer content={content} ventures={ventures} />
      <FloatingButtons />
    </>
  );
}
