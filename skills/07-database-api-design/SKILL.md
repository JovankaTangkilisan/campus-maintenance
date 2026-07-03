---
name: 07-database-api-design
description: Merancang database schema dan API contract untuk proyek Campus Service Request and Maintenance System berdasarkan requirement dan architecture design yang sudah disetujui. Gunakan skill ini saat perlu menentukan tabel, kolom, relasi, constraint, endpoint, method HTTP, payload, response, error case, akses role, dan traceability sebelum implementasi atau issue planning.
---

# Campus Service Request and Maintenance System - Database and API Design

## Tujuan
Skill ini membantu menerjemahkan requirement dan architecture design menjadi rancangan teknis database dan API untuk aplikasi Campus Service Request and Maintenance System.

Hasil skill ini harus menjawab dua pertanyaan utama:
- Data apa saja yang perlu disimpan agar proses service request dan maintenance berjalan benar?
- Endpoint API apa saja yang dibutuhkan frontend agar setiap aktor dapat menjalankan tugasnya?

Skill ini menjadi penghubung antara requirement, architecture design, UI design, issue planning, dan implementation. Output harus cukup detail untuk dipakai developer, tetapi belum berupa kode program.

## Kapan Digunakan
Gunakan skill ini setelah:
- Requirement functional dan non-functional sudah tersedia.
- User story dan acceptance criteria sudah cukup jelas.
- Architecture design sudah menentukan komponen utama sistem.
- Alur status service request sudah disetujui.

Gunakan juga ketika:
- Ada requirement baru yang menambah data, role, status, atau workflow.
- Ada perubahan arsitektur yang memengaruhi database atau API.
- Tim perlu membuat kontrak API sebelum frontend dan backend dikerjakan paralel.
- Reviewer meminta bukti bahwa tabel dan endpoint dapat ditelusuri ke requirement.

Jangan gunakan skill ini untuk menulis kode backend, migration final, seed data final, atau implementasi UI. Skill ini hanya menghasilkan desain database dan kontrak API.

## Input
Informasi berikut harus tersedia:
- Functional requirements dengan ID, misalnya `FR-01`, `FR-02`.
- Non-functional requirements dengan ID, misalnya `NFR-01`.
- Business rules dengan ID, misalnya `BR-01`.
- User stories dan acceptance criteria.
- Architecture design sistem.
- Daftar aktor dan hak akses, misalnya Requester, Administrator, Technician, dan Facility Manager.
- Alur status service request, misalnya Submitted, Under Review, Assigned, In Progress, Resolved, Closed, Rejected, atau Cancelled.
- Batasan teknologi database dan backend jika ada.
- Fitur opsional yang sudah disetujui, misalnya upload foto, komentar, notifikasi, dashboard, export report, atau audit log.

Jika input belum lengkap, lanjutkan hanya untuk bagian yang aman dan tandai gap sebagai pertanyaan terbuka.

## Required Context
Baca konteks berikut sebelum membuat desain:
- Dokumen requirement yang memuat fitur pembuatan request, review request, assignment teknisi, update progress, penyelesaian, dan penutupan request.
- Dokumen architecture design yang menjelaskan komponen frontend, backend/API, database, autentikasi, dan integrasi.
- Dokumen UI design jika sudah ada, terutama form input dan data yang harus tampil di halaman.
- Dokumen role access atau permission matrix jika tersedia.
- Dokumen issue planning jika desain sedang diperbarui dari backlog yang sudah ada.
- Struktur repository jika proyek sudah berjalan.
- Konvensi naming table, endpoint, response, atau status code jika sudah ada.

Jangan membuat asumsi tersembunyi tentang kolom, endpoint, role, atau provider layanan. Semua asumsi harus ditulis eksplisit.

