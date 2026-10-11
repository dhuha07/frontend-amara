import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  FileText,
  MapPin,
  History,
  Save,
  Loader2,
  CircleAlert,
  FileX,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { fetchPengaduanById, updatePengaduan } from "../services/pengaduanService";
import { formatTanggal } from "../utils/formatDate";
import { STATUS_LIST, PRIORITAS_LIST } from "../utils/constants";

const kartu = "rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-5";
const inputKelas =
  "min-h-[44px] w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald";

function Judul({ icon: Icon, children }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon size={18} className="text-navy" aria-hidden="true" />
      <h3 className="text-base font-semibold text-gray-900">{children}</h3>
    </div>
  );
}

export default function DetailPengaduan() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [status, setStatus] = useState("");
  const [prioritas, setPrioritas] = useState("");
  const [catatan, setCatatan] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);

  // Ambil data pengaduan berdasarkan ID
  const muatData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchPengaduanById(id);
      setItem(data);
      if (data) {
        setStatus(data.status);
        setPrioritas(data.prioritas);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    muatData();
  }, [muatData]);

  // Simpan perubahan status, prioritas, dan catatan
  const simpan = async () => {
    setMenyimpan(true);
    try {
      const baru = await updatePengaduan(id, { status, prioritas, catatan });
      if (!baru) {
        toast.error("Pengaduan tidak ditemukan.");
        return;
      }
      setItem(baru);
      setCatatan("");
      toast.success("Status pengaduan berhasil diperbarui");
    } catch {
      toast.error("Gagal menyimpan perubahan. Silakan coba lagi.");
    } finally {
      setMenyimpan(false);
    }
  };

  // Tombol simpan aktif hanya jika ada perubahan
  const adaPerubahan =
    item && (status !== item.status || prioritas !== item.prioritas || catatan.trim() !== "");

  // Tautan WhatsApp pelapor (hanya angka nomor)
  const linkWa = item ? `https://wa.me/${item.noWa.replace(/\D/g, "")}` : "#";

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="mt-4 h-8 w-80" />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
          <div className="space-y-4 md:space-y-6 lg:col-span-2">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={CircleAlert}
            title="Gagal memuat detail pengaduan"
            description="Terjadi kendala saat mengambil data. Silakan coba lagi."
            actionLabel="Coba Lagi"
            onAction={muatData}
          />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={FileX}
            title="Pengaduan tidak ditemukan"
            description={`Pengaduan dengan ID ${id} tidak tersedia atau sudah dihapus.`}
          />
          <div className="flex justify-center pb-8">
            <Link
              to="/pengaduan"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-emerald px-4 text-sm font-medium text-white hover:bg-emerald-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
            >
              Kembali ke Daftar Pengaduan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Remah roti */}
      <nav aria-label="Jejak halaman" className="mb-3 flex flex-wrap items-center gap-1 text-sm text-gray-600">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <Link to="/pengaduan" className="hover:underline">Daftar Pengaduan</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span className="font-medium text-gray-900">{item.id}</span>
      </nav>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 md:mb-6">
        <div className="flex items-start gap-3">
          <Link
            to="/pengaduan"
            aria-label="Kembali ke daftar pengaduan"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Pengaduan</h2>
            <p className="mt-1 text-sm text-gray-600">{item.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge prioritas={item.prioritas} />
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Kolom kiri: informasi */}
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          <section className={kartu}>
            <Judul icon={User}>Info Pelapor</Judul>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-400">Nama</dt>
                <dd className="font-medium text-gray-900">{item.pelapor}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Nomor WhatsApp</dt>
                <dd className="font-medium text-gray-900">{item.noWa}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Kategori</dt>
                <dd className="font-medium text-gray-900">{item.kategori}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Tanggal Laporan</dt>
                <dd className="font-medium text-gray-900">{formatTanggal(item.tanggal)}</dd>
              </div>
            </dl>
            <a
              href={linkWa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Buka di WhatsApp
            </a>
          </section>

          <section className={kartu}>
            <Judul icon={FileText}>Isi Pengaduan</Judul>
            <p className="text-sm font-semibold text-gray-900">{item.judul}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.deskripsi}</p>
          </section>

          <section className={kartu}>
            <Judul icon={MapPin}>Lokasi</Judul>
            <p className="text-sm text-gray-900">{item.lokasi}</p>
          </section>

          <section className={kartu}>
            <Judul icon={History}>Riwayat Status</Judul>
            <ol className="relative ml-2 space-y-5 border-l-2 border-gray-200 pl-5">
              {[...item.riwayatStatus].reverse().map((r, i) => (
                <li key={`${r.waktu}-${i}`} className="relative">
                  <span
                    className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-navy"
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={r.status} />
                    <span className="text-xs text-gray-400">{formatTanggal(r.waktu)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{r.catatan}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Kolom kanan: form pembaruan */}
        <div className="lg:col-span-1">
          <section className={`${kartu} lg:sticky lg:top-20`}>
            <Judul icon={Save}>Perbarui Pengaduan</Judul>

            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-900">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputKelas}
                >
                  {STATUS_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="prioritas" className="mb-1 block text-sm font-medium text-gray-900">
                  Prioritas
                </label>
                <select
                  id="prioritas"
                  value={prioritas}
                  onChange={(e) => setPrioritas(e.target.value)}
                  className={inputKelas}
                >
                  {PRIORITAS_LIST.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="catatan" className="mb-1 block text-sm font-medium text-gray-900">
                  Catatan Internal
                </label>
                <textarea
                  id="catatan"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={4}
                  placeholder="Tulis catatan tindak lanjut (opsional)"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                />
              </div>

              <button
                type="button"
                onClick={simpan}
                disabled={menyimpan || !adaPerubahan}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-emerald px-4 text-sm font-medium text-white hover:bg-emerald-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {menyimpan ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} aria-hidden="true" />
                    Simpan Perubahan
                  </>
                )}
              </button>
              {!adaPerubahan && (
                <p className="text-center text-xs text-gray-400">
                  Ubah status, prioritas, atau isi catatan untuk menyimpan.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}