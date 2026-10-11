import axios from "axios";
import toast from "react-hot-toast";

// Klien HTTP terpusat. Alamat server diambil dari file .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor untuk menyertakan token JWT
api.interceptors.request.use((config) => {
  const sesi = localStorage.getItem("amara_sesi");
  if (sesi) {
    const { token } = JSON.parse(sesi);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tangkap semua error jaringan dan tampilkan toast berbahasa Indonesia
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      toast.error("Permintaan terlalu lama. Silakan coba lagi.");
    } else if (!error.response) {
      toast.error("Koneksi ke server gagal. Periksa jaringan Anda.");
    } else {
      const status = error.response.status;
      if (status === 401) toast.error("Sesi Anda berakhir. Silakan masuk kembali.");
      else if (status === 404) toast.error("Data yang diminta tidak ditemukan.");
      else if (status >= 500) toast.error("Terjadi gangguan pada server. Coba beberapa saat lagi.");
      else toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
    return Promise.reject(error);
  }
);

// Pembantu: kembalikan data tiruan setelah jeda 400-800 ms agar loading terlihat
export const mockDelay = (data) =>
  new Promise((resolve) => {
    const jeda = 400 + Math.random() * 400;
    setTimeout(() => resolve(structuredClone(data)), jeda);
  });

export default api;