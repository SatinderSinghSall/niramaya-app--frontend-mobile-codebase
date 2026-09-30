export type ExploreContentType = "yoga" | "ayurveda";

export interface ExploreItem {
  _id: string;

  title?: string;
  name?: string;

  description?: string;

  category?: string;

  /*
   * Content-specific type.
   *
   * For Yoga this may contain values such as:
   * - category/type information
   *
   * For Ayurveda this may contain:
   * - practice
   * - herb
   * - product
   * - routine
   * - nutrition
   * - knowledge
   */
  type?: string;

  /*
   * Search/recommendation result content type.
   *
   * This is what we use to determine whether the
   * result belongs to Yoga or Ayurveda.
   */
  resultType?: ExploreContentType;

  image?: string;
  imageUrl?: string;

  benefits?: string[];

  tags?: string[];

  difficulty?: string;

  duration?: number;
  durationMinutes?: number;

  instructions?: string[];

  precautions?: string[];

  suitableFor?: string[];

  notSuitableFor?: string[];

  createdAt?: string;
  updatedAt?: string;

  [key: string]: unknown;
}

export interface RecommendationItem extends ExploreItem {
  recommendationReason?: string;
  score?: number;
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
