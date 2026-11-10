import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6 bg-[#fcfcfc] dark:bg-background min-h-screen">
      <Skeleton className="h-10 w-64 bg-gray-200 dark:bg-muted" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 bg-gray-200 dark:bg-muted" />
        <Skeleton className="h-32 bg-gray-200 dark:bg-muted" />
        <Skeleton className="h-32 bg-gray-200 dark:bg-muted" />
      </div>
      <Skeleton className="h-64 w-full bg-gray-200 dark:bg-muted" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-muted" />
        <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-muted" />
        <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-muted" />
      </div>
    </div>
  );
}

export function ChartPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6 bg-[#fcfcfc] dark:bg-background min-h-screen">
      <Skeleton className="h-10 w-48 bg-gray-200 dark:bg-muted" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton className="h-24 bg-gray-200 dark:bg-muted" />
        <Skeleton className="h-24 bg-gray-200 dark:bg-muted" />
        <Skeleton className="h-24 bg-gray-200 dark:bg-muted" />
        <Skeleton className="h-24 bg-gray-200 dark:bg-muted" />
      </div>
      <Skeleton className="h-80 w-full bg-gray-200 dark:bg-muted" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48 bg-gray-200 dark:bg-muted" />
        <Skeleton className="h-48 bg-gray-200 dark:bg-muted" />
      </div>
    </div>
  );
}

export function WalletPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-background">
      <div className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl">
        <Skeleton className="h-9 w-40 mb-6 sm:mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          {/* Main */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Tabs */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
            {/* Wallet header card */}
            <div className="rounded-2xl border border-border bg-white dark:bg-card overflow-hidden">
              <div className="p-6 space-y-4 border-b border-border">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-48" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                      <Skeleton className="h-3 w-14 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShopPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1.5">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        {/* Search + sort + tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-44 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        {/* Category pills */}
        <div className="flex gap-2 mb-6 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
          ))}
        </div>
        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="aspect-square w-full rounded-xl mb-3" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      <div className="relative h-56 bg-gradient-to-br from-[#e8f5d0] via-[#f0fce8] to-[#dff0f8] dark:from-[#1a2410] dark:via-[#111a0d] dark:to-[#0d1a1f]" />
      <div className="max-w-5xl mx-auto px-4 lg:px-6 pb-6">
        <div className="relative -mt-14 mb-6">
          <div className="bg-white dark:bg-card border border-slate-100 dark:border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <Skeleton className="w-24 h-24 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2.5 pt-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-52" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
              </div>
              <Skeleton className="h-9 w-28 rounded-xl self-start sm:self-auto" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-card border border-slate-100 dark:border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-2.5 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-card border border-slate-100 dark:border-border rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex gap-3 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="w-28 h-20 rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-card border border-slate-100 dark:border-border rounded-2xl p-4 mb-5 shadow-sm">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <div className="flex gap-1 p-1 bg-white dark:bg-card border border-slate-100 dark:border-border rounded-xl mb-5 shadow-sm">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="flex-1 h-9 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-card border border-slate-100 dark:border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-7 w-16 rounded-lg" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
