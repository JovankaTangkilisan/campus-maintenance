# Campus Service Request and Maintenance System - API Contract

## 1. Design Summary
- Project Name: Campus Service Request and Maintenance System
- Database Type: Cloudflare D1 is the system of record; Cloudflare R2 stores attachment objects
- API Style: REST API
- Source Documents: [output-specification.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/requirements/output-specification.md), [output-architecture-design.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/output-architecture-design.md), [output-database-schema.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/output-database-schema.md)
- Scope: Pembuatan laporan, daftar dan detail laporan, triase laporan, penugasan teknisi, update progres, komentar, lampiran foto, penutupan, pembukaan kembali, dan dashboard ringkas
- Out of Scope: Implementasi kode backend, kontrak notifikasi final, integrasi eksternal spesifik, dan fitur yang belum divalidasi seperti dashboard minimum detail final
- Assumptions:
  - Asumsi: Session layer menyediakan `actor_id`, `actor_name`, dan `actor_role`
  - Asumsi: `actor_role` yang valid adalah `Pelapor`, `Administrator`, `Teknisi`, dan `Manajer Fasilitas`
  - Asumsi: Semua timestamp dikembalikan dalam UTC ISO-8601
  - Asumsi: Attachment upload dilakukan melalui API Worker ke Cloudflare R2 dan metadata disimpan ke D1
  - Asumsi: Penolakan penugasan teknisi dicatat pada assignment record tanpa mengubah status utama laporan
  - Asumsi: `FR-012` dan `FR-013` masih pending validation, sehingga endpoint terkait ditandai secara eksplisit
- Open Questions:
  - Apakah penutupan laporan memerlukan bukti konfirmasi pelapor di payload terpisah?
  - Apakah dashboard memerlukan filter waktu default dan metrik minimum yang spesifik?
  - Apakah kategori masalah harus dibatasi ke daftar nilai tertentu atau boleh teks tervalidasi?
  - Apakah teknisi boleh mengunggah lampiran evidensi selain foto pelapor?

## 2. API Overview
| Endpoint | Purpose | Source Requirement | Status |
|---|---|---|---|
| POST /api/reports | Membuat laporan baru | FR-001, FR-002 | Ready |
| GET /api/reports | Mengambil daftar laporan sesuai peran dan filter | FR-003 | Ready |
| GET /api/reports/:reportId | Mengambil detail laporan lengkap | FR-004 | Ready |
| PATCH /api/reports/:reportId/triage | Menetapkan kategori dan prioritas setelah pemeriksaan | FR-005, FR-006 | Ready |
| POST /api/reports/:reportId/assign | Menugaskan teknisi ke laporan | FR-007, FR-008 | Ready |
| POST /api/reports/:reportId/assignment/accept | Teknisi menerima tugas | FR-009 | Ready |
| POST /api/reports/:reportId/assignment/reject | Teknisi menolak tugas dengan alasan | FR-009 | Ready |
| POST /api/reports/:reportId/progress/start | Teknisi mulai mengerjakan laporan | FR-009 | Ready |
| POST /api/reports/:reportId/progress/complete | Teknisi menandai pekerjaan selesai | FR-009 | Ready |
| POST /api/reports/:reportId/comments | Menambahkan komentar atau catatan | FR-010 | Ready |
| POST /api/reports/:reportId/attachments | Mengunggah lampiran foto | FR-001 | Ready |
| POST /api/reports/:reportId/close | Menutup laporan | FR-012 | Pending Validation |
| POST /api/reports/:reportId/reopen | Membuka kembali laporan | FR-012 | Pending Validation |
| GET /api/dashboard | Mengambil ringkasan dashboard | FR-013 | Pending Validation |

## 3. Common Response Rules
- Semua endpoint memerlukan autentikasi kecuali health check internal yang tidak dibahas di dokumen ini.
- Semua endpoint mengembalikan payload error yang aman dan tidak membocorkan stack trace atau detail internal storage.
- Semua endpoint yang mengubah data harus memvalidasi role, resource ownership, dan status transition yang sah.
- Semua response sukses memakai format JSON.

