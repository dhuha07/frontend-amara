import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Loader2, CircleAlert, BadgeCheck, AtSign } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { daftar } from "../services/authService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[A-Za-z0-9_]{4,20}$/;

const inputKelas =
  "min-h-[48px] w-full rounded-xl border bg-white dark:bg-gray-800 pl-11 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald";

// Satu kolom isian dengan ikon dan pesan galat
function Kolom({ id, label, icon: Icon, galat, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        {children}
      </div>
      {galat && <p className="mt-1 text-xs text-red-800">{galat}</p>}
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    konfirmasi: "",
  });
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState({});
  const [galatUmum, setGalatUmum] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [berhasil, setBerhasil] = useState(false);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const validasi = () => {
    const e = {};
    if (form.nama.trim().length < 3) e.nama = "Nama minimal 3 karakter.";
    if (!USERNAME_REGEX.test(form.username.trim()))
      e.username = "Username 4-20 karakter: huruf, angka, atau garis bawah.";
    if (!form.email.trim()) e.email = "Email wajib diisi.";
    else if (!EMAIL_REGEX.test(form.email.trim())) e.email = "Format email tidak valid.";
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      e.password = "Password minimal 8 karakter dan mengandung huruf serta angka.";
    if (form.konfirmasi !== form.password) e.konfirmasi = "Konfirmasi password tidak sama.";
    return e;
  };

  const kirim = async (ev) => {
    ev.preventDefault();
    const e = validasi();
    setGalat(e);
    setGalatUmum("");
    if (Object.keys(e).length > 0) return;

    setMemuat(true);
    try {
      await daftar(form);
      setBerhasil(true);
    } catch (err) {
      const pesan = err?.message || "Pendaftaran gagal. Silakan coba lagi.";
      const p = pesan.toLowerCase();
      if (p.includes("username")) setGalat({ username: pesan });
      else if (p.includes("email")) setGalat({ email: pesan });
      else setGalatUmum(pesan);
    } finally {
      setMemuat(false);
    }
  };

  const bentuk = (kunci) =>
    `${inputKelas} ${galat[kunci] ? "border-red-400" : "border-gray-300"}`;

  if (berhasil) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <BadgeCheck size={32} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-gray-100">Pendaftaran Berhasil</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Akun Anda menunggu persetujuan Super Admin. Anda baru bisa masuk setelah akun diaktifkan.
          </p>
          <Link
            to="/masuk"
            className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald text-base font-semibold text-white hover:bg-emerald-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
          >
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Daftar Akun</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        Akun baru perlu disetujui Super Admin sebelum dapat digunakan
      </p>

      <form onSubmit={kirim} noValidate className="mt-6 space-y-4">
        {galatUmum && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{galatUmum}</span>
          </div>
        )}

        <Kolom id="nama" label="Nama Lengkap" icon={User} galat={galat.nama}>
          <input
            id="nama"
            type="text"
            autoComplete="name"
            autoFocus
            value={form.nama}
            onChange={ubah("nama")}
            placeholder="Masukkan nama lengkap"
            aria-invalid={Boolean(galat.nama)}
            className={`${bentuk("nama")} pr-4`}
          />
        </Kolom>

        <Kolom id="reg-username" label="Username" icon={AtSign} galat={galat.username}>
          <input
            id="reg-username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={ubah("username")}
            placeholder="Contoh: siti_rahma"
            aria-invalid={Boolean(galat.username)}
            className={`${bentuk("username")} pr-4`}
          />
        </Kolom>

        <Kolom id="reg-email" label="Email" icon={Mail} galat={galat.email}>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={ubah("email")}
            placeholder="nama@instansi.go.id"
            aria-invalid={Boolean(galat.email)}
            className={`${bentuk("email")} pr-4`}
          />
        </Kolom>

        <Kolom id="reg-password" label="Password" icon={Lock} galat={galat.password}>
          <input
            id="reg-password"
            type={lihat ? "text" : "password"}
            autoComplete="new-password"
            value={form.password}
            onChange={ubah("password")}
            placeholder="Minimal 8 karakter, huruf dan angka"
            aria-invalid={Boolean(galat.password)}
            className={`${bentuk("password")} pr-12`}
          />
          <button
            type="button"
            onClick={() => setLihat((v) => !v)}
            aria-label={lihat ? "Sembunyikan password" : "Tampilkan password"}
            className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            {lihat ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </Kolom>

        <Kolom id="reg-konfirmasi" label="Konfirmasi Password" icon={Lock} galat={galat.konfirmasi}>
          <input
            id="reg-konfirmasi"
            type={lihat ? "text" : "password"}
            autoComplete="new-password"
            value={form.konfirmasi}
            onChange={ubah("konfirmasi")}
            placeholder="Ulangi password"
            aria-invalid={Boolean(galat.konfirmasi)}
            className={`${bentuk("konfirmasi")} pr-4`}
          />
        </Kolom>

        <button
          type="submit"
          disabled={memuat}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald text-base font-semibold text-white shadow-sm hover:bg-emerald-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {memuat ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              Memproses...
            </>
          ) : (
            "Daftar"
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
        Sudah punya akun?{" "}
        <Link
          to="/masuk"
          className="font-semibold text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
        >
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
}