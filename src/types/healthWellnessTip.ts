export type HealthWellnessTipCategory =
  | "nutrition"
  | "fitness"
  | "yoga"
  | "ayurveda"
  | "mental-wellbeing"
  | "sleep"
  | "stress-management"
  | "lifestyle"
  | "preventive-care"
  | "personal-care"
  | "healthy-habits"
  | "general-wellness";

export type HealthWellnessTipType =
  | "tip"
  | "guide"
  | "lesson"
  | "routine"
  | "exercise"
  | "practice"
  | "warning"
  | "educational";

export type HealthWellnessTipDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced";

export interface HealthWellnessTipImage {
  enabled: boolean;
  url?: string;
  altText?: string;
  caption?: string;
  credit?: string;
}

export interface HealthWellnessTipSource {
  name?: string;
  url?: string;
  accessedAt?: string | null;
}

export interface HealthWellnessTipReference {
  title: string;
  source?: string;
  url?: string;
  publishedDate?: string | null;
}

export interface HealthWellnessTipReviewer {
  name?: string;
  qualification?: string;
  reviewedAt?: string | null;
}

export interface HealthWellnessTipAction {
  enabled: boolean;
  label?: string;
  route?: string;
}

export interface HealthWellnessTip {
  _id: string;

  title: string;
  shortDescription: string;
  content: string;
  highlights: string[];

  category: HealthWellnessTipCategory;
  type: HealthWellnessTipType;
  tags: string[];

  image: HealthWellnessTipImage;
  thumbnailUrl?: string;

  source: HealthWellnessTipSource;
  references: HealthWellnessTipReference[];

  disclaimer?: string;
  safetyNote?: string;

  reviewed: boolean;
  reviewedBy?: HealthWellnessTipReviewer;

  readTimeMinutes: number;
  difficulty: HealthWellnessTipDifficulty;

  isActive: boolean;
  featured: boolean;
  priority: number;

  startDate: string;
  endDate?: string | null;

  action: HealthWellnessTipAction;

  createdAt: string;
  updatedAt: string;
}

export interface HealthWellnessTipPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HealthWellnessTipListData {
  items: HealthWellnessTip[];
  pagination: HealthWellnessTipPagination;
}

export interface HealthWellnessTipListResponse {
  success: boolean;
  data: HealthWellnessTipListData;
}

export interface HealthWellnessTipResponse {
  success: boolean;
  data: HealthWellnessTip;
}

export interface HealthWellnessTipFeaturedResponse {
  success: boolean;
  data: HealthWellnessTip[];
}
