export interface Showcase {
  title: string;
  category: string;
  description: string;
  tag: string;
  coverImage?: string;
  mediaType: "image" | "video" | "figma" | "presentation" | "googleslides" | "powerpoint";
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

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  children: React.ReactNode;
}

export interface TimelineEntry {
  title: string;
  date: string;
  description: string;
}

export interface TimelineSection {
  heading: string;
  entries: TimelineEntry[];
}

