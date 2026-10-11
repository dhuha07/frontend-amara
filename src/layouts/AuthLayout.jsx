import { useState } from "react";
import { ShieldCheck, HeartHandshake } from "lucide-react";

// Kerangka halaman masuk dan daftar:
// satu wadah abu-abu membulat berisi panel biru-hijau (kiri) dan kartu formulir (kanan)
export default function AuthLayout({ children }) {
  const [logoGagal, setLogoGagal] = useState(false);
  const [ilustrasiGagal, setIlustrasiGagal] = useState(false);

  return (
    <div className="min-h-dvh bg-white p-3 lg:p-5">
      <div className="flex min-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-3xl bg-gray-200 lg:min-h-[calc(100dvh-2.5rem)] lg:flex-row">
        {/* Panel kiri */}
        <aside className="relative flex flex-col rounded-3xl bg-gradient-to-b from-navy via-[#1b5a78] to-[#18a34e] px-6 py-6 text-white lg:w-[42%] lg:max-w-[640px] lg:px-10 lg:py-10 xl:px-14">
          {/* Logo dan nama dinas */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/*
              Wadah logo. Gambar diperbesar (scale) untuk mengimbangi ruang transparan
              di file PNG. Jika logo masih terlalu kecil/besar, ubah angka scale-[2.2]
              (contoh: scale-[1.8] lebih kecil, scale-[2.8] lebih besar).
            */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center lg:h-24 lg:w-24">
              {logoGagal ? (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/15">
                  <ShieldCheck size={32} aria-hidden="true" />
                </div>
              ) : (
                <img
                  src="/logo-magelang.png"
                  alt="Lambang Kota Magelang"
                  onError={() => setLogoGagal(true)}
                  className="h-full w-full origin-center scale-[2.2] object-contain"
                />
              )}
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none tracking-wide lg:text-4xl xl:text-5xl">
                DPMP4KB
              </p>
              <p className="mt-1 text-sm font-medium tracking-wide lg:text-lg">KOTA MAGELANG</p>
            </div>
          </div>

          <h2 className="mt-5 text-lg font-semibold leading-snug lg:mt-10 lg:text-3xl xl:text-4xl">
            Sistem Pengaduan Masyarakat
          </h2>
          <p className="mt-4 hidden text-base leading-relaxed text-white/90 lg:block xl:text-lg">
            Layanan pengaduan dan perlindungan perempuan dan anak
          </p>

          {/* Ilustrasi (hanya layar lebar). Jika gambar belum ada, tampil ikon pengganti */}
          <div className="hidden flex-1 items-center justify-center py-8 lg:flex">
            {!ilustrasiGagal ? (
              <img
                src="/ilustrasi-ibu-anak.png"
                alt=""
                aria-hidden="true"
                onError={() => setIlustrasiGagal(true)}
                className="max-h-[360px] w-auto object-contain xl:max-h-[420px]"
              />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white/10">
                <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white/10">
                  <HeartHandshake size={72} aria-hidden="true" />
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 hidden text-center text-sm text-white/90 lg:block">
            © {new Date().getFullYear()} DPMP4KB Kota Magelang
          </p>
        </aside>

        {/* Panel kanan */}
        <div className="flex flex-1 flex-col">
          <main className="flex flex-1 items-center justify-center px-0 py-4 lg:px-10 lg:py-10">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm md:p-8 lg:max-w-lg lg:p-10">
              {children}
            </div>
          </main>
          <p className="pb-4 text-center text-xs text-gray-600 lg:hidden">
            © {new Date().getFullYear()} DPMP4KB Kota Magelang
          </p>
        </div>
      </div>
    </div>
  );
}