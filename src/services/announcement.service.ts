import { api } from "./api";

import type { Announcement } from "@/types/announcement";

interface AnnouncementResponse {
  success: boolean;
  data: Announcement[];
  message?: string;
}

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  try {
    const response = await api.get<AnnouncementResponse>("/announcements");

    const payload = response.data;

    if (!payload?.success) {
      throw new Error(payload?.message || "Unable to load announcements.");
    }

    if (!Array.isArray(payload.data)) {
      throw new Error("The server returned an invalid announcements response.");
    }

    return payload.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to load announcements. Please try again.");
  }
}