### Common Error Model
| Error Code | HTTP Status | Kondisi | Pesan Aman |
|---|---|---|---|
| UNAUTHORIZED | 401 | Session tidak valid atau belum login | Silakan masuk terlebih dahulu |
| FORBIDDEN | 403 | Role tidak berwenang atau resource tidak boleh diakses | Akses ditolak |
| VALIDATION_ERROR | 400 | Payload tidak valid | Data tidak valid |
| NOT_FOUND | 404 | Laporan atau resource tidak ditemukan | Resource tidak ditemukan |
| CONFLICT | 409 | Status transition atau assignment konflik | Perubahan tidak diizinkan |
| STORAGE_UNAVAILABLE | 503 | D1 atau R2 tidak tersedia | Layanan penyimpanan sedang tidak tersedia |

## 4. API Contract
### POST /api/reports
- Purpose: Membuat laporan baru dari pelapor.
- Source Requirement: FR-001, FR-002
- Allowed Actors: Pelapor
- Authentication Required: Yes

Request Body:
```json
{
  "location": "Gedung A lantai 2",
  "issue_type": "Lampu ruang kelas rusak",
  "description": "Lampu tidak menyala sejak pagi"
}
```

Optional Request Notes:
- Lampiran foto dikirim lewat endpoint upload lampiran setelah laporan dibuat, atau melalui mekanisme upload yang disepakati kemudian.

Success Response 201:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Baru",
  "message": "Laporan berhasil dibuat"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | `location`, `issue_type`, atau `description` kosong | Validation error |
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan | Forbidden |

Database Tables Used:
- service_requests
- service_request_status_history

Business Rules:
- BR-001: Laporan baru harus memiliki lokasi, jenis masalah, dan deskripsi.

### GET /api/reports
- Purpose: Mengambil daftar laporan sesuai hak akses pengguna.
- Source Requirement: FR-003
- Allowed Actors: Pelapor, Administrator, Teknisi, Manajer Fasilitas
- Authentication Required: Yes

Query Parameters:
| Name | Type | Required | Notes |
|---|---|---|---|
| status | string | No | Filter status laporan |
| priority | string | No | Filter prioritas `low`, `medium`, `high`, `urgent` |
| category | string | No | Filter kategori |
| from_date | string | No | ISO-8601 UTC |
| to_date | string | No | ISO-8601 UTC |
| page | integer | No | Default 1 |
| page_size | integer | No | Default 20, max 100 |
| sort | string | No | Default `created_at_desc` |

