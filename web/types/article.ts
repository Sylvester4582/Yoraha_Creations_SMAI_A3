export type Category =
  | "AI & Machine Learning"
  | "Startups & Business"
  | "Gadgets & Hardware"
  | "Software & Apps"
  | "General Tech";

export type SourceName = "TechCrunch" | "The Verge" | "YourStory";

export interface Article {
  id: string;
  title: string;
  link: string;
  published: string;
  source: SourceName;
  category: Category;
  confidence: number;
  content: string;
}

export interface ArticlesResponse {
  articles: Article[];
  fetchedAt: string;
  total: number;
}

export interface SummarizeResponse {
  summary: string;
}

export const CATEGORIES: Category[] = [
  "AI & Machine Learning",
  "Startups & Business",
  "Gadgets & Hardware",
  "Software & Apps",
  "General Tech",
];

export const SOURCES: SourceName[] = ["TechCrunch", "The Verge", "YourStory"];

export const SOURCE_COLORS: Record<SourceName, string> = {
  TechCrunch: "#3fb950",
  "The Verge": "#f97316",
  YourStory: "#bc8cff",
};

export const SOURCE_SHORT: Record<SourceName, string> = {
  TechCrunch: "TC",
  "The Verge": "VG",
  YourStory: "YS",
};

export const CAT_COLORS: Record<Category, string> = {
  "AI & Machine Learning": "#58a6ff",
  "Startups & Business": "#3fb950",
  "Gadgets & Hardware": "#e3b341",
  "Software & Apps": "#bc8cff",
  "General Tech": "#6e7681",
};

export const CAT_SHORT: Record<Category, string> = {
  "AI & Machine Learning": "AI",
  "Startups & Business": "BIZ",
  "Gadgets & Hardware": "HW",
  "Software & Apps": "SW",
  "General Tech": "TECH",
};
