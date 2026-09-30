import { api } from "@/services/api";
import {
  ProgressEntry,
  ProgressFormData,
  ProgressHistoryResponse,
  ProgressSummary,
} from "@/types/progress";

const getPayload = (response: any) =>
  response?.data?.data ?? response?.data ?? response;

export async function getProgressHistory(params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<ProgressHistoryResponse> {
  const response = await api.get("/progress", {
    params,
  });

  return getPayload(response);
}

export async function getProgressSummary(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<ProgressSummary> {
  const response = await api.get("/progress/summary", {
    params,
  });

  return getPayload(response);
}

export async function getProgressById(id: string): Promise<ProgressEntry> {
  const response = await api.get(`/progress/${id}`);

  return getPayload(response);
}

export async function createProgress(
  data: ProgressFormData,
): Promise<ProgressEntry> {
  const response = await api.post("/progress", data);

  return getPayload(response);
}

export async function updateProgress(
  id: string,
  data: ProgressFormData,
): Promise<ProgressEntry> {
  const response = await api.patch(`/progress/${id}`, data);

  return getPayload(response);
}

export async function deleteProgress(id: string): Promise<{ message: string }> {
  const response = await api.delete(`/progress/${id}`);

  return getPayload(response);
}
