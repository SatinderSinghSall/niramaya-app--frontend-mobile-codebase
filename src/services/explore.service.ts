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

export async function getYoga(params?: {
  category?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}): Promise<ExploreItem[]> {
  const response = await api.get("/yoga", {
    params,
  });

  return extractItems(getPayload(response));
}

export async function getYogaCategories(): Promise<CategoryItem[]> {
  const response = await api.get("/yoga/categories");

  const payload = getPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.categories ?? [];
}

export async function getFeaturedYoga(): Promise<ExploreItem[]> {
  const response = await api.get("/yoga/featured");

  return extractItems(getPayload(response));
}

/* -------------------------------------------------------------------------- */
/* Ayurveda                                                                   */
/* -------------------------------------------------------------------------- */

export async function getAyurveda(params?: {
  category?: string;
  ayurvedaType?: string;
  page?: number;
  limit?: number;
}): Promise<ExploreItem[]> {
  const response = await api.get("/ayurveda", {
    params,
  });

  return extractItems(getPayload(response));
}

export async function getAyurvedaCategories(): Promise<CategoryItem[]> {
  const response = await api.get("/ayurveda/categories");

  const payload = getPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.categories ?? [];
}

export async function getFeaturedAyurveda(): Promise<ExploreItem[]> {
  const response = await api.get("/ayurveda/featured");

  return extractItems(getPayload(response));
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

  /*
   * Backend response:
   *
   * {
   *   favorites: [
   *     {
   *       _id: "...",
   *       itemType: "yoga",
   *       item: "...",
   *       itemData: {
   *         _id: "...",
   *         title: "...",
   *         ...
   *       }
   *     }
   *   ],
   *   pagination: {...}
   * }
   */

  const favorites = Array.isArray(payload?.favorites) ? payload.favorites : [];

  return favorites
    .filter((favorite: any) => favorite?.itemData)
    .map((favorite: any) => ({
      ...favorite.itemData,

      /*
       * Preserve the actual favorite type.
       *
       * We use resultType in the frontend so that
       * Ayurveda items cannot accidentally be treated
       * as Yoga.
       */
      resultType: favorite.itemType,
    }));
}
