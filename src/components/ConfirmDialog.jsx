import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

// Kotak konfirmasi sebelum aksi penting (misalnya menonaktifkan pengguna)
export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  danger = true,
  onConfirm,
  onCancel,
}) {
  // Tutup dengan ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-konfirmasi"
        className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              danger ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            <AlertTriangle size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="judul-konfirmasi" className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{message}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[44px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              danger
                ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
                : "bg-emerald hover:bg-emerald-dark focus-visible:ring-emerald"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}