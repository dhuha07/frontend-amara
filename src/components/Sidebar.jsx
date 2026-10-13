import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Users,
  Bot,
  X,
} from "lucide-react";
import api from "../services/api";

// Daftar menu navigasi
const MENU = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pengaduan", label: "Daftar Pengaduan", icon: FileText },
  { to: "/chat", label: "Riwayat Percakapan", icon: MessageSquare },
  { to: "/laporan", label: "Laporan", icon: BarChart3 },
  { to: "/pengguna", label: "Pengguna", icon: Users },
];

export default function Sidebar({ open, onClose, collapsed = false }) {
  const location = useLocation();
  const [botStatus, setBotStatus] = useState("checking");
  const [botMessage, setBotMessage] = useState("Memeriksa status...");

  // Cek status bot setiap 5 detik
  useEffect(() => {
    const cekStatus = async () => {
      try {
        const r = await api.get("/");
        if (r.data.wa_status === "online") {
          setBotStatus("online");
          setBotMessage("Terhubung ke WhatsApp dan siap menerima pengaduan.");
        } else {
          setBotStatus("offline");
          setBotMessage("WhatsApp tidak terhubung. Periksa Fonnte.");
        }
      } catch {
        setBotStatus("offline");
        setBotMessage("Tidak terhubung ke server bot.");
      }
    };
    
    cekStatus();
    const interval = setInterval(cekStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Kelas bantu: tampilan penuh (teks) vs ringkas (hanya ikon)
  const penuh = `md:hidden ${collapsed ? "" : "lg:block"}`;
  const ringkas = `hidden md:flex ${collapsed ? "" : "lg:hidden"}`;

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
      {/* Lapisan gelap di belakang drawer (hanya mobile) - fade smooth */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          open ? "opacity-100 visible" : "pointer-events-none opacity-0 invisible"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy text-white will-change-transform transform-gpu shadow-2xl transition-[transform,width,box-shadow] duration-[500ms] ease-[cubic-bezier(0.32,0.72,0,1)] md:z-30 md:w-20 md:translate-x-0 md:shadow-none ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Menu utama"
      >
        {/* Logo */}
        <div
          className={`flex h-14 shrink-0 items-center gap-3 border-b border-white/10 px-4 md:justify-center ${
            collapsed ? "" : "lg:justify-start"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald">
            <Bot size={20} aria-hidden="true" />
          </div>
          <div className={`min-w-0 ${penuh}`}>
            <p className="text-sm font-bold leading-tight">AMARA Bot</p>
            <p className="truncate text-[11px] leading-tight text-blue-100">
              DPMP4KB Kota Magelang
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <p
            className={`mb-2 px-5 text-[11px] font-semibold uppercase tracking-wider text-blue-200/70 ${penuh}`}
          >
            Menu Utama
          </p>
          <div className="space-y-1">
            {MENU.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                title={label}
                className={({ isActive }) =>
                  `flex min-h-[48px] items-center gap-3 border-l-4 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald md:justify-center md:px-0 ${
                    collapsed ? "" : "lg:justify-start lg:px-4"
                  } ${
                    isActive
                      ? "border-emerald bg-white/15 text-white"
                      : "border-transparent text-blue-100 hover:bg-white/10"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" aria-hidden="true" />
                <span className={`md:hidden ${collapsed ? "" : "lg:inline"}`}>
                  {label}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bagian bawah: indikator bot dan profil (hanya tampilan, bukan tombol) */}
        <div className="shrink-0 space-y-3 border-t border-white/10 p-3">
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

          {/* Profil admin - tampilan penuh */}
          <div
            className={`items-center gap-3 rounded-xl px-1 ${
              collapsed ? "flex md:hidden" : "flex md:hidden lg:flex"
            }`}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald text-sm font-bold"
              aria-hidden="true"
            >
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">Admin</p>
              <p className="truncate text-[11px] leading-tight text-blue-100">
                Super Admin
              </p>
            </div>
          </div>

          {/* Profil admin - tampilan ringkas */}
          <div className={`justify-center ${ringkas}`} title="Admin (Super Admin)">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-sm font-bold"
              aria-hidden="true"
            >
              A
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}