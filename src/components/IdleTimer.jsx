import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function IdleTimer() {
  const { pengguna, keluar } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pengguna) return;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        keluar();
        toast("Sesi habis karena tidak ada aktivitas.", { icon: "🔒" });
        navigate("/masuk");
      }, 15 * 60 * 1000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);
    reset();
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("click", reset);
    };
  }, [pengguna, keluar, navigate]);

  return null;
}
