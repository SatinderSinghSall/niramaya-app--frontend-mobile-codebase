export interface MaintenanceConfig {
  configured: boolean;
  active: boolean;
  enabled: boolean;
  allowUserAccess: boolean;
  title: string | null;
  message: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface MaintenanceApiResponse {
  success: boolean;
  data: MaintenanceConfig;
  message?: string;
}
