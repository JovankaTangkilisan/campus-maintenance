---
name: 01-inception
description: >
  Skill untuk memimpin dan mendokumentasikan Software Engineering Inception — fase awal proyek perangkat lunak yang mencakup definisi masalah bisnis, tujuan, stakeholder, scope, asumsi, constraint, dan open questions. Gunakan skill ini setiap kali pengguna menyebut "inception", "project kickoff", "project charter", "inisiasi proyek", "mulai proyek baru", "definisi proyek", "software inception", atau meminta dokumen perencanaan awal proyek. Juga gunakan ketika pengguna meminta klarifikasi ruang lingkup, identifikasi stakeholder, atau pendefinisian masalah bisnis untuk sebuah sistem atau aplikasi baru. Jangan tunggu kata "inception" secara eksplisit — jika pengguna sedang mendefinisikan sebuah proyek dari nol, skill ini harus digunakan.
---

# 01-inception 

## Purpose

Memandu AI untuk menghasilkan dokumen **Inception** yang terstruktur, lengkap, dan dapat digunakan sebagai fondasi pengembangan perangkat lunak. Inception adalah tahap pertama proyek yang mendefinisikan *mengapa* proyek ada, *siapa* yang terlibat, *apa* yang akan dibangun, *batasan* apa yang berlaku, dan *pertanyaan* apa yang masih perlu dijawab.

Dokumen inception yang dihasilkan harus:
- Dapat dibaca oleh stakeholder bisnis maupun teknis
- Menjadi kontrak awal antara tim dan pemangku kepentingan
- Menjadi input untuk fase requirement, arsitektur, dan perencanaan sprint

---

## When to Use

Gunakan skill ini ketika:
- Pengguna memulai proyek perangkat lunak baru dan belum memiliki dokumen inception
- Pengguna memiliki ide sistem/aplikasi dan ingin memformalkannya
- Pengguna ingin mendokumentasikan ulang atau memperbaiki inception yang sudah ada
- Pengguna membutuhkan klarifikasi scope sebelum menulis requirement
- Pengguna menyebut: *inception, project charter, project brief, kickoff doc, inisiasi proyek, definisi proyek*

---

## Inputs

Sebelum menjalankan skill ini, pastikan tersedia minimal:

| Input | Keterangan | Wajib? |
|---|---|---|
| Nama proyek | Nama sistem atau aplikasi yang akan dibangun | ✅ |
| Deskripsi masalah | Masalah bisnis atau kebutuhan yang mendorong proyek | ✅ |
| Nama organisasi / tim | Pemilik proyek atau tim pengembang | ✅ |
| Stakeholder | Daftar pihak yang terlibat atau terdampak | ✅ |
| Tujuan bisnis | Hasil bisnis yang ingin dicapai | ✅ |
| Fitur utama (high-level) | Gambaran kasar fungsionalitas yang diinginkan | ⚠️ Direkomendasikan |
| Deadline / target rilis | Batas waktu proyek | ⚠️ Direkomendasikan |
| Anggaran | Batas anggaran yang tersedia | ⚠️ Opsional |
| Sistem yang sudah ada | Sistem eksisting yang harus diintegrasikan atau digantikan | ⚠️ Opsional |

Jika input wajib tidak tersedia → **hentikan dan minta klarifikasi**.

---

## Required Context

Sebelum menghasilkan output, baca konteks berikut jika tersedia:
- Brief atau catatan dari pengguna tentang proyek
- Dokumen lama (inception, BRD, PRD) yang ingin diperbarui
- Diagram arsitektur atau wireframe jika sudah ada
- Kebijakan organisasi yang relevan (keamanan, privasi data, regulasi)

---

## Workflow

1. **Baca semua input yang diberikan** — Ekstrak informasi dari teks pengguna, file yang diunggah, atau percakapan sebelumnya. Jangan membuat asumsi tanpa menandainya secara eksplisit.

2. **Identifikasi gap** — Periksa apakah semua input wajib tersedia. Jika ada yang hilang, tanyakan sebelum melanjutkan. Susun pertanyaan klarifikasi secara ringkas (maksimal 5 pertanyaan sekaligus).

