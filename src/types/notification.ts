export type NotificationType =
  | "goal"
  | "progress"
  | "consultation"
  | "yoga"
  | "ayurveda"
  | "general"
  | "system";

export type NotificationActionType =
  | "goal"
  | "progress"
  | "consultation"
  | "yoga"
  | "ayurveda"
  | "dashboard"
  | "none";

export interface NotificationAction {
  type?: NotificationActionType;
  referenceId?: string | null;
  route?: string | null;
}

export interface Notification {
  _id: string;
  user: string;

  type: NotificationType;

  title: string;
  message: string;

  isRead: boolean;
  readAt?: string | null;

  action?: NotificationAction | null;

  metadata?: Record<string, unknown>;

  expiresAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: NotificationPagination;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  read?: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface MarkAllReadResponse {
  modifiedCount: number;
}

export interface DeleteReadResponse {
  deletedCount: number;
}
