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
  try {
    const sesi = localStorage.getItem("amara_sesi");
    if (sesi) {
      const { token } = JSON.parse(sesi);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // abaikan sesi yang rusak agar permintaan tetap berjalan
  }
  return config;
});

// Tampilkan satu notifikasi per jenis kesalahan (id yang sama tidak menumpuk)
const tampilkanError = (pesan, id) => toast.error(pesan, { id });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const alamat = String(error?.config?.url || "");
    const permintaanAuth = alamat.includes("/auth/");

    if (error.code === "ECONNABORTED") {
      tampilkanError("Permintaan terlalu lama. Silakan coba lagi.", "api-timeout");
    } else if (!error.response) {
      tampilkanError("Koneksi ke server gagal. Periksa jaringan Anda.", "api-jaringan");
    } else {
      const status = error.response.status;
      if (status === 401) {
        // Salah password di halaman masuk ditangani oleh authService sendiri
        if (!permintaanAuth) tampilkanError("Sesi Anda berakhir. Silakan masuk kembali.", "api-401");
      } else if (status === 403) {
        tampilkanError("Anda tidak memiliki izin untuk tindakan ini.", "api-403");
      } else if (status === 404) {
        tampilkanError("Data yang diminta tidak ditemukan.", "api-404");
      } else if (status === 400 || status === 422) {
        tampilkanError("Data yang dikirim tidak valid.", "api-422");
      } else if (status >= 500) {
        tampilkanError("Terjadi gangguan pada server. Coba beberapa saat lagi.", "api-500");
      } else {
        tampilkanError("Terjadi kesalahan. Silakan coba lagi.", "api-umum");
      }
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