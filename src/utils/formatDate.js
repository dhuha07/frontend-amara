// Format tanggal dalam bahasa Indonesia

const BULAN = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const pad = (n) => String(n).padStart(2, "0");

// Contoh hasil: "12 Mei 2025, 14:30"
export function formatTanggal(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Contoh hasil: "12 Mei 2025"
export function formatTanggalSingkat(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

// Contoh hasil: "14:30"
export function formatJam(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Label pemisah tanggal di chat: "Hari ini", "Kemarin", atau tanggal
export function labelHari(iso) {
  const d = new Date(iso);
  const sekarang = new Date();
  const mulaiHari = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const selisih = Math.round((mulaiHari(sekarang) - mulaiHari(d)) / 86400000);
  if (selisih === 0) return "Hari ini";
  if (selisih === 1) return "Kemarin";
  return formatTanggalSingkat(iso);
}