-- Active: 1755748362030@@127.0.0.1@3306@siswa_db
CREATE DATABASE IF NOT EXISTS siswa_db;
USE siswa_db;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_siswa VARCHAR(50) NOT NULL UNIQUE,
  nama_siswa VARCHAR(255) NOT NULL,
  alamat_siswa TEXT,
  tgl_siswa DATE,
  jurusan_siswa VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
VALUES
('1','Shafa Syauqi','Jl. Bandung','2002-05-15','RPL'),
('2','Rima Vania','Jl. Cimahi','2002-11-21','TKJ'),
('3','Siti Risnawati','Jl. Sukabumi','2005-02-20','Mesin'),
('4','Tongseng','Jl. Cianjur','2002-05-20','Perhotelan'),
('5','Roheni','Jl. Kliningan','2004-03-01','Industri');

SHOW DATABASES;