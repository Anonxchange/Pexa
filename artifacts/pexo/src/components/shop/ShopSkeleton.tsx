import { Skeleton } from "@/components/ui/skeleton";

export const ShopSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col">
          <Skeleton className="aspect-[3/4] w-full mb-3" />
          <Skeleton className="h-4 w-3/4 mb-1.5" />
          <Skeleton className="h-3 w-1/2 mb-3" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
};
