import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock, Eye, EyeOff, Loader2, CircleAlert, Info } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { MODE_TIRUAN, AKUN_CONTOH } from "../services/authService";

const inputKelas =
  "min-h-[48px] w-full rounded-xl border border-gray-300 bg-white dark:bg-gray-800 pl-11 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald";

export default function Login() {
  const { masuk } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [tampilLupa, setTampilLupa] = useState(false);

  const kirim = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setGalat("Username dan password wajib diisi.");
      return;
    }
    setMemuat(true);
    setGalat("");
    try {
      await masuk(username, password);
      toast.success("Selamat datang kembali");
      // Pengalihan ke dasbor ditangani oleh GuestRoute
    } catch (err) {
      setGalat(err?.message || "Tidak dapat masuk. Silakan coba lagi.");
      setMemuat(false);
    }
  };

  const isiContoh = () => {
    setUsername(AKUN_CONTOH.username);
    setPassword(AKUN_CONTOH.password);
    setGalat("");
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Login Admin</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Masuk untuk mengakses panel admin</p>

      <form onSubmit={kirim} noValidate className="mt-6 space-y-5">
        {galat && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{galat}</span>
          </div>
        )}

        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-gray-100">
            Username
          </label>
          <div className="relative">
            <User
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className={`${inputKelas} pr-4`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-gray-100">
            Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="password"
              type={lihat ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className={`${inputKelas} pr-12`}
            />
            <button
              type="button"
              onClick={() => setLihat((v) => !v)}
              aria-label={lihat ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              {lihat ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

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
            <>
              <Lock size={18} aria-hidden="true" />
              Masuk
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setTampilLupa((v) => !v)}
          aria-expanded={tampilLupa}
          className="min-h-[44px] rounded-lg px-3 text-sm font-semibold text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
        >
          Lupa Password?
        </button>
        {tampilLupa && (
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-left text-sm text-navy">
            <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              Reset password dilakukan oleh Super Admin. Hubungi Super Admin DPMP4KB Kota Magelang
              dan sebutkan username Anda.
            </span>
          </div>
        )}
      </div>

      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
        Belum punya akun?{" "}
        <Link
          to="/daftar"
          className="font-semibold text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
        >
          Daftar
        </Link>
      </p>

      {MODE_TIRUAN && (
        <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-600 dark:text-gray-300">
          <p className="font-semibold text-gray-900 dark:text-gray-100">Mode percobaan (tanpa backend)</p>
          <p className="mt-1">
            Username <code className="font-semibold">{AKUN_CONTOH.username}</code>, password{" "}
            <code className="font-semibold">{AKUN_CONTOH.password}</code>
          </p>
          <button
            type="button"
            onClick={isiContoh}
            className="mt-2 min-h-[36px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            Isi otomatis
          </button>
        </div>
      )}
    </AuthLayout>
  );
}