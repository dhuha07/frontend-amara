import { PRIORITAS_STYLE } from "../utils/constants";

// Lencana prioritas: Rendah, Sedang, Tinggi
export default function PriorityBadge({ prioritas }) {
  const gaya = PRIORITAS_STYLE[prioritas] || "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${gaya}`}
    >
      {prioritas}
    </span>
  );
}