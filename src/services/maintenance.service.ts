import { api } from "./api";

import type {
  MaintenanceApiResponse,
  MaintenanceConfig,
} from "../types/maintenance";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const value = error as {
      message?: unknown;
      error?: unknown;
    };

    if (typeof value.message === "string" && value.message.trim()) {
      return value.message;
    }

    if (typeof value.error === "string" && value.error.trim()) {
      return value.error;
    }
  }

  return fallback;
}

export async function getMaintenanceConfig(): Promise<MaintenanceConfig> {
  try {
    const response = await api.get<MaintenanceApiResponse>("/maintenance");

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Unable to check maintenance status.",
      );
    }

    return response.data.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to check maintenance status."),
    );
  }
}
