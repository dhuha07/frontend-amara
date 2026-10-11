import api, { mockDelay } from "./api";
import { chatData } from "../data/chatData";

/*
 * LAYANAN CHAT
 * ---------------------------------------------------------------
 * Mode tiruan  : VITE_USE_MOCK=true  (data contoh + balasan otomatis)
 * Mode asli    : VITE_USE_MOCK=false (API backend Python + WebSocket)
 *
 * Kontrak backend yang diharapkan (Fonnte dan Gemini hanya di backend):
 *   GET  /chat/kontak                 -> [{ id, nama, noWa, online, belumDibaca, pesanTerakhir, waktu }]
 *   GET  /chat/kontak/:id/pesan       -> [{ id, pengirim, teks, waktu, statusKirim }]
 *   POST /chat/kontak/:id/pesan       body { teks } -> pesan yang dibuat (backend mengirim via Fonnte)
 *   POST /chat/kontak/:id/dibaca      -> menandai percakapan sudah dibaca
 *
 * Nilai pengirim   : "pelapor" | "admin" | "bot"
 * Nilai statusKirim: "mengirim" | "terkirim" | "diterima" | "dibaca" | "gagal"
 *
 * Kejadian WebSocket (VITE_WS_URL) yang dikirim backend:
 *   { "type": "pesan_baru", "kontakId": "k1", "pesan": { ...pesan } }
 *   { "type": "mengetik",   "kontakId": "k1" }
 */

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const WS_URL = import.meta.env.VITE_WS_URL;

// ---------- Penyimpanan lokal untuk mode tiruan ----------
let kontak = structuredClone(chatData);
const pendengar = new Set();
const siarkan = (kejadian) => pendengar.forEach((fn) => fn(kejadian));

const ringkas = (k) => {
  const terakhir = k.pesan[k.pesan.length - 1];
  return {
    id: k.id,
    nama: k.nama,
    noWa: k.noWa,
    online: k.online,
    belumDibaca: k.belumDibaca,
    pesanTerakhir: terakhir ? terakhir.teks : "",
    waktu: terakhir ? terakhir.waktu : new Date().toISOString(),
  };
};

const BALASAN_TIRUAN = [
  "Baik, terima kasih atas bantuannya.",
  "Siap, saya tunggu kabar selanjutnya ya.",
  "Terima kasih banyak, saya mengerti.",
  "Baik, nanti saya kirimkan informasi tambahannya.",
  "Oke, kalau ada perkembangan mohon dikabari ya.",
];

// Simulasi: pelapor mengetik lalu membalas (hanya mode tiruan)
function simulasiBalasan(kontakId) {
  setTimeout(() => {
    siarkan({ type: "mengetik", kontakId });
    setTimeout(() => {
      const k = kontak.find((x) => x.id === kontakId);
      if (!k) return;
      k.pesan.forEach((m) => {
        if (m.pengirim !== "pelapor") m.statusKirim = "dibaca";
      });
      const pesan = {
        id: `${kontakId}-${Date.now()}`,
        pengirim: "pelapor",
        teks: BALASAN_TIRUAN[Math.floor(Math.random() * BALASAN_TIRUAN.length)],
        waktu: new Date().toISOString(),
        statusKirim: "diterima",
      };
      k.pesan.push(pesan);
      k.belumDibaca += 1;
      siarkan({ type: "pesan_baru", kontakId, pesan });
    }, 1500);
  }, 2000);
}

// ---------- Fungsi yang dipakai halaman ----------

// Daftar kontak WhatsApp (sesi aktif)
export async function fetchKontak() {
  if (!USE_MOCK) {
    const { data } = await api.get("/chat/kontak");
    return data;
  }
  return mockDelay(kontak.map(ringkas));
}

// Riwayat pesan satu kontak
export async function fetchPesan(kontakId) {
  if (!USE_MOCK) {
    const { data } = await api.get(`/chat/kontak/${kontakId}/pesan`);
    return data;
  }
  const k = kontak.find((x) => x.id === kontakId);
  return mockDelay(k ? k.pesan : []);
}

// Kirim pesan dari admin (backend meneruskan ke WhatsApp lewat Fonnte)
export async function kirimPesan(kontakId, teks) {
  if (!USE_MOCK) {
    const { data } = await api.post(`/chat/kontak/${kontakId}/pesan`, { teks });
    return data;
  }
  const k = kontak.find((x) => x.id === kontakId);
  if (!k) throw new Error("Kontak tidak ditemukan");
  const pesan = {
    id: `${kontakId}-${Date.now()}`,
    pengirim: "admin",
    teks,
    waktu: new Date().toISOString(),
    statusKirim: "terkirim",
  };
  k.pesan.push(pesan);
  simulasiBalasan(kontakId);
  return mockDelay(pesan);
}

// Tandai percakapan sudah dibaca
export async function tandaiDibaca(kontakId) {
  if (!USE_MOCK) {
    await api.post(`/chat/kontak/${kontakId}/dibaca`);
    return;
  }
  const k = kontak.find((x) => x.id === kontakId);
  if (k) k.belumDibaca = 0;
}

// Berlangganan kejadian waktu nyata. Mengembalikan fungsi untuk berhenti.
export function subscribeChat(onKejadian) {
  // Mode tiruan: dengarkan simulasi lokal
  if (USE_MOCK) {
    pendengar.add(onKejadian);
    return () => pendengar.delete(onKejadian);
  }

  // Mode asli: WebSocket dengan sambung ulang otomatis
  let ws;
  let berhenti = false;
  let percobaan = 0;
  let pewaktu;

  const sambung = () => {
    if (!WS_URL) return;
    ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      percobaan = 0;
    };
    ws.onmessage = (e) => {
      try {
        onKejadian(JSON.parse(e.data));
      } catch {
        // abaikan pesan yang bukan JSON
      }
    };
    ws.onclose = () => {
      if (berhenti) return;
      percobaan += 1;
      pewaktu = setTimeout(sambung, Math.min(30000, 1000 * 2 ** percobaan));
    };
  };
  sambung();

  return () => {
    berhenti = true;
    clearTimeout(pewaktu);
    if (ws) ws.close();
  };
}