import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="section-container py-16 sm:py-24 space-y-12 sm:space-y-16">
      <div className="space-y-3">
        <Skeleton className="w-20 h-3 rounded animate-pulse" />
        <Skeleton className="w-44 h-8 sm:h-14 rounded-lg animate-pulse" />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-96 rounded-2xl md:col-span-2" />
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}
