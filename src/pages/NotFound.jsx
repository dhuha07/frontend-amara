import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
import EmptyState from "../components/EmptyState";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="p-4 md:p-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <EmptyState
          icon={SearchX}
          title="Halaman tidak ditemukan"
          description="Alamat yang Anda buka tidak tersedia atau sudah dipindahkan."
          actionLabel="Kembali ke Dashboard"
          onAction={() => navigate("/")}
        />
      </div>
    </div>
  );
}