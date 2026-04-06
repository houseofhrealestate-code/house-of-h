-- =============================================
-- House of H. — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Site Content (key-value text pairs)
CREATE TABLE site_content (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ventures
CREATE TABLE ventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  badge TEXT NOT NULL,
  button_text TEXT DEFAULT 'Learn More',
  button_link TEXT DEFAULT '#contact',
  image_url TEXT DEFAULT '',
  bg_gradient TEXT NOT NULL,
  pattern_style TEXT DEFAULT '',
  pattern_size TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Team Members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  initials TEXT DEFAULT '',
  initials_bg TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Stats
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  count INT NOT NULL DEFAULT 0,
  suffix TEXT DEFAULT '',
  label TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Submissions
CREATE TABLE submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  interest TEXT DEFAULT '',
  message TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Site Settings
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Row Level Security
-- =============================================

-- site_content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON site_content FOR SELECT USING (true);
CREATE POLICY "Admin write" ON site_content FOR ALL USING (auth.role() = 'authenticated');

-- ventures
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON ventures FOR SELECT USING (true);
CREATE POLICY "Admin write" ON ventures FOR ALL USING (auth.role() = 'authenticated');

-- team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON team_members FOR SELECT USING (true);
CREATE POLICY "Admin write" ON team_members FOR ALL USING (auth.role() = 'authenticated');

-- stats
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON stats FOR SELECT USING (true);
CREATE POLICY "Admin write" ON stats FOR ALL USING (auth.role() = 'authenticated');

-- submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read" ON submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON submissions FOR DELETE USING (auth.role() = 'authenticated');

-- site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin write" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- Seed Data
-- =============================================

-- Ventures
INSERT INTO ventures (title, subtitle, description, badge, button_text, button_link, bg_gradient, pattern_style, pattern_size, display_order) VALUES
('Khayal', 'Where Culture Becomes Clothing', 'A premium Indian clothing brand translating nostalgia, culture, and everyday experiences into wearable stories. Story-driven collections, limited drops, premium finishes.', 'Fashion', 'Discover Khayal', '#contact', 'linear-gradient(160deg,#2C2438 0%,#1A1520 100%)', 'repeating-linear-gradient(45deg,rgba(184,147,90,1) 0,rgba(184,147,90,1) 1px,transparent 0,transparent 50%)', '18px 18px', 1),
('Real Estate', 'Commercial · Acquisitions · Leasing', 'A deal-focused vertical specializing in commercial leasing, acquisitions, and institutional transactions. We operate with a deal-first mindset — prioritizing outcomes over activity.', 'Real Estate', 'Explore Properties', '#contact', 'linear-gradient(160deg,#1C2B3A 0%,#0F1A26 100%)', 'repeating-linear-gradient(0deg,rgba(184,147,90,1) 0,rgba(184,147,90,1) 1px,transparent 0,transparent 32px),repeating-linear-gradient(90deg,rgba(184,147,90,1) 0,rgba(184,147,90,1) 1px,transparent 0,transparent 32px)', '', 2),
('EDMO', 'AI-Powered Education Ecosystem', 'An AI-powered ecosystem for schools, students, and parents — integrating learning, performance tracking, and engagement into a single platform. Redefining how education is experienced.', 'AI & Technology', 'Learn About EDMO', '#contact', 'linear-gradient(160deg,#1A2818 0%,#0E1A0E 100%)', 'radial-gradient(circle at 50% 50%,rgba(184,147,90,.15) 0,transparent 60%)', '', 3);

-- Team Members
INSERT INTO team_members (name, role, bio, phone, whatsapp, email, image_url, initials, initials_bg, display_order) VALUES
('Ammaar Fouzan', 'Founder', '', '+91 99457 20417', '919945720417', '', '/images/ammaar.jpg', 'AF', '', 1),
('Om Faraz', 'Creative Director', '', '+91 99866 64874', '919986664874', '', '', 'OF', 'linear-gradient(135deg,#2C2438,#1A1520)', 2),
('Fouzan Hashim', 'Operations & Strategy', '', '+91 99001 39430', '919900139430', '', '', 'FH', 'linear-gradient(135deg,#1C2B3A,#0F1A26)', 3);

-- Stats
INSERT INTO stats (count, suffix, label, display_order) VALUES
(3, '', 'Active Ventures', 1),
(3, '', 'Industries', 2),
(2, '', 'Cities', 3),
(1, '+', 'Years Building', 4);

-- Site Content
INSERT INTO site_content (id, value) VALUES
('hero_eyebrow', 'A Modern Conglomerate'),
('hero_headline', 'House of H<em>.</em><br>Building <em>India''s</em> Future.'),
('hero_sub', 'A diversified group building enduring ventures across fashion, real estate, and artificial intelligence — rooted in clarity, quality, and long-term thinking.'),
('hero_btn1_text', 'Explore Ventures'),
('hero_btn1_link', '#verticals'),
('hero_btn2_text', 'Get in Touch'),
('hero_btn2_link', '#contact'),
('hero_img_tag', 'Ammaar Fouzan — Founder'),
('ventures_eyebrow', 'Our Ventures'),
('ventures_heading', 'Three Verticals.<br>One Vision.'),
('ventures_desc', 'Each venture operates independently with its own identity, connected by shared values of quality, precision, and long-term thinking.'),
('philosophy_eyebrow', 'Our Philosophy'),
('philosophy_quote', '"We are not here to <em>participate</em>.<br>We are here to <em>build</em>."'),
('philosophy_attr', 'House of H. — Founded on Intent'),
('about_eyebrow', 'About the Group'),
('about_headline', 'A Modern Business Group Built to Last'),
('about_p1', 'House of H. is a diversified conglomerate focused on building and operating ventures across fashion, real estate, and artificial intelligence. Founded with clear intent — to create businesses that combine strong identity, operational excellence, and long-term scalability.'),
('about_p2', 'In a market where many companies are built for speed, House of H. focuses on depth — understanding industries from the ground up, building strong foundations, and scaling with structure.'),
('vision_text', 'To build a globally respected group of companies originating from India — known for clarity, quality, and long-term impact. House of H. is not built for short-term success. It is built to last.'),
('team_eyebrow', 'The People Behind H.'),
('team_heading', 'A Team Built on<br>Trust & Execution'),
('team_desc', 'A small, focused team with clear roles and shared standards of excellence.'),
('contact_eyebrow', 'Get in Touch'),
('contact_heading', 'Let''s Start<br>a Conversation'),
('contact_form_title', 'Send an Enquiry'),
('contact_form_sub', 'Share a few details and Ammaar will personally follow up within 24 hours.'),
('contact_privacy', 'Your details are kept strictly confidential. We respond within 24 hours.'),
('cta_heading', 'Ready to Build Something Together?'),
('cta_desc', 'Whether it is fashion, property, or technology — let us start with a conversation.'),
('footer_brand', 'House of H<span>.</span>'),
('footer_tagline', 'A modern conglomerate building enduring ventures across fashion, real estate, and artificial intelligence — founded on intent, built to last.'),
('footer_copyright', '© 2026 House of H. All rights reserved.');

-- Site Settings defaults
INSERT INTO site_settings (key, value) VALUES
('colors', '{}'),
('display_font', '{"name": "Cormorant Garamond", "url": ""}'),
('body_font', '{"name": "Manrope", "url": ""}'),
('cloudinary', '{"cloudName": "", "uploadPreset": ""}');

-- =============================================
-- Real Estate Sub-Site
-- =============================================

-- RE Content (key-value text pairs for /houseofh page)
CREATE TABLE re_content (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RE Properties
CREATE TABLE re_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT DEFAULT '',
  price TEXT DEFAULT '',
  type TEXT DEFAULT 'Commercial',
  area_sqft INT DEFAULT 0,
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE re_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON re_content FOR SELECT USING (true);
CREATE POLICY "Admin write" ON re_content FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE re_properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON re_properties FOR SELECT USING (true);
CREATE POLICY "Admin write" ON re_properties FOR ALL USING (auth.role() = 'authenticated');

-- RE Content Seed Data
INSERT INTO re_content (id, value) VALUES
('re_hero_headline', 'Premium Real Estate,<br><em>Redefined.</em>'),
('re_hero_subtitle', 'Commercial leasing, acquisitions, and institutional transactions — powered by a deal-first mindset.'),
('re_hero_cta_text', 'View Properties'),
('re_hero_cta_link', '#properties'),
('re_hero_image', ''),
('re_properties_eyebrow', 'Our Portfolio'),
('re_properties_heading', 'Featured Properties'),
('re_properties_subheading', 'Explore our curated selection of premium commercial and residential properties across India.'),
('re_stats_1_number', '50'),
('re_stats_1_suffix', '+'),
('re_stats_1_label', 'Properties Managed'),
('re_stats_2_number', '120'),
('re_stats_2_suffix', 'Cr+'),
('re_stats_2_label', 'Portfolio Value'),
('re_stats_3_number', '15'),
('re_stats_3_suffix', '+'),
('re_stats_3_label', 'Cities Covered'),
('re_about_eyebrow', 'About Our Real Estate Division'),
('re_about_heading', 'Deal-First Mindset,<br>Premium Outcomes.'),
('re_about_text', 'House of H. Real Estate specializes in commercial leasing, acquisitions, and institutional transactions. We prioritize outcomes over activity — identifying high-value opportunities and executing with precision.'),
('re_cta_heading', 'Looking for the Right Property?'),
('re_cta_text', 'Whether you are exploring commercial spaces, residential investments, or land acquisitions — let us find the perfect deal for you.'),
('re_cta_button_text', 'Get in Touch'),
('re_cta_button_link', '/#contact'),
('re_footer_text', '© 2026 House of H. Real Estate. All rights reserved.');

-- RE Properties Seed Data
INSERT INTO re_properties (title, location, price, type, area_sqft, bedrooms, bathrooms, description, image_url, is_featured, display_order) VALUES
('Brigade Gateway', 'Rajajinagar, Bangalore', '2.4 Cr', 'Commercial', 3200, 0, 2, 'Prime commercial office space in the heart of Bangalore with modern amenities and excellent connectivity.', '', true, 1),
('Prestige Lakeside', 'Whitefield, Bangalore', '1.8 Cr', 'Residential', 2400, 3, 3, 'Luxury 3BHK apartment overlooking the lake with premium finishes and a world-class clubhouse.', '', false, 2),
('Embassy Business Park', 'Outer Ring Road, Bangalore', 'On Request', 'Commercial', 5000, 0, 4, 'Grade-A commercial space in one of Bangalore''s most sought-after business parks.', '', true, 3);
