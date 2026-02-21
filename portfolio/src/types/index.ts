// Reconstructing your existing types and adding the new Blog types
export interface TimelineEntry {
  title: string;
  date: string;
  description: string | string[];
}

export interface TimelineSection {
  heading: string;
  entries: TimelineEntry[];
}

export interface Showcase {
  title: string;
  category: string;
  description: string;
  tag: string;
  coverImage?: string;
  mediaType: string;
  media: string | string[];
  challenge: string;
  process: string;
  outcome: string;
}

export interface CompanyProject {
  companyName: string;
  companyLogo: string;
  disclaimer: string;
  projects: Showcase[];
}

// --- NEW BLOG TYPES ---
export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string;
  photoCredit?: string;
  isPublished: boolean;
  createdAt: Date;
}

export interface BlogComment {
  _id?: string;
  postSlug: string;
  text: string;
  animalIdentity: string;
  animalIcon: string;
  createdAt: Date;
}