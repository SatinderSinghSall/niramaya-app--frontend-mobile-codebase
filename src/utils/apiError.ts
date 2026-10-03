import axios from "axios";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  code?: string;
  errors?: Record<string, string>;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  // ---------------------------------------------
  // Axios error
  // ---------------------------------------------
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    // No response = network / timeout / connection issue
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return "Request timed out. Please try again.";
      }

      if (error.code === "ERR_NETWORK") {
        return "Unable to connect to Niramaya. Please check your internet connection.";
      }

      return "Unable to connect to Niramaya. Please check your internet connection.";
    }

    const status = error.response.status;
    const data = error.response.data;

    // Backend explicitly provided a useful message
    if (data?.message) {
      return data.message;
    }

    // ---------------------------------------------
    // HTTP status fallback messages
    // ---------------------------------------------
    switch (status) {
      case 400:
        return "Invalid request. Please check your details.";

      case 401:
        return "Authentication required. Please sign in again.";

      case 403:
        return "You don't have permission to perform this action.";

      case 404:
        return "The requested resource was not found.";

      case 409:
        return "This request conflicts with existing data.";

      case 422:
        return "Please check the information you entered.";

      case 429:
        return "Too many requests. Please try again later.";

      case 500:
        return "Server Error. Please try again later.";

      case 501:
        return "This feature is not available on the server.";

      case 502:
        return "Server connection error. Please try again later.";

      case 503:
        return "Service is temporarily unavailable. Please try again later.";

      case 504:
        return "Server took too long to respond. Please try again.";

      case 505:
        return "Server does not support this request.";

      default:
        if (status >= 500) {
          return "Server Error. Please try again later.";
        }

        return fallback;
    }
  }

  // ---------------------------------------------
  // Normal JavaScript Error
  // ---------------------------------------------
  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};
