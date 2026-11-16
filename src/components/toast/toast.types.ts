export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition = "top" | "bottom";

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: ToastPosition;

  action?: {
    label: string;
    onPress: () => void;
  };
}

export interface ToastData extends ToastOptions {
  id: number;
}
