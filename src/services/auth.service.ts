import { api } from "./api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";
import { clearTokens, saveTokens } from "@/utils/tokenStorage";

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await api.post("/auth/register", payload);

  const data = response.data?.data ?? response.data;

  const authResponse: AuthResponse = {
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };

  await saveTokens(authResponse.accessToken, authResponse.refreshToken);

  return authResponse;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post("/auth/login", payload);

  const data = response.data?.data ?? response.data;

  const authResponse: AuthResponse = {
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };

  await saveTokens(authResponse.accessToken, authResponse.refreshToken);

  return authResponse;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get("/auth/me");

  return response.data?.data?.user ?? response.data?.user ?? response.data;
}

export async function refreshAccessToken(): Promise<AuthResponse> {
  const { getRefreshToken } = await import("@/utils/tokenStorage");

  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  const response = await api.post("/auth/refresh", {
    refreshToken,
  });

  const data = response.data?.data ?? response.data;

  const authResponse: AuthResponse = {
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? refreshToken,
  };

  await saveTokens(authResponse.accessToken, authResponse.refreshToken);

  return authResponse;
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } finally {
    await clearTokens();
  }
}
