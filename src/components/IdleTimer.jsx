import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function IdleTimer() {
  const { keluar, pengguna } = useAuth();
  const timeout = 2 * 60 * 1000; // 2 Menit tepat
  const timerRef = useRef(null);

  useEffect(() => {
    // Jika tidak ada user, jangan jalankan timer
    if (!pengguna) return;

    const logoutOtomatis = () => {
      console.log("Sesi berakhir karena tidak ada aktivitas.");
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.", {
        id: "session-expired", // Agar tidak muncul double
        duration: 5000
      });
      keluar();
      // Paksa refresh halaman untuk memastikan semua state bersih
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logoutOtomatis, timeout);
    };

    // Daftar semua interaksi yang dianggap "aktif"
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Mulai timer pertama kali
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [keluar, pengguna, timeout]);

  return null;
}
