import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Halaman admin: hanya untuk pengguna yang sudah masuk
export function ProtectedRoute() {
  const { pengguna } = useAuth();
  const lokasi = useLocation();

  if (!pengguna) {
    return <Navigate to="/masuk" replace state={{ dari: lokasi.pathname + lokasi.search }} />;
  }
  return <Outlet />;
}

// Halaman masuk dan daftar: pengguna yang sudah masuk dialihkan ke dasbor
export function GuestRoute() {
  const { pengguna } = useAuth();
  const lokasi = useLocation();

  if (pengguna) {
    return <Navigate to={lokasi.state?.dari || "/"} replace />;
  }
  return <Outlet />;
}