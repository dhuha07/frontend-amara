import api from "./api";

export async function fetchPengaduan() {
  const { data } = await api.get("/api/pengaduan");
  const pengaduan = data.data || [];
  
  // Map backend format ke frontend format
  return pengaduan.map(p => ({
    id: `PGD-2026-${String(p.id).padStart(4, '0')}`,
    pelapor: p.namaPelapor || 'Anonim',
    noWa: p.noWa,
    kategori: p.kategoriKasus || 'Belum Teridentifikasi',
    judul: p.detailKekerasan || `Pengaduan ${p.kategoriKasus || 'Umum'}`,
    deskripsi: `${p.detailKekerasan}. Pelaku: ${p.pelaku}. Lokasi: ${p.lokasiKejadian}`,
    lokasi: p.lokasiKejadian,
    status: p.statusPenanganan,
    prioritas: p.tingkatUrgensi === 'DARURAT' ? 'Tinggi' : 'Sedang',
    tanggal: p.createdAt,
    riwayatStatus: []
  }));
}

export async function fetchPengaduanById(id) {
  // Extract numeric ID dari format PGD-2026-0084
  const numericId = id.includes('-') ? parseInt(id.split('-')[2]) : id;
  const { data } = await api.get(`/api/pengaduan/${numericId}`);
  const p = data.pengaduan;
  
  return {
    id: `PGD-2026-${String(p.id).padStart(4, '0')}`,
    pelapor: p.namaPelapor || 'Anonim',
    noWa: p.noWa,
    kategori: p.kategoriKasus || 'Belum Teridentifikasi',
    judul: p.detailKekerasan || `Pengaduan ${p.kategoriKasus || 'Umum'}`,
    deskripsi: `${p.detailKekerasan}. Pelaku: ${p.pelaku}. Lokasi: ${p.lokasiKejadian}`,
    lokasi: p.lokasiKejadian,
    status: p.statusPenanganan,
    prioritas: p.tingkatUrgensi === 'DARURAT' ? 'Tinggi' : 'Sedang',
    tanggal: p.createdAt,
    riwayatStatus: data.riwayatStatus.map(r => ({
      status: r.status,
      catatan: r.catatan,
      waktu: r.waktu,
      petugas: r.petugas
    }))
  };
}

export async function updatePengaduan(id, { status, catatan, petugas = "Admin" }) {
  const numericId = id.includes('-') ? parseInt(id.split('-')[2]) : id;
  const { data } = await api.post(`/api/pengaduan/${numericId}/status`, { status, catatan, petugas });
  return data;
}