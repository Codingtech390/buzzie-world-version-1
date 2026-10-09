export default function AccountLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading account">
      <div className="h-44 animate-pulse rounded-[30px] border border-[#ECE8F2] bg-white" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-[24px] border border-[#ECE8F2] bg-white"
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-64 animate-pulse rounded-[26px] border border-[#ECE8F2] bg-white" />
        <div className="h-64 animate-pulse rounded-[26px] border border-[#ECE8F2] bg-[#F7F4FB]" />
      </div>
    </div>
  );
}
