import { useCallback, useEffect, useState } from "react";

import { AppState, AppStateStatus } from "react-native";

import AppUpdateModal from "./AppUpdateModal";

import { checkForAppUpdate } from "../../services/appUpdate.service";

import type { AppUpdateCheckData } from "../../types/appUpdate";

export default function AppUpdateGate() {
  const [update, setUpdate] = useState<AppUpdateCheckData | null>(null);

  const [visible, setVisible] = useState(false);

  const checkUpdate = useCallback(async () => {
    try {
      const result = await checkForAppUpdate();

      const shouldShow =
        Boolean(result.config) &&
        (result.updateAvailable || result.belowMinimum);

      if (!shouldShow) {
        setUpdate(null);
        setVisible(false);
        return;
      }

      setUpdate(result);
      setVisible(true);
    } catch (error) {
      /*
       * Update checking must never prevent
       * the application from opening.
       */
      console.log("App update check failed:", error);
    }
  }, []);

  useEffect(() => {
    void checkUpdate();

    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          void checkUpdate();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [checkUpdate]);

  const handleLater = useCallback(() => {
    /*
     * Mandatory updates cannot be dismissed.
     *
     * Mandatory means:
     * - below minimum version
     * - OR admin enabled Force Update
     */
    if (update?.forceUpdate || update?.belowMinimum) {
      return;
    }

    setVisible(false);
  }, [update]);

  return (
    <AppUpdateModal visible={visible} update={update} onLater={handleLater} />
  );
}
