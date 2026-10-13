import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Consent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: "", nik: "", tgl_lahir: "", alamat: "" });

  const submit = async (e) => {
    e.preventDefault();
    // Simpan ke DB nanti
    toast.success("Informed Consent tersimpan!");
    navigate("/penjadwalan");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Informed Consent</h2>
      <form onSubmit={submit} className="space-y-4">
        <input required placeholder="Nama Lengkap" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={e => setForm({...form, nama: e.target.value})} />
        <input required placeholder="NIK" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={e => setForm({...form, nik: e.target.value})} />
        <input required type="date" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={e => setForm({...form, tgl_lahir: e.target.value})} />
        <textarea required placeholder="Alamat" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={e => setForm({...form, alamat: e.target.value})} />
        <button type="submit" className="w-full bg-emerald text-white p-3 rounded-lg font-semibold hover:bg-emerald-dark transition">Lanjut ke Penjadwalan</button>
      </form>
    </div>
  );
}
