# 🏫 Campus Service Request & Maintenance System

> Proyek Software Engineering dengan Bantuan AI — Dari Requirements Engineering sampai Deployment ke Cloudflare

[![CI](https://github.com/JovankaTangkilisan/campus-maintenance/actions/workflows/ci.yml/badge.svg)](https://github.com/JovankaTangkilisan/campus-maintenance/actions)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)](https://www.typescriptlang.org/)
[![License: Private](https://img.shields.io/badge/License-Private-red.svg)](#)

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Repository](#-struktur-repository)
- [Persiapan Lingkungan](#-persiapan-lingkungan)
- [Cara Menjalankan](#-cara-menjalankan)
- [Database](#-database)
- [Akun Demo](#-akun-demo)
- [Panduan Penggunaan](#-panduan-penggunaan)
- [Status Workflow](#-status-workflow)
- [Dokumentasi Proyek](#-dokumentasi-proyek)
- [Penggunaan AI](#-penggunaan-ai)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Known Limitations](#-known-limitations)
- [Pertanyaan Refleksi](#-pertanyaan-refleksi)
- [Informasi Pengumpulan](#-informasi-pengumpulan)

---

## 📌 Tentang Proyek

**Campus Service Request and Maintenance System** adalah aplikasi web untuk melaporkan masalah fasilitas kampus. Aplikasi ini digunakan oleh mahasiswa atau dosen untuk melaporkan masalah seperti proyektor rusak, internet bermasalah, AC tidak dingin, kursi rusak, alat laboratorium bermasalah, atau ruangan kotor.

### Aktor Sistem

| Aktor | Keterangan |
|-------|-----------|
| **Pelapor** | Mahasiswa atau dosen yang melaporkan masalah fasilitas kampus. Dapat membuat laporan, melihat status, menambahkan komentar, dan mengonfirmasi hasil. |
| **Administrator** | Pihak yang memeriksa laporan, menentukan kategori dan prioritas, menugaskan teknisi, serta menutup laporan. |
| **Teknisi** | Pihak yang melihat tugas, menerima tugas, memperbarui progres, dan menandai pekerjaan selesai. |
| **Manajer Fasilitas** | Pihak yang melihat dashboard dan laporan ringkas. |

---

## 💻 Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Vite 8 |
| Backend | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Styling | Custom CSS |
| Testing | Vitest 4, Testing Library |
| Build | Vite + TypeScript |
| Deployment | Cloudflare Workers + D1 |
| CI/CD | GitHub Actions |

---

## 📂 Struktur Repository

```
campus-maintenance/
├── README.md                    # Dokumen utama proyek
├── CASE.md                      # Use Case Specification
├── skills/                      # 13 Skill AI yang dibuat
│   ├── 01-inception/
│   ├── 02-elicitation/
│   ├── 03-specification/
│   ├── 04-prioritization/
│   ├── 05-validation-change/
│   ├── 06-architecture-design/
│   ├── 07-database-api-design/
│   ├── 08-issue-planning/
│   ├── 09-implementation/
│   ├── 10-code-review/
│   ├── 11-test-planning/
│   ├── 12-automated-test/
│   └── 13-acceptance-testing/
├── docs/
│   ├── requirements/            # Output requirements engineering
│   ├── design/                  # Output desain sistem
│   ├── testing/                 # Output testing
│   └── review/                  # Output code review
├── src/                         # Frontend React
│   ├── App.tsx                  # Komponen utama
│   ├── LoginPage.tsx            # Halaman login
│   ├── AuthContext.tsx          # Konteks autentikasi
│   └── ...
├── worker/                      # Backend Cloudflare Worker
│   ├── index.ts                 # Entry point Worker
│   ├── router.ts                # Router API
│   ├── types.ts                 # Tipe data
│   ├── middleware/               # Middleware autentikasi
│   └── tests/                   # Test Worker
├── migrations/                  # Database migrations
├── tests/                       # Test files
├── evidence/                    # Bukti penggunaan AI
├── result/                      # Hasil screenshot
├── wrangler.jsonc               # Konfigurasi Cloudflare
├── package.json                 # Dependencies
├── tsconfig.json                # Konfigurasi TypeScript
└── vitest.config.ts             # Konfigurasi test
```

---

## 🚀 Persiapan Lingkungan

### Prasyarat

| Komponen | Versi |
|----------|-------|
| Node.js | v18 atau lebih baru |
| npm | Versi terbaru |
| Git | Versi terbaru |
| Akun Cloudflare | Untuk deployment |
| Akun GitHub | Untuk repository 
### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/JovankaTangkilisan/campus-maintenance.git
cd campus-maintenance

# 2. Install dependencies
npm install

# 3. Jalankan migrasi database (lokal via Wrangler)
npx wrangler d1 migrations apply campus-maintenance-db --local

# 4. Jalankan development server
npm run dev
```

---

## 🎮 Cara Menjalankan

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build

```bash
npm run build
```

### Deploy ke Cloudflare

```bash
npm run deploy
```

### Menjalankan Test

```bash
npm test
```

---

## 🗄️ Database

### Struktur Tabel

| Tabel | Keterangan |
|-------|-----------|
| `service_requests` | Tabel utama untuk laporan service |
| `service_request_comments` | Komentar pada laporan |
| `service_request_status_history` | Riwayat perubahan status |
| `service_request_assignments` | Penugasan teknisi |
| `service_request_attachments` | Lampiran file |
| `users` | Data pengguna |
| `sessions` | Sesi login |

### Migration

```bash
# Local
npx wrangler d1 migrations apply campus-maintenance-db --local

# Production
npx wrangler d1 migrations apply campus-maintenance-db --remote
```

---

## 👥 Akun Demo

> **Password untuk semua akun:** `password123`

| Username | Role | Nama |
|----------|------|------|
| `fajar` | Pelapor | Fajar Ramadhan (Asisten Lab) |
| `hermawan` | Pelapor | Dr. Hermawan (Dosen) |
| `admin` | Administrator | Administrator |
| `budi` | Teknisi | Budi Santoso |
| `andi` | Teknisi | Andi Wijaya |
| `joko` | Teknisi | Joko Susilo |
| `slamet` | Teknisi | Slamet Riyadi |
| `manager` | Manajer Fasilitas | Facility Manager |

---

## 📖 Panduan Penggunaan

### 1. Login

1. Buka halaman aplikasi di browser
2. Masukkan **username** dan **password**
3. Pilih **role** yang sesuai
4. Klik **Login**

### 2. Membuat Laporan Baru (Pelapor)

1. Login sebagai **Pelapor** (`fajar` atau `hermawan`)
2. Klik menu **Buat Laporan** atau tombol **Buat Laporan Baru** di dashboard
3. Isi form:
   - **Kategori:** Pilih dari dropdown (Peralatan Presentasi, Jaringan & Internet, Kenyamanan Ruangan, Furnitur, Peralatan Laboratorium, Kebersihan & Sanitasi)
   - **Lokasi:** Tuliskan lokasi masalah (contoh: "Gedung A Lantai 3 Ruang 301")
   - **Deskripsi:** Jelaskan masalah secara detail (minimal 20 karakter)
4. Klik **Submit**

> Laporan akan berstatus `BARU`

### 3. Melihat & Menyaring Laporan

1. Klik menu **Daftar Laporan** di sidebar
2. Gunakan filter untuk menyaring:
   - **Status:** Baru, Diperiksa, Ditolak, Ditugaskan, Diterima, Sedang Dikerjakan, Selesai Dikerjakan, Ditutup, Dibuka Kembali
   - **Kategori:** Salah satu dari 6 kategori yang tersedia
   - **Tanggal:** Atur rentang tanggal
3. Klik baris laporan untuk melihat detail lengkap

### 4. Memeriksa Laporan (Administrator)

1. Login sebagai **Administrator** (`admin`)
2. Buka **Daftar Laporan** atau lihat daftar "Perlu Review" di dashboard
3. Klik laporan dengan status `BARU`
4. Pada bagian **Workflow**, klik **Review**
5. Atur:
   - **Kategori** (jika perlu diubah)
   - **Prioritas** (`HIGH` / `MEDIUM` / `LOW`)
6. Klik **Submit Review**

> Status berubah ke `DIPERIKSA`

### 5. Menugaskan Teknisi (Administrator)

1. Pada laporan dengan status `DIPERIKSA` atau `DIBUKA KEMBALI`
2. Di panel **Workflow**, pilih **Teknisi** dari dropdown
3. Klik **Assign**

> Status berubah ke `DITUGASKAN`

### 6. Mengerjakan Tugas (Teknisi)

1. Login sebagai **Teknisi** (`budi`, `andi`, `joko`, atau `slamet`)
2. Di dashboard, lihat daftar **Tugas Aktif** (status `DITUGASKAN` atau `SEDANG DIKERJAKAN`)
3. Klik tugas untuk melihat detail
4. **Terima Tugas:** Klik **Accept** untuk mengubah status dari `DITUGASKAN` → `DITERIMA`
5. **Selesaikan:** Setelah perbaikan selesai, klik **Resolve** untuk mengubah status dari `SEDANG DIKERJAKAN` → `SELESAI DIKERJAKAN`
6. Tambahkan komentar jika diperlukan

### 7. Mengonfirmasi Hasil (Pelapor)

1. Login sebagai **Pelapor**
2. Buka laporan dengan status `SELESAI DIKERJAKAN`
3. Lihat detail perbaikan dan komentar dari teknisi
4. Pilih:
   - **Accept** — Terima hasil perbaikan
   - **Reject** — Tolak hasil perbaikan, berikan alasan

### 8. Menutup Laporan (Administrator)

**Jika Pelapor Accept:**
1. Login sebagai **Admin**, buka laporan tersebut
2. Klik **Close**

> Status berubah ke `DITUTUP`

**Jika Pelapor Reject:**
1. Login sebagai **Admin**, buka laporan tersebut
2. Klik **Reopen** untuk mengembalikan ke status `DIBUKA KEMBALI` dan tugaskan ulang teknisi

### 9. Melihat Dashboard (Manajer Fasilitas)

1. Login sebagai **Manajer Fasilitas** (`manager`)
2. Dashboard menampilkan:
   - Ringkasan jumlah laporan berdasarkan status
   - Grafik batang jumlah laporan per kategori
   - Total keseluruhan laporan

### 10. Menambahkan Komentar

1. Buka detail laporan
2. Scroll ke bagian **Komentar**
3. Ketik komentar di kolom teks
4. Klik **Kirim**

> Komentar akan tercatat dengan nama dan role penulis

---

## 🔄 Status Workflow

```
BARU → DIPERIKSA → DITUGASKAN → DITERIMA → SEDANG DIKERJAKAN → SELESAI DIKERJAKAN → DITUTUP
                                          ↑                          ↓
                                          └────── DIBUKA KEMBALI ←───┘
```

| Status | Keterangan | Aksi yang Tersedia |
|--------|------------|-------------------|
| `BARU` | Laporan baru dibuat | Admin: Review, Reject |
| `DIPERIKSA` | Sedang diperiksa | Admin: Assign, Reject |
| `DITUGASKAN` | Ditugaskan ke teknisi | Teknisi: Accept |
| `DITERIMA` | Teknisi menerima tugas | Teknisi: Start Work |
| `SEDANG DIKERJAKAN` | Teknisi mengerjakan | Teknisi: Resolve |
| `SELESAI DIKERJAKAN` | Selesai, menunggu konfirmasi | Pelapor: Accept/Reject |
| `DITUTUP` | Laporan ditutup | — |
| `DIBUKA KEMBALI` | Dibuka kembali | Admin: Assign ulang |
| `DITOLAK` | Laporan ditolak | — |

---

## 📚 Dokumentasi Proyek

### Requirements Engineering

| Dokumen | Lokasi |
|---------|--------|
| Inception & Stakeholder | [`docs/requirements/output-inception.md`](docs/requirements/output-inception.md) |
| Elicitation | [`docs/requirements/output-elicitation.md`](docs/requirements/output-elicitation.md) |
| Specification | [`docs/requirements/output-specification.md`](docs/requirements/output-specification.md) |
| Prioritization | [`docs/requirements/output-prioritization.md`](docs/requirements/output-prioritization.md) |
| Validation & Change | [`docs/requirements/output-validation-change.md`](docs/requirements/output-validation-change.md) |

### Design

| Dokumen | Lokasi |
|---------|--------|
| Architecture Design | [`docs/design/output-architecture-design.md`](docs/design/output-architecture-design.md) |
| Database Schema | [`docs/design/output-database-schema.md`](docs/design/output-database-schema.md) |
| API Contract | [`docs/design/output-api-contract.md`](docs/design/output-api-contract.md) |
| UI Design | [`docs/design/output-ui-design.md`](docs/design/output-ui-design.md) |
| UI Flow | [`docs/design/output-ui-flow.md`](docs/design/output-ui-flow.md) |

### Testing

| Dokumen | Lokasi |
|---------|--------|
| Test Planning | [`docs/testing/output-test-planning.md`](docs/testing/output-test-planning.md) |
| Acceptance Testing | [`docs/testing/output-acceptance-testing.md`](docs/testing/output-acceptance-testing.md) |

### Code Review

| Dokumen | Lokasi |
|---------|--------|
| Code Review Report | [`docs/review/output-code-review-report.md`](docs/review/output-code-review-report.md) |

### Use Case

| Dokumen | Lokasi |
|---------|--------|
| Use Case Specification | [`CASE.md`](CASE.md) |

---

## 🤖 Penggunaan AI

Proyek ini menggunakan AI (OpenCode, Codex, Antigravity) dengan pendekatan **human-in-the-loop**. AI membantu dalam pembuatan dokumen requirements, kode, dan test, tetapi semua output harus diverifikasi oleh manusia.

### Skill AI yang Dibuat

| No | Skill | Tujuan |
|----|-------|--------|
| 01 | Inception & Stakeholder | Memahami masalah, tujuan, stakeholder, scope, asumsi, dan pertanyaan terbuka |
| 02 | Elicitation | Menyusun pertanyaan dan menemukan kebutuhan stakeholder |
| 03 | Specification | Membuat functional requirement, non-functional requirement, user story, dan acceptance criteria |
| 04 | Prioritization | Menentukan prioritas dan menyelesaikan konflik kebutuhan |
| 05 | Validation & Change | Memeriksa requirement dan menganalisis perubahan |
| 06 | Architecture Design | Menentukan bagian utama aplikasi |
| 07 | Database & API Design | Membuat tabel database dan endpoint API |
| 08 | Issue Planning | Mengubah requirement menjadi GitHub Issues |
| 09 | Implementation | Mengerjakan satu issue menjadi kode |
| 10 | Code Review | Memeriksa kode dan test |
| 11 | Test Planning | Membuat rencana pengujian |
| 12 | Automated Testing | Membuat unit test dan integration test |
| 13 | Acceptance Testing | Menguji alur lengkap pengguna |

### Proses Penggunaan AI

| Tahap | Siapa yang Melakukan |
|-------|---------------------|
| AI membuat draft | AI |
| Memeriksa fakta dan asumsi | Mahasiswa |
| Memperbaiki requirement atau kode | Mahasiswa dan AI |
| Menjalankan test | Mahasiswa |
| Menyetujui hasil | Mahasiswa atau reviewer |
| Bertanggung jawab terhadap hasil akhir | Mahasiswa |

---

## 🧪 Testing

### Menjalankan Test

```bash
npm test
```

### Struktur Test

| Jenis | Lokasi | Keterangan |
|-------|--------|-----------|
| Unit Test | `src/*.test.*` | Test untuk utilitas dan komponen |
| Integration Test | `worker/tests/` | Test untuk API endpoints |
| Acceptance Test | `docs/testing/output-acceptance-testing.md` | Test alur pengguna |

---

## 🌐 Deployment

### URL Akses

| Environment | URL |
|-------------|-----|
| Development | http://localhost:5173 |
| Production | [campus-maintenance.s22210548.workers.dev](https://campus-maintenance.s22210548.workers.dev) |

### Deployment ke Cloudflare

```bash
# Build
npm run build

# Deploy
npm run deploy
```

### Integrasi GitHub dengan Cloudflare

Deployment otomatis terjadi ketika perubahan di-push ke branch `main`.

---

## ⚠️ Known Limitations

| No | Keterbatasan | Penjelasan |
|----|-------------|-----------|
| 1 | Belum ada multi-user authentication | Menggunakan simple session-based auth |
| 2 | Tidak ada upload foto | Object storage memerlukan layanan tambahan |
| 3 | Tidak ada email notification | Belum terintegrasi dengan layanan email |
| 4 | Tidak ada login Google | Belum terintegrasi dengan OAuth |
| 5 | Dashboard sederhana | Hanya menampilkan ringkasan dasar |

---

## 🤔 Pertanyaan Refleksi

### 1. Bagian mana yang paling membantu ketika menggunakan AI?

> AI membantu membuat dokumen-dokumen requirements dan dengan human review scope menjadi lebih clear, AI membantu generate code, dan code review

### 2. Kesalahan apa yang paling sering dibuat AI?

> Walaupun sudah dikatakan dalam skill untuk tidak menambah apapun yang ada diluar requirements, namun AI sering bertanya untuk menambahkan sesuatu, bahkan sudah membuat fitur sendiri

### 3. Fitur apa yang pernah dibuat AI tetapi tidak terdapat pada requirement?

> - AI membuat pilihan akun demo di UI login seperti "one click login" dan dalam codenya menampilkan seluruh data email dan password
> - Di fix dengan menghapus pilihan-pilihan ini, email dan password diisi manual

### 4. Test apa yang gagal dan apa penyebabnya?

| No | Test Case | Penyebab |
|----|-----------|----------|
| 1 | Session tidak otomatis end ketika menutup browser | Session cookie expiry |
| 2 | Tidak ada tombol logout pada view screen diluar desktop | Kesalahan UI |
| 3 | Pelapor dapat "CLOSED" tanpa persetujuan admin | Kesalahan logika konfirmasi pelapor |

### 5. Perubahan apa yang dilakukan setelah human review?

- **Session expiry** — Ditambahkan mekanisme session otomatis berakhir saat browser ditutup
- **Mobile logout** — Ditambahkan tombol logout di tampilan mobile
- **Confirm workflow** — Diperbaiki logika konfirmasi pelapor

### 6. Mengapa output AI tidak boleh langsung dianggap benar?

1. AI sering membuat kesalahan duplikasi
2. AI lemah dalam keamanan, bisa memasukkan email dan password dalam code — harus dicek lagi
3. AI sering membuat asumsi sendiri yang harus diluruskan oleh manusia

### 7. Bagaimana traceability membantu proyek?

- **Memastikan semua requirements terpenuhi** — Setiap item di CASE.md bisa dilacak ke kode implementasi
- **Mencegah fitur tambahan yang tidak perlu** — Bisa dibedakan mana yang diminta vs yang ditambahkan AI
- **Facilitate code review** — Reviewer bisa langsung menuju kode yang relevan dengan requirement tertentu
- **Membantu maintenance** — Ketika ada perubahan requirement, bisa dilacak bagian mana yang perlu diubah
- **Validasi test coverage** — Bisa dipastikan setiap requirement memiliki test yang sesuai

### 8. Apa yang akan diperbaiki jika proyek diulang?

> Menjawab semua question dan asumsi sejak awal, memperbaiki github issue, melakukan code review dan testing issue yang diselesaikan, belajar lebih mengotomatisasi agent workflow

---

## 📤 Informasi Pengumpulan

| Field | Isian |
|-------|-------|
| Nama | Jovanka, Tangkilisan |
| NIM | 105022210102 |
| Kelas | Software Engineering |
| Anggota tim | Jovanka |
| Repository URL | https://github.com/JovankaTangkilisan/campus-maintenance.git |
| Cloudflare URL | campus-maintenance.s22210548.workers.dev |
| Commit terakhir | `3ec8304` — add output, skill, worker |
| Jumlah test | 3 test files (unit + integration) |
| AI yang digunakan | OpenCode, Codex, Antigravity |
| Known limitations | Belum ada multi-user auth, upload foto, email notification, login Google |

---

## 📝 License

Private - Campus Maintenance System

---

<div align="center">

**Campus Service Request & Maintenance System** © 2026

Proyek Software Engineering dengan Bantuan AI

Mata Kuliah: Software Engineering | Dosen: Andrew Tanny Liem

</div>
