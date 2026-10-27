import { useCallback, useEffect, useRef, useState } from "react";

const AWALAN = "amara_cache:";
const UMUR_MAKS = 10 * 60 * 1000; // data lama lebih dari 10 menit dianggap kedaluwarsa

function baca(kunci) {
  try {
    const mentah = sessionStorage.getItem(AWALAN + kunci);
    if (!mentah) return null;
    const { waktu, data } = JSON.parse(mentah);
    if (Date.now() - waktu > UMUR_MAKS) return null;
    return data;
  } catch {
    return null;
  }
}

function simpan(kunci, data) {
  try {
    sessionStorage.setItem(AWALAN + kunci, JSON.stringify({ waktu: Date.now(), data }));
  } catch {
    // abaikan jika penyimpanan penuh atau diblokir
  }
}

// Panggil saat pengguna keluar, supaya data pengaduan tidak tertinggal di browser
export function hapusCacheData() {
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(AWALAN))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {
    // abaikan
  }
}

// Menampilkan data lama seketika (jika ada), lalu menyegarkannya di belakang layar.
// memuat = true hanya saat belum ada data sama sekali (tampilkan skeleton).
export default function useDataCepat(kunci, ambil, { aktif = true } = {}) {
  const [data, setData] = useState(() => baca(kunci));
  const [memuat, setMemuat] = useState(() => baca(kunci) === null);
  const [menyegarkan, setMenyegarkan] = useState(false);
  const [error, setError] = useState(null);
  const ambilRef = useRef(ambil);
  const nomor = useRef(0);

  useEffect(() => {
    ambilRef.current = ambil;
  });

  const muat = useCallback(async () => {
    const id = ++nomor.current;
    setMenyegarkan(true);
    setError(null);
    try {
      const hasil = await ambilRef.current();
      if (id !== nomor.current) return; // permintaan lama diabaikan
      setData(hasil);
      simpan(kunci, hasil);
    } catch (e) {
      if (id !== nomor.current) return;
      setError(e);
    } finally {
      if (id === nomor.current) {
        setMemuat(false);
        setMenyegarkan(false);
      }
    }
  }, [kunci]);

  useEffect(() => {
    if (!aktif) return undefined;
    const awal = baca(kunci);
    setData(awal);
    setMemuat(awal === null);
    muat();
    return () => {
      nomor.current += 1;
    };
  }, [kunci, aktif, muat]);

  return { data, memuat, menyegarkan, error, muatUlang: muat };
}