# Campus Service Request and Maintenance System - Database Schema

## 1. Design Summary
- Project Name: Campus Service Request and Maintenance System
- Database Type: Relational database on Cloudflare D1
- API Style: Not included in this deliverable
- Source Documents: [output-specification.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/requirements/output-specification.md), [output-architecture-design.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/output-architecture-design.md)
- Scope: Penyimpanan laporan layanan fasilitas, penugasan teknisi, komentar, riwayat status, dan metadata lampiran foto
- Out of Scope: Kontrak API, implementasi backend, integrasi eksternal spesifik, dashboard read model terpisah, dan notifikasi channel final
- Assumptions:
  - Asumsi: Identity/session layer berada di luar database dan menyediakan `actor_id`, `actor_name`, dan `actor_role`
  - Asumsi: Semua timestamp disimpan dalam UTC
  - Asumsi: Lampiran foto disimpan di Cloudflare R2, sedangkan metadata disimpan di D1
  - Asumsi: Tidak ada tabel `users` internal karena identitas dikelola oleh layer autentikasi eksternal
- Open Questions:
  - Apakah konfirmasi penutupan laporan memerlukan field khusus di database atau cukup tercatat di riwayat status?
  - Berapa batas ukuran lampiran dan aturan retensinya?
  - Apakah kategori masalah perlu tabel referensi terpisah atau cukup disimpan sebagai nilai tervalidasi?

## 2. Data Model Overview
| Entity | Purpose | Source Requirement | Notes |
|---|---|---|---|
| service_requests | Menyimpan inti laporan fasilitas, status aktif, prioritas, dan snapshot pelapor/penugasan | FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-012, FR-013 | Menjadi system of record untuk satu laporan |
| service_request_comments | Menyimpan komentar dan catatan pada laporan | FR-004, FR-010 | Append-only per laporan |
| service_request_status_history | Menyimpan riwayat perubahan status untuk audit trail | FR-011, NFR-002 | Append-only, tidak di-update |
| service_request_assignments | Menyimpan riwayat penugasan teknisi dan status pengakuan tugas | FR-007, FR-008, FR-009 | Satu request dapat memiliki beberapa assignment jika ada penugasan ulang |
| service_request_attachments | Menyimpan metadata lampiran foto yang file-nya berada di R2 | FR-001 | Hanya metadata, bukan blob |

## 3. Database Schema
### Table: service_requests
- Source Requirement: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-012, FR-013
- Purpose: Menyimpan satu laporan layanan fasilitas dari pelapor sampai laporan ditutup atau dibuka kembali.

| Column | Type | Constraint | Nullable | Description |
|---|---|---|---|---|
| id | TEXT | PRIMARY KEY | No | ID unik laporan, disarankan UUID |
| reporter_id | TEXT | NOT NULL | No | Snapshot ID pelapor dari session layer |
| reporter_name | TEXT | NOT NULL | No | Snapshot nama pelapor |
| reporter_role | TEXT | NOT NULL | No | Snapshot peran pelapor |
| location | TEXT | NOT NULL | No | Lokasi fasilitas yang dilaporkan |
| issue_type | TEXT | NOT NULL | No | Jenis masalah fasilitas |
| description | TEXT | NOT NULL | No | Deskripsi masalah |
| category | TEXT | - | Yes | Kategori hasil pemeriksaan administrator |
| priority | TEXT | CHECK priority IN ('low', 'medium', 'high', 'urgent') | Yes | Prioritas laporan |
| status | TEXT | CHECK status IN ('baru', 'diperiksa', 'ditolak', 'ditugaskan', 'diterima', 'sedang_dikerjakan', 'selesai_dikerjakan', 'ditutup', 'dibuka_kembali') | No | Status aktif laporan |
| reviewed_by_id | TEXT | - | Yes | Snapshot ID administrator yang memeriksa laporan |
| reviewed_by_name | TEXT | - | Yes | Snapshot nama administrator |
| reviewed_by_role | TEXT | - | Yes | Snapshot peran pemeriksa |
| reviewed_at | TEXT | - | Yes | Waktu laporan diperiksa |
| assigned_technician_id | TEXT | - | Yes | Snapshot ID teknisi yang sedang ditugaskan |
| assigned_technician_name | TEXT | - | Yes | Snapshot nama teknisi |
| assigned_technician_role | TEXT | - | Yes | Snapshot peran teknisi |
| assigned_at | TEXT | - | Yes | Waktu penugasan aktif dibuat |
| accepted_at | TEXT | - | Yes | Waktu teknisi menerima tugas |
| started_at | TEXT | - | Yes | Waktu teknisi mulai mengerjakan laporan |
| completed_at | TEXT | - | Yes | Waktu pekerjaan dinyatakan selesai |
| closed_at | TEXT | - | Yes | Waktu laporan ditutup |
| reopened_at | TEXT | - | Yes | Waktu laporan dibuka kembali |
| rejection_reason | TEXT | - | Yes | Alasan penolakan laporan atau tugas jika status ditolak |
| created_at | TEXT | NOT NULL DEFAULT CURRENT_TIMESTAMP | No | Waktu laporan dibuat |
| updated_at | TEXT | NOT NULL DEFAULT CURRENT_TIMESTAMP | No | Waktu laporan terakhir diperbarui |

