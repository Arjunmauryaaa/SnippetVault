export default function SnippetSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="skeleton h-6 w-3/4 mb-2" />
            <div className="skeleton h-4 w-1/2" />
          </div>
          <div className="skeleton h-8 w-8 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-20 rounded-md" />
          <div className="skeleton h-5 w-14 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Code Preview */}
      <div className="bg-code-bg p-4 space-y-2">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-5/6" />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/30 flex items-center justify-between">
        <div className="skeleton h-4 w-24" />
        <div className="flex items-center gap-1">
          <div className="skeleton h-8 w-8 rounded" />
          <div className="skeleton h-8 w-8 rounded" />
          <div className="skeleton h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}
