import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import IdleTimer from "../components/IdleTimer";

const KUNCI_LIPAT = "amara_sidebar_lipat";

// Baca pilihan lipat sidebar yang tersimpan (aman jika penyimpanan diblokir)
function bacaLipat() {
  try {
    return localStorage.getItem(KUNCI_LIPAT) === "1";
  } catch {
    return false;
  }
}

// Kerangka utama: sidebar + header + area isi halaman
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // drawer mobile
  const [collapsed, setCollapsed] = useState(bacaLipat); // lipat di desktop

  const tutupSidebar = useCallback(() => setSidebarOpen(false), []);
  const bukaSidebar = useCallback(() => setSidebarOpen(true), []);

  const toggleLipat = useCallback(() => {
    setCollapsed((prev) => {
      const baru = !prev;
      try {
        localStorage.setItem(KUNCI_LIPAT, baru ? "1" : "0");
      } catch {
        // abaikan jika penyimpanan tidak tersedia
      }
      return baru;
    });
  }, []);

  return (
    <div className="min-h-screen bg-app">
      <IdleTimer />
      <Sidebar open={sidebarOpen} onClose={tutupSidebar} collapsed={collapsed} />
      <Topbar
        onMenuClick={bukaSidebar}
        onToggleCollapse={toggleLipat}
        collapsed={collapsed}
      />

      {/* Area isi: jarak mengikuti lebar sidebar dan tinggi header */}
      <main
        className={`pt-14 transition-[margin] duration-200 md:ml-20 ${
          collapsed ? "" : "lg:ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}