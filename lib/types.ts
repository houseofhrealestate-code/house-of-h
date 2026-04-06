export interface Venture {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  button_text: string;
  button_link: string;
  image_url: string;
  bg_gradient: string;
  pattern_style: string;
  pattern_size: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  image_url: string;
  initials: string;
  initials_bg: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stat {
  id: string;
  count: number;
  suffix: string;
  label: string;
  display_order: number;
  created_at: string;
}

export interface SiteContent {
  id: string;
  value: string;
  updated_at: string;
}

export interface Submission {
  id: number;
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface REProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ContentMap = Record<string, string>;
