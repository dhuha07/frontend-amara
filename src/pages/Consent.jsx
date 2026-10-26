import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  FileText,
  History,
  User,
  CreditCard,
  Calendar,
  MapPin,
  Lock,
  ArrowRight,
} from "lucide-react";
import { SERVER_AKTIF, simpanConsent } from "../services/consentService";

// ---- Isi persetujuan: ubah teks di sini sesuai ketentuan resmi instansi ----
const VERSI_PERSETUJUAN = "1.0";
const POIN_PERSETUJUAN = [
  {
    judul: "Tujuan pengumpulan data",
    isi: "Data Anda digunakan hanya untuk memproses pengaduan dan layanan pendampingan melalui AMARA Bot DPMP4KB Kota Magelang.",
  },
  {
    judul: "Kerahasiaan",
    isi: "Identitas dan isi laporan dijaga kerahasiaannya dan hanya dapat diakses oleh petugas yang berwenang.",
  },
  {
    judul: "Hak Anda",
    isi: "Anda berhak menanyakan, memperbaiki, atau meminta penghapusan data Anda kepada petugas kapan saja.",
  },
  {
    judul: "Kesukarelaan",
    isi: "Persetujuan ini diberikan secara sukarela dan dapat ditarik kembali sewaktu-waktu.",
  },
  {
    judul: "Rujukan lanjutan",
    isi: "Atas persetujuan Anda, data dapat diteruskan kepada pihak terkait (misalnya layanan kesehatan atau bantuan hukum) hanya untuk kepentingan penanganan kasus.",
  },
];

// Tanggal hari ini (zona waktu lokal) dalam format YYYY-MM-DD
function hariIni() {
  const sekarang = new Date();
  sekarang.setMinutes(sekarang.getMinutes() - sekarang.getTimezoneOffset());
  return sekarang.toISOString().slice(0, 10);
}

// Periksa isian formulir; hasilnya berupa daftar pesan kesalahan per kolom
function periksaForm(f) {
  const galat = {};
  if (f.nama.trim().length < 3) galat.nama = "Nama lengkap minimal 3 huruf.";
  if (!/^\d{16}$/.test(f.nik)) galat.nik = "NIK harus 16 digit angka.";
  if (!f.tgl_lahir) galat.tgl_lahir = "Tanggal lahir wajib diisi.";
  else if (f.tgl_lahir > hariIni()) galat.tgl_lahir = "Tanggal lahir tidak boleh di masa depan.";
  if (f.alamat.trim().length < 10) galat.alamat = "Alamat minimal 10 karakter.";
  return galat;
}

// Kelas untuk kolom isian (merah jika ada kesalahan)
function kelasInput(adaGalat) {
  return `w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-1 dark:bg-gray-700 dark:text-white dark:[color-scheme:dark] ${
    adaGalat
      ? "border-red-400 focus:border-red-500 focus:ring-red-400 dark:border-red-500"
      : "border-gray-300 focus:border-emerald focus:ring-emerald dark:border-gray-600"
  }`;
}

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

// Pembungkus satu kolom: label, isian, dan pesan bantuan/kesalahan
function Bidang({ id, label, ikon: Ikon, galat, petunjuk, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        <Ikon size={16} className="text-navy dark:text-blue-300" aria-hidden="true" />
        {label}
      </label>
      {children}
      {galat ? (
        <p id={`${id}-info`} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
          {galat}
        </p>
      ) : petunjuk ? (
        <p id={`${id}-info`} className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {petunjuk}
        </p>
      ) : null}
    </div>
  );
}

