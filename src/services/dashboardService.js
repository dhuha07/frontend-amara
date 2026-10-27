import api from "./api";

// Jika fetchDashboard dipanggil lagi saat permintaan sebelumnya belum selesai,
// pemanggil memakai permintaan yang sama (tidak ada permintaan ganda ke server).
let sedangJalan = null;

export function fetchDashboard() {
  if (sedangJalan) return sedangJalan;

  sedangJalan = (async () => {
    const { data } = await api.get("/api/pengaduan");
    const pengaduan = Array.isArray(data?.data) ? data.data : [];

    const total = pengaduan.length;
    const diproses = pengaduan.filter((p) => p.statusPenanganan === "Diproses").length;
    const selesai = pengaduan.filter((p) => p.statusPenanganan === "Selesai").length;
    const darurat = pengaduan.filter((p) => p.tingkatUrgensi === "DARURAT").length;

    // Dashboard membaca p.status; data dari server memakai statusPenanganan
    const terbaru = pengaduan
      .slice(0, 5)
      .map((p) => ({ ...p, status: p.status ?? p.statusPenanganan }));

    return {
      kpi: { total, diproses, selesai, darurat },
      notifikasi: [],
      laporanTerbaru: terbaru,
    };
  })().finally(() => {
    sedangJalan = null;
  });

  return sedangJalan;
}

export async function fetchNotifikasi() {
  return [];
}