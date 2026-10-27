import { useEffect, useRef, useState } from "react";

export default function useAngkaNaik(target, durasi = 900) {
  const [nilai, setNilai] = useState(0);
  const sekarang = useRef(0);

  useEffect(() => {
    const tujuan = Number(target) || 0;
    const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (kurangiGerak || sekarang.current === tujuan) {
      sekarang.current = tujuan;
      setNilai(tujuan);
      return undefined;
    }

    const awal = sekarang.current;
    const mulai = performance.now();
    let rangka;

    const langkah = (waktu) => {
      const p = Math.min((waktu - mulai) / durasi, 1);
      const lembut = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // melambat halus di akhir
      const v = Math.round(awal + (tujuan - awal) * lembut);
      sekarang.current = v;
      setNilai(v);
      if (p < 1) rangka = requestAnimationFrame(langkah);
    };

    rangka = requestAnimationFrame(langkah);
    return () => cancelAnimationFrame(rangka);
  }, [target, durasi]);

  return nilai;
}