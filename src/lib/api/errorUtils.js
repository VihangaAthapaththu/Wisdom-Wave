import { toast } from "sonner";

/**
 * Normalize any Axios/network error into a consistent shape the UI can display.
 *
 * The backend returns errors as `{ status, message, statusCode?, errors? }`
 * with the correct HTTP status code. This reads the real message + status so
 * users see what actually went wrong instead of a generic string.
 *
 * @param {unknown} error - the caught error (usually an AxiosError)
 * @param {string} [fallback] - message to use when none can be extracted
 * @returns {{ status: number|null, message: string, fieldErrors: Record<string,string> }}
 */
export function getApiError(error, fallback = "Something went wrong. Please try again.") {
  // No response object → network / CORS / server unreachable
  if (error && error.request && !error.response) {
    return {
      status: null,
      message: "Cannot reach the server. Check your connection and try again.",
      fieldErrors: {},
    };
  }

  const response = error?.response;
  const data = response?.data;
  const status = response?.status ?? data?.statusCode ?? null;

  // Map any field-level validation errors (express-validator style)
  const fieldErrors = {};
  if (Array.isArray(data?.errors)) {
    for (const e of data.errors) {
      const field = e.field || e.param || e.path;
      if (field && !fieldErrors[field]) fieldErrors[field] = e.message || e.msg;
    }
  }

  const message =
    data?.message ||
    (Array.isArray(data?.errors) && data.errors[0]?.message) ||
    error?.message ||
    fallback;

  return { status, message, fieldErrors };
}

/**
 * Show a toast for an API error, including the HTTP status code so users and
 * developers can see exactly what failed.
 *
 * @param {unknown} error
 * @param {string} [fallback]
 * @returns {{ status: number|null, message: string, fieldErrors: Record<string,string> }}
 */
export function toastApiError(error, fallback) {
  const info = getApiError(error, fallback);
  const label = info.status ? `${info.message} (Error ${info.status})` : info.message;
  toast.error(label);
  return info;
}
