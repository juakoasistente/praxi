import { Loader } from "./loader"

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="h-4 w-48 rounded bg-muted" />
          </div>
        </div>
        <div className="h-9 w-32 rounded-md bg-muted" />
      </div>

      {/* Filter bar */}
      <div className="flex gap-3">
        <div className="h-9 flex-1 rounded-md bg-muted" />
        <div className="h-9 w-44 rounded-md bg-muted" />
        <div className="h-9 w-36 rounded-md bg-muted" />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        {/* Table header */}
        <div className="flex gap-4 border-b px-4 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 flex-1 rounded bg-muted" />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="flex gap-4 border-b last:border-0 px-4 py-4">
            {Array.from({ length: 5 }).map((_, col) => (
              <div key={col} className="h-4 flex-1 rounded bg-muted/60" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// For backwards compatibility, keep the old LoadingSkeleton but also provide new PageLoader
export { PageLoader } from './loader'
