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

// Cek status bot langsung ke backend (tidak lewat api.js agar tidak memunculkan
// notifikasi error berulang saat server sedang tidak terjangkau)
const ALAMAT_API = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const JEDA_CEK_MS = 15000;
const BATAS_WAKTU_MS = 8000;

export default function Sidebar({ open, onClose, collapsed = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { pengguna, keluar } = useAuth();
  const [botStatus, setBotStatus] = useState("checking");
  const [botMessage, setBotMessage] = useState("Memeriksa status...");
  const [menuProfil, setMenuProfil] = useState(false);
  const profilRef = useRef(null);

  // Cek status bot secara berkala; berhenti saat tab tidak terlihat
  useEffect(() => {
    let dibatalkan = false;
    let urutan = 0;
    let pengendali = null;

    const cekStatus = async () => {
      if (document.hidden) return;
      const saya = ++urutan;
      if (pengendali) pengendali.abort();
      pengendali = new AbortController();
      const batasWaktu = setTimeout(() => pengendali.abort(), BATAS_WAKTU_MS);
      try {
        const res = await fetch(`${ALAMAT_API}/`, {
          signal: pengendali.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Server tidak merespons");
        const data = await res.json();
        if (dibatalkan || saya !== urutan) return;
        if (data.wa_status === "online") {
          setBotStatus("online");
          setBotMessage("Terhubung ke WhatsApp dan siap menerima pengaduan.");
        } else {
          setBotStatus("offline");
          setBotMessage("WhatsApp tidak terhubung. Periksa Fonnte.");
        }
      } catch {
        if (dibatalkan || saya !== urutan) return;
        setBotStatus("offline");
        setBotMessage("Tidak terhubung ke server bot.");
      } finally {
        clearTimeout(batasWaktu);
      }
    };

    const saatTabTampil = () => {
      if (!document.hidden) cekStatus();
    };

    cekStatus();
    const interval = setInterval(cekStatus, JEDA_CEK_MS);
    document.addEventListener("visibilitychange", saatTabTampil);

    return () => {
      dibatalkan = true;
      if (pengendali) pengendali.abort();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", saatTabTampil);
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
    if (open) onClose();
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

        {/* Bagian bawah: indikator bot dan profil */}
        <div className="shrink-0 space-y-3 border-t border-white/10 p-3">
          {/* Indikator bot - tampilan penuh */}
          <div
            className={`rounded-xl bg-white/10 p-3 ${penuh}`}
            role="status"
            aria-live="polite"
          >
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
          <div
            className={`justify-center py-1 ${ringkas}`}
            title={
              botStatus === "online"
                ? "Bot Aktif"
                : botStatus === "checking"
                ? "Memeriksa..."
                : "Bot Offline"
            }
          >
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

          {/* Profil admin */}
          <div className="relative" ref={profilRef}>
            <button
              type="button"
              onClick={() => setMenuProfil((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuProfil}
              title={namaTampil}
              className={`flex w-full items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald md:justify-center ${
                collapsed ? "" : "lg:justify-start"
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
              <ChevronUp
                size={16}
                className={`text-blue-200 transition-transform ${menuProfil ? "rotate-180" : ""} ${penuh}`}
                aria-hidden="true"
              />
            </button>

            {menuProfil && (
              <div
                role="menu"
                className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-[200px] overflow-hidden rounded-xl border border-gray-700 bg-gray-900 py-1 text-white shadow-xl"
              >
                <div className="border-b border-gray-800 px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400">Masuk sebagai</p>
                  <p className="truncate text-sm font-bold">{namaTampil}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuProfil(false);
                    navigate("/pengguna");
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-gray-800"
                >
                  <UserCog size={14} aria-hidden="true" />
                  Kelola Pengguna
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuProfil(false);
                    keluar();
                    toast.success("Berhasil keluar");
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut size={14} aria-hidden="true" />
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