Relationships:
- `service_requests.id` direferensikan oleh `service_request_comments.request_id`.
- `service_requests.id` direferensikan oleh `service_request_status_history.request_id`.
- `service_requests.id` direferensikan oleh `service_request_assignments.request_id`.
- `service_requests.id` direferensikan oleh `service_request_attachments.request_id`.

Validation Notes:
- Field minimum untuk laporan baru adalah `location`, `issue_type`, dan `description`.
- `status` harus mengikuti status flow yang disetujui pada specification dan architecture design.
- `priority` hanya boleh memakai nilai yang sudah disepakati.
- Snapshot nama dan peran disimpan untuk audit trail agar riwayat tetap terbaca walau identitas eksternal berubah.

### Table: service_request_comments
- Source Requirement: FR-004, FR-010
- Purpose: Menyimpan komentar dan catatan yang menempel pada sebuah laporan.

| Column | Type | Constraint | Nullable | Description |
|---|---|---|---|---|
| id | TEXT | PRIMARY KEY | No | ID unik komentar |
| request_id | TEXT | NOT NULL, FOREIGN KEY service_requests.id | No | Laporan induk komentar |
| author_id | TEXT | NOT NULL | No | Snapshot ID penulis komentar |
| author_name | TEXT | NOT NULL | No | Snapshot nama penulis komentar |
| author_role | TEXT | NOT NULL | No | Snapshot peran penulis komentar |
| body | TEXT | NOT NULL | No | Isi komentar atau catatan |
| created_at | TEXT | NOT NULL DEFAULT CURRENT_TIMESTAMP | No | Waktu komentar dibuat |

Relationships:
- `service_request_comments.request_id` references `service_requests.id`.

Validation Notes:
- Komentar bersifat append-only.
- Komentar tidak boleh dibuat tanpa laporan induk yang valid.

### Table: service_request_status_history
- Source Requirement: FR-011, NFR-002
- Purpose: Menyimpan catatan perubahan status secara append-only untuk audit trail.

| Column | Type | Constraint | Nullable | Description |
|---|---|---|---|---|
| id | TEXT | PRIMARY KEY | No | ID unik riwayat status |
| request_id | TEXT | NOT NULL, FOREIGN KEY service_requests.id | No | Laporan yang berubah status |
| old_status | TEXT | NOT NULL | No | Status sebelum perubahan |
| new_status | TEXT | NOT NULL | No | Status sesudah perubahan |
| actor_id | TEXT | NOT NULL | No | Snapshot ID actor yang melakukan perubahan |
| actor_name | TEXT | NOT NULL | No | Snapshot nama actor |
| actor_role | TEXT | NOT NULL | No | Snapshot peran actor |
| reason | TEXT | - | Yes | Alasan perubahan jika diperlukan |
| changed_at | TEXT | NOT NULL DEFAULT CURRENT_TIMESTAMP | No | Waktu perubahan status |

