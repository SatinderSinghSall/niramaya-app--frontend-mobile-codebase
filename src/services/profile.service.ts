import { api } from "./api";

import {
  ChangePasswordPayload,
  DeleteAccountPayload,
  UpdateProfilePayload,
  UpdateSettingsPayload,
  UserProfile,
  UserSettings,
} from "../types/profile";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface MessageResponse {
  success: boolean;
  message?: string;
}

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<ApiResponse<UserProfile>>("/profile");

  return response.data.data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<UserProfile> => {
  const response = await api.patch<ApiResponse<UserProfile>>(
    "/profile",
    payload,
  );

  return response.data.data;
};

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<string> => {
  const response = await api.patch<MessageResponse>(
    "/profile/password",
    payload,
  );

  return response.data.message ?? "Password changed successfully.";
};

export const getSettings = async (): Promise<UserSettings> => {
  const response =
    await api.get<ApiResponse<UserSettings>>("/profile/settings");

  return response.data.data;
};

export const updateSettings = async (
  payload: UpdateSettingsPayload,
): Promise<UserSettings> => {
  const response = await api.patch<ApiResponse<UserSettings>>(
    "/profile/settings",
    payload,
  );

  return response.data.data;
};

export const deleteAccount = async (
  payload: DeleteAccountPayload,
): Promise<string> => {
  const response = await api.delete<MessageResponse>("/profile/account", {
    data: payload,
  });

  return response.data.message ?? "Account deactivated successfully.";
};
