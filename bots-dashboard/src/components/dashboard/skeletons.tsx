const Pulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-2xl bg-white/[0.05] ${className}`} />
);

export const DashboardSkeleton = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10" aria-busy="true" aria-live="polite">
    <span className="sr-only">Loading the floor</span>
    <div className="flex items-end justify-between">
      <div className="space-y-3">
        <Pulse className="h-3 w-24 rounded-full" />
        <Pulse className="h-8 w-40" />
      </div>
      <Pulse className="h-10 w-36 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 6 }, (_, index) => (
        <Pulse key={index} className="h-[84px]" />
      ))}
    </div>
    <Pulse className="h-28" />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Pulse key={index} className="h-52" />
      ))}
    </div>
  </div>
);