## Langkah Kerja
1. Baca requirement, user story, acceptance criteria, business rules, dan architecture design.
2. Buat daftar konsep data utama dari domain kampus, seperti service request, user, role, facility, location, category, assignment, status history, comment, attachment, dan notification jika didukung requirement.
3. Tentukan entity kandidat dari konsep data tersebut. Jangan menjadikan semua konsep sebagai tabel jika tidak diperlukan.
4. Untuk setiap entity, tentukan tujuan penyimpanan, requirement sumber, dan data minimal yang harus disimpan.
5. Rancang tabel dengan kolom, tipe data, primary key, foreign key, unique constraint, nullable rule, default value, dan catatan validasi.
6. Tentukan relasi antar tabel, termasuk one-to-many atau many-to-many jika requirement mendukungnya.
7. Pastikan alur status service request dapat direpresentasikan dalam database, minimal melalui status aktif dan riwayat perubahan status jika dibutuhkan.
8. Tentukan endpoint API berdasarkan aksi pengguna dan acceptance criteria, bukan berdasarkan tabel semata.
9. Untuk setiap endpoint, tulis method, path, aktor yang boleh mengakses, request payload, response sukses, error cases, dan requirement traceability.
10. Petakan business rules ke database constraint, validasi API, atau keduanya.
11. Petakan non-functional requirements ke keputusan desain, misalnya pagination, authorization, audit trail, input validation, response error, dan perlindungan data sensitif.
12. Periksa konsistensi nama antara requirement, tabel, kolom, endpoint, dan response.
13. Buat traceability matrix yang menghubungkan requirement ke tabel dan endpoint.
14. Catat asumsi, risiko, dan pertanyaan terbuka.
15. Lakukan quality check.
16. Hentikan jika informasi penting tidak cukup untuk membuat desain yang dapat divalidasi.

## Output
Buat file `campus-service-request-maintenance-database-api-design.md` dengan struktur berikut:

