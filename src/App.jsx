import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pengaduan from "./pages/Pengaduan";
import DetailPengaduan from "./pages/DetailPengaduan";
import Chat from "./pages/Chat";
import Laporan from "./pages/Laporan";
import Pengguna from "./pages/Pengguna";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Halaman publik: masuk dan daftar */}
          <Route element={<GuestRoute />}>
            <Route path="/masuk" element={<Login />} />
            <Route path="/daftar" element={<Register />} />
          </Route>

          {/* Halaman admin: wajib masuk */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pengaduan" element={<Pengaduan />} />
              <Route path="/pengaduan/:id" element={<DetailPengaduan />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/laporan" element={<Laporan />} />
              <Route path="/pengguna" element={<Pengguna />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}