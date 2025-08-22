require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

let pool;

async function initDb() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "siswa_db",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  const [rows] = await pool.query("SELECT 1 + 1 AS result");
  console.log("DB ok:", rows[0].result === 2);
}

app.get("/students", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("GET /students error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/students/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /students/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } =
      req.body;

    if (!kode_siswa || !nama_siswa) {
      return res
        .status(400)
        .json({ error: "kode_siswa and nama_siswa required" });
    }

    const [result] = await pool.query(
      "INSERT INTO students (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa) VALUES (?, ?, ?, ?, ?)",
      [
        kode_siswa,
        nama_siswa,
        alamat_siswa || null,
        tgl_siswa || null,
        jurusan_siswa || null,
      ]
    );
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /students error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const { nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;

    await pool.query(
      "UPDATE students SET nama_siswa = ?, alamat_siswa = ?, tgl_siswa = ?, jurusan_siswa = ? WHERE id = ?",
      [nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa, req.params.id]
    );

    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("PUT /students/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM students WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /students/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

initDb()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch((err) => {
    console.error("DB init failed", err);
    process.exit(1);
  });
