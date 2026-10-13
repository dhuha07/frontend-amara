import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Bell,
  CircleAlert,
  ChevronRight,
  Inbox,
  RefreshCw,
} from "lucide-react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { SkeletonCard, SkeletonRows } from "../components/Skeleton";
import { fetchDashboard } from "../services/dashboardService";
import { formatTanggal } from "../utils/formatDate";

// Ikon dan warna untuk setiap jenis notifikasi
const NOTIF_STYLE = {
  darurat: { icon: AlertTriangle, warna: "bg-red-100 text-red-800" },
  baru: { icon: FileText, warna: "bg-blue-100 text-navy" },
  pesan: { icon: MessageSquare, warna: "bg-amber-100 text-amber-800" },
  tindak: { icon: Clock, warna: "bg-amber-100 text-amber-800" },
  selesai: { icon: CheckCircle2, warna: "bg-emerald-100 text-emerald-800" },
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Ambil data dashboard dari service
  const muatData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const hasil = await fetchDashboard();
      setData(hasil);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);

  // Tampilan saat error
  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <EmptyState
            icon={CircleAlert}
            title="Gagal memuat dashboard"
            description="Terjadi kendala saat mengambil data. Silakan coba lagi."
            actionLabel="Coba Lagi"
            onAction={muatData}
          />
        </div>
      </div>
    );
  }

  const kpi = data?.kpi;
  const persenSelesai =
    kpi && kpi.total > 0 ? Math.round((kpi.selesai / kpi.total) * 100) : 0;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3 md:mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Ringkasan pengaduan yang masuk melalui AMARA Bot.
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

      {/* 4 kartu ringkasan: klik untuk membuka daftar pengaduan terfilter */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {loading || !kpi ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={FileText}
              label="Total Pengaduan"
              value={kpi.total}
              trend="Seluruh laporan yang tercatat"
              color="navy"
              to="/pengaduan"
            />
            <StatCard
              icon={Clock}
              label="Sedang Diproses"
              value={kpi.diproses}
              trend="Menunggu tindak lanjut petugas"
              color="amber"
              to="/pengaduan?status=Diproses"
            />
            <StatCard
              icon={CheckCircle2}
              label="Selesai"
              value={kpi.selesai}
              trend={`${persenSelesai}% dari total laporan`}
              color="emerald"
              to="/pengaduan?status=Selesai"
            />
            <StatCard
              icon={AlertTriangle}
              label="Darurat"
              value={kpi.darurat}
              trend="Perlu penanganan segera"
              color="red"
              to="/pengaduan?status=Darurat"
            />
          </>
        )}
      </div>

      {/* Dua kolom: notifikasi dan laporan terbaru */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 lg:grid-cols-2">
        {/* Notifikasi Penting */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 p-4 md:px-5">
            <Bell size={18} className="text-navy" aria-hidden="true" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Notifikasi Penting</h3>
          </div>

          {loading ? (
            <SkeletonRows rows={5} />
          ) : data?.notifikasi?.length ? (
            <ul className="divide-y divide-gray-100">
              {data.notifikasi.slice(0, 5).map((n) => {
                const gaya = NOTIF_STYLE[n.tipe] || NOTIF_STYLE.baru;
                const Ikon = gaya.icon;
                return (
                  <li key={n.id} className="flex items-start gap-3 p-4 md:px-5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${gaya.warna}`}
                      aria-hidden="true"
                    >
                      <Ikon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">{n.teks}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{formatTanggal(n.waktu)}</p>
                    </div>
                    <Link
                      to={n.tautan}
                      className="flex min-h-[44px] shrink-0 items-center rounded-lg px-2 text-sm font-medium text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                    >
                      Lihat
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={Bell}
              title="Belum ada notifikasi"
              description="Notifikasi penting akan muncul di sini."
            />
          )}
        </section>

        {/* Laporan Terbaru */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 p-4 md:px-5">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-navy" aria-hidden="true" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Laporan Terbaru</h3>
            </div>
            <Link
              to="/pengaduan"
              className="flex min-h-[44px] items-center gap-1 text-sm font-medium text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              Semua
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <SkeletonRows rows={5} />
          ) : data?.laporanTerbaru?.length ? (
            <ul className="divide-y divide-gray-100">
              {data.laporanTerbaru.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/pengaduan/${p.id}`}
                    className="flex items-start justify-between gap-3 p-4 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald md:px-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{p.judul}</p>
                      <p className="mt-0.5 truncate text-xs text-gray-600 dark:text-gray-300">
                        {p.id} · {p.pelapor}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">{formatTanggal(p.tanggal)}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Inbox}
              title="Belum ada laporan"
              description="Laporan yang masuk melalui WhatsApp akan tampil di sini."
            />
          )}
        </section>
      </div>
    </div>
  );
}