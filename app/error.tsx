"use client";

import StatusState from "@/components/layout/StatusState";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorBoundary({ error, reset }: ErrorProps) {
  void error;

  return (
    <StatusState
      variant="error"
      title="The kingdom hit a little bump"
      description="Something unexpected happened while loading this page. You can safely try again."
      onAction={reset}
      actionLabel="Try again"
    />
  );
}
