// Data pengguna tiruan (fiktif). Alamat email memakai domain contoh.

const hr = (hari, jam = 9, menit = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - hari);
  d.setHours(jam, menit, 0, 0);
  return d.toISOString();
};

export const penggunaData = [
  { id: "u1", nama: "Sri Wahyuni", email: "sri.wahyuni@dpmp4kb.example", peran: "Super Admin", status: "Aktif", terakhirLogin: hr(0, 8, 5) },
  { id: "u2", nama: "Agus Setiawan", email: "agus.setiawan@dpmp4kb.example", peran: "Super Admin", status: "Aktif", terakhirLogin: hr(1, 14, 20) },
  { id: "u3", nama: "Retno Handayani", email: "retno.handayani@dpmp4kb.example", peran: "Admin", status: "Aktif", terakhirLogin: hr(0, 7, 45) },
  { id: "u4", nama: "Bambang Nugroho", email: "bambang.nugroho@dpmp4kb.example", peran: "Admin", status: "Aktif", terakhirLogin: hr(2, 10, 15) },
  { id: "u5", nama: "Lestari Dewi", email: "lestari.dewi@dpmp4kb.example", peran: "Admin", status: "Nonaktif", terakhirLogin: hr(40, 9, 0) },
  { id: "u6", nama: "Fitriani Rahayu", email: "fitriani.rahayu@dpmp4kb.example", peran: "Petugas", status: "Aktif", terakhirLogin: hr(0, 9, 10) },
  { id: "u7", nama: "Dimas Prasetyo", email: "dimas.prasetyo@dpmp4kb.example", peran: "Petugas", status: "Aktif", terakhirLogin: hr(1, 16, 30) },
  { id: "u8", nama: "Wulan Sari", email: "wulan.sari@dpmp4kb.example", peran: "Petugas", status: "Aktif", terakhirLogin: hr(3, 11, 0) },
  { id: "u9", nama: "Hendro Susilo", email: "hendro.susilo@dpmp4kb.example", peran: "Petugas", status: "Nonaktif", terakhirLogin: hr(75, 13, 40) },
  { id: "u10", nama: "Yuliana Putri", email: "yuliana.putri@dpmp4kb.example", peran: "Petugas", status: "Aktif", terakhirLogin: hr(5, 8, 50) },
];