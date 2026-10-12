import { api } from "@/services/api";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get<{ success?: boolean; data?: DashboardData }>(
    "/dashboard",
  );

  const dashboard = response.data?.data;

  if (!dashboard) {
    throw new Error("Invalid dashboard response");
  }

  return dashboard;
}
