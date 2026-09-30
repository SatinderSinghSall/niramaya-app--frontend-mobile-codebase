export type ConsultationType = "online" | "offline";

export type ConsultationStatus =
  | "requested"
  | "confirmed"
  | "rescheduled"
  | "completed"
  | "cancelled";

export interface Consultant {
  name?: string;
  specialization?: string;
  contact?: string;
}

export interface Consultation {
  _id: string;
  user: string;

  consultationType: ConsultationType;

  preferredDate: string;
  preferredTime: string;

  concern: string;
  goals: string[];
  notes?: string | null;

  status: ConsultationStatus;

  consultant?: Consultant | null;

  scheduledAt?: string | null;
  cancellationReason?: string | null;
  completedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationPayload {
  consultationType: ConsultationType;
  preferredDate: string;
  preferredTime: string;
  concern: string;
  goals?: string[];
  notes?: string;
}

export interface UpdateConsultationPayload {
  consultationType?: ConsultationType;
  preferredDate?: string;
  preferredTime?: string;
  concern?: string;
  goals?: string[];
  notes?: string;
}

export interface CancelConsultationPayload {
  reason?: string;
}

export interface ConsultationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ConsultationListResponse {
  consultations: Consultation[];
  pagination: ConsultationPagination;
}