Relationships:
- `service_request_status_history.request_id` references `service_requests.id`.

Validation Notes:
- Setiap perubahan status harus menghasilkan tepat satu baris history.
- Tabel ini bersifat append-only dan tidak di-update untuk menjaga auditability.
- `old_status` dan `new_status` harus berasal dari domain status yang sama dengan `service_requests.status`.

### Table: service_request_assignments
- Source Requirement: FR-007, FR-008, FR-009
- Purpose: Menyimpan riwayat penugasan teknisi dan siapa yang menugaskan tugas tersebut.

| Column | Type | Constraint | Nullable | Description |
|---|---|---|---|---|
| id | TEXT | PRIMARY KEY | No | ID unik penugasan |
| request_id | TEXT | NOT NULL, FOREIGN KEY service_requests.id | No | Laporan yang ditugaskan |
| technician_id | TEXT | NOT NULL | No | Snapshot ID teknisi |
| technician_name | TEXT | NOT NULL | No | Snapshot nama teknisi |
| technician_role | TEXT | NOT NULL | No | Snapshot peran teknisi |
| assigned_by_id | TEXT | NOT NULL | No | Snapshot ID administrator yang menugaskan |
| assigned_by_name | TEXT | NOT NULL | No | Snapshot nama administrator |
| assigned_by_role | TEXT | NOT NULL | No | Snapshot peran administrator |
| assigned_at | TEXT | NOT NULL DEFAULT CURRENT_TIMESTAMP | No | Waktu penugasan dibuat |
| acknowledged_at | TEXT | - | Yes | Waktu teknisi menerima tugas |
| rejected_at | TEXT | - | Yes | Waktu teknisi menolak tugas |
| rejection_reason | TEXT | - | Yes | Alasan teknisi menolak tugas |
| is_active | INTEGER | NOT NULL DEFAULT 1 | No | Menandai assignment aktif saat ini |

Relationships:
- `service_request_assignments.request_id` references `service_requests.id`.

Validation Notes:
- Satu laporan hanya boleh memiliki satu assignment aktif pada satu waktu.
- Jika assignment berubah, baris lama ditandai tidak aktif dan baris baru dibuat.
- Penolakan tugas harus menyimpan alasan.

### Table: service_request_attachments
- Source Requirement: FR-001
- Purpose: Menyimpan metadata lampiran foto yang fisiknya berada di Cloudflare R2.

| Column | Type | Constraint | Nullable | Description |
|---|---|---|---|---|
| id | TEXT | PRIMARY KEY | No | ID unik lampiran |
| request_id | TEXT | NOT NULL, FOREIGN KEY service_requests.id | No | Laporan induk lampiran |
| object_key | TEXT | NOT NULL | No | Kunci objek file di R2 |
| file_name | TEXT | NOT NULL | No | Nama file asli |
| mime_type | TEXT | NOT NULL | No | Tipe MIME file |
| file_size_bytes | INTEGER | NOT NULL | No | Ukuran file dalam byte |
| uploaded_by_id | TEXT | NOT NULL | No | Snapshot ID pengunggah |
| uploaded_by_name | TEXT | NOT NULL | No | Snapshot nama pengunggah |
| uploaded_by_role | TEXT | NOT NULL | No | Snapshot peran pengunggah |
| uploaded_at | TEXT | NOT NULL DEFAULT CURRENT_TIMESTAMP | No | Waktu lampiran diunggah |

Relationships:
- `service_request_attachments.request_id` references `service_requests.id`.

Validation Notes:
- Tabel ini hanya menyimpan metadata, bukan isi file.
- `mime_type` harus dibatasi ke tipe gambar yang disetujui.
- `file_size_bytes` harus divalidasi terhadap batas ukuran yang nanti disepakati.

