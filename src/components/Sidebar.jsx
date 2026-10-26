import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Users,
  Bot,
  X,
  LogOut,
  UserCog,
  ChevronUp,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Daftar menu navigasi
const MENU = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pengaduan", label: "Daftar Pengaduan", icon: FileText },
  { to: "/chat", label: "Riwayat Percakapan", icon: MessageSquare },
  { to: "/laporan", label: "Laporan", icon: BarChart3 },
  { to: "/pengguna", label: "Pengguna", icon: Users },
  { to: "/consent", label: "Informed Consent", icon: FileText },
  { to: "/scan-wa", label: "Scan WhatsApp", icon: Bot },
];

// Jeda antar menu saat animasi masuk (milidetik)
const JEDA_AWAL = 160;
const JEDA_MENU = 75;

export default function Sidebar({ open, onClose, collapsed = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { pengguna, keluar } = useAuth();
  const [botStatus, setBotStatus] = useState("checking");
  const [botMessage, setBotMessage] = useState("Memeriksa status...");
  const [menuProfil, setMenuProfil] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const profilRef = useRef(null);

  // Mainkan ulang animasi masuk saat drawer dibuka (HP)
  useEffect(() => {
    if (open) setAnimKey((k) => k + 1);
  }, [open]);

  // Mainkan ulang animasi masuk saat sidebar dilipat atau dibentang (desktop) dan saat pertama dimuat
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [collapsed]);

  // Cek status bot setiap 10 detik (berhenti saat tab tidak terlihat)
  useEffect(() => {
    let aktif = true;

    const cekStatus = async () => {
      if (document.hidden) return;
      try {
        const r = await api.get("/");
        if (!aktif) return;
        // Jika balasan bukan JSON dari API (misalnya HTML halaman frontend),
        // berarti alamat API belum benar
        if (!r.data || typeof r.data !== "object") {
          setBotStatus("offline");
          setBotMessage("Server bot tidak ditemukan. Periksa alamat API (VITE_API_BASE_URL).");
        } else if (r.data.wa_status === "online") {
          setBotStatus("online");
          setBotMessage("Terhubung ke WhatsApp dan siap menerima pengaduan.");
        } else {
          setBotStatus("offline");
          setBotMessage("WhatsApp tidak terhubung. Periksa Fonnte.");
        }
      } catch {
        if (!aktif) return;
        setBotStatus("offline");
        setBotMessage("Tidak terhubung ke server bot.");
      }
    };

    const saatTampil = () => {
      if (!document.hidden) cekStatus();
    };

    cekStatus();
    const interval = setInterval(cekStatus, 10000);
    document.addEventListener("visibilitychange", saatTampil);
    return () => {
      aktif = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", saatTampil);
    };
  }, []);

  // Kelas bantu: tampilan penuh (teks) vs ringkas (hanya ikon)
  const penuh = `md:hidden ${collapsed ? "" : "lg:block"}`;
  const ringkas = `hidden md:flex ${collapsed ? "" : "lg:hidden"}`;

  // Tutup menu profil saat klik di luar
  useEffect(() => {
    if (!menuProfil) return;
    const klikLuar = (e) => {
      if (profilRef.current && !profilRef.current.contains(e.target)) setMenuProfil(false);
    };
    document.addEventListener("mousedown", klikLuar);
    return () => document.removeEventListener("mousedown", klikLuar);
  }, [menuProfil]);

  const namaTampil = pengguna?.nama || "Admin";
  const peranTampil = pengguna?.peran || "Super Admin";
  const inisial = namaTampil.charAt(0).toUpperCase();

  // Tutup drawer otomatis saat pindah halaman
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Tutup drawer dengan tombol ESC dan kunci scroll body saat drawer terbuka
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflowAwal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowAwal;
    };
  }, [open, onClose]);

  return (
    <>
      {/* Lapisan gelap di belakang drawer (hanya mobile) */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          open ? "opacity-100 visible" : "pointer-events-none opacity-0 invisible"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Di HP: drawer meluncur dengan pantulan besar dan cahaya hijau di tepinya.
          Bagian "before" menutup celah di tepi kiri saat pantulan.
          Di desktop: lebar berubah halus saat dilipat atau dibentang. */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy text-white will-change-transform transform-gpu transition-[transform,width,box-shadow] before:absolute before:inset-y-0 before:right-full before:w-16 before:bg-navy before:content-[''] md:z-30 md:w-20 md:translate-x-0 md:shadow-none md:before:hidden ${
          open
            ? "duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_70px_rgba(16,185,129,0.35)]"
            : "duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl"
        } ${collapsed ? "lg:w-20" : "lg:w-64"} ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Menu utama"
      >
        {/* Logo */}
        <div
          className={`flex h-14 shrink-0 items-center gap-3 border-b border-white/10 px-4 md:justify-center ${
            collapsed ? "" : "lg:justify-start"
          }`}
        >
          <div className="sb2-bot flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald">
            <Bot size={20} aria-hidden="true" />
          </div>
          <div
            key={`teks-${animKey}`}
            className={`sb2-masuk min-w-0 ${penuh}`}
            style={{ "--d": "120ms" }}
          >
            <p className="text-sm font-bold leading-tight">AMARA Bot</p>
            <p className="truncate text-[11px] leading-tight text-blue-100">
              DPMP4KB Kota Magelang
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className={`ml-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-500 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald md:hidden ${
              open ? "rotate-0 scale-100 opacity-100 delay-300" : "-rotate-90 scale-50 opacity-0"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu (dibangun ulang tiap animKey berubah supaya animasi masuk main lagi) */}
        <nav key={animKey} className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <p
            className={`sb2-masuk mb-2 px-5 text-[11px] font-semibold uppercase tracking-wider text-blue-200/70 ${penuh}`}
            style={{ "--d": `${JEDA_AWAL - 60}ms` }}
          >
            Menu Utama
          </p>
          <div className="space-y-1">
            {MENU.map(({ to, label, icon: Icon }, i) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                title={label}
                style={{ "--d": `${JEDA_AWAL + i * JEDA_MENU}ms` }}
                className={({ isActive }) =>
                  `sb2-link sb2-masuk flex min-h-[48px] items-center gap-3 border-l-4 px-4 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald md:justify-center md:px-0 ${
                    collapsed ? "" : "lg:justify-start lg:px-4"
                  } ${
                    isActive
                      ? "border-emerald bg-white/15 text-white"
                      : "border-transparent text-blue-100 hover:bg-white/10"
                  }`
                }
              >
                <Icon size={20} className="sb2-ikon shrink-0" aria-hidden="true" />
                <span
                  className={`sb2-teks sb2-label md:hidden ${collapsed ? "" : "lg:inline-block"}`}
                >
                  {label}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bagian bawah: indikator bot dan profil */}
        <div
          key={`bawah-${animKey}`}
          className="sb2-masuk shrink-0 space-y-3 border-t border-white/10 p-3"
          style={{ "--d": `${JEDA_AWAL + MENU.length * JEDA_MENU + 60}ms` }}
        >
          {/* Indikator bot - tampilan penuh */}
          <div className={`rounded-xl bg-white/10 p-3 ${penuh}`}>
            <div className="flex items-center gap-2">
              {botStatus === "online" ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
                  </span>
                  <p className="text-xs font-semibold">Bot Aktif</p>
                </>
              ) : botStatus === "checking" ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse" />
                  </span>
                  <p className="text-xs font-semibold">Memeriksa...</p>
                </>
              ) : (
                <>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  <p className="text-xs font-semibold">Bot Offline</p>
                </>
              )}
            </div>
            <p className="mt-1 text-[11px] leading-snug text-blue-100">
              {botMessage}
            </p>
          </div>

          {/* Indikator bot - tampilan ringkas */}
          <div className={`justify-center py-1 ${ringkas}`} title={botStatus === "online" ? "Bot Aktif" : botStatus === "checking" ? "Memeriksa..." : "Bot Offline"}>
            {botStatus === "online" ? (
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald" />
              </span>
            ) : botStatus === "checking" ? (
              <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
            ) : (
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            )}
          </div>

          {/* Profil admin - interaktif */}
          <div className="relative" ref={profilRef}>
            <button
              type="button"
              onClick={() => setMenuProfil((v) => !v)}
              className={`w-full flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
                collapsed ? "justify-center md:hidden" : "justify-start"
              }`}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald text-sm font-bold text-white"
                aria-hidden="true"
              >
                {inisial}
              </div>
              <div className={`min-w-0 flex-1 text-left ${penuh}`}>
                <p className="truncate text-sm font-semibold leading-tight text-white">{namaTampil}</p>
                <p className="truncate text-[11px] leading-tight text-blue-200">
                  {peranTampil}
                </p>
              </div>
              <ChevronUp size={16} className={`text-blue-200 transition-transform duration-300 ${menuProfil ? "rotate-180" : ""} ${penuh}`} />
            </button>

            {menuProfil && (
              <div className="sb2-pop absolute bottom-full left-0 mb-2 w-full min-w-[200px] overflow-hidden rounded-xl bg-gray-900 border border-gray-700 py-1 text-white shadow-xl z-50">
                <div className="border-b border-gray-800 px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400">Masuk sebagai</p>
                  <p className="truncate text-sm font-bold">{namaTampil}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setMenuProfil(false); navigate("/pengguna"); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium hover:bg-gray-800 transition-colors"
                >
                  <UserCog size={14} />
                  Kelola Pengguna
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuProfil(false);
                    keluar();
                    toast.success("Berhasil keluar");
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} />
                  Keluar Aplikasi
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}