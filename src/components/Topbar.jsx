import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Menu,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCheck,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { fetchNotifikasi } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";
import { formatTanggal } from "../utils/formatDate";

// Header navy di bagian atas.
// Hamburger tampil di mobile, tombol lipat di desktop,
// lonceng membuka notifikasi, avatar membuka menu akun.
export default function Topbar({ onMenuClick, onToggleCollapse, collapsed = false }) {
  const IkonLipat = collapsed ? PanelLeftOpen : PanelLeftClose;
  const { pengguna, keluar } = useAuth();

  const [notif, setNotif] = useState([]);
  const [dibaca, setDibaca] = useState([]);
  const [terbuka, setTerbuka] = useState(false);
  const [menuAkun, setMenuAkun] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));
  const wadah = useRef(null);
  const akunRef = useRef(null);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  useEffect(() => {
    if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const namaTampil = pengguna?.nama || "Admin";
  const inisial = namaTampil.charAt(0).toUpperCase();

  // Ambil notifikasi saat header dimuat
  useEffect(() => {
    let batal = false;
    fetchNotifikasi()
      .then((d) => {
        if (!batal) setNotif(d);
      })
      .catch(() => {});
    return () => {
      batal = true;
    };
  }, []);

  // Tutup panel saat klik di luar atau menekan ESC
  useEffect(() => {
    if (!terbuka && !menuAkun) return;
    const klikLuar = (e) => {
      if (terbuka && wadah.current && !wadah.current.contains(e.target)) setTerbuka(false);
      if (menuAkun && akunRef.current && !akunRef.current.contains(e.target)) setMenuAkun(false);
    };
    const tekanKey = (e) => {
      if (e.key === "Escape") {
        setTerbuka(false);
        setMenuAkun(false);
      }
    };
    document.addEventListener("mousedown", klikLuar);
    document.addEventListener("keydown", tekanKey);
    return () => {
      document.removeEventListener("mousedown", klikLuar);
      document.removeEventListener("keydown", tekanKey);
    };
  }, [terbuka, menuAkun]);

  const belumDibaca = notif.filter((n) => !dibaca.includes(n.id)).length;

  const tandaiSemua = () => setDibaca(notif.map((n) => n.id));
  const bukaItem = (id) => {
    setDibaca((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setTerbuka(false);
  };

  const prosesKeluar = () => {
    setMenuAkun(false);
    keluar();
    toast.success("Anda telah keluar");
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-20 flex h-14 items-center gap-3 bg-navy px-4 text-white transition-[left] duration-200 md:left-20 md:px-6 ${
        collapsed ? "" : "lg:left-64"
      }`}
    >
      {/* Tombol buka drawer (mobile) */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Buka menu"
        className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald md:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Tombol lipat sidebar (desktop) */}
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Bentangkan menu samping" : "Lipat menu samping"}
        title={collapsed ? "Bentangkan menu" : "Lipat menu"}
        className="hidden h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald lg:flex"
      >
        <IkonLipat size={22} />
      </button>

      <h1 className="truncate text-sm font-semibold md:text-base">
        <span className="md:hidden">AMARA Bot</span>
        <span className="hidden md:inline">
          Dasbor Admin AMARA Bot - DPMP4KB Kota Magelang
        </span>
      </h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Tombol Dark Mode */}
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label="Ubah tema gelap atau terang"
          title={isDark ? "Beralih ke Terang" : "Beralih ke Gelap"}
          className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald transition-transform active:scale-90"
        >
          {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
        </button>
        {/* Lonceng notifikasi */}
        <div className="relative" ref={wadah}>
          <button
            type="button"
            onClick={() => {
              setTerbuka((v) => !v);
              setMenuAkun(false);
            }}
            aria-label={`Notifikasi, ${belumDibaca} belum dibaca`}
            aria-expanded={terbuka}
            className="relative flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            <Bell size={20} />
            {belumDibaca > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                {belumDibaca}
              </span>
            )}
          </button>

          {terbuka && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-lg">
              <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
                <h2 className="text-sm font-semibold">Notifikasi</h2>
                <button
                  type="button"
                  onClick={tandaiSemua}
                  disabled={belumDibaca === 0}
                  className="flex min-h-[36px] items-center gap-1 rounded-lg px-2 text-xs font-medium text-navy hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCheck size={14} aria-hidden="true" />
                  Tandai semua dibaca
                </button>
              </div>

              {notif.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-600">
                  Belum ada notifikasi.
                </p>
              ) : (
                <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
                  {notif.map((n) => {
                    const sudah = dibaca.includes(n.id);
                    return (
                      <li key={n.id}>
                        <Link
                          to={n.tautan}
                          onClick={() => bukaItem(n.id)}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald ${
                            sudah ? "" : "bg-blue-50/50"
                          }`}
                        >
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              sudah ? "bg-transparent" : "bg-emerald"
                            }`}
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="text-sm text-gray-900">{n.teks}</p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {formatTanggal(n.waktu)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Menu akun */}
        <div className="relative" ref={akunRef}>
          <button
            type="button"
            onClick={() => {
              setMenuAkun((v) => !v);
              setTerbuka(false);
            }}
            aria-label={`Menu akun ${namaTampil}`}
            aria-expanded={menuAkun}
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-1.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald text-sm font-bold"
              aria-hidden="true"
            >
              {inisial}
            </span>
            <span className="hidden max-w-[140px] truncate text-sm font-medium sm:inline">
              {namaTampil}
            </span>
          </button>

          {menuAkun && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <p className="truncate text-sm font-semibold">{namaTampil}</p>
                <p className="truncate text-xs text-gray-600">{pengguna?.email}</p>
                <span className="mt-2 inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-navy">
                  {pengguna?.peran || "Admin"}
                </span>
              </div>
              <button
                type="button"
                onClick={prosesKeluar}
                className="flex min-h-[48px] w-full items-center gap-2 px-4 text-sm font-medium text-red-800 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald"
              >
                <LogOut size={16} aria-hidden="true" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}