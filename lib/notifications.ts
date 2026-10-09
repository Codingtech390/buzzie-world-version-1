import { toast } from "sonner";

function getMessage(error: unknown, fallback: string): string {
  const message = error instanceof Error ? error.message : fallback;
  const normalized = message.toLowerCase();

  if (
    normalized.includes("unauthorized") ||
    normalized.includes("unauthenticated") ||
    normalized.includes("not authenticated") ||
    normalized.includes("please sign in") ||
    normalized.includes("login required") ||
    normalized.includes("401")
  ) {
    return "Please sign in to continue.";
  }

  return message.trim() || fallback;
}

export const notify = {
  success(message: string) {
    toast.success(message);
  },

  error(error: unknown, fallback = "Something went wrong. Please try again.") {
    toast.error(getMessage(error, fallback));
  },

  info(message: string) {
    toast.info(message);
  },

  loading(message: string) {
    return toast.loading(message);
  },

  dismiss(id?: string | number) {
    toast.dismiss(id);
  },
};
