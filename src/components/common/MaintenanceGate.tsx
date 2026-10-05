import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AppState, AppStateStatus } from "react-native";

import { getMaintenanceConfig } from "../../services/maintenance.service";

import type { MaintenanceConfig } from "../../types/maintenance";

import MaintenanceModal from "./MaintenanceModal";

interface MaintenanceGateProps {
  children: React.ReactNode;
}

/* ============================================================
   DATE / COUNTDOWN HELPERS
============================================================ */

function getRemainingSeconds(endDate: string | null): number | null {
  if (!endDate) {
    return null;
  }

  const end = new Date(endDate).getTime();

  if (Number.isNaN(end)) {
    return null;
  }

  return Math.max(0, Math.ceil((end - Date.now()) / 1000));
}

function formatCountdown(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor((totalSeconds % 86400) / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, "0")}h ${String(
      minutes,
    ).padStart(2, "0")}m`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
}

function formatEndDate(endDate: string | null): string {
  if (!endDate) {
    return "";
  }

  const date = new Date(endDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/* ============================================================
   COMPONENT
============================================================ */

export default function MaintenanceGate({ children }: MaintenanceGateProps) {
  const [maintenance, setMaintenance] = useState<MaintenanceConfig | null>(
    null,
  );

  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  const [checking, setChecking] = useState(false);

  const [error, setError] = useState("");

  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const appState = useRef<AppStateStatus>(AppState.currentState);

  const mounted = useRef(true);

  const checkRequest = useRef(false);

  /* ==========================================================
     CHECK MAINTENANCE
  ========================================================== */

  const checkMaintenance = useCallback(async (showLoader = false) => {
    if (checkRequest.current) {
      return;
    }

    checkRequest.current = true;

    try {
      if (showLoader) {
        setChecking(true);
      }

      setError("");

      const config = await getMaintenanceConfig();

      if (!mounted.current) {
        return;
      }

      setMaintenance(config);

      const isActive =
        Boolean(config?.configured) &&
        Boolean(config?.active) &&
        Boolean(config?.enabled);

      /*
       * Maintenance is not active.
       */
      if (!isActive) {
        setVisible(false);
        setRemainingSeconds(null);

        return;
      }

      /*
       * Maintenance is active.
       */
      setRemainingSeconds(getRemainingSeconds(config.endDate));

      /*
       * IMPORTANT:
       *
       * Every successful maintenance check while
       * active makes the modal visible again.
       *
       * Therefore Continue does not permanently
       * dismiss maintenance.
       */
      setVisible(true);
    } catch (err) {
      if (!mounted.current) {
        return;
      }

      /*
       * Do not block the app if the maintenance
       * endpoint itself cannot be reached.
       */
      setError(
        err instanceof Error
          ? err.message
          : "Unable to check maintenance status.",
      );
    } finally {
      checkRequest.current = false;

      if (mounted.current) {
        setLoading(false);
        setChecking(false);
      }
    }
  }, []);

  /* ==========================================================
     INITIAL CHECK
  ========================================================== */

  useEffect(() => {
    mounted.current = true;

    void checkMaintenance(true);

    return () => {
      mounted.current = false;
    };
  }, [checkMaintenance]);

  /* ==========================================================
     APP FOREGROUND CHECK
  ========================================================== */

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const wasBackgrounded =
        appState.current === "background" || appState.current === "inactive";

      const isForeground = nextState === "active";

      appState.current = nextState;

      /*
       * User has opened/resumed the app.
       *
       * Check the backend again.
       *
       * If maintenance is active,
       * the modal appears again even
       * if the user previously pressed
       * Continue.
       */
      if (wasBackgrounded && isForeground) {
        void checkMaintenance(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkMaintenance]);

  /* ==========================================================
     COUNTDOWN
  ========================================================== */

  useEffect(() => {
    if (!visible || !maintenance?.endDate) {
      return;
    }

    const updateCountdown = () => {
      const remaining = getRemainingSeconds(maintenance.endDate);

      setRemainingSeconds(remaining);

      /*
       * Countdown finished.
       *
       * Ask backend for the actual
       * maintenance state.
       */
      if (remaining !== null && remaining <= 0) {
        void checkMaintenance();
      }
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [visible, maintenance?.endDate, checkMaintenance]);

  /* ==========================================================
     BACKGROUND SAFETY REFRESH
  ========================================================== */

  useEffect(() => {
    /*
     * Check every minute while the application
     * remains open.
     *
     * This handles maintenance being enabled
     * while the user is already using the app.
     */
    const timer = setInterval(() => {
      if (appState.current === "active") {
        void checkMaintenance();
      }
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [checkMaintenance]);

  /* ==========================================================
     DERIVED VALUES
  ========================================================== */

  const restricted = maintenance?.allowUserAccess === false;

  const countdownText = useMemo(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) {
      return null;
    }

    return formatCountdown(remainingSeconds);
  }, [remainingSeconds]);

  const endDateText = useMemo(() => {
    return formatEndDate(maintenance?.endDate ?? null);
  }, [maintenance?.endDate]);

  const title = maintenance?.title?.trim() || "Maintenance in Progress";

  const message =
    maintenance?.message?.trim() ||
    "Niramaya is currently undergoing maintenance. We appreciate your patience.";

  /* ==========================================================
     CONTINUE
  ========================================================== */

  function handleContinue() {
    /*
     * Restricted users can never
     * dismiss the modal.
     */
    if (restricted) {
      return;
    }

    setVisible(false);
  }

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  /*
   * Don't delay the application while the
   * first maintenance request is running.
   *
   * The modal will appear immediately after
   * the API responds.
   */
  if (loading) {
    return <>{children}</>;
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      {children}

      <MaintenanceModal
        visible={visible}
        restricted={restricted}
        title={title}
        message={message}
        countdownText={countdownText}
        endDateText={endDateText}
        checking={checking}
        error={error}
        onContinue={handleContinue}
      />
    </>
  );
}
