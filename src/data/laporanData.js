// Data tiruan (fiktif) untuk halaman Laporan.
// Jumlah per kategori dan per status dibuat sama dengan total per periode.

export const RENTANG = [
  { value: "7h", label: "7 hari terakhir" },
  { value: "30h", label: "30 hari terakhir" },
  { value: "12b", label: "12 bulan terakhir" },
];

export const NAMA_BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export const NAMA_HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const KATEGORI = [
  "Kekerasan terhadap Perempuan",
  "Perlindungan Anak",
  "Pemberdayaan Perempuan",
  "Pemberdayaan Masyarakat",
  "Keluarga Berencana",
  "Pengendalian Penduduk",
];

// Jumlah pengaduan per periode (urut dari terlama ke terbaru)
export const JUMLAH_PERIODE = {
  "7h": [4, 6, 3, 8, 5, 7, 9], // total 42
  "30h": [21, 26, 19, 30], // total 96, per minggu
  "12b": [32, 28, 35, 41, 38, 45, 40, 48, 44, 52, 47, 55], // total 505
};

// Jumlah per kategori (urutan sama dengan KATEGORI)
const JUMLAH_KATEGORI = {
  "7h": [10, 9, 6, 7, 5, 5],
  "30h": [24, 20, 14, 16, 11, 11],
  "12b": [128, 104, 72, 81, 60, 60],
};

// Jumlah per status: [Selesai, Diproses, Darurat, Ditolak]
export const JUMLAH_STATUS = {
  "7h": [18, 16, 5, 3],
  "30h": [48, 32, 9, 7],
  "12b": [290, 130, 45, 40],
};

export const KATEGORI_LAPORAN = KATEGORI;
export const JUMLAH_KATEGORI_LAPORAN = JUMLAH_KATEGORI;