import api from "./api";

export async function fetchPengguna() {
  const { data } = await api.get("/api/pengguna");
  return data.data || [];
}

export async function tambahPengguna({ nama, email, peran }) {
  const { data } = await api.post("/api/pengguna", { nama, email, peran });
  return data;
}

export async function ubahPengguna(id, { nama, email, peran }) {
  const { data } = await api.put(`/api/pengguna/${id}`, { nama, email, peran });
  return data;
}

export async function ubahStatusPengguna(id, status) {
  const { data } = await api.patch(`/api/pengguna/${id}/status`, { status });
  return data;
}

export async function hapusPengguna(id) {
  const { data } = await api.delete(`/api/pengguna/${id}`);
  return data;
}