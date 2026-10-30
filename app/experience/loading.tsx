import { TimelineSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="section-container py-20 space-y-12">
      <div className="space-y-3">
        <Skeleton className="w-24 h-3 rounded animate-pulse" />
        <Skeleton className="w-56 h-8 sm:h-14 rounded-lg animate-pulse" />
      </div>
      <TimelineSkeleton count={4} />
    </div>
  );
}
