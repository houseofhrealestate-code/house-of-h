import { createPublicClient } from '@/lib/supabase/public';
import type { ContentMap, REProperty } from '@/lib/types';
import { DEFAULT_RE_CONTENT } from '@/lib/constants';
import type { Metadata } from 'next';
import REHero from '@/components/houseofh/REHero';
import REStats from '@/components/houseofh/REStats';
import REProperties from '@/components/houseofh/REProperties';
import REAbout from '@/components/houseofh/REAbout';
import RECTA from '@/components/houseofh/RECTA';
import REFooter from '@/components/houseofh/REFooter';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'House of H. Real Estate',
  description:
    'Premium real estate services — commercial leasing, acquisitions, and institutional transactions powered by a deal-first mindset.',
};

export default async function HouseOfHPage() {
  let content: ContentMap = { ...DEFAULT_RE_CONTENT };
  let properties: REProperty[] = [];

  try {
    const supabase = createPublicClient();
    const [contentRes, propertiesRes] = await Promise.all([
      supabase.from('re_content').select('*'),
      supabase
        .from('re_properties')
        .select('*')
        .eq('is_active', true)
        .order('display_order'),
    ]);

    (contentRes.data || []).forEach((row) => {
      content[row.id] = row.value;
    });
    properties = propertiesRes.data || [];
  } catch (e) {
    console.error('Supabase RE fetch failed:', e);
  }

  return (
    <div className="re-page">
      <REHero content={content} />
      <REStats content={content} />
      <REProperties properties={properties} content={content} />
      <REAbout content={content} />
      <RECTA content={content} />
      <REFooter content={content} />
    </div>
  );
}
