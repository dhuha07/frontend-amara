const KONSELOR = [
  { id: 1, nama: "Dr. Ani, M.Psi", spesialis: "Kesehatan Mental" },
  { id: 2, nama: "Dr. Budi, M.Kes", spesialis: "Keluarga & Anak" },
  { id: 3, nama: "Dr. Citra, Sp.A", spesialis: "Pengembangan Remaja" }
];

export default function Penjadwalan() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold dark:text-white mb-6">Pilih Konselor</h2>
      <div className="grid gap-4">
        {KONSELOR.map(k => (
          <button key={k.id} className="p-5 border rounded-xl hover:border-emerald dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald transition text-left group">
            <h3 className="font-bold text-lg dark:text-white group-hover:text-emerald">{k.nama}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{k.spesialis}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
