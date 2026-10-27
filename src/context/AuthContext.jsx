/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { login, bacaSesi, hapusSesi } from "../services/authService";
import { hapusCacheData } from "../hooks/useDataCepat";

const AuthContext = createContext(null);

// Menyimpan siapa yang sedang masuk
export function AuthProvider({ children }) {
  const [pengguna, setPengguna] = useState(bacaSesi);

  const masuk = useCallback(async (username, password) => {
    const hasil = await login(username, password);
    setPengguna(hasil);
    return hasil;
  }, []);

  const keluar = useCallback(() => {
    hapusSesi();
    setPengguna(null);
  }, []);

  const nilai = useMemo(() => ({ pengguna, masuk, keluar }), [pengguna, masuk, keluar]);

  return <AuthContext.Provider value={nilai}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}