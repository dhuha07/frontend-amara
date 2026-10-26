import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  History,
  FileText,
  Search,
  RefreshCw,
  CircleAlert,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EmptyState from "../components/EmptyState";
import { SkeletonRows } from "../components/Skeleton";
import { ambilRiwayatConsent } from "../services/consentService";
import { formatTanggal } from "../utils/formatDate";

const PER_HALAMAN = 10;

// Tab navigasi antara formulir dan riwayat
function Tab({ to, aktif, ikon: Ikon, children }) {
  return (
    <Link
      to={to}
      aria-current={aktif ? "page" : undefined}
      className={`flex min-h-[44px] items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
        aktif
          ? "border-emerald text-gray-900 dark:text-gray-100"
          : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      }`}
    >
      <Ikon size={16} aria-hidden="true" />
      {children}
    </Link>
  );
}

function Lencana({ status }) {
  const dicabut = String(status).toLowerCase() === "dicabut";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        dicabut
          ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300"
          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
      }`}
    >
      {status}
    </span>
  );
}

// NIK hanya ditampilkan 4 digit terakhir
const samarkanNik = (akhir) => (akhir ? `************${akhir}` : "-");

const kelasKolom =
  "w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald focus:ring-1 focus:ring-emerald dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:[color-scheme:dark]";

export default function ConsentRiwayat() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // null | "belum-aktif" | "gagal"
  const [kata, setKata] = useState("");
  const [status, setStatus] = useState("semua");
  const [halaman, setHalaman] = useState(1);

  const muat = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await ambilRiwayatConsent());
    } catch (e) {
      setError(e?.response?.status === 404 ? "belum-aktif" : "gagal");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  const tersaring = useMemo(() => {
    const q = kata.trim().toLowerCase();
    return data.filter((d) => {
      if (status !== "semua" && String(d.status).toLowerCase() !== status) return false;
      if (!q) return true;
      return [d.nama, d.alamat, d.id, d.nikAkhir].some((v) =>
        String(v ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, kata, status]);

  const totalHalaman = Math.max(1, Math.ceil(tersaring.length / PER_HALAMAN));
  const halamanAman = Math.min(halaman, totalHalaman);
  const awal = (halamanAman - 1) * PER_HALAMAN;
  const tampil = tersaring.slice(awal, awal + PER_HALAMAN);

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
      {/* Judul halaman */}
      <header className="mb-4 flex items-start justify-between gap-3 md:mb-5">
        <div className="flex min-w-0 items-start gap-3 md:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald text-white md:h-12 md:w-12">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl">
              Informed Consent
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Riwayat persetujuan yang sudah diberikan oleh pelapor.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={muat}
          disabled={loading}
          className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} aria-hidden="true" />
          <span className="hidden sm:inline">Muat Ulang</span>
        </button>
      </header>

      {/* Tab */}
      <nav
        className="mb-4 flex border-b border-gray-200 dark:border-gray-700 md:mb-5"
        aria-label="Bagian Informed Consent"
      >
        <Tab to="/consent" aktif={false} ikon={FileText}>
          Formulir
        </Tab>
        <Tab to="/consent/riwayat" aktif ikon={History}>
          Riwayat
        </Tab>
      </nav>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* Pencarian dan filter */}
        <div className="grid grid-cols-1 gap-3 border-b border-gray-200 p-4 dark:border-gray-700 sm:grid-cols-[1fr_200px] md:p-5">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={kata}
              onChange={(e) => {
                setKata(e.target.value);
                setHalaman(1);
              }}
              placeholder="Cari nama, alamat, atau 4 digit terakhir NIK"
              aria-label="Cari riwayat persetujuan"
              className={`${kelasKolom} pl-9 pr-3`}
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setHalaman(1);
            }}
            aria-label="Filter status persetujuan"
            className={`${kelasKolom} px-3`}
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="dicabut">Dicabut</option>
          </select>
        </div>

        {/* Isi */}
        {loading ? (
          <SkeletonRows rows={5} />
        ) : error === "belum-aktif" ? (
          <EmptyState
            icon={History}
            title="Riwayat belum aktif di server"
            description="Fitur penyimpanan persetujuan belum disiapkan di backend. Riwayat akan muncul di sini setelah aktif."
          />
        ) : error ? (
          <EmptyState
            icon={CircleAlert}
            title="Gagal memuat riwayat"
            description="Terjadi kendala saat mengambil data. Silakan coba lagi."
            actionLabel="Coba Lagi"
            onAction={muat}
          />
        ) : tersaring.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Belum ada riwayat"
            description={
              data.length === 0
                ? "Persetujuan yang disimpan akan tampil di sini."
                : "Tidak ada data yang cocok dengan pencarian atau filter."
            }
          />
        ) : (
          <>
            {/* Tampilan kartu (HP) */}
            <ul className="divide-y divide-gray-100 dark:divide-gray-700 md:hidden">
              {tampil.map((d) => (
                <li key={d.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {d.nama}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                        NIK {samarkanNik(d.nikAkhir)}
                      </p>
                    </div>
                    <Lencana status={d.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
                    {d.alamat}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {d.waktu ? formatTanggal(d.waktu) : "-"} · Versi {d.versi}
                  </p>
                </li>
              ))}
            </ul>

            {/* Tampilan tabel (tablet dan desktop) */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                    <th scope="col" className="px-5 py-3">Nama</th>
                    <th scope="col" className="px-5 py-3">NIK</th>
                    <th scope="col" className="px-5 py-3">Tanggal Lahir</th>
                    <th scope="col" className="px-5 py-3">Alamat</th>
                    <th scope="col" className="px-5 py-3">Disetujui</th>
                    <th scope="col" className="px-5 py-3">Versi</th>
                    <th scope="col" className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {tampil.map((d) => (
                    <tr key={d.id} className="text-gray-900 dark:text-gray-100">
                      <td className="px-5 py-3.5 font-medium">{d.nama}</td>
                      <td className="px-5 py-3.5 font-mono text-xs">{samarkanNik(d.nikAkhir)}</td>
                      <td className="px-5 py-3.5">{d.tglLahir ? formatTanggal(d.tglLahir) : "-"}</td>
                      <td className="max-w-[220px] truncate px-5 py-3.5" title={d.alamat}>
                        {d.alamat}
                      </td>
                      <td className="px-5 py-3.5">{d.waktu ? formatTanggal(d.waktu) : "-"}</td>
                      <td className="px-5 py-3.5">{d.versi}</td>
                      <td className="px-5 py-3.5">
                        <Lencana status={d.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Penomoran halaman */}
            <div className="flex flex-col gap-3 border-t border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between md:px-5">
              <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
                Menampilkan {awal + 1}-{awal + tampil.length} dari {tersaring.length} data
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHalaman(halamanAman - 1)}
                  disabled={halamanAman <= 1}
                  aria-label="Halaman sebelumnya"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <span className="min-w-[72px] text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                  {halamanAman} / {totalHalaman}
                </span>
                <button
                  type="button"
                  onClick={() => setHalaman(halamanAman + 1)}
                  disabled={halamanAman >= totalHalaman}
                  aria-label="Halaman berikutnya"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}