3. **Strukturkan dokumen inception** sesuai Output Format di bawah, bagian per bagian secara berurutan.

4. **Tandai asumsi** — Setiap informasi yang tidak dinyatakan eksplisit oleh pengguna tetapi diasumsikan harus diberi label `[ASUMSI]`.

5. **Lakukan quality checks** sebelum output final (lihat bagian Quality Checks).

6. **Hentikan dan minta klarifikasi** jika ditemukan Failure Condition (lihat bagian Failure Conditions).

---

## Output Format

Hasilkan dokumen inception dengan struktur berikut. Gunakan Markdown. Setiap bagian wajib ada; jika informasi tidak tersedia, tulis `[BELUM DIDEFINISIKAN — diperlukan klarifikasi]`.

```
# Inception Document: [Nama Proyek]

**Versi:** [X.X]  
**Tanggal:** [YYYY-MM-DD]  
**Penulis:** [Nama / Tim]  
**Status:** Draft / Review / Final

---

## 1. Masalah Bisnis

### 1.1 Latar Belakang
[Deskripsi situasi saat ini dan konteks mengapa proyek ini diperlukan.]

### 1.2 Problem Statement
[Pernyataan masalah yang jelas, spesifik, dan terukur.]
Format: "Saat ini, [aktor] mengalami [masalah] yang menyebabkan [dampak]. Hal ini terjadi karena [akar masalah]."

### 1.3 Dampak Bisnis
[Dampak kuantitatif atau kualitatif jika masalah tidak diselesaikan.]

---

## 2. Tujuan Proyek

### 2.1 Business Goals
| ID | Tujuan | Metrik Keberhasilan | Target |
|----|--------|---------------------|--------|
| BG-01 | ... | ... | ... |

### 2.2 Project Objectives
| ID | Objektif | Terukur? | Deadline |
|----|----------|----------|----------|
| OBJ-01 | ... | Ya/Tidak | ... |

---

## 3. Stakeholder

| ID | Nama / Peran | Jenis | Kepentingan | Tingkat Keterlibatan |
|----|-------------|-------|-------------|----------------------|
| STK-01 | ... | Internal/Eksternal | ... | Tinggi/Sedang/Rendah |

**Keterangan Tingkat Keterlibatan:**
- Tinggi: Terlibat dalam keputusan dan review rutin
- Sedang: Dikonsultasikan pada milestone tertentu
- Rendah: Diinformasikan pada akhir fase

---

## 4. Scope

### 4.1 Dalam Scope (In Scope)
| ID | Fitur / Kapabilitas | Prioritas |
|----|---------------------|-----------|
| SC-IN-01 | ... | Must Have / Should Have / Nice to Have |

### 4.2 Di Luar Scope (Out of Scope)
| ID | Yang Tidak Dikerjakan | Alasan |
|----|----------------------|--------|
| SC-OUT-01 | ... | ... |

### 4.3 Batasan Scope
[Deskripsi batas sistem: apa yang dikelola sistem ini vs sistem lain.]

---

## 5. Asumsi

| ID | Asumsi | Dampak jika Salah | Pemilik Validasi |
|----|--------|-------------------|-----------------|
| ASM-01 | ... | ... | ... |

> ⚠️ Semua asumsi harus divalidasi sebelum fase requirement dimulai.

---

## 6. Constraint

### 6.1 Constraint Bisnis
| ID | Constraint | Sumber | Fleksibilitas |
|----|------------|--------|---------------|
| CON-BIZ-01 | ... | ... | Tidak / Terbatas / Fleksibel |

### 6.2 Constraint Teknis
| ID | Constraint | Sumber | Fleksibilitas |
|----|------------|--------|---------------|
| CON-TEC-01 | ... | ... | Tidak / Terbatas / Fleksibel |

### 6.3 Constraint Regulasi / Kepatuhan
| ID | Regulasi / Standar | Berlaku untuk | Catatan |
|----|-------------------|--------------|---------|
| CON-REG-01 | ... | ... | ... |

---

## 7. Open Questions

| ID | Pertanyaan | Pemilik | Deadline Jawaban | Dampak jika Tidak Dijawab |
|----|-----------|---------|-----------------|--------------------------|
| OQ-01 | ... | ... | ... | Tinggi/Sedang/Rendah |

---

## 8. Ringkasan Risiko Awal (Opsional)

| ID | Risiko | Kemungkinan | Dampak | Mitigasi Awal |
|----|--------|-------------|--------|--------------|
| RSK-01 | ... | Tinggi/Sedang/Rendah | Tinggi/Sedang/Rendah | ... |

---

## 9. Referensi

- [Daftar dokumen, regulasi, atau sumber yang dirujuk]

---

*Dokumen ini adalah living document. Perubahan harus melalui persetujuan [Nama Product Owner / Sponsor].*
```