```markdown
# Campus Service Request and Maintenance System - Database and API Design

## 1. Design Summary
- Project Name:
- Database Type:
- API Style:
- Source Documents:
- Scope:
- Out of Scope:
- Assumptions:
- Open Questions:

## 2. Data Model Overview
| Entity | Purpose | Source Requirement | Notes |
|---|---|---|---|
| service_requests | Menyimpan laporan maintenance fasilitas | FR-01 | ... |

## 3. Database Schema
### Table: service_requests
- Source Requirement: FR-01, FR-02
- Purpose: Menyimpan request perbaikan fasilitas yang dibuat pengguna.

| Column | Type | Constraint | Nullable | Description |
|---|---|---|---|---|
| id | INTEGER | PRIMARY KEY | No | Unique identifier |
| title | TEXT | - | No | Judul singkat laporan |
| status | TEXT | CHECK atau validasi API | No | Status aktif request |

Relationships:
- `service_requests.requester_id` references `users.id`.
- `service_requests.category_id` references `request_categories.id`.

Validation Notes:
- Status harus mengikuti status flow yang disetujui.
- Data sensitif tidak boleh disimpan tanpa requirement.

## 4. Relationship Summary
| Relationship | Type | Reason | Requirement ID |
|---|---|---|---|
| users -> service_requests | One-to-many | Satu requester dapat membuat banyak request | FR-01 |

## 5. Status Flow Data Handling
| Status | Stored In | Changed By | API Endpoint | Requirement ID |
|---|---|---|---|---|
| Submitted | service_requests.status, status_history | Requester | POST /service-requests | FR-01 |

## 6. API Contract
### POST /service-requests
- Purpose: Membuat service request baru.
- Source Requirement: FR-01
- Allowed Actors: Requester
- Authentication Required: Yes

Request Body:
```json
{
  "title": "Lampu ruang kelas rusak",
  "description": "Lampu tidak menyala sejak pagi",
  "location_id": 1,
  "category_id": 2,
  "priority": "medium"
}
```

Success Response 201:
```json
{
  "id": 101,
  "status": "Submitted",
  "message": "Service request created"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | Payload tidak valid | Validation error |
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan | Forbidden |

Database Tables Used:
- service_requests
- status_history

Business Rules:
- BR-01: Request baru dimulai dari status Submitted.

## 7. Role Access Matrix
| Endpoint | Requester | Administrator | Technician | Facility Manager |
|---|---|---|---|---|
| POST /service-requests | Yes | Optional/TBD | No | No |

## 8. Requirement Traceability Matrix
| Requirement ID | Database Tables | API Endpoints | Notes |
|---|---|---|---|
| FR-01 | service_requests, status_history | POST /service-requests | ... |

## 9. Business Rule Mapping
| Business Rule ID | Rule Summary | Enforced By | Related Table/API |
|---|---|---|---|
| BR-01 | Request baru harus berstatus Submitted | API validation | POST /service-requests |

## 10. Non-Functional Design Notes
| NFR ID | Concern | Database/API Decision | Verification |
|---|---|---|---|
| NFR-01 | Security | Role-based access per endpoint | Authorization test |

## 11. Assumptions
- ...

## 12. Risks
- ...

## 13. Open Questions
- ...

## 14. Quality Check Result
- Complete:
- Consistent:
- Traceable:
- Testable:
- Secure:
- Ready for Implementation:
```

Jika pengguna meminta output terpisah, buat dua file:
- `database-schema.md` untuk tabel, kolom, relasi, constraint, dan data rules.
- `api-contract.md` untuk endpoint, role access, payload, response, dan error cases.

## Aturan
- Jangan membuat tabel, kolom, endpoint, role, atau status yang tidak memiliki dasar requirement.
- Tandai asumsi dengan label `Asumsi`.
- Gunakan requirement ID pada setiap tabel dan endpoint.
- Jika requirement belum memiliki ID, gunakan ID sementara seperti `REQ-TEMP-001`.
- Nama tabel, kolom, endpoint, dan response harus konsisten dengan istilah domain yang digunakan requirement.
- Endpoint harus dibuat berdasarkan aksi bisnis, bukan hanya operasi CRUD tabel.
- Setiap endpoint harus memiliki allowed actors.
- Setiap endpoint yang mengubah data harus menjelaskan validasi utama dan error cases.
- Setiap tabel harus memiliki primary key.
- Setiap foreign key harus merujuk ke tabel yang memang ada di desain.
- Jangan mengembalikan password, token rahasia, atau data sensitif di response API.
- Jangan merancang fitur opsional seperti upload foto, email notification, atau dashboard jika tidak disetujui.
- Jangan memakai tipe data atau fitur database yang bertentangan dengan batasan teknologi proyek.
- Jangan menulis kode implementasi, migration final, atau query SQL produksi kecuali diminta eksplisit.
- Pisahkan fakta requirement, asumsi, risiko, dan pertanyaan terbuka.

## Quality Check
Periksa hasil sebelum diberikan:
- Apakah setiap functional requirement memiliki minimal satu tabel atau endpoint pendukung?
- Apakah setiap endpoint memiliki requirement sumber?
- Apakah setiap tabel memiliki tujuan yang jelas dan requirement sumber?
- Apakah relasi antar tabel konsisten dan tidak menggantung?
- Apakah alur status service request tercermin dalam database dan API?
- Apakah role access setiap endpoint jelas?
- Apakah request dan response API cukup lengkap untuk dipakai frontend?
- Apakah business rules diterapkan pada database constraint, validasi API, atau keduanya?
- Apakah non-functional requirements seperti security, auditability, performance, dan privacy sudah dipetakan?
- Apakah desain menghindari data sensitif yang tidak perlu?
- Apakah semua asumsi dan open questions ditulis terpisah?
- Apakah hasil siap digunakan untuk issue planning dan implementasi?

## Kondisi Gagal
Skill harus berhenti atau meminta klarifikasi jika:
- Requirement utama belum tersedia.
- Architecture design belum tersedia atau belum cukup menjelaskan komponen backend dan database.
- Daftar aktor dan hak akses belum jelas.
- Alur status service request belum tersedia atau saling bertentangan.
- Acceptance criteria tidak cukup untuk menentukan request/response API.
- Requirement menyebut data yang harus disimpan tetapi struktur atau sumber datanya tidak jelas.
- Requirement meminta integrasi eksternal tetapi provider, akses, atau batasannya belum disetujui.
- Batasan teknologi database/backend belum jelas dan memengaruhi keputusan desain.
- Ada requirement yang berpotensi menyimpan data sensitif tetapi aturan privacy/security belum tersedia.

Jika kondisi gagal terjadi, hasilkan daftar pertanyaan klarifikasi dan jangan membuat desain final yang terlihat pasti.

## Human Review
- Mahasiswa harus memeriksa apakah tabel dan endpoint sesuai dengan requirement yang disetujui.
- Mahasiswa harus mengonfirmasi semua asumsi sebelum desain dipakai untuk implementasi.
- Mahasiswa harus memastikan role access sesuai dengan aturan proyek.
- Mahasiswa harus memeriksa apakah kompleksitas tabel dan endpoint realistis untuk waktu pengerjaan.
- Reviewer atau dosen dapat memeriksa traceability dari requirement ke database dan API.
- Hasil review harus selesai sebelum issue planning atau coding dimulai.

## Example Invocation
```text
Gunakan skill campus-service-request-maintenance-database-api untuk membuat desain database dan API dari requirement dan architecture design Campus Service Request and Maintenance System. Sertakan tabel, relasi, endpoint, payload, response, error cases, role access, status flow, dan traceability matrix.
```

## Expected Output Example
```markdown
# Campus Service Request and Maintenance System - Database and API Design

## 1. Design Summary
- Project Name: Campus Service Request and Maintenance System
- Database Type: Relational database
- API Style: REST API
- Source Documents: requirements.md, architecture-design.md
- Scope: Service request submission, assignment, status update, and tracking.
- Out of Scope: Inventory management and payment.
- Assumptions:
  - Asumsi: Sistem memakai autentikasi berbasis akun internal karena SSO kampus belum disebutkan.
- Open Questions:
  - Apakah request boleh ditugaskan ke lebih dari satu teknisi?

## 2. Data Model Overview
| Entity | Purpose | Source Requirement | Notes |
|---|---|---|---|
| users | Menyimpan akun dan role pengguna | FR-01, FR-02 | Role menentukan akses endpoint |
| service_requests | Menyimpan laporan maintenance | FR-01 | Memiliki status aktif |
| status_history | Menyimpan riwayat perubahan status | FR-03 | Mendukung audit trail |

## 3. Database Schema
### Table: service_requests
- Source Requirement: FR-01
- Purpose: Menyimpan laporan kerusakan atau kebutuhan maintenance fasilitas kampus.

| Column | Type | Constraint | Nullable | Description |
|---|---|---|---|---|
| id | INTEGER | PRIMARY KEY | No | ID request |
| requester_id | INTEGER | FOREIGN KEY users.id | No | Pembuat request |
| title | TEXT | - | No | Judul laporan |
| description | TEXT | - | No | Detail masalah |
| status | TEXT | Validated by API | No | Status aktif |

Relationships:
- `requester_id` references `users.id`.

## 6. API Contract
### POST /service-requests
- Purpose: Membuat service request baru.
- Source Requirement: FR-01
- Allowed Actors: Requester
- Authentication Required: Yes

Request Body:
```json
{
  "title": "AC ruang lab rusak",
  "description": "AC tidak dingin sejak kemarin",
  "location_id": 3,
  "category_id": 1
}
```

Success Response 201:
```json
{
  "id": 25,
  "status": "Submitted"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | Field wajib kosong | Validation error |
| 401 | User belum login | Unauthorized |

## 8. Requirement Traceability Matrix
| Requirement ID | Database Tables | API Endpoints | Notes |
|---|---|---|---|
| FR-01 | service_requests, users | POST /service-requests | Membuat laporan baru |
```
