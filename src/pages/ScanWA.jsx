import { useState, useEffect } from "react";
import { RefreshCw, Smartphone, CheckCircle2, AlertTriangle } from "lucide-react";
import api from "../services/api";

export default function ScanWA() {
  const [qr, setQr] = useState(null);
  const [status, setStatus] = useState("loading");
  const [pesan, setPesan] = useState("Memuat QR WhatsApp...");

  const fetchQR = async () => {
    try {
      const res = await api.get("/qr-status");
      // Debug: cek respon
      console.log("QR Response:", res.data);
      if (res.data.status === "connected") {
        setStatus("connected");
        setPesan("WhatsApp terhubung! Bot siap menerima pengaduan.");
        setQr(null);
      } else if (res.data.qr || res.data.qr_link) {
        setStatus("scan");
        setQr(res.data.qr || res.data.qr_link);
        setPesan("Scan QR di bawah untuk mengaktifkan bot");
      } else {
        setStatus("scan");
        setPesan("Menunggu QR dari Fonnte...");
      }
    } catch {
      setStatus("error");
      setPesan("Gagal memuat QR. Pastikan backend dan token Fonnte aktif.");
    }
  };

  useEffect(() => {
    fetchQR();
    const interval = setInterval(fetchQR, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scan WhatsApp</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Hubungkan WhatsApp Fonnte ke AMARA Bot tanpa buka dashboard Fonnte.
        </p>
      </div>

      <div className="mx-auto max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm text-center">
        <div className="mb-4 flex justify-center">
          {status === "connected" ? (
            <CheckCircle2 size={48} className="text-emerald" />
          ) : status === "error" ? (
            <AlertTriangle size={48} className="text-amber-500" />
          ) : (
            <Smartphone size={48} className="text-navy dark:text-blue-300" />
          )}
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{pesan}</h3>

        {qr ? (
          <div className="mt-5">
            <div className="mx-auto inline-block rounded-lg border border-gray-200 dark:border-gray-600 bg-white p-3">
              <img src={qr} alt="QR WhatsApp" className="h-64 w-64 object-contain" />
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">QR refresh otomatis tiap 3 detik. Kadaluwarsa sesuai Fonnte.</p>
            <button type="button" onClick={fetchQR} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <RefreshCw size={16} /> Refresh QR
            </button>
          </div>
        ) : status === "connected" ? (
          <div className="mt-5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-800 dark:text-emerald-300">
            Bot aktif. Tidak perlu scan lagi kecuali logout.
          </div>
        ) : null}

        <div className="mt-6 rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-left text-xs leading-relaxed text-gray-600 dark:text-gray-400">
          <p className="font-semibold text-gray-800 dark:text-gray-200">Cara mengaktifkan:</p>
          <ol className="mt-1 list-decimal pl-4 space-y-1">
            <li>Buka WhatsApp di HP → Perangkat Tertaut → Tautkan Perangkat</li>
            <li>Arahkan kamera ke QR di atas</li>
            <li>Tunggu status berubah jadi Terhubung</li>
            <li>Tidak perlu buka web Fonnte lagi</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
