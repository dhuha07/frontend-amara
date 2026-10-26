// Aturan layanan PPPA:
// - Perempuan: dilayani semua usia.
// - Laki-laki: dilayani sampai hari ulang tahun ke-17 (17 tahun 1 hari sudah tidak bisa).
export const BATAS_USIA_ANAK = 17;

// true  = laki-laki dilayani sampai TEPAT hari ulang tahun ke-17
// false = laki-laki dilayani selama belum berusia 18 tahun (batas usia anak menurut UU Perlindungan Anak)
export const BATAS_TEPAT_17_TAHUN = true;

export const JENIS_KELAMIN = ["Perempuan", "Laki-laki"];

const NAMA_BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// Ubah teks "YYYY-MM-DD" menjadi tanggal; null jika tidak valid (misalnya 31 Februari)
function bacaTanggal(teks) {
  const [t, b, h] = String(teks || "").split("-").map(Number);
  if (!t || !b || !h) return null;
  const tgl = new Date(t, b - 1, h);
  if (tgl.getFullYear() !== t || tgl.getMonth() !== b - 1 || tgl.getDate() !== h) return null;
  return tgl;
}

// Ambil tanggalnya saja (jam diabaikan)
const awalHari = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Tambah tahun pada tanggal. Lahir 29 Februari: pada tahun bukan kabisat dihitung 1 Maret
const tambahTahun = (tgl, n) => new Date(tgl.getFullYear() + n, tgl.getMonth(), tgl.getDate());

// Kurangi hari dari tanggal
const kurangiHari = (tgl, n) => new Date(tgl.getFullYear(), tgl.getMonth(), tgl.getDate() - n);

// Selisih tahun, bulan, dan hari antara tanggal lahir dan hari acuan
function selisih(lahir, hari) {
  let tahun = hari.getFullYear() - lahir.getFullYear();
  let bulan = hari.getMonth() - lahir.getMonth();
  let tgl = hari.getDate() - lahir.getDate();
  if (tgl < 0) {
    bulan -= 1;
    tgl += new Date(hari.getFullYear(), hari.getMonth(), 0).getDate();
  }
  if (bulan < 0) {
    tahun -= 1;
    bulan += 12;
  }
  return { tahun, bulan, hari: tgl };
}

function teksUsia({ tahun, bulan, hari }) {
  const bagian = [`${tahun} tahun`];
  if (bulan > 0) bagian.push(`${bulan} bulan`);
  if (hari > 0) bagian.push(`${hari} hari`);
  return bagian.join(" ");
}

const teksTanggal = (d) => `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;

// Hitung usia penuh (tahun) dari tanggal lahir "YYYY-MM-DD"; null jika tidak valid
export function hitungUsia(tglLahir, acuan = new Date()) {
  const lahir = bacaTanggal(tglLahir);
  if (!lahir) return null;
  return selisih(lahir, awalHari(acuan)).tahun;
}

// Periksa apakah korban dapat dilayani
export function periksaKelayakan({ jenisKelamin, tglLahir }, acuan = new Date()) {
  const lahir = bacaTanggal(tglLahir);
  const hari = awalHari(acuan);
  const rinci = lahir ? selisih(lahir, hari) : null;
  const usia = rinci ? rinci.tahun : null;

  if (!JENIS_KELAMIN.includes(jenisKelamin) || usia === null || usia < 0) {
    return { lengkap: false, layak: null, usia, alasan: "" };
  }

  if (jenisKelamin === "Perempuan") {
    return {
      lengkap: true,
      layak: true,
      usia,
      alasan: usia <= BATAS_USIA_ANAK ? "Anak perempuan" : "Perempuan dewasa",
    };
  }

  // Laki-laki: tentukan hari terakhir yang masih dilayani
  const hariTerakhir = BATAS_TEPAT_17_TAHUN
    ? tambahTahun(lahir, BATAS_USIA_ANAK)
    : kurangiHari(tambahTahun(lahir, BATAS_USIA_ANAK + 1), 1);

  if (hari <= hariTerakhir) {
    return {
      lengkap: true,
      layak: true,
      usia,
      alasan: `Anak laki-laki (dilayani sampai ${teksTanggal(hariTerakhir)})`,
    };
  }
  return {
    lengkap: true,
    layak: false,
    usia,
    alasan: `Laki-laki berusia ${teksUsia(rinci)}, melebihi batas layanan (sampai ${teksTanggal(hariTerakhir)})`,
  };
}