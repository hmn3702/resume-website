import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="section-container py-20 space-y-12 animate-pulse">
      <div className="space-y-3 max-w-xl">
        <Skeleton className="w-20 h-3 rounded" />
        <Skeleton className="w-40 h-8 rounded-xl" />
        <Skeleton className="w-64 h-4 rounded" />
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton className="w-full h-11 rounded-xl" />
          <Skeleton className="w-full h-11 rounded-xl" />
          <Skeleton className="w-full h-32 rounded-xl" />
          <Skeleton className="w-32 h-11 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="w-48 h-5 rounded" />
          <Skeleton className="w-56 h-4 rounded" />
          <Skeleton className="w-44 h-4 rounded" />
        </div>
      </div>
    </div>
  );
}