Success Response 200:
```json
{
  "page": 1,
  "page_size": 20,
  "total_items": 2,
  "items": [
    {
      "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
      "status": "Baru",
      "location": "Gedung A lantai 2",
      "issue_type": "Lampu ruang kelas rusak",
      "priority": null,
      "category": null,
      "created_at": "2026-07-03T08:30:00Z"
    }
  ]
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan | Forbidden |
| 400 | Parameter filter tidak valid | Validation error |

Database Tables Used:
- service_requests

Business Rules:
- BR-002: Pelapor hanya dapat melihat laporan miliknya.
- BR-003: Administrator dapat melihat seluruh laporan.
- BR-004: Teknisi hanya dapat melihat laporan yang ditugaskan kepadanya.

### GET /api/reports/:reportId
- Purpose: Mengambil detail laporan lengkap.
- Source Requirement: FR-004
- Allowed Actors: Pelapor, Administrator, Teknisi, Manajer Fasilitas
- Authentication Required: Yes

Success Response 200:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Baru",
  "reporter": {
    "id": "usr-001",
    "name": "Ayu",
    "role": "Pelapor"
  },
  "location": "Gedung A lantai 2",
  "issue_type": "Lampu ruang kelas rusak",
  "description": "Lampu tidak menyala sejak pagi",
  "category": null,
  "priority": null,
  "reviewed_at": null,
  "assigned_technician": null,
  "attachments": [],
  "comments": [],
  "status_history": [
    {
      "old_status": null,
      "new_status": "Baru",
      "actor_name": "Ayu",
      "actor_role": "Pelapor",
      "changed_at": "2026-07-03T08:30:00Z"
    }
  ]
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan atau resource di luar hak akses | Forbidden |
| 404 | Laporan tidak ditemukan | Not found |

Database Tables Used:
- service_requests
- service_request_comments
- service_request_status_history
- service_request_assignments
- service_request_attachments

Business Rules:
- BR-002, BR-003, BR-004

### PATCH /api/reports/:reportId/triage
- Purpose: Administrator memeriksa laporan dan menetapkan kategori serta prioritas.
- Source Requirement: FR-005, FR-006
- Allowed Actors: Administrator
- Authentication Required: Yes

Request Body:
```json
{
  "category": "Kelistrikan",
  "priority": "high"
}
```

Success Response 200:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Diperiksa",
  "category": "Kelistrikan",
  "priority": "high",
  "message": "Laporan berhasil diperiksa"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | Kategori atau prioritas tidak valid | Validation error |
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan | Forbidden |
| 404 | Laporan tidak ditemukan | Not found |
| 409 | Status laporan tidak dapat diperiksa | Conflict |

Database Tables Used:
- service_requests
- service_request_status_history

Business Rules:
- BR-005: Prioritas laporan harus dipilih dari nilai yang disetujui.

### POST /api/reports/:reportId/assign
- Purpose: Administrator menugaskan teknisi ke laporan.
- Source Requirement: FR-007, FR-008
- Allowed Actors: Administrator
- Authentication Required: Yes

Request Body:
```json
{
  "technician_id": "usr-tech-01"
}
```

Success Response 201:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Ditugaskan",
  "assigned_technician": {
    "id": "usr-tech-01",
    "name": "Budi",
    "role": "Teknisi"
  },
  "message": "Teknisi berhasil ditugaskan"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | `technician_id` tidak valid | Validation error |
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan | Forbidden |
| 404 | Laporan atau teknisi tidak ditemukan | Not found |
| 409 | Laporan sudah memiliki assignment aktif yang konflik | Conflict |

Database Tables Used:
- service_requests
- service_request_assignments
- service_request_status_history

Business Rules:
- BR-006: Setiap perubahan status harus dicatat ke riwayat status.

### POST /api/reports/:reportId/assignment/accept
- Purpose: Teknisi menerima tugas yang ditugaskan kepadanya.
- Source Requirement: FR-009
- Allowed Actors: Teknisi
- Authentication Required: Yes

Request Body:
```json
{
  "note": "Siap dikerjakan"
}
```

Success Response 200:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Diterima",
  "message": "Tugas diterima"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan atau bukan teknisi yang ditugaskan | Forbidden |
| 404 | Laporan atau assignment tidak ditemukan | Not found |
| 409 | Tugas sudah diterima atau status tidak sesuai | Conflict |

Database Tables Used:
- service_requests
- service_request_assignments
- service_request_status_history

Business Rules:
- BR-006: Setiap perubahan status harus dicatat ke riwayat status.

### POST /api/reports/:reportId/assignment/reject
- Purpose: Teknisi menolak tugas yang ditugaskan kepadanya dengan alasan.
- Source Requirement: FR-009
- Allowed Actors: Teknisi
- Authentication Required: Yes

Request Body:
```json
{
  "reason": "Sedang berada di lokasi lain"
}
```

Success Response 200:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Ditugaskan",
  "message": "Tugas ditolak"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | `reason` kosong | Validation error |
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan atau bukan teknisi yang ditugaskan | Forbidden |
| 404 | Laporan atau assignment tidak ditemukan | Not found |
| 409 | Assignment tidak dapat ditolak pada status saat ini | Conflict |

Database Tables Used:
- service_request_assignments
- service_request_status_history
- service_requests

Business Rules:
- BR-006: Setiap perubahan status harus dicatat ke riwayat status.

### POST /api/reports/:reportId/progress/start
- Purpose: Teknisi memulai pengerjaan laporan.
- Source Requirement: FR-009
- Allowed Actors: Teknisi
- Authentication Required: Yes

Request Body:
```json
{
  "note": "Mulai pemeriksaan di lokasi"
}
```

Success Response 200:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Sedang Dikerjakan",
  "message": "Progres diperbarui"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan atau bukan teknisi yang ditugaskan | Forbidden |
| 404 | Laporan tidak ditemukan | Not found |
| 409 | Status tidak dapat dipindahkan ke sedang dikerjakan | Conflict |

Database Tables Used:
- service_requests
- service_request_status_history

Business Rules:
- BR-006: Setiap perubahan status harus dicatat ke riwayat status.

### POST /api/reports/:reportId/progress/complete
- Purpose: Teknisi menandai pekerjaan selesai.
- Source Requirement: FR-009
- Allowed Actors: Teknisi
- Authentication Required: Yes

Request Body:
```json
{
  "note": "Pekerjaan selesai"
}
```

Success Response 200:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Selesai Dikerjakan",
  "message": "Pekerjaan ditandai selesai"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan atau bukan teknisi yang ditugaskan | Forbidden |
| 404 | Laporan tidak ditemukan | Not found |
| 409 | Status tidak dapat dipindahkan ke selesai dikerjakan | Conflict |

Database Tables Used:
- service_requests
- service_request_status_history

Business Rules:
- BR-006: Setiap perubahan status harus dicatat ke riwayat status.

### POST /api/reports/:reportId/comments
- Purpose: Menambahkan komentar atau catatan pada laporan.
- Source Requirement: FR-010
- Allowed Actors: Pelapor, Administrator, Teknisi
- Authentication Required: Yes

Request Body:
```json
{
  "body": "Mohon dicek kembali setelah jam kuliah selesai"
}
```

Success Response 201:
```json
{
  "id": "cmt-001",
  "message": "Komentar berhasil disimpan"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | `body` kosong | Validation error |
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan atau tidak punya akses ke laporan | Forbidden |
| 404 | Laporan tidak ditemukan | Not found |

Database Tables Used:
- service_request_comments

Business Rules:
- Komentar harus menempel pada laporan yang valid.

### POST /api/reports/:reportId/attachments
- Purpose: Mengunggah lampiran foto untuk laporan.
- Source Requirement: FR-001
- Allowed Actors: Pelapor
- Authentication Required: Yes

Request Body:
Content-Type: `multipart/form-data`

Fields:
- `file`: file gambar
- `caption`: string opsional

Success Response 201:
```json
{
  "id": "att-001",
  "file_name": "lampu-rusak.jpg",
  "message": "Lampiran berhasil diunggah"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | File tidak ada, bukan gambar, atau ukuran tidak valid | Validation error |
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan atau tidak punya akses ke laporan | Forbidden |
| 404 | Laporan tidak ditemukan | Not found |
| 503 | R2 tidak tersedia | Storage unavailable |

Database Tables Used:
- service_request_attachments

Business Rules:
- Lampiran hanya menyimpan metadata di D1 dan objek file di R2.

### POST /api/reports/:reportId/close
- Purpose: Administrator menutup laporan setelah hasil dikonfirmasi.
- Source Requirement: FR-012
- Allowed Actors: Administrator
- Authentication Required: Yes
- Status: Pending Validation

Request Body:
```json
{
  "closing_note": "Masalah selesai ditangani"
}
```

Success Response 200:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Ditutup",
  "message": "Laporan ditutup"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | Payload tidak valid | Validation error |
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan | Forbidden |
| 409 | Konfirmasi hasil belum terpenuhi atau status tidak sesuai | Conflict |

Database Tables Used:
- service_requests
- service_request_status_history

Business Rules:
- BR-007: Laporan hanya boleh ditutup setelah hasil pekerjaan dikonfirmasi oleh Pelapor.

### POST /api/reports/:reportId/reopen
- Purpose: Administrator membuka kembali laporan yang belum sesuai.
- Source Requirement: FR-012
- Allowed Actors: Administrator
- Authentication Required: Yes
- Status: Pending Validation

Request Body:
```json
{
  "reason": "Hasil perbaikan belum sesuai"
}
```

Success Response 200:
```json
{
  "id": "5e2f0af1-6bf4-4a4a-a7ed-60e8c2d4e2fd",
  "status": "Dibuka Kembali",
  "message": "Laporan dibuka kembali"
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 400 | `reason` kosong | Validation error |
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan | Forbidden |
| 404 | Laporan tidak ditemukan | Not found |
| 409 | Status tidak dapat dibuka kembali | Conflict |

Database Tables Used:
- service_requests
- service_request_status_history

Business Rules:
- BR-008: Laporan dapat dibuka kembali jika hasil pekerjaan belum sesuai.

### GET /api/dashboard
- Purpose: Mengambil ringkasan dashboard sederhana untuk Manajer Fasilitas.
- Source Requirement: FR-013
- Allowed Actors: Manajer Fasilitas
- Authentication Required: Yes
- Status: Pending Validation

Success Response 200:
```json
{
  "summary_by_status": [
    { "status": "Baru", "count": 4 },
    { "status": "Ditugaskan", "count": 2 }
  ],
  "summary_by_priority": [
    { "priority": "high", "count": 3 }
  ],
  "summary_by_category": [
    { "category": "Kelistrikan", "count": 5 }
  ],
  "average_resolution_time_hours": 12.5
}
```

Error Cases:
| Status Code | Condition | Response Summary |
|---|---|---|
| 401 | User belum login | Unauthorized |
| 403 | Role tidak diizinkan | Forbidden |
| 503 | Data agregat tidak tersedia sementara | Storage unavailable |

Database Tables Used:
- service_requests
- service_request_status_history

Business Rules:
- Dashboard minimum dan filter time range masih pending validation.

## 5. Role Access Matrix
| Endpoint | Pelapor | Administrator | Teknisi | Manajer Fasilitas |
|---|---|---|---|---|
| POST /api/reports | Yes | No | No | No |
| GET /api/reports | Yes | Yes | Yes | Yes |
| GET /api/reports/:reportId | Yes | Yes | Yes | Yes |
| PATCH /api/reports/:reportId/triage | No | Yes | No | No |
| POST /api/reports/:reportId/assign | No | Yes | No | No |
| POST /api/reports/:reportId/assignment/accept | No | No | Yes | No |
| POST /api/reports/:reportId/assignment/reject | No | No | Yes | No |
| POST /api/reports/:reportId/progress/start | No | No | Yes | No |
| POST /api/reports/:reportId/progress/complete | No | No | Yes | No |
| POST /api/reports/:reportId/comments | Yes | Yes | Yes | No |
| POST /api/reports/:reportId/attachments | Yes | No | No | No |
| POST /api/reports/:reportId/close | No | Yes | No | No |
| POST /api/reports/:reportId/reopen | No | Yes | No | No |
| GET /api/dashboard | No | No | No | Yes |

## 6. Requirement Traceability Matrix
| Requirement ID | Database Tables | API Endpoints | Notes |
|---|---|---|---|
| FR-001 | service_requests, service_request_attachments, service_request_status_history | POST /api/reports, POST /api/reports/:reportId/attachments | Membuat laporan dan lampiran foto |
| FR-002 | service_requests | POST /api/reports | Validasi field minimum |
| FR-003 | service_requests | GET /api/reports | Daftar laporan sesuai peran |
| FR-004 | service_requests, service_request_comments, service_request_status_history, service_request_assignments, service_request_attachments | GET /api/reports/:reportId | Detail lengkap laporan |
| FR-005 | service_requests, service_request_status_history | PATCH /api/reports/:reportId/triage | Pemeriksaan dan kategori |
| FR-006 | service_requests, service_request_status_history | PATCH /api/reports/:reportId/triage | Penentuan prioritas |
| FR-007 | service_requests, service_request_assignments, service_request_status_history | POST /api/reports/:reportId/assign | Penugasan teknisi |
| FR-008 | service_requests, service_request_assignments, service_request_status_history | POST /api/reports/:reportId/assign | Status berubah menjadi Ditugaskan |
| FR-009 | service_requests, service_request_assignments, service_request_status_history | POST /api/reports/:reportId/assignment/accept, POST /api/reports/:reportId/assignment/reject, POST /api/reports/:reportId/progress/start, POST /api/reports/:reportId/progress/complete | Alur teknisi |
| FR-010 | service_request_comments | POST /api/reports/:reportId/comments | Komentar/catatan |
| FR-011 | service_request_status_history | GET /api/reports/:reportId | Riwayat status otomatis ditampilkan di detail |
| FR-012 | service_requests, service_request_status_history | POST /api/reports/:reportId/close, POST /api/reports/:reportId/reopen | Pending validation |
| FR-013 | service_requests, service_request_status_history | GET /api/dashboard | Pending validation |

## 7. Business Rule Mapping
| Business Rule ID | Rule Summary | Enforced By | Related Table/API |
|---|---|---|---|
| BR-001 | Laporan baru harus memiliki lokasi, jenis masalah, dan deskripsi | API validation + NOT NULL | POST /api/reports, service_requests |
| BR-002 | Pelapor hanya dapat melihat laporan miliknya | Resource-level authz | GET /api/reports, GET /api/reports/:reportId |
| BR-003 | Administrator dapat melihat seluruh laporan | Role-based authz | GET /api/reports, GET /api/reports/:reportId |
| BR-004 | Teknisi hanya dapat melihat laporan yang ditugaskan kepadanya | Resource-level authz | GET /api/reports, GET /api/reports/:reportId |
| BR-005 | Prioritas hanya boleh memakai nilai yang disetujui | API validation + CHECK constraint | PATCH /api/reports/:reportId/triage |
| BR-006 | Setiap perubahan status harus dicatat ke riwayat status | Service-layer write path + history insert | Semua endpoint yang mengubah status |
| BR-007 | Laporan hanya boleh ditutup setelah hasil dikonfirmasi pelapor | API validation | POST /api/reports/:reportId/close |
| BR-008 | Laporan dapat dibuka kembali jika hasil belum sesuai | API validation | POST /api/reports/:reportId/reopen |

## 8. Non-Functional Design Notes
| NFR ID | Concern | Database/API Decision | Verification |
|---|---|---|---|
| NFR-001 | Security | Semua endpoint sensitif memakai session auth, role check, dan resource-level authorization | Authorization test |
| NFR-002 | Auditability | Setiap perubahan status menulis satu baris ke `service_request_status_history` | Audit trail test |
| NFR-003 | Data Integrity | FK, not null, dan write path konsisten mencegah data yatim | Constraint test |
| NFR-004 | Usability | Response status menggunakan label domain yang konsisten dengan UI | Contract test |
| NFR-005 | Availability | Response error aman dan tidak bergantung pada cache wajib | Smoke test dan failure-mode test |
| NFR-006 | Observability | Response dapat dilacak lewat request id/correlation id di layer worker | Log inspection |
| NFR-007 | Performance | GET daftar dan detail memakai pagination, filter, dan indeks yang sesuai | Performance smoke test |

## 9. Assumptions
- Asumsi: `/api/reports` adalah namespace REST utama untuk laporan layanan fasilitas.
- Asumsi: `POST /api/reports/:reportId/attachments` menerima satu file gambar per request; multi-file berarti beberapa request.
- Asumsi: `POST /api/reports/:reportId/assignment/reject` hanya menandai assignment sebagai ditolak dan tidak mengubah status laporan utama dari `Ditugaskan`.
- Asumsi: `GET /api/reports/:reportId` cukup untuk UI detail, sementara pagination tambahan untuk komentar atau history belum diwajibkan.

## 10. Risks
- Jika konfirmasi penutupan laporan berubah bentuk, endpoint `close` akan perlu payload dan validasi tambahan.
- Jika dashboard minimum akhirnya memerlukan time window default atau filter yang lebih kompleks, response contract akan berkembang.
- Jika penolakan assignment harus memicu status baru, state flow dan response `reject` perlu diubah.
- Jika attachment butuh upload resumable atau multiple file sekaligus, endpoint `attachments` perlu revisi.

## 11. Open Questions
- Apakah `close` harus menerima bukti konfirmasi pelapor sebagai payload eksplisit?
- Apakah `dashboard` memerlukan filter waktu, kategori, atau prioritas sebagai query params wajib?
- Apakah komentar perlu endpoint GET terpisah untuk pagination penuh?
- Apakah teknisi boleh menambahkan lampiran pada progress update, bukan hanya pelapor?
- Apakah kategori masalah akan diperlakukan sebagai teks bebas atau enum terkontrol?

## 12. Quality Check Result
- Complete: Ya, semua aksi utama yang didukung requirement memiliki endpoint, payload, response, error, dan role access.
- Consistent: Ya, istilah status, role, dan domain field selaras dengan specification, architecture, dan database schema.
- Traceable: Ya, setiap endpoint dipetakan ke requirement source dan tabel terkait.
- Testable: Ya, payload, error cases, authz, dan state transition dapat diuji.
- Secure: Ya, response tidak mengembalikan secret, token, atau data sensitif yang tidak perlu.
- Ready for Implementation: Ya, dengan catatan endpoint pending validation tetap dikonfirmasi sebelum coding final.