### Recommended Indexes
| Index | Table | Columns | Purpose | Requirement ID |
|---|---|---|---|---|
| idx_service_requests_reporter_created_at | service_requests | reporter_id, created_at DESC | Menampilkan daftar laporan milik pelapor berdasarkan waktu terbaru | FR-003, FR-004 |
| idx_service_requests_status_created_at | service_requests | status, created_at DESC | Menampilkan daftar laporan per status dan agregat dashboard | FR-003, FR-013 |
| idx_service_requests_assigned_technician_updated_at | service_requests | assigned_technician_id, updated_at DESC | Menampilkan tugas teknisi dan status terakhir | FR-009 |
| idx_service_requests_priority_created_at | service_requests | priority, created_at DESC | Filter dan sortir prioritas laporan | FR-006 |
| idx_status_history_request_changed_at | service_request_status_history | request_id, changed_at ASC | Timeline riwayat status pada detail laporan | FR-011, NFR-002 |
| idx_comments_request_created_at | service_request_comments | request_id, created_at ASC | Menampilkan komentar per laporan secara kronologis | FR-010 |
| idx_assignments_request_assigned_at | service_request_assignments | request_id, assigned_at DESC | Melihat assignment aktif dan riwayat penugasan | FR-007, FR-008 |
| idx_attachments_request_uploaded_at | service_request_attachments | request_id, uploaded_at DESC | Menampilkan lampiran per laporan | FR-001 |

## 4. Relationship Summary
| Relationship | Type | Reason | Requirement ID |
|---|---|---|---|
| service_requests -> service_request_comments | One-to-many | Satu laporan dapat memiliki banyak komentar | FR-004, FR-010 |
| service_requests -> service_request_status_history | One-to-many | Setiap perubahan status harus tercatat sebagai histori baru | FR-011, NFR-002 |
| service_requests -> service_request_assignments | One-to-many | Laporan dapat ditugaskan ulang jika proses berubah | FR-007, FR-008, FR-009 |
| service_requests -> service_request_attachments | One-to-many | Satu laporan dapat memiliki beberapa foto lampiran | FR-001 |

## 5. Status Flow Data Handling
| Status | Stored In | Changed By | Database Rule | Requirement ID |
|---|---|---|---|---|
| baru | service_requests.status, service_request_status_history | Pelapor | Status awal laporan baru | FR-001, FR-002 |
| diperiksa | service_requests.status, service_request_status_history | Administrator | Hanya boleh terjadi setelah pemeriksaan laporan | FR-005 |
| ditolak | service_requests.status, service_request_status_history | Administrator | Alasan penolakan disimpan di `rejection_reason` atau history `reason` | FR-005, FR-012 |
| ditugaskan | service_requests.status, service_request_assignments, service_request_status_history | Administrator | Harus ada assignment aktif untuk teknisi | FR-007, FR-008 |
| diterima | service_requests.status, service_request_assignments, service_request_status_history | Teknisi | `acknowledged_at` diisi saat tugas diterima | FR-009 |
| sedang_dikerjakan | service_requests.status, service_request_status_history | Teknisi | Hanya dapat terjadi jika laporan sudah ditugaskan | FR-009 |
| selesai_dikerjakan | service_requests.status, service_request_status_history | Teknisi | Menandai pekerjaan selesai sebelum penutupan | FR-009, FR-011 |
| ditutup | service_requests.status, service_request_status_history | Administrator | Hanya setelah alur selesai dan hasil dikonfirmasi | FR-012 |
| dibuka_kembali | service_requests.status, service_request_status_history | Administrator | Mengembalikan laporan ke alur penugasan | FR-012 |

## 6. Business Rule Mapping
| Business Rule ID | Rule Summary | Enforced By | Related Table |
|---|---|---|---|
| BR-001 | Laporan baru harus memiliki lokasi, jenis masalah, dan deskripsi | Validasi aplikasi + NOT NULL | service_requests |
| BR-002 | Pelapor hanya dapat melihat laporan miliknya | Validasi otorisasi di layer aplikasi | service_requests |
| BR-003 | Administrator dapat melihat seluruh laporan | Validasi otorisasi di layer aplikasi | service_requests |
| BR-004 | Teknisi hanya dapat melihat laporan yang ditugaskan kepadanya | Validasi otorisasi di layer aplikasi + indeks assignment | service_requests, service_request_assignments |
| BR-005 | Prioritas hanya boleh memakai nilai yang disetujui | CHECK constraint + validasi aplikasi | service_requests |
| BR-006 | Setiap perubahan status harus dicatat ke riwayat status | Append-only insert + aturan write path | service_request_status_history |
| BR-007 | Laporan hanya boleh ditutup setelah hasil dikonfirmasi pelapor | Validasi aplikasi + status history | service_requests, service_request_status_history |
| BR-008 | Laporan dapat dibuka kembali jika hasil belum sesuai | Validasi aplikasi + status history | service_requests, service_request_status_history |

