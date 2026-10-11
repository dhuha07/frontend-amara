import { STATUS_STYLE } from "../utils/constants";

// Lencana status: Selesai, Diproses, Ditolak, Darurat
export default function StatusBadge({ status }) {
  const gaya = STATUS_STYLE[status] || "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${gaya}`}
    >
      {status}
    </span>
  );
}