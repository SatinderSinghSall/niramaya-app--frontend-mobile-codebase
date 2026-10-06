import { api } from "./api";

import type {
  HealthWellnessTip,
  HealthWellnessTipCategory,
  HealthWellnessTipFeaturedResponse,
  HealthWellnessTipListData,
  HealthWellnessTipListResponse,
  HealthWellnessTipResponse,
  HealthWellnessTipType,
} from "../types/healthWellnessTip";

export interface GetHealthWellnessTipsParams {
  category?: HealthWellnessTipCategory;
  type?: HealthWellnessTipType;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

const ENDPOINT = "/health-wellness-tips";

function buildQuery(params: GetHealthWellnessTipsParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.featured !== undefined) {
    searchParams.set("featured", String(params.featured));
  }

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export async function getActiveHealthWellnessTips(
  params: GetHealthWellnessTipsParams = {},
): Promise<HealthWellnessTipListData> {
  const query = buildQuery(params);

  const response = await api.get<HealthWellnessTipListResponse>(
    `${ENDPOINT}${query}`,
  );

  return response.data.data;
}

export async function getFeaturedHealthWellnessTips(
  limit = 5,
): Promise<HealthWellnessTip[]> {
  const response = await api.get<HealthWellnessTipFeaturedResponse>(
    `${ENDPOINT}/featured?limit=${limit}`,
  );

  return response.data.data;
}

export async function getActiveHealthWellnessTip(
  id: string,
): Promise<HealthWellnessTip> {
  const response = await api.get<HealthWellnessTipResponse>(
    `${ENDPOINT}/${id}`,
  );

  return response.data.data;
}
