import { ButtonHTMLAttributes } from "react";

export interface TimelineEntry {
  title: string;
  date: string;
  description: string | string[];
}

export interface TimelineSection {
  heading: string;
  entries: TimelineEntry[];
}

export interface CaseStudyDetails {
  role: string;
  duration: string;
  tools: string[];
  problemStatement: string;
  problemImages?: string[];
  userResearch?: string;
  researchImages?: string[];
  wireframesText?: string;
  wireframesImages?: string[];
  designSystemText?: string;
  designSystemImage?: string;
  learnings?: string;
}

export interface Showcase {
  _id?: string;
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
  caseStudy?: CaseStudyDetails;
  brandDetails?: {
    colors?: string[];
    mockups?: string[]; 
  };
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
  description: string; // Custom summary for the blog tiles
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

export interface Invoice {
  _id?: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: "USD" | "KES" | "GBP"; 
  isInternational: boolean;
  status: "pending" | "paid";
  createdAt: Date;
  paidAt?: Date;
}


// src/types/index.ts
export interface PricingItem {
  name: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface PricingList {
  _id?: string;
  title: string;
  clientName: string;
  clientEmail: string;
  currency: string; // e.g., 'USD', 'KES', 'EUR'
  items: PricingItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface CatalogPrices {
  KES: number;
  USD: number;
  EUR: number;
  GBP: number;
}

export interface CatalogService {
  _id?: string;
  name: string;
  category: string;
  prices: CatalogPrices;
}

export interface CatalogBundle {
  _id?: string;
  name: string;
  description: string;
  includedServices: string[];
  prices: CatalogPrices;
}


// Add this below your existing types in src/types/index.ts
export interface Quote {
  _id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed Won' | 'Closed Lost';
  notes?: string;
  lastContactedDate?: string;
  createdAt: string;
}

// --- UI COMPONENT TYPES ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}
