import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  RotateCcw,
  ArrowUpDown,
  CircleAlert,
  SearchX,
  RefreshCw,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import { SkeletonRows } from "../components/Skeleton";
import { fetchPengaduan } from "../services/pengaduanService";
import { formatTanggalSingkat } from "../utils/formatDate";
import {
  STATUS_LIST,
  KATEGORI_LIST,
  PRIORITAS_LIST,
  ROWS_PER_PAGE,
} from "../utils/constants";

const selectKelas =
  "min-h-[44px] w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald";

export default function Pengaduan() {
  // Filter status, kategori, dan prioritas disimpan di alamat (?status=Darurat)
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "";
  const kategori = params.get("kategori") || "";
  const prioritas = params.get("prioritas") || "";

  const [semua, setSemua] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [cari, setCari] = useState("");
  const [kataKunci, setKataKunci] = useState(""); // hasil debounce 300 ms
  const [terbaruDulu, setTerbaruDulu] = useState(true);
  const [page, setPage] = useState(1);

  // Ambil data pengaduan
  const muatData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setSemua(await fetchPengaduan());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);

  // Tunda pencarian 300 ms agar tidak menyaring di setiap ketikan
  useEffect(() => {
    const t = setTimeout(() => setKataKunci(cari.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [cari]);

  // Kembali ke halaman 1 saat filter berubah
  useEffect(() => {
    setPage(1);
  }, [status, kategori, prioritas, kataKunci, terbaruDulu]);

  const ubahFilter = (kunci, nilai) => {
    const baru = new URLSearchParams(params);
    if (nilai) baru.set(kunci, nilai);
    else baru.delete(kunci);
    setParams(baru, { replace: true });
  };

  const adaFilter = Boolean(status || kategori || prioritas || cari);

  const resetFilter = () => {
    setParams({}, { replace: true });
    setCari("");
    setKataKunci("");
  };

  // Saring dan urutkan data
  const hasil = useMemo(() => {
    const disaring = semua.filter((p) => {
      if (status && p.status !== status) return false;
      if (kategori && p.kategori !== kategori) return false;
      if (prioritas && p.prioritas !== prioritas) return false;
      if (kataKunci) {
        const gabungan = `${p.judul} ${p.pelapor} ${p.id}`.toLowerCase();
        if (!gabungan.includes(kataKunci)) return false;
      }
      return true;
    });
    return disaring.sort((a, b) =>
      terbaruDulu
        ? new Date(b.tanggal) - new Date(a.tanggal)
        : new Date(a.tanggal) - new Date(b.tanggal)
    );
  }, [semua, status, kategori, prioritas, kataKunci, terbaruDulu]);

  const baris = hasil.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <EmptyState
            icon={CircleAlert}
            title="Gagal memuat daftar pengaduan"
            description="Terjadi kendala saat mengambil data. Silakan coba lagi."
            actionLabel="Coba Lagi"
            onAction={muatData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3 md:mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Daftar Pengaduan</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Kelola laporan yang masuk melalui AMARA Bot.
          </p>
        </div>
        <button
          type="button"
          onClick={muatData}
          disabled={loading}
          className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} aria-hidden="true" />
          <span className="hidden sm:inline">Muat Ulang</span>
        </button>
      </div>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        {/* Pencarian dan filter */}
        <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 p-4 md:p-5">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari judul, nama pelapor, atau ID pengaduan"
              aria-label="Cari pengaduan"
              className="min-h-[44px] w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={status}
              onChange={(e) => ubahFilter("status", e.target.value)}
              aria-label="Filter status"
              className={selectKelas}
            >
              <option value="">Semua Status</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={kategori}
              onChange={(e) => ubahFilter("kategori", e.target.value)}
              aria-label="Filter kategori"
              className={selectKelas}
            >
              <option value="">Semua Kategori</option>
              {KATEGORI_LIST.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>

            <select
              value={prioritas}
              onChange={(e) => ubahFilter("prioritas", e.target.value)}
              aria-label="Filter prioritas"
              className={selectKelas}
            >
              <option value="">Semua Prioritas</option>
              {PRIORITAS_LIST.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={resetFilter}
              disabled={!adaFilter}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Reset Filter
            </button>
          </div>
        </div>

        {/* Tabel */}
        {loading ? (
          <SkeletonRows rows={6} />
        ) : hasil.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Pengaduan tidak ditemukan"
            description="Tidak ada data yang cocok dengan pencarian atau filter Anda."
            actionLabel={adaFilter ? "Reset Filter" : undefined}
            onAction={adaFilter ? resetFilter : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold md:px-5">ID</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Pelapor</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Kategori</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Judul</th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-semibold"
                      aria-sort={terbaruDulu ? "descending" : "ascending"}
                    >
                      <button
                        type="button"
                        onClick={() => setTerbaruDulu((v) => !v)}
                        title={terbaruDulu ? "Urut dari terbaru" : "Urut dari terlama"}
                        className="flex items-center gap-1 rounded uppercase tracking-wide hover:text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                      >
                        Tanggal
                        <ArrowUpDown size={14} aria-hidden="true" />
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">Prioritas</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-4 py-3 font-semibold md:px-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {baris.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-gray-100 md:px-5">
                        {p.id}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.pelapor}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.kategori}</td>
                      <td className="max-w-[260px] px-4 py-3 text-gray-900 dark:text-gray-100">
                        <p className="line-clamp-2">{p.judul}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                        {formatTanggalSingkat(p.tanggal)}
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge prioritas={p.prioritas} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 md:px-5">
                        <Link
                          to={`/pengaduan/${p.id}`}
                          className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-navy hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald md:min-h-[36px]"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalItems={hasil.length}
              perPage={ROWS_PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}