---

## Rules

- Jangan membuat fakta, angka, atau nama yang tidak diberikan pengguna.
- Tandai setiap asumsi dengan label `[ASUMSI]` secara inline dan masukkan ke tabel Asumsi (Bagian 5).
- Gunakan requirement ID yang konsisten: `BG-`, `OBJ-`, `STK-`, `SC-IN-`, `SC-OUT-`, `ASM-`, `CON-BIZ-`, `CON-TEC-`, `CON-REG-`, `OQ-`, `RSK-`.
- Pisahkan constraint bisnis, teknis, dan regulasi secara eksplisit.
- Jangan gunakan kata ambigu tanpa ukuran: hindari "cepat", "mudah", "besar", "banyak" tanpa nilai konkret.
- Setiap tujuan bisnis (BG) harus memiliki metrik keberhasilan yang dapat diukur.
- Open questions harus mencantumkan pemilik dan deadline; jangan biarkan kosong.
- Jangan campurkan In Scope dan Out of Scope dalam satu tabel.
- Problem statement harus menggunakan format yang ditentukan (aktor → masalah → dampak → akar masalah).
- Jangan menghasilkan objektif yang tidak dapat diuji atau diverifikasi.

---

## Quality Checks

Sebelum output final, verifikasi:

- [ ] **Kelengkapan**: Semua 7 bagian wajib terisi (atau ditandai `[BELUM DIDEFINISIKAN]`)
- [ ] **Konsistensi**: Stakeholder di Bagian 3 selaras dengan tujuan di Bagian 2
- [ ] **Tidak Ambigu**: Tidak ada kata seperti "cepat", "mudah", "banyak" tanpa ukuran konkret
- [ ] **Dapat Diuji**: Setiap Business Goal memiliki metrik yang dapat diverifikasi
- [ ] **Traceable**: Setiap item memiliki ID unik
- [ ] **Business Value**: Setiap item In Scope terhubung ke minimal satu Business Goal
- [ ] **Asumsi Terpisah**: Asumsi tidak bercampur dengan fakta yang sudah dikonfirmasi
- [ ] **Open Questions Lengkap**: Setiap OQ memiliki pemilik dan deadline

---

## Failure Conditions

Hentikan dan minta klarifikasi jika:

1. **Masalah bisnis tidak jelas** — Pengguna tidak dapat mengartikulasikan masalah yang ingin diselesaikan.
2. **Tidak ada stakeholder yang diidentifikasi** — Tidak diketahui siapa yang memiliki atau menggunakan sistem.
3. **Scope terlalu luas tanpa prioritas** — Pengguna menyebutkan terlalu banyak fitur tanpa indikasi prioritas.
4. **Tujuan saling bertentangan** — Dua atau lebih business goals tidak dapat dicapai secara bersamaan dalam constraint yang diberikan.
5. **Constraint kritis hilang** — Deadline atau platform target tidak diketahui dan pengguna tidak dapat memberikannya.
6. **Input tidak dapat divalidasi** — Pengguna memberikan data yang mustahil (misal: deadline kemarin, anggaran negatif).

Contoh respons saat failure condition:
> "Saya membutuhkan klarifikasi sebelum melanjutkan. [Sebutkan pertanyaan spesifik, maksimal 3 sekaligus.]"

---

