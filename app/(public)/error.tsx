"use client";

import StatusState from "@/components/layout/StatusState";

interface PublicErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicErrorBoundary({ error, reset }: PublicErrorProps) {
  void error;

  return (
    <StatusState
      variant="error"
      title="We lost our way for a moment"
      description="This storefront page could not be loaded correctly. Please try again."
      onAction={reset}
      actionLabel="Try again"
    />
  );
}
