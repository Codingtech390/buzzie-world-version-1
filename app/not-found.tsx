import StatusState from "@/components/layout/StatusState";

export default function NotFound() {
  return (
    <StatusState
      variant="empty"
      title="That page wandered off"
      description="The page you're looking for doesn't exist or may have moved somewhere else in the BuzzieWorld kingdom."
      actionLabel="Back to BuzzieWorld"
      actionHref="/"
    />
  );
}
