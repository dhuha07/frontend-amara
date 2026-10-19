import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function IdleTimer() {
  const { keluar, pengguna } = useAuth();
  const timeout = 2 * 60 * 1000; // 2 Menit
  const timerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!pengguna) return;

    const logoutOtomatis = () => {
      console.log("Idle detected. Logging out...");
      toast.error("Sesi Anda telah berakhir.", { id: "expired" });
      keluar();
      window.location.href = "/login";
    };

    const resetTimer = () => {
      const now = Date.now();
      // Hanya reset jika aktivitas terjadi minimal 1 detik setelah yang terakhir
      // Ini mencegah sensor mouse/vibrasi meja me-reset timer terus-menerus
      if (now - lastActivityRef.current > 1000) {
        lastActivityRef.current = now;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(logoutOtomatis, timeout);
      }
    };

    // Gunakan event yang lebih PASTI (klik, ketik, sentuh)
    // Hapus 'mousemove' dan 'scroll' agar tidak sensitif berlebih
    const events = ["mousedown", "keydown", "touchstart", "click"];
    
    events.forEach((event) => window.addEventListener(event, resetTimer));
    
    // Inisialisasi timer pertama
    timerRef.current = setTimeout(logoutOtomatis, timeout);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [keluar, pengguna]);

  return null;
}
