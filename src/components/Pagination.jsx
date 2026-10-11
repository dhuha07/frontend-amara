import { ChevronLeft, ChevronRight } from "lucide-react";

// Nomor halaman yang ditampilkan (maksimal 5, geser mengikuti halaman aktif)
function nomorHalaman(page, totalPages) {
  const maks = 5;
  let mulai = Math.max(1, page - 2);
  let akhir = Math.min(totalPages, mulai + maks - 1);
  mulai = Math.max(1, akhir - maks + 1);
  const hasil = [];
  for (let i = mulai; i <= akhir; i++) hasil.push(i);
  return hasil;
}

export default function Pagination({ page, totalItems, perPage = 10, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  if (totalItems === 0) return null;

  const dari = (page - 1) * perPage + 1;
  const sampai = Math.min(page * perPage, totalItems);

  const tombol =
    "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald md:min-h-[36px] md:min-w-[36px]";

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row md:px-5">
      <p className="text-sm text-gray-600">
        Menampilkan {dari}-{sampai} dari {totalItems} data
      </p>

      <nav className="flex items-center gap-1" aria-label="Navigasi halaman">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
          className={`${tombol} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <ChevronLeft size={18} />
        </button>

        {nomorHalaman(page, totalPages).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`${tombol} ${
              n === page
                ? "border-emerald bg-emerald text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
          className={`${tombol} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <ChevronRight size={18} />
        </button>
      </nav>
    </div>
  );
}