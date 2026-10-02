export type ExploreContentType = "yoga" | "ayurveda";

export interface RecommendedFor {
  energyLevels?: string[];

  // Ayurveda-specific
  digestion?: string[];

  stressLevels?: string[];
  sleepQualities?: string[];
  activityLevels?: string[];
  yogaExperience?: string[];
  concerns?: string[];
  goalCategories?: string[];
}

export interface ExploreItem {
  _id: string;

  title?: string;
  name?: string;

  slug?: string;

  description?: string;

  // Ayurveda-specific
  shortDescription?: string;

  category?: string;

  /*
   * Content-specific type.
   *
   * Yoga:
   * pose | practice | routine | breathing | meditation | knowledge
   *
   * Ayurveda:
   * practice | herb | product | routine | nutrition | knowledge
   */
  type?: string;

  /*
   * Search/recommendation result content type.
   */
  resultType?: ExploreContentType;

  image?: string;
  imageUrl?: string;

  videoUrl?: string;

  benefits?: string[];

  instructions?: string[];

  precautions?: string[];

  contraindications?: string[];

  suitableFor?: string[];

  notSuitableFor?: string[];

  equipment?: string[];

  bodyFocus?: string[];

  tags?: string[];

  difficulty?: "beginner" | "intermediate" | "advanced" | string;

  duration?: number | string;
  durationMinutes?: number;

  recommendedFor?: RecommendedFor;

  isActive?: boolean;
  isFeatured?: boolean;

  viewCount?: number;

  createdAt?: string;
  updatedAt?: string;

  // ─────────────────────────
  // AYURVEDA-SPECIFIC FIELDS
  // ─────────────────────────

  bestTime?: string[];

  frequency?: string;

  preparation?: string;

  usage?: string;

  howToUse?: string[];

  doshas?: string[];

  prakriti?: string[];

  properties?: {
    rasa?: string[];
    guna?: string[];
    virya?: string;
    vipaka?: string;
  };

  bodySystems?: string[];

  wellnessGoals?: string[];

  ingredients?: {
    name?: string;
    description?: string;
    quantity?: string;
    form?: string;
  }[];

  traditionalUseNote?: string;

  evidenceNote?: string;

  sources?: {
    title?: string;
    url?: string;
    publisher?: string;
  }[];

  [key: string]: unknown;
}

export interface RecommendationItem extends ExploreItem {
  recommendationReason?: string;
  score?: number;
  recommendationScore?: number;
  resultType?: ExploreContentType;
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[];

  yoga?: RecommendationItem[];

  ayurveda?: RecommendationItem[];
}

export interface CategoryItem {
  name?: string;

  value?: string;

  label?: string;

  slug?: string;

  key?: string;

  category?: string;

  count?: number;

  [key: string]: unknown;
}

export interface ExploreListResponse {
  items: ExploreItem[];

  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
