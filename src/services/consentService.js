import api from "./api";

// Ubah menjadi true setelah endpoint /api/consent siap di backend (Tahap 2)
export const SERVER_AKTIF = false;

// Ambil nilai pertama yang terisi dari beberapa kemungkinan nama field
function ambil(obj, kunci, bawaan = "") {
  for (const k of kunci) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return bawaan;
}

// Seragamkan satu data persetujuan dari backend
function rapikan(d) {
  const nikPenuh = String(ambil(d, ["nik"], "")).replace(/\D/g, "");
  return {
    id: String(ambil(d, ["id", "id_consent", "idConsent"], "-")),
    nama: ambil(d, ["nama", "nama_lengkap"], "-"),
    nikAkhir: String(ambil(d, ["nik_akhir4", "nikAkhir4"], nikPenuh.slice(-4))),
    tglLahir: ambil(d, ["tgl_lahir", "tglLahir", "tanggal_lahir"], null),
    alamat: ambil(d, ["alamat"], "-"),
    versi: String(ambil(d, ["versi"], "-")),
    waktu: ambil(d, ["dibuat_pada", "created_at", "createdAt", "waktu", "tanggal"], null),
    status: ambil(d, ["status"], "Aktif"),
  };
}

// Simpan persetujuan baru
export async function simpanConsent(payload) {
  const { data } = await api.post("/api/consent", payload);
  return data;
}

// Ambil riwayat persetujuan
export async function ambilRiwayatConsent() {
  const { data } = await api.get("/api/consent");
  const mentah = Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
  return (Array.isArray(mentah) ? mentah : []).map(rapikan);
}