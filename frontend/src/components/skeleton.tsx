// Skeleton Loading Component
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  )
}

export function StoryCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border">
      <Skeleton className="h-56 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function StoryDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="w-full h-96 sm:h-[500px]" />
      <section className="px-4 sm:px-6 lg:px-8 py-12 -mt-32">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-8 mb-8 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>
      </section>
    </div>
  )
}

