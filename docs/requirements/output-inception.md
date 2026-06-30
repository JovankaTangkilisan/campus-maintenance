# Inception Document: Campus Service Request and Maintenance System

**Versi:** 1.0  
**Tanggal:** 2026-06-30  
**Penulis:** Codex  
**Status:** Draft

---

## 1. Masalah Bisnis

### 1.1 Latar Belakang
Saat ini kampus membutuhkan cara yang terstruktur untuk menerima, memeriksa, menugaskan, memantau, dan menutup laporan gangguan fasilitas. Berdasarkan `CASE.md`, jenis masalah yang ditangani mencakup proyektor rusak, internet bermasalah, AC tidak dingin, kursi rusak, alat laboratorium bermasalah, dan ruangan kotor.

### 1.2 Problem Statement
Saat ini, pelapor mengalami kesulitan menyampaikan dan memantau laporan fasilitas secara konsisten yang menyebabkan proses penanganan menjadi tidak transparan dan sulit ditelusuri. Hal ini terjadi karena belum ada sistem terpusat yang mengelola alur laporan, penugasan teknisi, perubahan status, komentar, dan riwayat status secara end-to-end.

### 1.3 Dampak Bisnis
- Laporan dapat tercecer atau dipantau secara manual.
- Administrator sulit menilai prioritas dan membagi beban kerja teknisi secara konsisten.
- Pelapor kesulitan mengetahui status terbaru dan riwayat penanganan laporan.
- Manajer Fasilitas tidak memiliki ringkasan operasional yang mudah diakses untuk pengambilan keputusan.

---

## 2. Tujuan Proyek

### 2.1 Business Goals
| ID | Tujuan | Metrik Keberhasilan | Target |
|----|--------|---------------------|--------|
| BG-01 | Menyediakan alur pelaporan fasilitas yang terpusat dan tervalidasi | Persentase laporan baru yang tersimpan dengan data lengkap dan status awal tercatat | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] |
| BG-02 | Mempercepat proses triase dan penugasan laporan | Rata-rata waktu dari laporan dibuat sampai ditugaskan ke teknisi | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] |
| BG-03 | Meningkatkan transparansi status penanganan laporan | Persentase laporan yang memiliki riwayat status dan komentar yang dapat dilihat pada detail laporan | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] |
| BG-04 | Menyediakan ringkasan operasional untuk pengawasan fasilitas | Ketersediaan dashboard ringkas yang menampilkan jumlah laporan per status, kategori, prioritas, dan rata-rata waktu penyelesaian | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] |

### 2.2 Project Objectives
| ID | Objektif | Terukur? | Deadline |
|----|----------|----------|----------|
| OBJ-01 | Mengimplementasikan use case inti untuk membuat, melihat, mencari, dan melihat detail laporan | Ya | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] |
| OBJ-02 | Mengimplementasikan alur pemeriksaan, prioritas, penugasan teknisi, dan pembaruan status pekerjaan | Ya | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] |
| OBJ-03 | Menyediakan komentar/catatan, riwayat status otomatis, serta kemampuan menutup atau membuka kembali laporan | Ya | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] |
| OBJ-04 | Menyediakan dashboard sederhana untuk Manajer Fasilitas | Ya | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] |

---

## 3. Stakeholder

| ID | Nama / Peran | Jenis | Kepentingan | Tingkat Keterlibatan |
|----|-------------|-------|-------------|----------------------|
| STK-01 | Pelapor | Internal [ASUMSI] | Membuat laporan, memantau status, dan memberi komentar/konfirmasi | Tinggi |
| STK-02 | Administrator | Internal | Memeriksa laporan, menetapkan prioritas, menugaskan teknisi, dan menutup laporan | Tinggi |
| STK-03 | Teknisi | Internal | Menerima tugas, memperbarui progres, dan menyelesaikan pekerjaan | Tinggi |
| STK-04 | Manajer Fasilitas | Internal | Melihat ringkasan operasional dan data agregat laporan | Sedang |

**Keterangan Tingkat Keterlibatan:**
- Tinggi: Terlibat dalam keputusan dan review rutin
- Sedang: Dikonsultasikan pada milestone tertentu
- Rendah: Diinformasikan pada akhir fase

---

## 4. Scope

### 4.1 Dalam Scope (In Scope)
| ID | Fitur / Kapabilitas | Prioritas |
|----|---------------------|-----------|
| SC-IN-01 | Membuat laporan baru dengan data lokasi, jenis masalah, deskripsi, dan lampiran foto opsional | Must Have |
| SC-IN-02 | Melihat daftar laporan sesuai hak akses per peran | Must Have |
| SC-IN-03 | Mencari dan menyaring laporan berdasarkan status, kategori, prioritas, dan tanggal | Should Have |
| SC-IN-04 | Melihat detail laporan lengkap beserta komentar dan riwayat status | Must Have |
| SC-IN-05 | Memeriksa laporan dan menetapkan kategori | Must Have |
| SC-IN-06 | Menentukan prioritas laporan | Must Have |
| SC-IN-07 | Menugaskan teknisi dan mengirim notifikasi tugas baru | Must Have |
| SC-IN-08 | Mengubah status pekerjaan oleh teknisi | Must Have |
| SC-IN-09 | Menambahkan komentar atau catatan pada laporan | Should Have |
| SC-IN-10 | Menyimpan riwayat status secara otomatis | Must Have |
| SC-IN-11 | Menutup atau membuka kembali laporan | Must Have |
| SC-IN-12 | Menampilkan dashboard sederhana untuk Manajer Fasilitas | Should Have |

