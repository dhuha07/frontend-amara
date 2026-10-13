// Kotak abu-abu berkedip sebagai tanda data sedang dimuat
export default function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} aria-hidden="true" />;
}

// Kerangka kartu KPI
export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm md:p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-16" />
      <Skeleton className="mt-4 h-3 w-32" />
    </div>
  );
}

// Kerangka daftar/tabel
export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="space-y-3 p-4 md:p-5" role="status" aria-label="Memuat data">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}