import { Inbox } from "lucide-react";

// Tampilan saat data kosong, tidak ditemukan, atau terjadi error
export default function EmptyState({
  icon: Icon = Inbox,
  title = "Data tidak ditemukan",
  description = "Belum ada data yang dapat ditampilkan.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <Icon size={28} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-600">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 min-h-[44px] rounded-lg bg-emerald px-4 py-2 text-sm font-medium text-white hover:bg-emerald-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}