## 7. Non-Functional Design Notes
| NFR ID | Concern | Database Decision | Verification |
|---|---|---|---|
| NFR-001 | Security | Tidak menyimpan password atau token; hanya snapshot identitas minimum | Review schema dan payload |
| NFR-002 | Auditability | Riwayat status append-only di tabel terpisah | Query history menunjukkan old_status, new_status, actor, dan timestamp |
| NFR-003 | Data Integrity | FK antar tabel anak ke `service_requests.id` dan NOT NULL untuk data wajib | Constraint test dan referential integrity test |
| NFR-004 | Usability | Status disimpan memakai label domain yang sama dengan UI | Contract test terhadap nilai status |
| NFR-005 | Availability | Desain membaca laporan dari satu source of truth dan tidak bergantung pada cache wajib | Smoke test saat data tersedia dan saat storage error |
| NFR-006 | Observability | Kolom waktu dan snapshot actor mendukung audit dan troubleshooting | Pemeriksaan payload dan history row |
| NFR-007 | Performance | Index disusun berdasarkan pola baca utama: daftar, detail, history, komentar, assignment | Explain/query test saat implementasi |

## 8. Assumptions
- Asumsi: Tidak ada tabel `users` internal karena autentikasi dan otorisasi disediakan oleh layer session eksternal.
- Asumsi: Category disimpan sebagai nilai tervalidasi di `service_requests.category` sampai ada kebutuhan referensi terpisah yang disetujui.
- Asumsi: `priority` memakai nilai `low`, `medium`, `high`, dan `urgent` agar konsisten dengan rancangan yang sudah ada.
- Asumsi: `rejection_reason` cukup dipakai untuk alasan penolakan laporan atau penolakan tugas, selama validasi aplikasi membedakan konteksnya.

## 9. Risks
- Jika identitas session tidak menyediakan snapshot nama dan role secara konsisten, audit trail akan kehilangan konteks pembacaannya.
- Jika konfirmasi penutupan laporan berubah menjadi alur yang lebih kompleks, schema mungkin perlu kolom tambahan untuk approval atau feedback.
- Jika lampiran foto melebihi batas yang nanti disepakati, ukuran dan lifecycle cleanup perlu kebijakan tambahan.
- Jika category berkembang menjadi data referensial yang dipakai lintas modul, tabel lookup terpisah akan lebih tepat daripada teks bebas tervalidasi.

## 10. Open Questions
- Apakah category cukup sebagai teks tervalidasi, atau perlu tabel referensi terpisah?
- Apakah penutupan laporan harus menyimpan bukti konfirmasi pelapor sebagai field khusus?
- Apakah teknisi boleh memiliki lebih dari satu assignment aktif dalam kondisi tertentu?
- Berapa retensi lampiran foto dan riwayat status yang disetujui?
- Apakah ada kebutuhan pencarian full-text pada deskripsi atau komentar?

## 11. Quality Check Result
- Complete: Ya, entitas inti, tabel, kolom, relasi, constraint, index, status flow, business rule mapping, dan traceability tersedia.
- Consistent: Ya, istilah status, peran, dan komponen data selaras dengan specification dan architecture design.
- Traceable: Ya, setiap tabel dan rule utama dipetakan ke requirement source.
- Testable: Ya, constraint, index, status flow, dan audit trail dapat diuji saat implementasi.
- Secure: Ya, schema hanya menyimpan snapshot identitas minimum dan tidak menyimpan secret.
- Ready for Implementation: Ya, untuk tahap schema dan migration planning.
