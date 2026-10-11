import api from "./api";

// Mode tiruan: VITE_USE_MOCK=true (bawaan). Mode asli: VITE_USE_MOCK=false
export const MODE_TIRUAN = import.meta.env.VITE_USE_MOCK !== "false";

/*
 * Kontrak backend yang diharapkan:
 *   POST /auth/login    body { username, password }
 *        -> { pengguna: { username, nama, email, peran } }
 *   POST /auth/daftar   body { nama, username, email, password }
 *        -> { pesan } (akun berstatus "Menunggu" sampai disetujui Super Admin)
 *
 * Saran keamanan: backend menyimpan sesi di cookie httpOnly (bukan localStorage),
 * lalu tambahkan withCredentials: true pada axios di api.js.
 */

const KUNCI_SESI = "amara_sesi";

// Akun tiruan hanya hidup di memori. Ini BUKAN keamanan sungguhan.
const akunTiruan = [
  {
    username: "admin",
    password: "admin123",
    nama: "Super Admin DPMP4KB",
    email: "admin@dpmp4kb.magelangkota.go.id",
    peran: "Super Admin",
    status: "Aktif",
  },
];

export const AKUN_CONTOH = { username: "admin", password: "Admin12345" };

const tunda = (ms = 700) => new Promise((r) => setTimeout(r, ms));

// ---------- Sesi (hanya data profil, tanpa password) ----------
export function bacaSesi() {
  try {
    const s = localStorage.getItem(KUNCI_SESI);
    if (!s) return null;
    const parsed = JSON.parse(s);
    // Jika tidak ada token (sesi lama sebelum backend auth), hapus otomatis
    if (!MODE_TIRUAN && !parsed.token) {
      localStorage.removeItem(KUNCI_SESI);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function simpanSesi(pengguna) {
  try {
    localStorage.setItem(KUNCI_SESI, JSON.stringify(pengguna));
  } catch {
    // abaikan jika penyimpanan diblokir
  }
}

export function hapusSesi() {
  try {
    localStorage.removeItem(KUNCI_SESI);
  } catch {
    // abaikan
  }
}

// ---------- Masuk ----------
export async function login(username, password) {
  if (!MODE_TIRUAN) {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      if (!data.token || !data.pengguna) {
        throw new Error("Server tidak mengembalikan token.");
      }
      const sesiData = { ...data.pengguna, token: data.token };
      simpanSesi(sesiData);
      return data.pengguna;
    } catch (e) {
      // Jika backend kirim detail, tampilkan itu
      throw new Error(
        e?.response?.data?.detail ||
          e?.message ||
          (e?.response?.status === 401
            ? "Username atau password salah."
            : "Tidak dapat masuk. Silakan coba lagi.")
      );
    }
  }

  await tunda();
  const akun = akunTiruan.find(
    (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
  );
  if (!akun) throw new Error("Username atau password salah.");
  if (akun.status === "Menunggu")
    throw new Error("Akun Anda masih menunggu persetujuan Super Admin.");
  if (akun.status === "Nonaktif")
    throw new Error("Akun Anda dinonaktifkan. Hubungi Super Admin.");

  const pengguna = {
    username: akun.username,
    nama: akun.nama,
    email: akun.email,
    peran: akun.peran,
  };
  simpanSesi(pengguna);
  return pengguna;
}

// ---------- Daftar ----------
export async function daftar({ nama, username, email, password }) {
  if (!MODE_TIRUAN) {
    try {
      const { data } = await api.post("/auth/daftar", { nama, username, email, password });
      return data;
    } catch (e) {
      throw new Error(e?.response?.data?.pesan || "Pendaftaran gagal. Silakan coba lagi.");
    }
  }

  await tunda();
  if (akunTiruan.some((a) => a.username.toLowerCase() === username.trim().toLowerCase()))
    throw new Error("Username sudah digunakan.");
  if (akunTiruan.some((a) => a.email.toLowerCase() === email.trim().toLowerCase()))
    throw new Error("Email sudah terdaftar.");

  akunTiruan.push({
    username: username.trim(),
    password,
    nama: nama.trim(),
    email: email.trim(),
    peran: "Petugas",
    status: "Menunggu",
  });
  return { pesan: "Pendaftaran berhasil dan menunggu persetujuan Super Admin." };
}