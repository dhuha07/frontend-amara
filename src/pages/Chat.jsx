import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Search,
  Send,
  Check,
  CheckCheck,
  Clock,
  CircleAlert,
  MessageSquare,
  MessageCircle,
  RefreshCw,
  SearchX,
  Bot,
  RotateCw,
} from "lucide-react";
import EmptyState from "../components/EmptyState";
import { SkeletonRows } from "../components/Skeleton";
import {
  fetchKontak,
  fetchPesan,
  kirimPesan,
  tandaiDibaca,
  subscribeChat,
} from "../services/chatService";
import { formatJam, labelHari } from "../utils/formatDate";

// Huruf awal untuk avatar
const inisial = (nama) => (nama.replace(/[^A-Za-z]/g, "")[0] || "?").toUpperCase();

// Waktu di daftar kontak: jam jika hari ini, selain itu label hari
const waktuDaftar = (iso) => (labelHari(iso) === "Hari ini" ? formatJam(iso) : labelHari(iso));

// Centang status pesan
function Centang({ status }) {
  if (status === "mengirim")
    return <Clock size={13} className="text-gray-400" aria-label="Sedang dikirim" />;
  if (status === "gagal")
    return <CircleAlert size={13} className="text-red-500" aria-label="Gagal terkirim" />;
  if (status === "terkirim")
    return <Check size={14} className="text-gray-400" aria-label="Terkirim" />;
  if (status === "diterima")
    return <CheckCheck size={14} className="text-gray-400" aria-label="Diterima" />;
  return <CheckCheck size={14} className="text-sky-500" aria-label="Dibaca" />;
}

function Avatar({ nama, online, ukuran = "h-11 w-11" }) {
  return (
    <div className="relative shrink-0">
      <div
        className={`flex ${ukuran} items-center justify-center rounded-full bg-navy text-sm font-bold text-white`}
        aria-hidden="true"
      >
        {inisial(nama)}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald"
          title="Online"
        />
      )}
    </div>
  );
}

