import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function IdleTimer() {
  const { keluar, pengguna } = useAuth();
  const timeout = 2 * 60 * 1000; // 2 Menit

  useEffect(() => {
    if (!pengguna) return; // Jangan jalankan jika belum login

    let logoutTimer;

    const resetTimer = () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        console.log("Idle timeout reached. Logging out...");
        keluar();
      }, timeout);
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [keluar, pengguna]);

  return null;
}
