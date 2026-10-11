// Konstanta global aplikasi AMARA Bot (DPMP4KB Kota Magelang)

export const STATUS_LIST = ["Diproses", "Selesai", "Ditolak", "Darurat"];
export const PRIORITAS_LIST = ["Rendah", "Sedang", "Tinggi"];
export const KATEGORI_LIST = [
  "Kekerasan terhadap Perempuan",
  "Perlindungan Anak",
  "Pemberdayaan Perempuan",
  "Pemberdayaan Masyarakat",
  "Keluarga Berencana",
  "Pengendalian Penduduk",
];
export const PERAN_LIST = ["Super Admin", "Admin", "Petugas"];

export const STATUS_STYLE = {
  Selesai: "bg-emerald-100 text-emerald-800",
  Darurat: "bg-red-100 text-red-800",
  Ditolak: "bg-red-100 text-red-800",
  Diproses: "bg-amber-100 text-amber-800",
};

export const PRIORITAS_STYLE = {
  Rendah: "bg-gray-100 text-gray-700",
  Sedang: "bg-amber-100 text-amber-800",
  Tinggi: "bg-red-100 text-red-800",
};

// Warna grafik: navy, emerald, amber, merah, abu-abu, biru muda
export const CHART_COLORS = ["#1e3a8a", "#10b981", "#f59e0b", "#ef4444", "#9ca3af", "#60a5fa"];

export const ROWS_PER_PAGE = 10;