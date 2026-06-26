import { CardGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="section-container py-20 space-y-12">
      <div className="space-y-3">
        <div className="skeleton w-28 h-3 rounded animate-pulse" />
        <div className="skeleton w-64 h-8 rounded-xl animate-pulse" />
      </div>
      <CardGridSkeleton count={2} />
      <CardGridSkeleton count={6} />
    </div>
  );
}
