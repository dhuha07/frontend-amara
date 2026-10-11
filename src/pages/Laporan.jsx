import { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  CircleAlert,
} from "lucide-react";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import Skeleton, { SkeletonCard } from "../components/Skeleton";
import { fetchLaporan } from "../services/laporanService";
import { RENTANG } from "../data/laporanData";
import { CHART_COLORS } from "../utils/constants";

const kartu = "rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-5";

// Bungkus nilai CSV agar aman dari koma dan tanda kutip
const sel = (v) => `"${String(v).replace(/"/g, '""')}"`;

// Susun dan unduh laporan sebagai file CSV (bisa dibuka di Excel)
function unduhCsv(lap) {
  const status = lap.status || {};
  const perPeriode = lap.perPeriode || [];
  const kategori = lap.kategori || [];

  const baris = [
    ["Laporan AMARA Bot - DPMP4KB Kota Magelang"],
    ["Rentang waktu", lap.labelRentang || lap.rentang || "Semua"],
    ["Dibuat pada", new Date().toLocaleString("id-ID")],
    [],
    ["RINGKASAN"],
    ["Total pengaduan", lap.total || 0],
    ["Selesai", status.selesai || 0],
    ["Diproses", status.diproses || 0],
    ["Darurat", status.darurat || 0],
    ["Ditolak", status.ditolak || 0],
    [],
    [lap.judulGrafik ? lap.judulGrafik.toUpperCase() : "GRAFIK PERIODE"],
    ["Periode", "Jumlah"],
    ...perPeriode.map((p) => [p.label || "", p.jumlah || 0]),
    [],
    ["PENGADUAN PER KATEGORI"],
    ["Kategori", "Jumlah"],
    ...kategori.map((k) => [k.nama || k.kategori || "", k.jumlah || 0]),
  ];

  const isi = "\uFEFF" + baris.map((b) => b.map(sel).join(",")).join("\r\n");
  const blob = new Blob([isi], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `laporan-amara-${lap.rentang || "data"}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Laporan() {
  const [tglMulai, setTglMulai] = useState("");
  const [tglSelesai, setTglSelesai] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const muatData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchLaporan({ tgl_mulai: tglMulai || undefined, tgl_selesai: tglSelesai || undefined });
      setData(res);
    } catch (err) {
      console.error("LAPORAN ERROR:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [tglMulai, tglSelesai]);

  useEffect(() => {
    muatData();
  }, [muatData]);

  const unduh = () => {
    if (!data) {
      toast.error("Data belum dimuat.");
      return;
    }
    try {
      unduhCsv(data);
      toast.success("Laporan berhasil diunduh.");
    } catch (e) {
      console.error(e);
      toast.error("Gagal mengunduh file.");
    }
  };

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={CircleAlert}
            title="Gagal memuat laporan"
            description="Terjadi kendala saat mengambil data. Silakan coba lagi."
            actionLabel="Coba Lagi"
            onAction={muatData}
          />
        </div>
      </div>
    );
  }

  const persenSelesai =
    data && data.total > 0 ? Math.round((data.status.selesai / data.total) * 100) : 0;
  const totalKategori = data ? data.kategori.reduce((n, k) => n + k.jumlah, 0) : 0;
  const lebar = data && data.perPeriode.length > 8; // 12 bulan: grafik digeser di layar kecil

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 md:mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Laporan</h2>
          <p className="mt-1 text-sm text-gray-600">
            Analisis pengaduan yang masuk melalui AMARA Bot.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={tglMulai}
            onChange={(e) => setTglMulai(e.target.value)}
            className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900"
          />
          <span className="text-sm text-gray-500">s.d.</span>
          <input
            type="date"
            value={tglSelesai}
            onChange={(e) => setTglSelesai(e.target.value)}
            className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900"
          />

          <button
            type="button"
            onClick={muatData}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={16} />
          </button>

          <button
            type="button"
            onClick={unduh}
            className="flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald px-4 text-sm font-medium text-white"
          >
            <Download size={16} />
            Unduh
          </button>
        </div>
      </div>

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {loading || !data ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={FileText}
              label="Total Pengaduan"
              value={data.total}
              trend={data.labelRentang}
              color="navy"
            />
            <StatCard
              icon={CheckCircle2}
              label="Selesai"
              value={data.status.selesai}
              trend={`${persenSelesai}% dari total`}
              color="emerald"
            />
            <StatCard
              icon={Clock}
              label="Sedang Diproses"
              value={data.status.diproses}
              trend="Masih ditangani petugas"
              color="amber"
            />
            <StatCard
              icon={AlertTriangle}
              label="Darurat"
              value={data.status.darurat}
              trend={`${data.status.ditolak} laporan ditolak`}
              color="red"
            />
          </>
        )}
      </div>

      {/* Grafik */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 lg:grid-cols-5">
        {/* Grafik batang */}
        <section className={`${kartu} lg:col-span-3`}>
          <h3 className="text-base font-semibold text-gray-900">
            {data ? data.judulGrafik : "Jumlah Pengaduan"}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">Jumlah laporan yang masuk pada tiap periode</p>

          {loading || !data ? (
            <Skeleton className="mt-4 h-72 w-full" />
          ) : data.perPeriode.length === 0 ? (
            <div className="flex h-72 items-center justify-center rounded-lg border-2 border-dashed border-gray-100 bg-gray-50/50">
               <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">Maaf, data tidak tersedia</p>
                  <p className="text-xs text-gray-500">Tidak ada pengaduan pada rentang tanggal ini.</p>
               </div>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <div className={`h-72 ${lebar ? "min-w-[560px]" : ""}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.perPeriode} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#4b5563" }} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#4b5563" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "#f3f4f6" }}
                      formatter={(v) => [v, "Pengaduan"]}
                      contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }}
                    />
                    <Bar dataKey="jumlah" name="Pengaduan" fill="#1e3a8a" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        {/* Grafik lingkaran */}
        <section className={`${kartu} lg:col-span-2`}>
          <h3 className="text-base font-semibold text-gray-900">Pengaduan per Kategori</h3>
          <p className="mt-0.5 text-xs text-gray-400">Sebaran laporan berdasarkan bidang layanan</p>

          {loading || !data ? (
            <Skeleton className="mt-4 h-72 w-full" />
          ) : (
            <>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.kategori}
                      dataKey="jumlah"
                      nameKey="nama"
                      innerRadius={52}
                      outerRadius={88}
                      paddingAngle={2}
                      stroke="#ffffff"
                    >
                      {data.kategori.map((k, i) => (
                        <Cell key={k.nama} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, nama) => [v, nama]}
                      contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legenda */}
              <ul className="mt-3 space-y-2">
                {data.kategori.map((k, i) => (
                  <li key={k.nama} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        aria-hidden="true"
                      />
                      <span className="truncate text-gray-600">{k.nama}</span>
                    </span>
                    <span className="shrink-0 font-medium text-gray-900">
                      {k.jumlah}{" "}
                      <span className="font-normal text-gray-400">
                        ({totalKategori > 0 ? Math.round((k.jumlah / totalKategori) * 100) : 0}%)
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}