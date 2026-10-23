import api from "./api";

// Ambil nilai pertama yang terisi dari beberapa kemungkinan nama field
function ambil(obj, kunci, bawaan = "") {
  for (const k of kunci) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return bawaan;
}

// Bandingkan teks tanpa peduli huruf besar/kecil
const sama = (a, b) => String(a ?? "").trim().toLowerCase() === b.toLowerCase();

// Seragamkan satu data pengaduan dari backend
function rapikan(p) {
  return {
    id: String(
      ambil(p, ["id", "id_pengaduan", "idPengaduan", "kode", "kode_pengaduan", "nomor_pengaduan"], "-")
    ),
    judul: ambil(p, ["judul", "jenisKekerasan", "jenis_kekerasan", "kategori", "ringkasan"], "Tanpa judul"),
    pelapor: ambil(p, ["pelapor", "namaPelapor", "nama_pelapor", "nama"], "Anonim"),
    tanggal: ambil(p, ["tanggal", "tanggalLapor", "tanggal_lapor", "createdAt", "created_at", "waktu"], null),
    status: ambil(p, ["statusPenanganan", "status_penanganan", "status"], ""),
    urgensi: ambil(p, ["tingkatUrgensi", "tingkat_urgensi", "prioritas"], ""),
  };
}

const waktuAngka = (p) => {
  const t = new Date(p.tanggal).getTime();
  return Number.isNaN(t) ? 0 : t;
};

export async function fetchDashboard() {
  const { data } = await api.get("/api/pengaduan");

  // Bentuk respons bisa berupa daftar langsung atau dibungkus { data: [...] }
  const mentah = Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
  const daftar = (Array.isArray(mentah) ? mentah : []).map(rapikan);

  // Urutkan dari yang terbaru (urutan asli dipertahankan jika tanggal tidak terbaca)
  const urut = [...daftar].sort((a, b) => waktuAngka(b) - waktuAngka(a));

  const selesai = (p) => sama(p.status, "selesai");
  const darurat = (p) => sama(p.urgensi, "darurat") || sama(p.status, "darurat");

  const kpi = {
    total: daftar.length,
    diproses: daftar.filter((p) => sama(p.status, "diproses")).length,
    selesai: daftar.filter(selesai).length,
    darurat: daftar.filter(darurat).length,
  };

  // Notifikasi dibuat dari data: laporan darurat dan laporan yang menunggu tindak lanjut
  const hariIni = new Date().toISOString();
  const notifDarurat = urut
    .filter((p) => darurat(p) && !selesai(p))
    .slice(0, 3)
    .map((p) => ({
      id: `darurat-${p.id}`,
      tipe: "darurat",
      teks: `Laporan darurat ${p.id} dari ${p.pelapor} perlu penanganan segera.`,
      waktu: p.tanggal || hariIni,
      tautan: `/pengaduan/${p.id}`,
    }));
  const notifTindak = urut
    .filter((p) => !darurat(p) && sama(p.status, "diproses"))
    .slice(0, 2)
    .map((p) => ({
      id: `tindak-${p.id}`,
      tipe: "tindak",
      teks: `Laporan ${p.id} masih menunggu tindak lanjut petugas.`,
      waktu: p.tanggal || hariIni,
      tautan: `/pengaduan/${p.id}`,
    }));

  return {
    kpi,
    notifikasi: [...notifDarurat, ...notifTindak],
    laporanTerbaru: urut.slice(0, 5),
  };
}

export async function fetchNotifikasi() {
  return [];
}