export default function Chat() {
  const [kontak, setKontak] = useState([]);
  const [loadingKontak, setLoadingKontak] = useState(true);
  const [errorKontak, setErrorKontak] = useState(false);

  const [aktifId, setAktifId] = useState(null);
  const [pesanMap, setPesanMap] = useState({});
  const [loadingPesan, setLoadingPesan] = useState(false);
  const [errorPesan, setErrorPesan] = useState(false);

  const [cari, setCari] = useState("");
  const [teks, setTeks] = useState("");
  const [mengetik, setMengetik] = useState([]); // id kontak yang sedang mengetik

  const aktifRef = useRef(null);
  const kontakRef = useRef([]);
  const daftarRef = useRef(null);
  const inputRef = useRef(null);
  const nomorTemp = useRef(0);

  // ---------- Muat data ----------
  const muatKontak = useCallback(async (senyap = false) => {
    if (!senyap) setLoadingKontak(true);
    setErrorKontak(false);
    try {
      setKontak(await fetchKontak());
    } catch {
      if (!senyap) setErrorKontak(true);
    } finally {
      setLoadingKontak(false);
    }
  }, []);

  useEffect(() => {
    muatKontak();
  }, [muatKontak]);

  useEffect(() => {
    kontakRef.current = kontak;
  }, [kontak]);

  const muatPesan = useCallback(async (id) => {
    setLoadingPesan(true);
    setErrorPesan(false);
    try {
      const data = await fetchPesan(id);
      setPesanMap((prev) => ({ ...prev, [id]: data }));
    } catch {
      if (aktifRef.current === id) setErrorPesan(true);
    } finally {
      if (aktifRef.current === id) setLoadingPesan(false);
    }
  }, []);

  // ---------- Kejadian waktu nyata (WebSocket atau simulasi) ----------
  useEffect(() => {
    const berhenti = subscribeChat((e) => {
      if (e.type === "mengetik") {
        setMengetik((prev) => (prev.includes(e.kontakId) ? prev : [...prev, e.kontakId]));
        return;
      }
      if (e.type !== "pesan_baru") return;

      const { kontakId, pesan } = e;
      const aktif = aktifRef.current === kontakId;
      setMengetik((prev) => prev.filter((x) => x !== kontakId));

      // Kontak baru yang belum ada di daftar: muat ulang daftar
      if (!kontakRef.current.some((k) => k.id === kontakId)) muatKontak(true);

      setPesanMap((prev) => {
        const lama = prev[kontakId];
        if (!lama || lama.some((m) => m.id === pesan.id)) return prev;
        const diperbarui =
          pesan.pengirim === "pelapor"
            ? lama.map((m) => (m.pengirim !== "pelapor" ? { ...m, statusKirim: "dibaca" } : m))
            : lama;
        return { ...prev, [kontakId]: [...diperbarui, pesan] };
      });

      setKontak((prev) =>
        prev.map((k) =>
          k.id === kontakId
            ? {
                ...k,
                pesanTerakhir: pesan.teks,
                waktu: pesan.waktu,
                belumDibaca: aktif || pesan.pengirim !== "pelapor" ? 0 : k.belumDibaca + 1,
              }
            : k
        )
      );

      if (aktif && pesan.pengirim === "pelapor") tandaiDibaca(kontakId).catch(() => {});
    });
    return berhenti;
  }, [muatKontak]);

  // ---------- Buka dan tutup percakapan ----------
  const bukaKontak = (id) => {
    aktifRef.current = id;
    setAktifId(id);
    setTeks("");
    setKontak((prev) => prev.map((k) => (k.id === id ? { ...k, belumDibaca: 0 } : k)));
    tandaiDibaca(id).catch(() => {});
    if (!pesanMap[id]) muatPesan(id);
    else setLoadingPesan(false);
    setErrorPesan(false);
  };

  const tutupChat = () => {
    aktifRef.current = null;
    setAktifId(null);
  };

  // ---------- Kirim pesan ----------
  const ubahPesan = (id, kontakId, perubahan) =>
    setPesanMap((prev) => ({
      ...prev,
      [kontakId]: (prev[kontakId] || []).map((m) => (m.id === id ? { ...m, ...perubahan } : m)),
    }));

  const kirim = async (isi, idUlang) => {
    const kontakId = aktifRef.current;
    if (!kontakId) return;

    const idTemp = idUlang || `tmp-${++nomorTemp.current}`;
    const sekarang = new Date().toISOString();

    if (idUlang) {
      ubahPesan(idTemp, kontakId, { statusKirim: "mengirim" });
    } else {
      // Pembaruan optimistis: pesan langsung tampil
      const pesanTemp = { id: idTemp, pengirim: "admin", teks: isi, waktu: sekarang, statusKirim: "mengirim" };
      setPesanMap((prev) => ({ ...prev, [kontakId]: [...(prev[kontakId] || []), pesanTemp] }));
      setKontak((prev) =>
        prev.map((k) => (k.id === kontakId ? { ...k, pesanTerakhir: isi, waktu: sekarang } : k))
      );
    }

    try {
      const asli = await kirimPesan(kontakId, isi);
      setPesanMap((prev) => {
        const daftar = prev[kontakId] || [];
        const sudahAda = daftar.some((m) => m.id === asli.id);
        const baru = sudahAda
          ? daftar.filter((m) => m.id !== idTemp)
          : daftar.map((m) => (m.id === idTemp ? asli : m));
        return { ...prev, [kontakId]: baru };
      });
    } catch {
      ubahPesan(idTemp, kontakId, { statusKirim: "gagal" });
    }
  };

  const kirimDariInput = () => {
    const isi = teks.trim();
    if (!isi) return;
    setTeks("");
    kirim(isi);
    inputRef.current?.focus();
  };

  const tekanKey = (e) => {
    // Enter mengirim, Shift+Enter baris baru
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      kirimDariInput();
    }
  };

  // Tinggi kolom ketik menyesuaikan isi (maksimal 120px)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [teks, aktifId]);

  // ---------- Gulir otomatis ke pesan terbawah ----------
  const pesanAktif = aktifId ? pesanMap[aktifId] : undefined;
  const jumlahPesan = pesanAktif ? pesanAktif.length : 0;
  const sedangMengetik = aktifId ? mengetik.includes(aktifId) : false;

  useEffect(() => {
    const el = daftarRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [aktifId, jumlahPesan, sedangMengetik, loadingPesan]);

  // ---------- Turunan data ----------
  const kontakAktif = kontak.find((k) => k.id === aktifId) || null;

  const kontakTampil = useMemo(() => {
    const kunci = cari.trim().toLowerCase();
    return [...kontak]
      .filter((k) =>
        kunci ? `${k.nama} ${k.noWa} ${k.pesanTerakhir}`.toLowerCase().includes(kunci) : true
      )
      .sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
  }, [kontak, cari]);

  // ---------- Tampilan ----------
  return (
    // Tinggi tepat layar dikurangi header (h-14), tanpa position fixed
    <div className="flex h-[calc(100dvh-3.5rem)] overflow-hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* ===== Panel kiri: daftar kontak ===== */}
      <aside
        className={`${aktifId ? "hidden md:flex" : "flex"} min-h-0 w-full shrink-0 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 md:w-80`}
        aria-label="Daftar percakapan"
      >
        <div className="shrink-0 space-y-3 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Riwayat Percakapan</h2>
            <button
              type="button"
              onClick={() => muatKontak()}
              disabled={loadingKontak}
              aria-label="Muat ulang daftar percakapan"
              title="Muat ulang"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:opacity-50 md:h-9 md:w-9"
            >
              <RefreshCw size={16} className={loadingKontak ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama atau nomor"
              aria-label="Cari percakapan"
              className="min-h-[44px] w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loadingKontak ? (
            <SkeletonRows rows={6} />
          ) : errorKontak ? (
            <EmptyState
              icon={CircleAlert}
              title="Gagal memuat percakapan"
              description="Terjadi kendala saat mengambil data. Silakan coba lagi."
              actionLabel="Coba Lagi"
              onAction={() => muatKontak()}
            />
          ) : kontakTampil.length === 0 ? (
            <EmptyState
              icon={cari ? SearchX : MessageSquare}
              title={cari ? "Percakapan tidak ditemukan" : "Belum ada percakapan"}
              description={
                cari
                  ? "Tidak ada kontak yang cocok dengan pencarian Anda."
                  : "Percakapan dari WhatsApp hotline akan muncul di sini."
              }
              actionLabel={cari ? "Hapus Pencarian" : undefined}
              onAction={cari ? () => setCari("") : undefined}
            />
          ) : (
            <ul className="divide-y divide-gray-100">
              {kontakTampil.map((k) => (
                <li key={k.id}>
                  <button
                    type="button"
                    onClick={() => bukaKontak(k.id)}
                    aria-current={k.id === aktifId ? "true" : undefined}
                    className={`flex min-h-[64px] w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald ${
                      k.id === aktifId ? "bg-gray-100" : ""
                    }`}
                  >
                    <Avatar nama={k.nama} online={k.online} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{k.nama}</p>
                        <span
                          className={`shrink-0 text-xs ${
                            k.belumDibaca > 0 ? "font-semibold text-emerald-800" : "text-gray-400"
                          }`}
                        >
                          {waktuDaftar(k.waktu)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-gray-600 dark:text-gray-300">{k.pesanTerakhir}</p>
                        {k.belumDibaca > 0 && (
                          <span
                            className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-emerald px-1.5 text-[11px] font-bold text-white"
                            aria-label={`${k.belumDibaca} pesan belum dibaca`}
                          >
                            {k.belumDibaca}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* ===== Panel kanan: percakapan ===== */}
      <section
        className={`${aktifId ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-1 flex-col`}
        aria-label="Isi percakapan"
      >
        {!kontakAktif ? (
          <div className="flex flex-1 flex-col items-center justify-center bg-[#efeae2] px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-400 shadow-sm">
              <MessageCircle size={30} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Pilih percakapan</h3>
            <p className="mt-1 max-w-xs text-sm text-gray-600 dark:text-gray-300">
              Pilih kontak di sebelah kiri untuk membaca riwayat dan membalas pesan pelapor.
            </p>
          </div>
        ) : (
          <>
            {/* Header chat */}
            <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 md:px-4">
              <button
                type="button"
                onClick={tutupChat}
                aria-label="Kembali ke daftar percakapan"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald md:hidden"
              >
                <ArrowLeft size={20} />
              </button>
              <Avatar nama={kontakAktif.nama} online={kontakAktif.online} ukuran="h-10 w-10" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{kontakAktif.nama}</p>
                <p className="truncate text-xs text-gray-600 dark:text-gray-300">
                  {sedangMengetik ? (
                    <span className="font-medium text-emerald-800">sedang mengetik...</span>
                  ) : (
                    <>
                      {kontakAktif.noWa} · {kontakAktif.online ? "Online" : "Offline"}
                    </>
                  )}
                </p>
              </div>
              <a
                href={`https://wa.me/${kontakAktif.noWa.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka percakapan di WhatsApp"
                title="Buka di WhatsApp"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                <MessageCircle size={20} />
              </a>
            </div>

            {/* Daftar pesan */}
            <div
              ref={daftarRef}
              className="min-h-0 flex-1 overflow-y-auto bg-[#efeae2] px-3 pb-4 pt-3 md:px-6"
            >
              {loadingPesan && !pesanAktif ? (
                <SkeletonRows rows={5} />
              ) : errorPesan ? (
                <EmptyState
                  icon={CircleAlert}
                  title="Gagal memuat pesan"
                  description="Terjadi kendala saat mengambil riwayat percakapan."
                  actionLabel="Coba Lagi"
                  onAction={() => muatPesan(kontakAktif.id)}
                />
              ) : !pesanAktif || pesanAktif.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="Belum ada pesan"
                  description="Mulai percakapan dengan mengirim pesan di bawah."
                />
              ) : (
                <div className="space-y-1.5">
                  {pesanAktif.map((m, i) => {
                    const hari = labelHari(m.waktu);
                    const tampilPemisah = i === 0 || labelHari(pesanAktif[i - 1].waktu) !== hari;
                    const dariPelapor = m.pengirim === "pelapor";
                    return (
                      <div key={m.id}>
                        {tampilPemisah && (
                          <div className="my-3 flex justify-center">
                            <span className="rounded-lg bg-white dark:bg-gray-800/90 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm">
                              {hari}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${dariPelapor ? "justify-start" : "justify-end"}`}>
                          <div
                            className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm md:max-w-[70%] ${
                              dariPelapor ? "bg-white dark:bg-gray-800" : "bg-[#dcf8c6]"
                            }`}
                          >
                            {m.pengirim === "bot" && (
                              <p className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                                <Bot size={12} aria-hidden="true" />
                                AMARA Bot
                              </p>
                            )}
                            <p className="whitespace-pre-wrap break-words text-sm text-gray-900 dark:text-gray-100">
                              {m.teks}
                            </p>
                            <div className="mt-1 flex items-center justify-end gap-1">
                              <span className="text-[11px] text-gray-400">{formatJam(m.waktu)}</span>
                              {!dariPelapor && <Centang status={m.statusKirim} />}
                            </div>
                            {m.statusKirim === "gagal" && (
                              <button
                                type="button"
                                onClick={() => kirim(m.teks, m.id)}
                                className="mt-1 flex min-h-[36px] items-center gap-1 rounded text-xs font-medium text-red-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                              >
                                <RotateCw size={12} aria-hidden="true" />
                                Gagal terkirim. Kirim ulang
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {sedangMengetik && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm italic text-gray-600 dark:text-gray-300 shadow-sm">
                        sedang mengetik...
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Kolom ketik: menempel di bawah, aman dari keyboard dan area aman HP */}
            <div className="sticky bottom-0 shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-100 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-4">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={teks}
                  onChange={(e) => setTeks(e.target.value)}
                  onKeyDown={tekanKey}
                  rows={1}
                  placeholder="Tulis balasan untuk pelapor"
                  aria-label="Tulis pesan"
                  className="min-h-[44px] w-full resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                />
                <button
                  type="button"
                  onClick={kirimDariInput}
                  disabled={!teks.trim()}
                  aria-label="Kirim pesan"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald text-white hover:bg-emerald-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-1.5 hidden text-[11px] text-gray-400 md:block">
                Enter untuk kirim, Shift + Enter untuk baris baru.
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}