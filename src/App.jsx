import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IdleTimer from "./components/IdleTimer";
import { Toaster } from "react-hot-toast";

// Penanda sementara untuk halaman yang belum dipasang
function BelumDipasang({ nama }) {
  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-bold">{nama}</h2>
      <p className="mt-2 text-sm">Halaman ini belum dipasang di App.jsx.</p>
    </div>
  );
}

function AppRoutes() {
  const { pengguna } = useAuth();

  return (
    <>
      <IdleTimer />
      <Routes>
        <Route path="/login" element={!pengguna ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/daftar" element={!pengguna ? <Register /> : <Navigate to="/" replace />} />

        {/* Semua halaman admin berada di dalam AdminLayout */}
        <Route
          path="/"
          element={pengguna ? <AdminLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="pengaduan" element={<BelumDipasang nama="Daftar Pengaduan" />} />
          <Route path="chat" element={<BelumDipasang nama="Riwayat Percakapan" />} />
          <Route path="laporan" element={<BelumDipasang nama="Laporan" />} />
          <Route path="pengguna" element={<BelumDipasang nama="Pengguna" />} />
          <Route path="consent" element={<BelumDipasang nama="Informed Consent" />} />
          <Route path="scan-wa" element={<BelumDipasang nama="Scan WhatsApp" />} />
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
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}