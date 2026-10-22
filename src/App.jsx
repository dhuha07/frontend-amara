import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IdleTimer from "./components/IdleTimer";
import { Toaster } from "react-hot-toast";

function AppRoutes() {
  const { pengguna } = useAuth();

  return (
    <>
      <IdleTimer />
      <Routes>
        <Route path="/login" element={!pengguna ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/daftar" element={!pengguna ? <Register /> : <Navigate to="/" replace />} />

        {/* Rute yang butuh login: semua halaman admin ada di dalam AdminLayout */}
        <Route
          path="/"
          element={pengguna ? <AdminLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          {/* Halaman lain ditambahkan di sini setelah nama filenya saya ketahui */}
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