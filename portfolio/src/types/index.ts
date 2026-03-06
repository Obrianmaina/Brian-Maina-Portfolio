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

// --- UI COMPONENT TYPES ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}