### 4.2 Di Luar Scope (Out of Scope)
| ID | Yang Tidak Dikerjakan | Alasan |
|----|----------------------|--------|
| SC-OUT-01 | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] | Batasan non-fungsional dan area yang tidak akan ditangani belum dinyatakan secara eksplisit dalam `CASE.md` |

### 4.3 Batasan Scope
Sistem ini berfokus pada pengelolaan laporan fasilitas kampus dari tahap pembuatan sampai penutupan, termasuk triase, penugasan, pembaruan status, komentar, riwayat status, dan dashboard ringkas. Sistem ini tidak mendefinisikan detail di luar alur laporan tersebut pada dokumen sumber.

---

## 5. Asumsi

| ID | Asumsi | Dampak jika Salah | Pemilik Validasi |
|----|--------|-------------------|-----------------|
| ASM-01 | Alur status utama mengikuti urutan Baru -> Diperiksa -> Ditugaskan -> Diterima -> Sedang Dikerjakan -> Selesai Dikerjakan -> Ditutup, dengan kemungkinan Dibuka Kembali | Desain workflow dan validasi status menjadi tidak sesuai kebutuhan | [BELUM DIDEFINISIKAN] |
| ASM-02 | Mekanisme konfirmasi hasil oleh pelapor dilakukan melalui kombinasi komentar/catatan dan persetujuan eksplisit sebelum penutupan | Proses penutupan laporan tidak dapat dirancang dengan benar | [BELUM DIDEFINISIKAN] |
| ASM-03 | Riwayat status dicatat otomatis oleh sistem setiap kali ada perubahan status | Audit trail dan timeline laporan tidak lengkap | [BELUM DIDEFINISIKAN] |
| ASM-04 | Pelapor, Administrator, Teknisi, dan Manajer Fasilitas adalah stakeholder utama yang menggunakan sistem ini dalam lingkungan kampus | Hak akses, navigasi, dan scope peran dapat berubah | [BELUM DIDEFINISIKAN] |

> Semua asumsi harus divalidasi sebelum fase requirement dimulai.

---

## 6. Constraint

### 6.1 Constraint Bisnis
| ID | Constraint | Sumber | Fleksibilitas |
|----|------------|--------|---------------|
| CON-BIZ-01 | Alur kerja harus mendukung peran Pelapor, Administrator, Teknisi, dan Manajer Fasilitas | `CASE.md` | Terbatas |
| CON-BIZ-02 | Sistem harus mempertahankan jejak riwayat status untuk perubahan yang dipicu oleh proses bisnis utama | `CASE.md` | Tidak |
| CON-BIZ-03 | Dashboard harus menampilkan ringkasan operasional yang relevan bagi manajemen fasilitas | `CASE.md` | Terbatas |

### 6.2 Constraint Teknis
| ID | Constraint | Sumber | Fleksibilitas |
|----|------------|--------|---------------|
| CON-TEC-01 | Sistem harus mendukung hak akses berbeda untuk Pelapor, Administrator, Teknisi, dan Manajer Fasilitas | `CASE.md` | Tidak |
| CON-TEC-02 | Sistem harus menyimpan komentar, status, dan riwayat status agar detail laporan dapat ditampilkan secara lengkap | `CASE.md` | Tidak |
| CON-TEC-03 | Notifikasi tugas baru kepada teknisi harus didukung pada alur penugasan | `CASE.md` | Terbatas |

### 6.3 Constraint Regulasi / Kepatuhan
| ID | Regulasi / Standar | Berlaku untuk | Catatan |
|----|-------------------|--------------|---------|
| CON-REG-01 | [BELUM DIDEFINISIKAN - diperlukan klarifikasi] | Data laporan, komentar, dan identitas pengguna | Kebijakan privasi dan tata kelola data belum disebutkan dalam `CASE.md` |

---

## 7. Open Questions

| ID | Pertanyaan | Pemilik | Deadline Jawaban | Dampak jika Tidak Dijawab |
|----|-----------|---------|-----------------|--------------------------|
| OQ-01 | Siapa pemilik proyek atau sponsor yang akan menyetujui perubahan dokumen inception ini? | Sponsor Proyek | Sebelum fase requirement dimulai | Tinggi |
| OQ-02 | Apa batasan yang jelas untuk fitur di luar scope, terutama integrasi, notifikasi, dan kebutuhan non-fungsional? | Product Owner / Sponsor | Sebelum backlog requirement disusun | Tinggi |
| OQ-03 | Apakah ada target waktu rilis atau milestone implementasi yang harus dipenuhi? | Sponsor Proyek | Sebelum perencanaan iterasi dimulai | Tinggi |

---

## 8. Ringkasan Risiko Awal (Opsional)

| ID | Risiko | Kemungkinan | Dampak | Mitigasi Awal |
|----|--------|-------------|--------|--------------|
| RSK-01 | Scope bertambah karena detail proses operasional belum sepenuhnya didefinisikan | Sedang | Tinggi | Kunci scope awal melalui validasi stakeholder dan daftar open questions |
| RSK-02 | Definisi status dan transisi workflow tidak konsisten antar peran | Sedang | Tinggi | Validasi model status sebelum desain requirement rinci |
| RSK-03 | Kebutuhan hak akses dan visibilitas data bisa berbeda antar stakeholder | Sedang | Tinggi | Tetapkan matriks akses sejak awal |

---

## 9. Referensi

- `CASE.md`

---

*Dokumen ini adalah living document. Perubahan harus melalui persetujuan [BELUM DIDEFINISIKAN - diperlukan klarifikasi].*
