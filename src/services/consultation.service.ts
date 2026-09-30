import { api } from "./api";

import type {
  CancelConsultationPayload,
  Consultation,
  ConsultationListResponse,
  ConsultationStatus,
  CreateConsultationPayload,
  UpdateConsultationPayload,
} from "../types/consultation";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const createConsultation = async (
  payload: CreateConsultationPayload,
): Promise<Consultation> => {
  const response = await api.post<ApiResponse<Consultation>>(
    "/consultations",
    payload,
  );

  return response.data.data;
};

export const getConsultations = async (params?: {
  status?: ConsultationStatus;
  page?: number;
  limit?: number;
}): Promise<ConsultationListResponse> => {
  const response = await api.get<ApiResponse<ConsultationListResponse>>(
    "/consultations",
    {
      params,
    },
  );

  return response.data.data;
};

export const getConsultationById = async (
  consultationId: string,
): Promise<Consultation> => {
  const response = await api.get<ApiResponse<Consultation>>(
    `/consultations/${consultationId}`,
  );

  return response.data.data;
};

export const updateConsultation = async (
  consultationId: string,
  payload: UpdateConsultationPayload,
): Promise<Consultation> => {
  const response = await api.patch<ApiResponse<Consultation>>(
    `/consultations/${consultationId}`,
    payload,
  );

  return response.data.data;
};

export const cancelConsultation = async (
  consultationId: string,
  payload?: CancelConsultationPayload,
): Promise<Consultation> => {
  const response = await api.patch<ApiResponse<Consultation>>(
    `/consultations/${consultationId}/cancel`,
    payload ?? {},
  );

  return response.data.data;
};

export const completeConsultation = async (
  consultationId: string,
): Promise<Consultation> => {
  const response = await api.patch<ApiResponse<Consultation>>(
    `/consultations/${consultationId}/complete`,
  );

  return response.data.data;
};
