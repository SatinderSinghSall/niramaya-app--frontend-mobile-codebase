import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/utils/tokenStorage";

const fallbackBaseURL =
  Platform.OS === "android"
    ? "http://10.5.122.231:5000/api/v1"
    : "http://10.5.122.231:5000/api/v1";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || fallbackBaseURL;

console.log("Niramaya API:", API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh");

    if (status !== 401 || isAuthRequest) {
      return Promise.reject(error);
    }

    if ((originalRequest as any)._retry) {
      return Promise.reject(error);
    }

    (originalRequest as any)._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = await getRefreshToken();

          if (!refreshToken) {
            throw new Error("No refresh token available.");
          }

          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const data = response.data?.data ?? response.data;

          const newAccessToken = data.accessToken;
          const newRefreshToken = data.refreshToken ?? refreshToken;

          await saveTokens(newAccessToken, newRefreshToken);

          return newAccessToken;
        })();
      }

      const newAccessToken = await refreshPromise;

      refreshPromise = null;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      await clearTokens();

      return Promise.reject(refreshError);
    }
  },
);
