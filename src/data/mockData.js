// Data tiruan (fiktif) untuk DPMP4KB Kota Magelang.
// Data chat dan pengguna ditambahkan pada kelompok berikutnya.

const hariLalu = (hari, jam = 9, menit = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - hari);
  d.setHours(jam, menit, 0, 0);
  return d.toISOString();
};

export const pengaduanData = [
  {
    id: "PGD-2025-001", pelapor: "Ibu R. (Anonim)", noWa: "+6281234567801",
    kategori: "Kekerasan terhadap Perempuan", judul: "Pelapor mengaku mengalami kekerasan dalam rumah tangga",
    deskripsi: "Pelapor menyampaikan sering mengalami kekerasan dari pasangan dan meminta pendampingan serta tempat yang aman.",
    lokasi: "Kelurahan Rejowinangun Utara, Magelang Tengah",
    status: "Darurat", prioritas: "Tinggi", tanggal: hariLalu(0, 8, 15),
    riwayatStatus: [
      { status: "Diproses", catatan: "Laporan diterima melalui AMARA Bot", waktu: hariLalu(0, 8, 15) },
      { status: "Darurat", catatan: "Konselor dan petugas pendamping segera dihubungi", waktu: hariLalu(0, 9, 0) },
    ],
  },
  {
    id: "PGD-2025-002", pelapor: "Siti Aminah", noWa: "+6281234567802",
    kategori: "Perlindungan Anak", judul: "Anak usia sekolah diduga mengalami perundungan berat",
    deskripsi: "Anak pelapor sering pulang dengan kondisi murung dan menolak berangkat sekolah karena diganggu teman-temannya.",
    lokasi: "Kelurahan Cacaban, Magelang Tengah",
    status: "Diproses", prioritas: "Sedang", tanggal: hariLalu(1, 10, 30),
    riwayatStatus: [
      { status: "Diproses", catatan: "Laporan diterima, menunggu koordinasi dengan pihak sekolah", waktu: hariLalu(1, 10, 30) },
    ],
  },
  {
    id: "PGD-2025-003", pelapor: "Dewi Lestari", noWa: "+6281234567803",
    kategori: "Keluarga Berencana", judul: "Permintaan layanan KB untuk pasangan usia subur",
    deskripsi: "Pelapor ingin mengetahui jenis alat kontrasepsi yang sesuai dan lokasi layanan KB terdekat.",
    lokasi: "Kelurahan Kemirirejo, Magelang Tengah",
    status: "Selesai", prioritas: "Rendah", tanggal: hariLalu(3, 13, 0),
    riwayatStatus: [
      { status: "Diproses", catatan: "Laporan diterima", waktu: hariLalu(3, 13, 0) },
      { status: "Selesai", catatan: "Pelapor sudah diarahkan ke puskesmas dan penyuluh KB setempat", waktu: hariLalu(1, 11, 0) },
    ],
  },
  {
    id: "PGD-2025-004", pelapor: "Rina Wulandari", noWa: "+6281234567804",
    kategori: "Pemberdayaan Perempuan", judul: "Permohonan pelatihan usaha bagi perempuan kepala keluarga",
    deskripsi: "Kelompok perempuan kepala keluarga di kelurahan meminta pelatihan keterampilan usaha dan akses permodalan.",
    lokasi: "Kelurahan Tidar Utara, Magelang Selatan",
    status: "Diproses", prioritas: "Sedang", tanggal: hariLalu(2, 15, 45),
    riwayatStatus: [
      { status: "Diproses", catatan: "Pengajuan dicatat, dijadwalkan survei kelompok", waktu: hariLalu(2, 15, 45) },
    ],
  },
  {
    id: "PGD-2025-005", pelapor: "Rudi Hartono", noWa: "+6281234567805",
    kategori: "Pemberdayaan Masyarakat", judul: "Pendampingan kelompok usaha warga tingkat RW",
    deskripsi: "Warga RW membentuk kelompok usaha bersama dan membutuhkan pendampingan administrasi serta pelatihan.",
    lokasi: "Kelurahan Potrobangsan, Magelang Utara",
    status: "Diproses", prioritas: "Rendah", tanggal: hariLalu(4, 9, 20),
    riwayatStatus: [
      { status: "Diproses", catatan: "Koordinasi dengan kelurahan setempat", waktu: hariLalu(4, 9, 20) },
    ],
  },
  {
    id: "PGD-2025-006", pelapor: "Lina Marlina", noWa: "+6281234567806",
    kategori: "Perlindungan Anak", judul: "Anak diduga ditelantarkan oleh orang tuanya",
    deskripsi: "Tetangga melaporkan seorang anak sering ditinggal sendirian tanpa pengawasan dan kekurangan makanan.",
    lokasi: "Kelurahan Panjang, Magelang Utara",
    status: "Darurat", prioritas: "Tinggi", tanggal: hariLalu(0, 7, 40),
    riwayatStatus: [
      { status: "Darurat", catatan: "Petugas perlindungan anak menuju lokasi", waktu: hariLalu(0, 7, 40) },
    ],
  },
  {
    id: "PGD-2025-007", pelapor: "Yoga Pratama", noWa: "+6281234567807",
    kategori: "Pengendalian Penduduk", judul: "Permintaan informasi program Kampung KB",
    deskripsi: "Pengurus kelurahan ingin mengetahui syarat dan tahapan pembentukan Kampung KB di wilayahnya.",
    lokasi: "Kelurahan Magersari, Magelang Selatan",
    status: "Selesai", prioritas: "Rendah", tanggal: hariLalu(6, 11, 10),
    riwayatStatus: [
      { status: "Diproses", catatan: "Laporan diterima", waktu: hariLalu(6, 11, 10) },
      { status: "Selesai", catatan: "Informasi dan panduan telah dikirimkan", waktu: hariLalu(3, 10, 0) },
    ],
  },
  {
    id: "PGD-2025-008", pelapor: "Nur Hidayah", noWa: "+6281234567808",
    kategori: "Keluarga Berencana", judul: "Keluhan efek samping alat kontrasepsi",
    deskripsi: "Pelapor merasa pusing dan haid tidak teratur sejak memakai kontrasepsi dan ingin berkonsultasi.",
    lokasi: "Kelurahan Kramat Utara, Magelang Utara",
    status: "Diproses", prioritas: "Sedang", tanggal: hariLalu(1, 16, 5),
    riwayatStatus: [
      { status: "Diproses", catatan: "Pelapor dijadwalkan konsultasi dengan penyuluh KB", waktu: hariLalu(1, 16, 5) },
    ],
  },
  {
    id: "PGD-2025-009", pelapor: "Hendra Kusuma", noWa: "+6281234567809",
    kategori: "Pemberdayaan Masyarakat", judul: "Permohonan bantuan modal usaha pribadi",
    deskripsi: "Pelapor meminta bantuan dana modal untuk usaha pribadi.",
    lokasi: "Kelurahan Jurangombo Selatan, Magelang Selatan",
    status: "Ditolak", prioritas: "Rendah", tanggal: hariLalu(8, 14, 30),
    riwayatStatus: [
      { status: "Diproses", catatan: "Laporan diterima", waktu: hariLalu(8, 14, 30) },
      { status: "Ditolak", catatan: "Bantuan hanya untuk kelompok, pelapor disarankan bergabung dengan kelompok usaha", waktu: hariLalu(6, 9, 0) },
    ],
  },
  {
    id: "PGD-2025-010", pelapor: "Maya Sari", noWa: "+6281234567810",
    kategori: "Pemberdayaan Masyarakat", judul: "Pembinaan kader posyandu di tingkat RW",
    deskripsi: "Kader posyandu meminta pelatihan pencatatan dan penyuluhan bagi warga.",
    lokasi: "Kelurahan Wates, Magelang Utara",
    status: "Selesai", prioritas: "Sedang", tanggal: hariLalu(9, 8, 0),
    riwayatStatus: [
      { status: "Diproses", catatan: "Laporan diterima", waktu: hariLalu(9, 8, 0) },
      { status: "Selesai", catatan: "Pelatihan kader telah dilaksanakan", waktu: hariLalu(5, 13, 0) },
    ],
  },
  {
    id: "PGD-2025-011", pelapor: "Ibu F. (Anonim)", noWa: "+6281234567811",
    kategori: "Kekerasan terhadap Perempuan", judul: "Permintaan perlindungan darurat dan rumah aman",
    deskripsi: "Pelapor merasa terancam dan membutuhkan tempat berlindung sementara bersama anaknya.",
    lokasi: "Kelurahan Gelangan, Magelang Tengah",
    status: "Darurat", prioritas: "Tinggi", tanggal: hariLalu(0, 6, 50),
    riwayatStatus: [
      { status: "Darurat", catatan: "Koordinasi dengan unit layanan perlindungan perempuan dan anak", waktu: hariLalu(0, 6, 50) },
    ],
  },
  {
    id: "PGD-2025-012", pelapor: "Fitri Handayani", noWa: "+6281234567812",
    kategori: "Perlindungan Anak", judul: "Konsultasi pola asuh anak usia remaja",
    deskripsi: "Orang tua merasa kesulitan berkomunikasi dengan anak remaja dan ingin berkonsultasi dengan psikolog.",
    lokasi: "Kelurahan Kedungsari, Magelang Utara",
    status: "Diproses", prioritas: "Rendah", tanggal: hariLalu(5, 10, 15),
    riwayatStatus: [
      { status: "Diproses", catatan: "Jadwal konsultasi sedang diatur", waktu: hariLalu(5, 10, 15) },
    ],
  },
  {
    id: "PGD-2025-013", pelapor: "Joko Susilo", noWa: "+6281234567813",
    kategori: "Keluarga Berencana", judul: "Permintaan penyuluhan KB di tingkat RW",
    deskripsi: "Ketua RW meminta penyuluhan keluarga berencana bagi warga pasangan muda.",
    lokasi: "Kelurahan Magersari, Magelang Selatan",
    status: "Selesai", prioritas: "Sedang", tanggal: hariLalu(11, 9, 40),
    riwayatStatus: [
      { status: "Diproses", catatan: "Laporan diterima", waktu: hariLalu(11, 9, 40) },
      { status: "Selesai", catatan: "Penyuluhan dilaksanakan di balai RW", waktu: hariLalu(7, 14, 0) },
    ],
  },
  {
    id: "PGD-2025-014", pelapor: "Anita Putri", noWa: "+6281234567814",
    kategori: "Kekerasan terhadap Perempuan", judul: "Permohonan pendampingan hukum bagi korban kekerasan",
    deskripsi: "Pelapor meminta pendampingan hukum dan psikologis untuk anggota keluarganya.",
    lokasi: "Kelurahan Rejowinangun Selatan, Magelang Selatan",
    status: "Diproses", prioritas: "Tinggi", tanggal: hariLalu(1, 7, 30),
    riwayatStatus: [
      { status: "Diproses", catatan: "Petugas pendamping dijadwalkan menemui pelapor", waktu: hariLalu(1, 7, 30) },
    ],
  },
  {
    id: "PGD-2025-015", pelapor: "Bambang Irawan", noWa: "+6281234567815",
    kategori: "Pengendalian Penduduk", judul: "Permohonan pengurusan Kartu Keluarga",
    deskripsi: "Pelapor menanyakan cara pengurusan perubahan data Kartu Keluarga.",
    lokasi: "Kelurahan Wates, Magelang Utara",
    status: "Ditolak", prioritas: "Rendah", tanggal: hariLalu(12, 12, 0),
    riwayatStatus: [
      { status: "Diproses", catatan: "Laporan diterima", waktu: hariLalu(12, 12, 0) },
      { status: "Ditolak", catatan: "Di luar kewenangan dinas, diarahkan ke Dinas Kependudukan dan Pencatatan Sipil", waktu: hariLalu(10, 10, 0) },
    ],
  },
];

export const notifikasiData = [
    { id: 1, teks: "3 laporan berstatus Darurat menunggu penanganan", waktu: hariLalu(0, 9, 5), tipe: "darurat", tautan: "/pengaduan?status=Darurat" },
  { id: 2, teks: "Laporan baru PGD-2025-001 masuk dari WhatsApp", waktu: hariLalu(0, 8, 15), tipe: "baru", tautan: "/pengaduan/PGD-2025-001" },
  { id: 3, teks: "Pesan belum dibaca dari Siti Aminah", waktu: hariLalu(0, 7, 55), tipe: "pesan", tautan: "/chat" },
  { id: 4, teks: "Laporan PGD-2025-014 membutuhkan tindak lanjut", waktu: hariLalu(1, 7, 30), tipe: "tindak", tautan: "/pengaduan/PGD-2025-014" },
  { id: 5, teks: "Laporan PGD-2025-003 telah diselesaikan petugas", waktu: hariLalu(1, 11, 0), tipe: "selesai", tautan: "/pengaduan/PGD-2025-003" },
];