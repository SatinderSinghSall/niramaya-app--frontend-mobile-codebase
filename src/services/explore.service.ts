import { api } from "@/services/api";

import { CategoryItem, ExploreItem, RecommendationItem } from "@/types/explore";

/* -------------------------------------------------------------------------- */
/* Response helpers                                                           */
/* -------------------------------------------------------------------------- */

function getPayload(response: any) {
  return response.data?.data ?? response.data;
}

function extractItems(payload: any): ExploreItem[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.yoga)) {
    return payload.yoga;
  }

  if (Array.isArray(payload?.ayurveda)) {
    return payload.ayurveda;
  }

  return [];
}

/* -------------------------------------------------------------------------- */
/* Recommendations                                                           */
/* -------------------------------------------------------------------------- */

export async function getRecommendations(
  type: "all" | "yoga" | "ayurveda" = "all",
  limit = 10,
): Promise<RecommendationItem[]> {
  const response = await api.get("/recommendations", {
    params: {
      type,
      limit,
    },
  });

  const payload = getPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.recommendations)) {
    return payload.recommendations;
  }

  if (type === "yoga" && Array.isArray(payload?.yoga)) {
    return payload.yoga;
  }

  if (type === "ayurveda" && Array.isArray(payload?.ayurveda)) {
    return payload.ayurveda;
  }

  return [];
}

/* -------------------------------------------------------------------------- */
/* Yoga                                                                       */
/* -------------------------------------------------------------------------- */

export interface YogaListParams {
  search?: string;
  category?: string;
  type?: string;
  difficulty?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface YogaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface YogaListResult {
  items: ExploreItem[];
  pagination: YogaPagination;
}

export async function getYoga(params?: YogaListParams): Promise<ExploreItem[]> {
  const response = await api.get("/yoga", {
    params,
  });

  return extractItems(getPayload(response));
}

export async function getYogaPage(
  params?: YogaListParams,
): Promise<YogaListResult> {
  const response = await api.get("/yoga", {
    params,
  });

  const payload = getPayload(response);

  const items = extractItems(payload);

  return {
    items,
    pagination: {
      page: Number(payload?.pagination?.page ?? params?.page ?? 1),
      limit: Number(payload?.pagination?.limit ?? params?.limit ?? 10),
      total: Number(payload?.pagination?.total ?? items.length),
      totalPages: Number(
        payload?.pagination?.totalPages ??
          Math.max(
            1,
            Math.ceil(
              Number(payload?.pagination?.total ?? items.length) /
                Number(payload?.pagination?.limit ?? params?.limit ?? 10),
            ),
          ),
      ),
    },
  };
}

export async function getYogaCategories(): Promise<CategoryItem[]> {
  const response = await api.get("/yoga/categories");

  const payload = getPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  return Array.isArray(payload?.categories) ? payload.categories : [];
}

export async function getFeaturedYoga(): Promise<ExploreItem[]> {
  const response = await api.get("/yoga/featured");

  return extractItems(getPayload(response));
}

export async function incrementYogaViewCount(
  id: string,
): Promise<number | null> {
  const response = await api.post(`/yoga/${id}/view`);

  const payload = getPayload(response);

  return typeof payload?.viewCount === "number" ? payload.viewCount : null;
}

/* -------------------------------------------------------------------------- */
/* Ayurveda                                                                   */
/* -------------------------------------------------------------------------- */

export interface AyurvedaListParams {
  search?: string;
  category?: string;
  type?: string;
  difficulty?: string;
  dosha?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface AyurvedaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AyurvedaListResult {
  items: ExploreItem[];
  pagination: AyurvedaPagination;
}

export async function getAyurveda(
  params?: AyurvedaListParams,
): Promise<ExploreItem[]> {
  const response = await api.get("/ayurveda", {
    params,
  });

  return extractItems(getPayload(response));
}

export async function getAyurvedaPage(
  params?: AyurvedaListParams,
): Promise<AyurvedaListResult> {
  const response = await api.get("/ayurveda", {
    params,
  });

  const payload = getPayload(response);

  const items = extractItems(payload);

  const page = Number(payload?.pagination?.page ?? params?.page ?? 1);

  const limit = Number(payload?.pagination?.limit ?? params?.limit ?? 10);

  const total = Number(payload?.pagination?.total ?? items.length);

  const totalPages = Number(
    payload?.pagination?.totalPages ?? Math.max(1, Math.ceil(total / limit)),
  );

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getAyurvedaCategories(): Promise<CategoryItem[]> {
  const response = await api.get("/ayurveda/categories");

  const payload = getPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  return Array.isArray(payload?.categories) ? payload.categories : [];
}

export async function getFeaturedAyurveda(): Promise<ExploreItem[]> {
  const response = await api.get("/ayurveda/featured");

  return extractItems(getPayload(response));
}

export async function getAyurvedaRecommendations(
  limit = 10,
): Promise<RecommendationItem[]> {
  return getRecommendations("ayurveda", limit);
}

export async function incrementAyurvedaViewCount(
  id: string,
): Promise<number | null> {
  const response = await api.post(`/ayurveda/${id}/view`);

  const payload = getPayload(response);

  return typeof payload?.viewCount === "number" ? payload.viewCount : null;
}

export async function getAyurvedaById(id: string): Promise<ExploreItem> {
  const response = await api.get(`/ayurveda/${id}`);
  const payload = getPayload(response);

  return (payload?.item ?? payload?.ayurveda ?? payload) as ExploreItem;
}

/* -------------------------------------------------------------------------- */
/* Individual items                                                           */
/* -------------------------------------------------------------------------- */

export async function getYogaRecommendation(id: string): Promise<ExploreItem> {
  const response = await api.get(`/yoga/${id}`);

  return getPayload(response);
}

export async function getAyurvedaRecommendation(
  id: string,
): Promise<ExploreItem> {
  const response = await api.get(`/ayurveda/${id}`);

  return getPayload(response);
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

export async function searchExplore(params: {
  q: string;
  type?: "all" | "yoga" | "ayurveda";
  category?: string;
  difficulty?: string;
  ayurvedaType?: string;
  page?: number;
  limit?: number;
}): Promise<ExploreItem[]> {
  const response = await api.get("/search", {
    params,
  });

  return extractItems(getPayload(response));
}

/* -------------------------------------------------------------------------- */
/* Favorites                                                                  */
/* -------------------------------------------------------------------------- */

export async function getFavorites(): Promise<ExploreItem[]> {
  const response = await api.get("/favorites");

  const payload = getPayload(response);

  const favorites = Array.isArray(payload?.favorites) ? payload.favorites : [];

  return favorites
    .filter((favorite: any) => favorite?.itemData)
    .map((favorite: any) => ({
      ...favorite.itemData,
      resultType: favorite.itemType,
    }));
}