export default function Consent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: "", nik: "", tgl_lahir: "", alamat: "" });
  const [tersentuh, setTersentuh] = useState({});
  const [setuju, setSetuju] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);

  const galat = periksaForm(form);
  const tampilGalat = (kolom) => (tersentuh[kolom] ? galat[kolom] : undefined);

  // NIK hanya boleh angka, maksimal 16 digit
  const ubah = (kolom) => (e) => {
    const nilai =
      kolom === "nik" ? e.target.value.replace(/\D/g, "").slice(0, 16) : e.target.value;
    setForm((f) => ({ ...f, [kolom]: nilai }));
  };
  const sentuh = (kolom) => () => setTersentuh((t) => ({ ...t, [kolom]: true }));

  const submit = async (e) => {
    e.preventDefault();
    setTersentuh({ nama: true, nik: true, tgl_lahir: true, alamat: true });
    if (Object.keys(galat).length > 0) {
      toast.error("Periksa kembali isian yang bertanda merah.", { id: "consent-galat" });
      return;
    }
    if (!setuju) {
      toast.error("Centang pernyataan persetujuan terlebih dahulu.", { id: "consent-setuju" });
      return;
    }

    // Simpan ke server hanya jika endpoint backend sudah aktif
    if (SERVER_AKTIF) {
      setMenyimpan(true);
      try {
        await simpanConsent({
          nama: form.nama.trim(),
          nik: form.nik,
          tgl_lahir: form.tgl_lahir,
          alamat: form.alamat.trim(),
          versi: VERSI_PERSETUJUAN,
        });
      } catch {
        setMenyimpan(false);
        toast.error("Persetujuan gagal disimpan. Silakan coba lagi.", { id: "consent-simpan" });
        return;
      }
      setMenyimpan(false);
    }

    toast.success(
      SERVER_AKTIF ? "Persetujuan tersimpan." : "Persetujuan diterima. Lanjut ke penjadwalan."
    );
    navigate("/penjadwalan");
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      {/* Judul halaman */}
      <header className="mb-4 flex items-start gap-3 md:mb-5 md:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald text-white md:h-12 md:w-12">
          <ShieldCheck size={24} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl">
            Informed Consent
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Mohon baca pernyataan di bawah dengan saksama sebelum mengisi data diri.
          </p>
        </div>
      </header>

      {/* Tab */}
      <nav
        className="mb-4 flex border-b border-gray-200 dark:border-gray-700 md:mb-5"
        aria-label="Bagian Informed Consent"
      >
        <Tab to="/consent" aktif ikon={FileText}>
          Formulir
        </Tab>
        <Tab to="/consent/riwayat" aktif={false} ikon={History}>
          Riwayat
        </Tab>
      </nav>

      {/* Langkah */}
      <ol
        className="mb-5 flex items-center gap-3 text-xs font-medium md:mb-6 md:text-sm"
        aria-label="Langkah pengisian"
      >
        <li className="flex items-center gap-2 text-gray-900 dark:text-gray-100" aria-current="step">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald text-xs font-bold text-white">
            1
          </span>
          Persetujuan
        </li>
        <li aria-hidden="true" className="h-px w-8 bg-gray-300 dark:bg-gray-600 md:w-12" />
        <li className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-xs font-bold dark:border-gray-600">
            2
          </span>
          Penjadwalan
        </li>
      </ol>

      {/* Pernyataan persetujuan */}
      <section
        aria-labelledby="judul-pernyataan"
        className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-4 dark:border-gray-700 md:px-6">
          <h3
            id="judul-pernyataan"
            className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100"
          >
            <FileText size={18} className="text-navy dark:text-blue-300" aria-hidden="true" />
            Pernyataan Persetujuan
          </h3>
          <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-navy dark:bg-blue-500/20 dark:text-blue-200">
            Versi {VERSI_PERSETUJUAN}
          </span>
        </div>

        <ol className="divide-y divide-gray-100 dark:divide-gray-700">
          {POIN_PERSETUJUAN.map((poin, i) => (
            <li key={poin.judul} className="flex gap-3 p-4 md:px-6">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-navy dark:bg-blue-500/20 dark:text-blue-200"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{poin.judul}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {poin.isi}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mx-4 mb-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200 md:mx-6 md:mb-6">
          <Lock size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="leading-relaxed">
            Data pribadi seperti NIK bersifat rahasia. Jangan membagikan layar atau mencetak
            halaman ini kepada pihak yang tidak berwenang.
          </p>
        </div>
      </section>

      {/* Formulir data diri */}
      <form
        onSubmit={submit}
        noValidate
        className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:mt-6"
      >
        <div className="border-b border-gray-200 p-4 dark:border-gray-700 md:px-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            <User size={18} className="text-navy dark:text-blue-300" aria-hidden="true" />
            Data Diri
          </h3>
        </div>

        <div className="space-y-4 p-4 md:p-6">
          <Bidang id="consent-nama" label="Nama Lengkap" ikon={User} galat={tampilGalat("nama")}>
            <input
              id="consent-nama"
              type="text"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Sesuai KTP"
              value={form.nama}
              onChange={ubah("nama")}
              onBlur={sentuh("nama")}
              aria-invalid={Boolean(tampilGalat("nama"))}
              aria-describedby="consent-nama-info"
              className={kelasInput(tampilGalat("nama"))}
            />
          </Bidang>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Bidang
              id="consent-nik"
              label="NIK"
              ikon={CreditCard}
              galat={tampilGalat("nik")}
              petunjuk={`${form.nik.length}/16 digit sesuai KTP`}
            >
              <input
                id="consent-nik"
                type="text"
                required
                inputMode="numeric"
                autoComplete="off"
                placeholder="16 digit angka"
                value={form.nik}
                onChange={ubah("nik")}
                onBlur={sentuh("nik")}
                aria-invalid={Boolean(tampilGalat("nik"))}
                aria-describedby="consent-nik-info"
                className={kelasInput(tampilGalat("nik"))}
              />
            </Bidang>

            <Bidang
              id="consent-lahir"
              label="Tanggal Lahir"
              ikon={Calendar}
              galat={tampilGalat("tgl_lahir")}
            >
              <input
                id="consent-lahir"
                type="date"
                required
                max={hariIni()}
                autoComplete="bday"
                value={form.tgl_lahir}
                onChange={ubah("tgl_lahir")}
                onBlur={sentuh("tgl_lahir")}
                aria-invalid={Boolean(tampilGalat("tgl_lahir"))}
                aria-describedby="consent-lahir-info"
                className={kelasInput(tampilGalat("tgl_lahir"))}
              />
            </Bidang>
          </div>

          <Bidang id="consent-alamat" label="Alamat" ikon={MapPin} galat={tampilGalat("alamat")}>
            <textarea
              id="consent-alamat"
              required
              rows={3}
              maxLength={300}
              autoComplete="street-address"
              placeholder="Alamat lengkap tempat tinggal"
              value={form.alamat}
              onChange={ubah("alamat")}
              onBlur={sentuh("alamat")}
              aria-invalid={Boolean(tampilGalat("alamat"))}
              aria-describedby="consent-alamat-info"
              className={`${kelasInput(tampilGalat("alamat"))} resize-y`}
            />
          </Bidang>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <input
              type="checkbox"
              checked={setuju}
              onChange={(e) => setSetuju(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 accent-emerald"
            />
            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              Saya telah membaca dan memahami pernyataan di atas, serta menyetujui data saya
              digunakan sesuai tujuan yang dijelaskan.
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pastikan data yang diisi sudah benar sebelum melanjutkan.
          </p>
          <button
            type="submit"
            disabled={!setuju || menyimpan}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-emerald px-5 py-3 font-semibold text-white transition hover:bg-emerald-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            {menyimpan ? "Menyimpan..." : "Lanjut ke Penjadwalan"}
            {!menyimpan && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        </div>
      </form>
    </div>
  );
}