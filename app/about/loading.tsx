import { CardGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="section-container py-20 space-y-12">
      <div className="space-y-3">
        <div className="skeleton w-20 h-3 rounded animate-pulse" />
        <div className="skeleton w-48 h-8 rounded-xl animate-pulse" />
      </div>
      <CardGridSkeleton count={6} />
    </div>
  );
}
