import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IdleTimer from "./components/IdleTimer";
import EfekKlik from "./components/EfekKlik";
import { Toaster } from "react-hot-toast";

// Daftar semua file halaman di src/pages.
// Tanpa { eager: true }: setiap halaman baru diunduh saat dibuka,
// jadi muatan awal aplikasi lebih kecil dan lebih cepat di HP.
const modul = import.meta.glob("./pages/**/*.jsx");

const daftarHalaman = Object.entries(modul).map(([path, muat]) => ({
  nama: path.split("/").pop().replace(".jsx", "").toLowerCase(),
  muat,
}));

// Cari halaman berdasarkan kata kunci di nama file
function cari(kataKunci, kecuali = []) {
  const ketemu = daftarHalaman.find(
    (h) =>
      kataKunci.some((k) => h.nama.includes(k)) &&
      !kecuali.some((k) => h.nama.includes(k))
  );
  return ketemu ? lazy(ketemu.muat) : null;
}

const HalamanPengaduan = cari(["pengaduan"], ["detail"]);
const HalamanDetail = cari(["detail"]);
const HalamanChat = cari(["chat", "percakapan", "riwayat"]);
const HalamanLaporan = cari(["laporan"]);
const HalamanPengguna = cari(["pengguna", "user"]);
const HalamanConsent = cari(["consent"]);
const HalamanScanWA = cari(["scan", "whatsapp"]);

// Penanda jika file halaman tidak ditemukan
function BelumDipasang({ nama, kata }) {
  return (
    <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-bold">{nama}</h2>
      <p className="mt-2 text-sm">
        File halaman tidak ditemukan. Nama file di src/pages harus mengandung kata "{kata}".
      </p>
    </div>
  );
}

// Tampilan sementara saat halaman sedang diunduh.
// Dipasang per halaman, jadi sidebar dan topbar tetap terlihat.
function Memuat() {
  return (
    <div
      className="flex items-center justify-center p-10 text-sm text-gray-500"
      role="status"
      aria-live="polite"
    >
      Memuat halaman...
    </div>
  );
}

function Halaman({ Komponen, nama, kata }) {
  if (!Komponen) return <BelumDipasang nama={nama} kata={kata} />;
  return (
    <Suspense fallback={<Memuat />}>
      <Komponen />
    </Suspense>
  );
}

function AppRoutes() {
  const { pengguna } = useAuth();

  return (
    <>
      {/* Pencatat waktu diam hanya perlu berjalan saat ada yang login */}
      {pengguna && <IdleTimer />}
      <Routes>
        <Route path="/login" element={!pengguna ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/daftar" element={!pengguna ? <Register /> : <Navigate to="/" replace />} />

        {/* Semua halaman admin berada di dalam AdminLayout */}
        <Route
          path="/"
          element={pengguna ? <AdminLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route
            path="pengaduan"
            element={<Halaman Komponen={HalamanPengaduan} nama="Daftar Pengaduan" kata="pengaduan" />}
          />
          <Route
            path="pengaduan/:id"
            element={<Halaman Komponen={HalamanDetail} nama="Detail Pengaduan" kata="detail" />}
          />
          <Route
            path="chat/*"
            element={<Halaman Komponen={HalamanChat} nama="Riwayat Percakapan" kata="chat" />}
          />
          <Route
            path="laporan"
            element={<Halaman Komponen={HalamanLaporan} nama="Laporan" kata="laporan" />}
          />
          <Route
            path="pengguna"
            element={<Halaman Komponen={HalamanPengguna} nama="Pengguna" kata="pengguna" />}
          />
          <Route
            path="consent"
            element={<Halaman Komponen={HalamanConsent} nama="Informed Consent" kata="consent" />}
          />
          <Route
            path="scan-wa"
            element={<Halaman Komponen={HalamanScanWA} nama="Scan WhatsApp" kata="scan" />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <EfekKlik />
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}