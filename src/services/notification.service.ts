import { api } from "./api";

import {
  DeleteReadResponse,
  MarkAllReadResponse,
  Notification,
  NotificationListParams,
  NotificationListResponse,
  UnreadCountResponse,
} from "../types/notification";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Get paginated notifications.
 */
export const getNotifications = async (
  params: NotificationListParams = {},
): Promise<NotificationListResponse> => {
  const response = await api.get<ApiResponse<NotificationListResponse>>(
    "/notifications",
    {
      params,
    },
  );

  return response.data.data;
};

/**
 * Get unread notification count.
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get<ApiResponse<UnreadCountResponse>>(
    "/notifications/unread-count",
  );

  return response.data.data.unreadCount;
};

/**
 * Get one notification.
 */
export const getNotificationById = async (
  notificationId: string,
): Promise<Notification> => {
  const response = await api.get<ApiResponse<Notification>>(
    `/notifications/${notificationId}`,
  );

  return response.data.data;
};

/**
 * Mark one notification as read.
 */
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<Notification> => {
  const response = await api.patch<ApiResponse<Notification>>(
    `/notifications/${notificationId}/read`,
  );

  return response.data.data;
};

/**
 * Mark all notifications as read.
 */
export const markAllNotificationsAsRead =
  async (): Promise<MarkAllReadResponse> => {
    const response = await api.patch<ApiResponse<MarkAllReadResponse>>(
      "/notifications/read-all",
    );

    return response.data.data;
  };

/**
 * Delete one notification.
 */
export const deleteNotification = async (
  notificationId: string,
): Promise<void> => {
  await api.delete(`/notifications/${notificationId}`);
};

/**
 * Delete all read notifications.
 */
export const deleteReadNotifications =
  async (): Promise<DeleteReadResponse> => {
    const response = await api.delete<ApiResponse<DeleteReadResponse>>(
      "/notifications/read",
    );

    return response.data.data;
  };
