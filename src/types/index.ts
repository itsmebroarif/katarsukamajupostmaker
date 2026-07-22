export type AspectRatio = '1:1' | '4:5' | '9:16' | '1.91:1';

export type TemplateCategory =
  | 'pengumuman'
  | 'kegiatan'
  | 'hari_besar'
  | 'organisasi'
  | 'umkm'
  | 'pendidikan'
  | 'dokumentasi'
  | 'donasi'
  | 'blank';

export type SlideType =
  | 'intro'
  | 'content'
  | 'gallery'
  | 'video'
  | 'cta'
  | 'outro'
  | 'quote'
  | 'timeline'
  | 'statistic';

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  cardBg: string;
  text: string;
  textMuted: string;
  headingFont: string;
  bodyFont: string;
}

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  body?: string;
  badge?: string;
  bgType: 'solid' | 'gradient' | 'pattern' | 'image';
  bgColor?: string;
  bgGradient?: string;
  bgPattern?: string;
  bgImageUrl?: string;
  mediaType?: 'none' | 'image' | 'video';
  mediaUrl?: string;
  galleryImages?: string[];
  ctaPhone?: string;
  ctaIg?: string;
  ctaLocation?: string;
  ctaDate?: string;
  ctaQrText?: string;
  quoteAuthor?: string;
  statNumber?: string;
  statLabel?: string;
  listItems?: string[];
  locked?: boolean;
  hidden?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: TemplateCategory;
  aspectRatio: AspectRatio;
  themeId: string;
  logoType: 'default' | 'white' | 'black' | 'custom' | 'none';
  customLogoUrl?: string;
  orgName: string;
  author: string;
  captionText: string;
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
  slides: Slide[];
}

export interface Asset {
  id: string;
  name: string;
  type: 'logo' | 'background' | 'decoration' | 'icon' | 'user_upload';
  url: string;
  size?: number;
  mimeType?: string;
  createdAt: string;
}

export interface AppStats {
  totalProjects: number;
  totalDrafts: number;
  templatesUsed: number;
  storageUsedBytes: number;
}
