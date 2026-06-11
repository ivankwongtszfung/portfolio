// Shared content types for the portfolio.
// All data in this folder is sourced from Ivan's resume and his own project
// documentation/repos. No speculative claims — every metric traces to a source.

export interface SocialLink {
  label: string;
  href: string;
  kind: "github" | "linkedin" | "email" | "resume";
}

export interface Profile {
  name: string;
  handle: string;
  title: string;
  location: string;
  tagline: string;
  summary: string;
  links: SocialLink[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  team?: string;
  start: string; // e.g. "Sep 2024"
  end: string; // e.g. "Present"
  location: string;
  highlights: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface EducationItem {
  school: string;
  credential: string;
  period: string;
}

export interface Project {
  name: string;
  blurb: string;
  description: string;
  stack: string[];
  visibility: "public" | "private";
  href?: string; // only set for public repos that can actually be opened
  highlights?: string[];
}

export interface Article {
  slug: string;
  title: string;
  source: string; // which job/project the learning came from
  period: string;
  tags: string[];
  summary: string;
  body: string; // markdown
}
