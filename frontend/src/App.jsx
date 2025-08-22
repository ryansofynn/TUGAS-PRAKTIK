import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    kode_siswa: "",
    nama_siswa: "",
    alamat_siswa: "",
    tgl_siswa: "",
    jurusan_siswa: "",
  });

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      alert("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Hapus data ini?")) return;
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
      setStudents(students.filter((s) => s.id !== id));
    } catch {
      alert("Gagal menghapus");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("gagal simpan");
      const newStudent = await res.json();
      setStudents([...students, newStudent]);
      setForm({
        kode_siswa: "",
        nama_siswa: "",
        alamat_siswa: "",
        tgl_siswa: "",
        jurusan_siswa: "",
      });
    } catch {
      alert("Gagal menyimpan");
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Data Siswa</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Kode</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Tgl Lahir</th>
              <th>Jurusan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.kode_siswa}</td>
                <td>{s.nama_siswa}</td>
                <td>{s.alamat_siswa}</td>
                <td>
                  {s.tgl_siswa
                    ? new Date(s.tgl_siswa).toLocaleDateString()
                    : ""}
                </td>
                <td>{s.jurusan_siswa}</td>
                <td>
                  <button onClick={() => handleDelete(s.id)}>Hapus</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="7">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
