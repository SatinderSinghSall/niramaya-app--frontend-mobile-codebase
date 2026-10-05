export type AppPlatform = "android" | "ios";

export interface AppUpdateConfig {
  platform: AppPlatform;
  latestVersion: string;
  minSupportedVersion: string;
  forceUpdate: boolean;
  storeUrl: string;
  updateMessage: string;
}

export interface AppUpdateCheckData {
  config: AppUpdateConfig | null;

  currentVersion: string;

  updateAvailable: boolean;

  belowMinimum: boolean;

  forceUpdate: boolean;
}

export interface AppUpdateCheckResponse {
  success: boolean;

  data: {
    platform: AppPlatform;
    currentVersion: string;
    latestVersion: string;
    minSupportedVersion: string;
    updateAvailable: boolean;
    belowMinimum: boolean;
    forceUpdate: boolean;
    storeUrl: string;
    updateMessage: string;
  };

  message?: string;
}
