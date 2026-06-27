interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function HeroSkeleton() {
  return (
    <div className="section-container flex flex-col items-center py-32 gap-6 animate-pulse">
      <Skeleton className="w-28 h-28 rounded-full" />
      <Skeleton className="w-64 h-8 rounded-xl" />
      <Skeleton className="w-48 h-5 rounded-xl" />
      <Skeleton className="w-80 h-4 rounded-xl" />
      <div className="flex gap-4">
        <Skeleton className="w-32 h-11 rounded-xl" />
        <Skeleton className="w-32 h-11 rounded-xl" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 space-y-3 animate-pulse">
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-full h-3 rounded" />
          <Skeleton className="w-3/4 h-3 rounded" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="w-14 h-6 rounded-full" />
            <Skeleton className="w-14 h-6 rounded-full" />
            <Skeleton className="w-14 h-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminTableSkeleton({ cols = 4, rows = 5 }: { cols?: number; rows?: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 flex gap-8">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 w-16 rounded" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-5 py-4 flex gap-8">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className={`h-3 rounded ${j === 0 ? "w-32" : "w-24"}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminCardGridSkeleton({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols >= 3 ? "lg:grid-cols-3" : ""} gap-4 animate-pulse`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
          <div className="pt-2 border-t border-slate-100 flex gap-3">
            <Skeleton className="h-3 flex-1 rounded" />
            <Skeleton className="h-3 flex-1 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-8 ml-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-6">
          <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0 mt-1" />
          <div className="card p-5 flex-1 space-y-3">
            <Skeleton className="w-40 h-4 rounded" />
            <Skeleton className="w-24 h-3 rounded" />
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-5/6 h-3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
