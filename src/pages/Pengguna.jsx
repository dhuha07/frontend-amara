import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  UserPlus,
  Search,
  Pencil,
  UserX,
  UserCheck,
  Trash2,
  X,
  Loader2,
  CircleAlert,
  SearchX,
  RefreshCw,
  RotateCcw,
  Users,
} from "lucide-react";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { SkeletonRows } from "../components/Skeleton";
import {
  fetchPengguna,
  tambahPengguna,
  ubahPengguna,
  ubahStatusPengguna,
  hapusPengguna,
} from "../services/penggunaService";
import { formatTanggal } from "../utils/formatDate";
import { PERAN_LIST, ROWS_PER_PAGE } from "../utils/constants";

const inputKelas =
  "min-h-[44px] w-full rounded-lg border bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald";

const PERAN_STYLE = {
  "Super Admin": "bg-blue-100 text-navy",
  Admin: "bg-emerald-100 text-emerald-800",
  Petugas: "bg-gray-100 text-gray-700",
};

const STATUS_PENGGUNA_STYLE = {
  Aktif: "bg-emerald-100 text-emerald-800",
  Nonaktif: "bg-gray-100 text-gray-700",
};

const Lencana = ({ gaya, children }) => (
  <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${gaya}`}>
    {children}
  </span>
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- Formulir tambah / ubah pengguna (modal) ----------
function FormPengguna({ mode, pengguna, onSimpan, onTutup }) {
  const [nama, setNama] = useState(pengguna?.nama || "");
  const [email, setEmail] = useState(pengguna?.email || "");
  const [peran, setPeran] = useState(pengguna?.peran || "Petugas");
  const [password, setPassword] = useState("");
  const [galat, setGalat] = useState({});
  const [menyimpan, setMenyimpan] = useState(false);

  // Tutup dengan ESC dan kunci scroll halaman
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !menyimpan) onTutup();
    };
    document.addEventListener("keydown", onKey);
    const awal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = awal;
    };
  }, [menyimpan, onTutup]);

  const validasi = () => {
    const e = {};
    if (nama.trim().length < 3) e.nama = "Nama minimal 3 karakter.";
    if (!email.trim()) e.email = "Email wajib diisi.";
    else if (!EMAIL_REGEX.test(email.trim())) e.email = "Format email tidak valid.";
    if (!PERAN_LIST.includes(peran)) e.peran = "Pilih peran pengguna.";
    if (mode === "tambah" && password.length < 6) e.password = "Password minimal 6 karakter.";
    return e;
  };

  const kirim = async (ev) => {
    ev.preventDefault();
    const e = validasi();
    setGalat(e);
    if (Object.keys(e).length > 0) return;

    setMenyimpan(true);
    try {
      const data = { nama, email, peran };
      if (mode === "tambah") data.password = password;
      await onSimpan(data);
    } catch (err) {
      const pesan = err?.message || "Gagal menyimpan data pengguna.";
      if (pesan.toLowerCase().includes("email")) setGalat({ email: pesan });
      else toast.error(pesan);
      setMenyimpan(false);
    }
  };

  const judul = mode === "tambah" ? "Tambah Pengguna" : "Ubah Pengguna";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={() => !menyimpan && onTutup()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-form-pengguna"
        onSubmit={kirim}
        noValidate
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-lg sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="judul-form-pengguna" className="text-lg font-semibold text-gray-900">
            {judul}
          </h2>
          <button
            type="button"
            onClick={onTutup}
            disabled={menyimpan}
            aria-label="Tutup formulir"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="f-nama" className="mb-1 block text-sm font-medium text-gray-900">
              Nama Lengkap
            </label>
            <input
              id="f-nama"
              type="text"
              autoFocus
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Siti Rahmawati"
              aria-invalid={Boolean(galat.nama)}
              className={`${inputKelas} ${galat.nama ? "border-red-400" : "border-gray-200"}`}
            />
            {galat.nama && <p className="mt-1 text-xs text-red-800">{galat.nama}</p>}
          </div>

          <div>
            <label htmlFor="f-email" className="mb-1 block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              id="f-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@instansi.go.id"
              aria-invalid={Boolean(galat.email)}
              className={`${inputKelas} ${galat.email ? "border-red-400" : "border-gray-200"}`}
            />
            {galat.email && <p className="mt-1 text-xs text-red-800">{galat.email}</p>}
          </div>

          <div>
            <label htmlFor="f-peran" className="mb-1 block text-sm font-medium text-gray-900">
              Peran
            </label>
            <select
              id="f-peran"
              value={peran}
              onChange={(e) => setPeran(e.target.value)}
              className={`${inputKelas} ${galat.peran ? "border-red-400" : "border-gray-200"}`}
            >
              {PERAN_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {galat.peran && <p className="mt-1 text-xs text-red-800">{galat.peran}</p>}
          </div>

          {mode === "tambah" && (
            <div>
              <label htmlFor="f-password" className="mb-1 block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="f-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                aria-invalid={Boolean(galat.password)}
                className={`${inputKelas} ${galat.password ? "border-red-400" : "border-gray-200"}`}
              />
              {galat.password && <p className="mt-1 text-xs text-red-800">{galat.password}</p>}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onTutup}
            disabled={menyimpan}
            className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={menyimpan}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-emerald px-4 text-sm font-medium text-white hover:bg-emerald-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {menyimpan ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                Menyimpan...
              </>
            ) : mode === "tambah" ? (
              "Tambah Pengguna"
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------- Halaman Pengguna ----------
export default function Pengguna() {
  const [daftar, setDaftar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [cari, setCari] = useState("");
  const [filterPeran, setFilterPeran] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(null);
  const [konfirmasi, setKonfirmasi] = useState(null);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(null);
  const [prosesId, setProsesId] = useState(null);

  const muatData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setDaftar(await fetchPengguna());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);

  useEffect(() => {
    setPage(1);
  }, [cari, filterPeran, filterStatus]);

  const adaFilter = Boolean(cari || filterPeran || filterStatus);
  const resetFilter = () => {
    setCari("");
    setFilterPeran("");
    setFilterStatus("");
  };

  const hasil = useMemo(() => {
    const kunci = cari.trim().toLowerCase();
    return daftar.filter((u) => {
      if (filterPeran && u.peran !== filterPeran) return false;
      if (filterStatus && u.status !== filterStatus) return false;
      if (kunci && !`${u.nama} ${u.email}`.toLowerCase().includes(kunci)) return false;
      return true;
    });
  }, [daftar, cari, filterPeran, filterStatus]);

  const baris = hasil.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const jumlahAktif = daftar.filter((u) => u.status === "Aktif").length;

  // Simpan dari formulir (tambah atau ubah)
  const simpanForm = async (data) => {
    if (modal.mode === "tambah") {
      const baru = await tambahPengguna(data);
      setDaftar((prev) => [baru, ...prev]);
      toast.success("Pengguna berhasil ditambahkan");
    } else {
      const baru = await ubahPengguna(modal.pengguna.id, data);
      setDaftar((prev) => prev.map((u) => (u.id === baru.id ? baru : u)));
      toast.success("Data pengguna berhasil diperbarui");
    }
    setModal(null);
  };

  // Nonaktifkan setelah konfirmasi
  const nonaktifkan = async () => {
    const u = konfirmasi;
    setKonfirmasi(null);
    if (!u) return;
    setProsesId(u.id);
    try {
      const baru = await ubahStatusPengguna(u.id, "Nonaktif");
      setDaftar((prev) => prev.map((x) => (x.id === baru.id ? baru : x)));
      toast.success(`${u.nama} berhasil dinonaktifkan`);
    } catch (err) {
      toast.error(err?.message || "Gagal menonaktifkan pengguna.");
    } finally {
      setProsesId(null);
    }
  };

  // Aktifkan kembali pengguna
  const aktifkan = async (u) => {
    setProsesId(u.id);
    try {
      const baru = await ubahStatusPengguna(u.id, "Aktif");
      setDaftar((prev) => prev.map((x) => (x.id === baru.id ? baru : x)));
      toast.success(`${u.nama} berhasil diaktifkan kembali`);
    } catch (err) {
      toast.error(err?.message || "Gagal mengaktifkan pengguna.");
    } finally {
      setProsesId(null);
    }
  };

  // Hapus pengguna
  const hapus = async (u) => {
    setProsesId(u.id);
    try {
      await hapusPengguna(u.id);
      setDaftar((prev) => prev.filter((x) => x.id !== u.id));
      toast.success(`${u.nama} berhasil dihapus`);
    } catch (err) {
      toast.error(err?.message || "Gagal menghapus pengguna.");
    } finally {
      setProsesId(null);
    }
  };

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={CircleAlert}
            title="Gagal memuat data pengguna"
            description="Terjadi kendala saat mengambil data. Silakan coba lagi."
            actionLabel="Coba Lagi"
            onAction={muatData}
          />
        </div>
      </div>
    );
  }

  const aksiKelas =
    "inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[36px]";

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 md:mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pengguna</h2>
          <p className="mt-1 text-sm text-gray-600">
            {loading ? "Memuat data pengguna..." : `${daftar.length} pengguna terdaftar, ${jumlahAktif} aktif.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={muatData}
            disabled={loading}
            aria-label="Muat ulang data pengguna"
            title="Muat ulang"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            type="button"
            onClick={() => setModal({ mode: "tambah", pengguna: null })}
            className="flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald px-4 text-sm font-medium text-white hover:bg-emerald-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
          >
            <UserPlus size={16} aria-hidden="true" />
            Tambah Pengguna
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Pencarian dan filter */}
        <div className="space-y-3 border-b border-gray-200 p-4 md:p-5">
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
              placeholder="Cari nama atau email pengguna"
              aria-label="Cari pengguna"
              className={`${inputKelas} border-gray-200 pl-10`}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
              value={filterPeran}
              onChange={(e) => setFilterPeran(e.target.value)}
              aria-label="Filter peran"
              className={`${inputKelas} border-gray-200`}
            >
              <option value="">Semua Peran</option>
              {PERAN_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter status"
              className={`${inputKelas} border-gray-200`}
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
            <button
              type="button"
              onClick={resetFilter}
              disabled={!adaFilter}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-40"
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
            icon={adaFilter ? SearchX : Users}
            title={adaFilter ? "Pengguna tidak ditemukan" : "Belum ada pengguna"}
            description={
              adaFilter
                ? "Tidak ada pengguna yang cocok dengan pencarian atau filter Anda."
                : "Tambahkan pengguna pertama dengan tombol Tambah Pengguna."
            }
            actionLabel={adaFilter ? "Reset Filter" : undefined}
            onAction={adaFilter ? resetFilter : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold md:px-5">Nama</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Peran</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Terakhir Login</th>
                    <th scope="col" className="px-4 py-3 font-semibold md:px-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {baris.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 md:px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white"
                            aria-hidden="true"
                          >
                            {u.nama.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{u.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <Lencana gaya={PERAN_STYLE[u.peran]}>{u.peran}</Lencana>
                      </td>
                      <td className="px-4 py-3">
                        <Lencana gaya={STATUS_PENGGUNA_STYLE[u.status]}>{u.status}</Lencana>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {u.terakhirLogin ? formatTanggal(u.terakhirLogin) : "Belum pernah"}
                      </td>
                      <td className="px-4 py-3 md:px-5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setModal({ mode: "ubah", pengguna: u })}
                            disabled={prosesId === u.id}
                            className={`${aksiKelas} text-navy hover:bg-blue-50`}
                          >
                            <Pencil size={14} aria-hidden="true" />
                            Ubah
                          </button>
                          <button
                            type="button"
                            onClick={() => setKonfirmasiHapus(u)}
                            disabled={prosesId === u.id}
                            className={`${aksiKelas} text-red-600 hover:bg-red-50`}
                          >
                            <Trash2 size={14} aria-hidden="true" />
                            Hapus
                          </button>
                          {u.status === "Aktif" ? (
                            <button
                              type="button"
                              onClick={() => setKonfirmasi(u)}
                              disabled={prosesId === u.id}
                              className={`${aksiKelas} text-red-800 hover:bg-red-50`}
                            >
                              <UserX size={14} aria-hidden="true" />
                              Nonaktifkan
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => aktifkan(u)}
                              disabled={prosesId === u.id}
                              className={`${aksiKelas} text-emerald-800 hover:bg-emerald-50`}
                            >
                              <UserCheck size={14} aria-hidden="true" />
                              Aktifkan
                            </button>
                          )}
                        </div>
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

      {modal && (
        <FormPengguna
          mode={modal.mode}
          pengguna={modal.pengguna}
          onSimpan={simpanForm}
          onTutup={() => setModal(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(konfirmasi)}
        title="Nonaktifkan pengguna?"
        message={
          konfirmasi
            ? `${konfirmasi.nama} tidak akan bisa mengakses dasbor sampai diaktifkan kembali.`
            : ""
        }
        confirmText="Ya, Nonaktifkan"
        onConfirm={nonaktifkan}
        onCancel={() => setKonfirmasi(null)}
      />

      <ConfirmDialog
        open={Boolean(konfirmasiHapus)}
        title="Hapus pengguna?"
        message={
          konfirmasiHapus
            ? `Pengguna ${konfirmasiHapus.nama} akan dihapus permanen dari sistem.`
            : ""
        }
        confirmText="Ya, Hapus"
        onConfirm={() => {
          const u = konfirmasiHapus;
          setKonfirmasiHapus(null);
          if (u) hapus(u);
        }}
        onCancel={() => setKonfirmasiHapus(null)}
      />
    </div>
  );
}