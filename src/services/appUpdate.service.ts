import Constants from "expo-constants";
import { Platform } from "react-native";

import { api } from "./api";

import type {
  AppPlatform,
  AppUpdateCheckData,
  AppUpdateCheckResponse,
} from "../types/appUpdate";

function getPlatform(): AppPlatform {
  return Platform.OS === "ios" ? "ios" : "android";
}

function getCurrentVersion(): string {
  return (
    Constants.expoConfig?.version ||
    Constants.manifest2?.extra?.expoClient?.version ||
    "1.0.0"
  );
}

export async function checkForAppUpdate(): Promise<AppUpdateCheckData> {
  const platform = getPlatform();

  const currentVersion = getCurrentVersion();

  const response = await api.get<AppUpdateCheckResponse>(
    `/app-config?platform=${platform}&version=${encodeURIComponent(
      currentVersion,
    )}`,
  );

  const data = response.data?.data;

  if (!data) {
    throw new Error("Invalid app update response.");
  }

  return {
    config: {
      platform: data.platform,

      latestVersion: data.latestVersion,

      minSupportedVersion: data.minSupportedVersion,

      forceUpdate: data.forceUpdate,

      storeUrl: data.storeUrl,

      updateMessage: data.updateMessage,
    },

    currentVersion: data.currentVersion || currentVersion,

    updateAvailable: Boolean(data.updateAvailable),

    belowMinimum: Boolean(data.belowMinimum),

    forceUpdate: Boolean(data.forceUpdate),
  };
}

export function getAppStoreUrl(update: AppUpdateCheckData): string | null {
  return update.config?.storeUrl || null;
}
