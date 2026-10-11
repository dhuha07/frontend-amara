import api from "./api";

export async function fetchLaporan({ tgl_mulai, tgl_selesai } = {}) {
  const params = {};
  if (tgl_mulai) params.tgl_mulai = tgl_mulai;
  if (tgl_selesai) params.tgl_selesai = tgl_selesai;
  const { data } = await api.get("/api/laporan", { params });
  return {
    labelRentang: data.judulGrafik || "Pengaduan",
    judulGrafik: data.judulGrafik || "Pengaduan",
    total: data.total || 0,
    status: data.status || { selesai: 0, diproses: 0, darurat: 0, ditolak: 0 },
    perPeriode: data.perPeriode || [],
    kategori: data.kategori || []
  };
}