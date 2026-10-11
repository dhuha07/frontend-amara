// Data percakapan tiruan (fiktif). Nomor sama dengan data pengaduan.

// Waktu pada hari tertentu (hari, jam, menit)
const hr = (hari, jam, menit = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - hari);
  d.setHours(jam, menit, 0, 0);
  return d.toISOString();
};

// Waktu relatif: n menit yang lalu (agar pesan hari ini selalu masuk akal)
const mnt = (n) => new Date(Date.now() - n * 60000).toISOString();

// Bentuk pesan: [pengirim, teks, waktu]
const buatKontak = (id, nama, noWa, online, belumDibaca, daftar) => ({
  id,
  nama,
  noWa,
  online,
  belumDibaca,
  pesan: daftar.map(([pengirim, teks, waktu], i) => ({
    id: `${id}-${i + 1}`,
    pengirim,
    teks,
    waktu,
    statusKirim: pengirim === "pelapor" ? "diterima" : "dibaca",
  })),
});

export const chatData = [
  buatKontak("k1", "Siti Aminah", "+6281234567802", true, 2, [
    ["pelapor", "Selamat pagi, saya ingin melapor. Anak saya sering diganggu teman-temannya di sekolah.", hr(1, 10, 20)],
    ["bot", "Selamat pagi. Terima kasih sudah menghubungi AMARA Bot DPMP4KB Kota Magelang. Boleh diceritakan kejadiannya secara singkat?", hr(1, 10, 21)],
    ["pelapor", "Anak saya kelas 5 SD. Hampir tiap hari pulang murung dan sekarang tidak mau berangkat sekolah.", hr(1, 10, 28)],
    ["bot", "Laporan Ibu sudah kami catat dengan nomor PGD-2025-002. Petugas kami akan segera menghubungi Ibu.", hr(1, 10, 30)],
    ["admin", "Selamat siang Bu Siti, saya petugas DPMP4KB. Kami sedang berkoordinasi dengan pihak sekolah.", mnt(95)],
    ["pelapor", "Baik Pak, kapan kira-kira kami bisa bertemu dengan petugas?", mnt(62)],
    ["pelapor", "Anak saya masih takut berangkat sekolah hari ini.", mnt(58)],
  ]),

  buatKontak("k2", "Ibu R. (Anonim)", "+6281234567801", false, 1, [
    ["pelapor", "Selamat pagi, saya butuh bantuan. Saya sering mengalami kekerasan di rumah dan merasa tidak aman.", mnt(330)],
    ["bot", "Terima kasih sudah berani bercerita. Keselamatan Ibu adalah yang utama. Apakah saat ini Ibu berada di tempat yang aman?", mnt(329)],
    ["pelapor", "Saat ini saya di rumah tetangga. Saya ingin tahu ke mana bisa meminta pendampingan.", mnt(322)],
    ["bot", "Laporan Ibu tercatat dengan nomor PGD-2025-001 dan kami tandai darurat. Petugas pendamping akan menghubungi Ibu segera.", mnt(320)],
    ["admin", "Selamat pagi Bu, saya petugas pendamping DPMP4KB. Kami akan membantu pendampingan dan tempat yang aman. Boleh kami hubungi lewat telepon?", mnt(240)],
    ["pelapor", "Boleh, tapi tolong hubungi setelah jam 10 pagi ya.", mnt(210)],
  ]),

  buatKontak("k3", "Lina Marlina", "+6281234567806", true, 1, [
    ["pelapor", "Permisi, saya ingin melaporkan seorang anak di dekat rumah saya yang sering ditinggal sendirian.", mnt(180)],
    ["bot", "Terima kasih atas kepedulian Ibu. Apakah Ibu tahu alamat atau nama kelurahan tempat anak tersebut tinggal?", mnt(179)],
    ["pelapor", "Di Kelurahan Panjang, Magelang Utara. Kadang anaknya terlihat belum makan seharian.", mnt(170)],
    ["bot", "Laporan dicatat dengan nomor PGD-2025-006 dan diteruskan ke petugas perlindungan anak.", mnt(168)],
    ["admin", "Terima kasih Bu Lina. Petugas kami sedang menuju lokasi. Mohon identitas Ibu dijaga dan tidak perlu mendatangi keluarga tersebut.", mnt(150)],
    ["pelapor", "Baik, saya tunggu kabarnya ya.", mnt(140)],
  ]),

  buatKontak("k4", "Dewi Lestari", "+6281234567803", false, 0, [
    ["pelapor", "Halo, saya ingin bertanya tentang layanan KB untuk pasangan usia subur.", hr(3, 13, 0)],
    ["bot", "Halo Bu Dewi. Layanan KB tersedia di puskesmas dan fasilitas kesehatan yang bekerja sama. Ibu ingin informasi jenis kontrasepsi atau lokasi layanan?", hr(3, 13, 1)],
    ["pelapor", "Dua-duanya Bu, saya tinggal di Kemirirejo.", hr(3, 13, 6)],
    ["admin", "Untuk wilayah Kemirirejo, Ibu bisa datang ke puskesmas terdekat. Penyuluh KB juga bisa mendampingi konsultasinya.", hr(1, 11, 0)],
    ["pelapor", "Baik, terima kasih banyak informasinya.", hr(1, 11, 12)],
  ]),

  buatKontak("k5", "Rina Wulandari", "+6281234567804", true, 0, [
    ["pelapor", "Selamat sore, kelompok kami perempuan kepala keluarga ingin ikut pelatihan usaha. Bagaimana caranya?", hr(2, 15, 40)],
    ["bot", "Selamat sore Bu Rina. Pengajuan Ibu sudah kami catat dengan nomor PGD-2025-004. Petugas akan menjadwalkan survei kelompok.", hr(2, 15, 45)],
    ["admin", "Bu Rina, kira-kira berapa anggota kelompoknya dan di kelurahan mana biasanya berkumpul?", hr(1, 9, 30)],
    ["pelapor", "Ada 12 orang Pak, kami berkumpul di Kelurahan Tidar Utara setiap Minggu sore.", hr(1, 9, 50)],
    ["admin", "Terima kasih. Kami jadwalkan survei hari Minggu depan ya Bu.", hr(1, 10, 5)],
  ]),

  buatKontak("k6", "Nur Hidayah", "+6281234567808", false, 0, [
    ["pelapor", "Selamat sore, saya merasa pusing dan haid tidak teratur setelah memakai KB. Apa normal?", hr(1, 16, 0)],
    ["bot", "Terima kasih sudah menghubungi. Keluhan seperti itu perlu diperiksa tenaga kesehatan. Kami jadwalkan konsultasi dengan penyuluh KB, ya.", hr(1, 16, 5)],
    ["admin", "Bu Nur, konsultasi dijadwalkan besok pukul 10.00 di puskesmas. Mohon membawa kartu KB jika ada.", hr(0, 7, 30) > new Date().toISOString() ? mnt(600) : hr(0, 7, 30)],
    ["pelapor", "Baik, saya datang besok. Terima kasih.", mnt(540)],
  ]),
];