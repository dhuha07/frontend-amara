import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";

function AppRoutes() {
  const { pengguna } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!pengguna ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/daftar" element={!pengguna ? <Register /> : <Navigate to="/" replace />} />
      <Route
        path="/*"
        element={pengguna ? <AdminLayout /> : <Navigate to="/login" replace />}
      />
    </Routes>
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
