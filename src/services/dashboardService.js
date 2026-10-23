import api from "./api";

export async function fetchDashboard() {
  const { data } = await api.get("/api/pengaduan");
  const pengaduan = data.data || [];
  
  const total = pengaduan.length;
  const diproses = pengaduan.filter(p => p.statusPenanganan === 'Diproses').length;
  const selesai = pengaduan.filter(p => p.statusPenanganan === 'Selesai').length;
  const darurat = pengaduan.filter(p => p.tingkatUrgensi === 'DARURAT').length;
  
  const terbaru = pengaduan.slice(0, 5);
  
  return {
    kpi: { total, diproses, selesai, darurat },
    notifikasi: [],
    laporanTerbaru: terbaru,
  };
}

export async function fetchNotifikasi() {
  return [];
}