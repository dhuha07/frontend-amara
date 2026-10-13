import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Kartu angka ringkasan (KPI). Jika diberi "to", seluruh kartu bisa diklik.
const WARNA = {
  navy: "bg-blue-100 text-navy",
  emerald: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
};

export default function StatCard({ icon: Icon, label, value, trend, color = "navy", to }) {
  const isi = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${WARNA[color] || WARNA.navy}`}
            aria-hidden="true"
          >
            <Icon size={22} />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        {trend && <p className="text-xs text-gray-400">{trend}</p>}
        {to && <ChevronRight size={16} className="ml-auto shrink-0 text-gray-400" aria-hidden="true" />}
      </div>
    </>
  );

  const kelas = "block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm md:p-5";

  if (to) {
    return (
      <Link
        to={to}
        aria-label={`${label}: ${value}. Lihat daftar`}
        className={`${kelas} transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald`}
      >
        {isi}
      </Link>
    );
  }
  return <div className={kelas}>{isi}</div>;
}