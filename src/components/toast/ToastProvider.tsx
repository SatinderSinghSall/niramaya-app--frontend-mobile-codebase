import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import Toast from "./Toast";

import type { ToastData, ToastOptions } from "./toast.types";

interface ToastContextType {
  show: (options: ToastOptions) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const toastId = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    toastId.current += 1;

    setToast({
      id: toastId.current,
      type: options.type ?? "info",
      position: options.position ?? "top",
      duration: options.duration ?? 3500,
      ...options,
    });
  }, []);

  const hide = useCallback(() => {
    setToast(null);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToast((current) => (current?.id === id ? null : current));
  }, []);

  const success = useCallback(
    (title: string, message?: string) => {
      show({ type: "success", title, message });
    },
    [show],
  );

  const error = useCallback(
    (title: string, message?: string) => {
      show({ type: "error", title, message });
    },
    [show],
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      show({ type: "warning", title, message });
    },
    [show],
  );

  const info = useCallback(
    (title: string, message?: string) => {
      show({ type: "info", title, message });
    },
    [show],
  );

  const value = useMemo(
    () => ({
      show,
      success,
      error,
      warning,
      info,
      hide,
    }),
    [show, success, error, warning, info, hide],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast && (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => dismiss(toast.id)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
