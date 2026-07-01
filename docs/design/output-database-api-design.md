# Database and API Design: Campus Service Request and Maintenance System

## 1. Ringkasan
- Tujuan bisnis: Mendukung alur pelaporan fasilitas kampus yang terpusat, tertelusur, dan dapat dipantau sampai penutupan laporan.
- Ruang lingkup: Penyimpanan laporan, komentar, riwayat status, penugasan teknisi, lampiran foto, query daftar/detail, workflow status, dan dashboard ringkas.
- Di luar ruang lingkup: Integrasi eksternal spesifik, kontrak notifikasi final di luar aplikasi, dan analytics lanjutan di luar dashboard ringkas.
- Aktor dan sistem terlibat: Pelapor, Administrator, Teknisi, Manajer Fasilitas, Web SPA, Cloudflare Worker API, Cloudflare D1, Cloudflare R2, dan Identity Provider / Session Layer [ASUMSI].
- Teknologi/batasan yang diberikan: React 19 + Vite + TypeScript di frontend, Cloudflare Worker sebagai backend edge, Cloudflare D1 sebagai system of record, dan Cloudflare R2 untuk lampiran foto.

## 2. Konteks dan Asumsi
### 2.1 Sumber yang Ditinjau
| Source ID | Sumber | Ringkasan | Relevansi |
|---|---|---|---|
| SRC-001 | output-architecture-design.md | Menetapkan edge-first modular monolith pada Cloudflare Worker, D1 sebagai system of record, dan R2 untuk lampiran. | Menjadi batas teknologi dan deployment. |
| SRC-002 | output-validation-change.md | Menandai item prioritas dan dependency yang masih pending validation. | Menjadi batas validasi untuk endpoint dan kontrak yang masih bisa berubah. |
| SRC-003 | output-specification.md | Memuat FR, NFR, business rules, dan acceptance criteria yang harus ditelusuri ke desain data dan API. | Sumber requirement utama untuk entity dan API. |
| SRC-004 | wrangler.jsonc dan worker/index.ts | Menunjukkan backend runtime saat ini adalah Cloudflare Worker. | Menjadi acuan implementasi API edge. |
| SRC-005 | package.json | Menunjukkan frontend berbasis React 19, Vite, dan TypeScript. | Menjadi consumer utama API JSON. |

### 2.2 Asumsi
| Assumption ID | Asumsi | Alasan | Validasi | Risiko Jika Salah |
|---|---|---|---|---|
| ASM-001 | Identity Provider / Session Layer belum final, tetapi API akan menerima `actor_id`, `actor_name`, dan `actor_role` dari session yang tervalidasi. | Sistem membutuhkan audit trail dan RBAC, tetapi sumber identitas belum dipilih. | Validasi owner produk / sponsor. | Jika klaim identitas tidak tersedia, authz dan audit trail perlu diubah. |
| ASM-002 | Lampiran foto disimpan sebagai objek di R2 dan metadata-nya disimpan di D1. | Sesuai keputusan arsitektur dan lebih cocok untuk file terpisah. | Validasi kebutuhan media dan retensi. | Jika lampiran harus inline, schema dan API upload berubah. |
| ASM-003 | Semua timestamp disimpan dalam UTC ISO-8601. | Menjaga konsistensi waktu antar status, komentar, dan dashboard. | Validasi kebutuhan lokalisasi jika ada. | Jika time zone lokal wajib, format dan query agregat perlu disesuaikan. |
| ASM-004 | Tidak ada kontrak integrasi eksternal selain session/auth layer yang sudah diasumsikan. | Source tidak mendefinisikan integrasi lain. | Validasi stakeholder bila ada channel eksternal lain. | Kontrak tambahan dapat memaksa perubahan endpoint dan event flow. |
| ASM-005 | Status workflow mengikuti nilai yang sudah tervalidasi di specification dan validation-change. | Harus konsisten dengan requirement yang diprioritaskan. | Validasi ulang saat rule bisnis berubah. | Jika status baru ditambahkan, enum dan state transition harus diperbarui. |

## 3. Data Flow dan Ownership
| Data Flow ID | Data | Producer | Consumer | System of Record | Trigger/Protocol | Sensitivitas |
|---|---|---|---|---|---|---|
| DF-001 | Laporan baru | Web SPA | Cloudflare Worker API, D1 | D1 | HTTPS/JSON `POST /api/reports` | Internal |
| DF-002 | Daftar laporan dan detail laporan | D1 | Web SPA via Worker | D1 | HTTPS/JSON `GET /api/reports`, `GET /api/reports/:id` | Internal |
| DF-003 | Perubahan status workflow | Administrator/Teknisi via Web SPA | D1 dan history timeline | D1 | HTTPS/JSON `POST /api/reports/:id/status` | Internal |
| DF-004 | Komentar/catatan | Pelapor/Administrator/Teknisi via Web SPA | D1 dan detail laporan | D1 | HTTPS/JSON `POST /api/reports/:id/comments` | Internal |
| DF-005 | Penugasan teknisi | Administrator via Web SPA | D1 dan teknisi terkait | D1 | HTTPS/JSON `POST /api/reports/:id/assign` | Internal |
| DF-006 | Lampiran foto | Web SPA | R2 via Worker, metadata ke D1 | R2 untuk objek, D1 untuk metadata | HTTPS upload/download | Internal |
| DF-007 | Dashboard ringkas | D1 aggregates | Manajer Fasilitas via Web SPA | D1 | HTTPS/JSON `GET /api/dashboard` | Internal |
| DF-008 | Identitas dan klaim peran | Identity layer [ASUMSI] | Worker API | Identity Provider [ASUMSI] | Token/session validation | Sensitif |

## 4. Database Design
### 4.1 Pilihan Penyimpanan
| Decision ID | Kebutuhan | Pilihan | Alternatif | Alasan | Konsekuensi |
|---|---|---|---|---|---|
| DEC-001 | Data laporan terstruktur, filter, detail, history, dan dashboard agregat | Cloudflare D1 relational database | KV, file storage, external SQL | Query utama bersifat relasional dan butuh audit trail yang konsisten. | Skema harus dijaga disiplin dan diindeks sesuai query utama. |
| DEC-002 | Lampiran foto opsional | Cloudflare R2 untuk objek dan D1 untuk metadata | Menyimpan blob di D1 | File lebih cocok di object storage, metadata tetap relasional. | Perlu proses cleanup dan referensi yang konsisten. |
| DEC-003 | Identitas pengguna | External identity/session layer [ASUMSI] dengan snapshot identitas di data domain | Internal user management penuh | Repository belum menunjukkan kebutuhan user management khusus; audit dan tampilan cukup memakai snapshot identitas. | Jika user management internal diperlukan, schema tambahan dibutuhkan. |

### 4.2 Entity dan Relationship
| Entity ID | Entity | Tujuan | Primary Key | Relationship | Requirement |
|---|---|---|---|---|---|
| ENT-001 | reports | Menyimpan inti laporan fasilitas. | report_id (UUID) | 1:N dengan report_comments, report_status_history, report_attachments, report_assignments; tepat 0..1 assignment aktif [ASUMSI] | FR-001, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-011, FR-012, FR-013 |
| ENT-002 | report_comments | Menyimpan komentar/catatan pada laporan. | comment_id (UUID) | N:1 ke reports | FR-010 |
| ENT-003 | report_status_history | Menyimpan audit trail perubahan status. | history_id (UUID) | N:1 ke reports | FR-011, NFR-002 |
| ENT-004 | report_assignments | Menyimpan penugasan teknisi dan status penugasan. | assignment_id (UUID) | N:1 ke reports | FR-007, FR-008, BR-004 |
| ENT-005 | report_attachments | Menyimpan metadata lampiran foto laporan. | attachment_id (UUID) | N:1 ke reports | FR-001 |
| ENT-006 | dashboard_snapshot [ASUMSI] | Menyimpan snapshot agregat jika caching laporan diperlukan. | snapshot_id (UUID) | Optional derivation dari reports dan report_status_history | FR-013, NFR-005 |

### 4.3 Data Dictionary
| Field ID | Entity.Field | Tipe | Null | Default | Constraint/Validasi | Sensitivitas | Deskripsi |
|---|---|---|---|---|---|---|---|
| FLD-001 | reports.report_id | UUID | Tidak | Generated | Unique, immutable | Internal | ID utama laporan. |
| FLD-002 | reports.report_number | VARCHAR(30) | Tidak | Generated | Unique | Internal | Nomor tampilan laporan. |
| FLD-003 | reports.reporter_id | VARCHAR(64) | Tidak | Session claim | Harus sesuai actor_id yang terautentikasi | Sensitif | ID pelapor dari session layer. |
| FLD-004 | reports.reporter_name | VARCHAR(120) | Tidak | Session claim | Non-empty | Internal | Snapshot nama pelapor untuk tampilan dan audit. |
| FLD-005 | reports.location | VARCHAR(200) | Tidak | None | Non-empty, trimmed | Internal | Lokasi fasilitas yang dilaporkan. |
| FLD-006 | reports.issue_type | VARCHAR(80) | Tidak | None | Non-empty | Internal | Jenis masalah fasilitas. |
| FLD-007 | reports.description | TEXT | Tidak | None | Non-empty | Internal | Deskripsi masalah. |
| FLD-008 | reports.category | VARCHAR(80) | Ya | NULL | Free text atau referential enum [ASUMSI] | Internal | Kategori hasil triase administrator. |
| FLD-009 | reports.priority | VARCHAR(20) | Ya | NULL | Enum: low, medium, high, urgent | Internal | Prioritas laporan. |
| FLD-010 | reports.status | VARCHAR(24) | Tidak | new | Enum: new, reviewed, assigned, accepted, in_progress, completed, reopened, closed, rejected | Internal | Status workflow laporan. |
| FLD-011 | reports.created_at | TIMESTAMP WITH TIME ZONE | Tidak | now() UTC | Immutable | Internal | Waktu pembuatan laporan. |
| FLD-012 | reports.updated_at | TIMESTAMP WITH TIME ZONE | Tidak | now() UTC | Auto-update | Internal | Waktu pembaruan terakhir laporan. |
| FLD-013 | reports.reviewed_at | TIMESTAMP WITH TIME ZONE | Ya | NULL | Set saat status reviewed | Internal | Waktu pemeriksaan laporan. |
| FLD-014 | reports.priority_set_at | TIMESTAMP WITH TIME ZONE | Ya | NULL | Set saat prioritas ditetapkan | Internal | Waktu prioritas ditentukan. |
| FLD-015 | reports.closed_at | TIMESTAMP WITH TIME ZONE | Ya | NULL | Set saat status closed | Internal | Waktu laporan ditutup. |
| FLD-016 | reports.reopened_at | TIMESTAMP WITH TIME ZONE | Ya | NULL | Set saat status reopened | Internal | Waktu laporan dibuka kembali. |
| FLD-017 | reports.assigned_technician_id | VARCHAR(64) | Ya | NULL | Hanya saat status assigned/accepted/in_progress/completed | Sensitif | ID teknisi yang ditugaskan. |
| FLD-018 | reports.assigned_technician_name | VARCHAR(120) | Ya | NULL | Snapshot non-empty saat assignment | Internal | Nama teknisi yang ditugaskan. |
| FLD-019 | reports.rejection_reason | TEXT | Ya | NULL | Wajib saat status rejected | Internal | Alasan penolakan tugas atau laporan. |
| FLD-020 | report_comments.comment_id | UUID | Tidak | Generated | Unique | Internal | ID komentar. |
| FLD-021 | report_comments.report_id | UUID | Tidak | FK | Must reference reports.report_id | Internal | Laporan induk komentar. |
| FLD-022 | report_comments.author_id | VARCHAR(64) | Tidak | Session claim | Harus sesuai actor_id | Sensitif | ID penulis komentar. |
| FLD-023 | report_comments.author_name | VARCHAR(120) | Tidak | Session claim | Non-empty | Internal | Nama penulis komentar. |
| FLD-024 | report_comments.author_role | VARCHAR(24) | Tidak | Session claim | Enum role valid | Internal | Peran penulis komentar. |
| FLD-025 | report_comments.body | TEXT | Tidak | None | Non-empty, max length [ASUMSI] | Internal | Isi komentar/catatan. |
| FLD-026 | report_comments.created_at | TIMESTAMP WITH TIME ZONE | Tidak | now() UTC | Immutable | Internal | Waktu komentar dibuat. |
| FLD-027 | report_status_history.history_id | UUID | Tidak | Generated | Unique | Internal | ID riwayat status. |
| FLD-028 | report_status_history.report_id | UUID | Tidak | FK | Must reference reports.report_id | Internal | Laporan induk riwayat. |
| FLD-029 | report_status_history.old_status | VARCHAR(24) | Tidak | None | Enum domain valid | Internal | Status lama sebelum perubahan. |
| FLD-030 | report_status_history.new_status | VARCHAR(24) | Tidak | None | Enum domain valid | Internal | Status baru setelah perubahan. |
| FLD-031 | report_status_history.actor_id | VARCHAR(64) | Tidak | Session claim | Harus sesuai actor_id | Sensitif | Actor yang melakukan perubahan. |
| FLD-032 | report_status_history.actor_name | VARCHAR(120) | Tidak | Session claim | Non-empty | Internal | Nama actor snapshot. |
| FLD-033 | report_status_history.actor_role | VARCHAR(24) | Tidak | Session claim | Enum role valid | Internal | Peran actor snapshot. |
| FLD-034 | report_status_history.changed_at | TIMESTAMP WITH TIME ZONE | Tidak | now() UTC | Immutable | Internal | Waktu perubahan status. |
| FLD-035 | report_status_history.reason | TEXT | Ya | NULL | Wajib untuk rejected/reopened/closed [ASUMSI] | Internal | Alasan perubahan status bila diperlukan. |
| FLD-036 | report_assignments.assignment_id | UUID | Tidak | Generated | Unique | Internal | ID penugasan. |
| FLD-037 | report_assignments.report_id | UUID | Tidak | FK | Must reference reports.report_id | Internal | Laporan yang ditugaskan. |
| FLD-038 | report_assignments.technician_id | VARCHAR(64) | Tidak | Session claim | Harus sesuai role teknisi | Sensitif | ID teknisi. |
| FLD-039 | report_assignments.technician_name | VARCHAR(120) | Tidak | Session claim | Non-empty | Internal | Nama teknisi snapshot. |
| FLD-040 | report_assignments.assigned_at | TIMESTAMP WITH TIME ZONE | Tidak | now() UTC | Immutable | Internal | Waktu penugasan. |
| FLD-041 | report_assignments.acknowledged_at | TIMESTAMP WITH TIME ZONE | Ya | NULL | Set saat teknisi menerima tugas | Internal | Waktu tugas diakui. |
| FLD-042 | report_assignments.rejected_at | TIMESTAMP WITH TIME ZONE | Ya | NULL | Set saat teknisi menolak tugas | Internal | Waktu tugas ditolak. |
| FLD-043 | report_assignments.rejection_reason | TEXT | Ya | NULL | Wajib saat rejected_at terisi | Internal | Alasan penolakan teknisi. |
| FLD-044 | report_attachments.attachment_id | UUID | Tidak | Generated | Unique | Internal | ID lampiran. |
| FLD-045 | report_attachments.report_id | UUID | Tidak | FK | Must reference reports.report_id | Internal | Laporan induk lampiran. |
| FLD-046 | report_attachments.object_key | VARCHAR(256) | Tidak | None | Must reference R2 object key | Internal | Kunci objek file di R2. |
| FLD-047 | report_attachments.file_name | VARCHAR(255) | Tidak | None | Non-empty | Internal | Nama file asli. |
| FLD-048 | report_attachments.mime_type | VARCHAR(100) | Tidak | None | Whitelist type | Internal | Tipe MIME file. |
| FLD-049 | report_attachments.file_size_bytes | INTEGER | Tidak | None | > 0, max size [ASUMSI] | Internal | Ukuran file. |
| FLD-050 | report_attachments.uploaded_at | TIMESTAMP WITH TIME ZONE | Tidak | now() UTC | Immutable | Internal | Waktu upload file. |

### 4.4 Index dan Pola Akses
| Index ID | Entity | Kolom | Tipe/Urutan | Query yang Didukung | Trade-off |
|---|---|---|---|---|---|
| IDX-001 | reports | reporter_id, created_at DESC | B-tree | Daftar laporan milik pelapor menurut waktu | Menambah biaya write saat laporan dibuat. |
| IDX-002 | reports | status, created_at DESC | B-tree | Daftar laporan by status untuk administrator dan dashboard | Menambah storage dan biaya update status. |
| IDX-003 | reports | assigned_technician_id, updated_at DESC | B-tree | Daftar tugas teknisi dan status terakhir | Menambah biaya write pada assignment dan status change. |
| IDX-004 | reports | priority, created_at DESC | B-tree | Filter dan sortir prioritas laporan | Memperberat update saat prioritas berubah. |
| IDX-005 | report_status_history | report_id, changed_at ASC | B-tree | Timeline kronologis riwayat status pada detail laporan | Menambah storage, tetapi dibutuhkan untuk audit. |
| IDX-006 | report_comments | report_id, created_at ASC | B-tree | Tampilkan komentar per laporan secara kronologis | Menambah write cost kecil pada komentar. |
| IDX-007 | report_assignments | report_id, assigned_at DESC | B-tree | Riwayat penugasan dan assignment aktif terbaru | Menambah storage dan kompleksitas constraint. |
| IDX-008 | reports | category, status | B-tree komposit | Dashboard agregat per kategori dan status | Membantu query, tetapi perlu penyesuaian jika kategori berubah. |

### 4.5 Lifecycle dan Migration
| Item ID | Area | Aturan/Strategi | Trigger/Jadwal | Recovery/Rollback |
|---|---|---|---|---|
| LCF-001 | Status lifecycle | Status disimpan sebagai enum string stabil di D1 dan hanya berubah melalui API Worker. | Setiap workflow request. | Rollback dengan restore status sebelumnya dari history. |
| LCF-002 | Audit history | `report_status_history` append-only, tidak di-update kecuali koreksi administratif yang terkontrol [ASUMSI]. | Setiap perubahan status. | Restore dari backup atau replay history. |
| LCF-003 | Lampiran foto | Metadata dihapus hanya setelah objek R2 dihapus atau sebaliknya dengan job pembersihan terurut. | Saat laporan dihapus secara administratif atau lampiran kadaluarsa [ASUMSI]. | Reconcile metadata vs object key pada job audit. |
| LCF-004 | Schema migration | Tambah kolom nullable dulu, backfill, baru enforce constraint. | Saat perubahan versi schema. | Rollback migrasi terakhir jika belum ada data bergantung. |
| LCF-005 | Retention | Retensi lampiran dan notifikasi belum final; data domain utama disimpan selama diperlukan untuk audit operasional [ASUMSI]. | Kebijakan sponsor. | Backfill/cleanup job sesuai kebijakan yang disepakati. |

## 5. API Design
### 5.1 API Operations
| API ID | Consumer | Method/Operation | Path/Topic | Tujuan | Authorization | Idempotency |
|---|---|---|---|---|---|---|
| API-001 | Pelapor | POST | /api/reports | Membuat laporan baru | Role: Pelapor | Tidak wajib; client retry harus membawa idempotency key [ASUMSI] |
| API-002 | Semua peran berwenang | GET | /api/reports | List laporan dengan filter dan pagination | Role-based | Ya, read-only |
| API-003 | Semua peran berwenang | GET | /api/reports/:reportId | Ambil detail laporan | Role-based, resource-level authz | Ya, read-only |
| API-004 | Administrator | PATCH | /api/reports/:reportId | Update kategori/prioritas/lifecycle fields yang diizinkan | Role: Administrator | Ya, patch bersifat upsert terbatas |
| API-005 | Administrator | POST | /api/reports/:reportId/assign | Menugaskan teknisi ke laporan | Role: Administrator | Ya jika assignment same payload |
| API-006 | Teknisi | POST | /api/reports/:reportId/status | Mengubah status pekerjaan | Role: Teknisi | Ya dengan idempotency key disarankan |
| API-007 | Pelapor/Administrator/Teknisi | POST | /api/reports/:reportId/comments | Menambah komentar atau catatan | Role-based | Tidak wajib; dapat didedup dengan request id [ASUMSI] |
| API-008 | Manajer Fasilitas | GET | /api/dashboard | Mengambil ringkasan dashboard | Role: Manajer Fasilitas | Ya, read-only |
| API-009 | Pelapor/Administrator/Teknisi [ASUMSI] | POST | /api/reports/:reportId/attachments | Upload lampiran foto | Role-based, resource-level authz | Ya dengan idempotency key untuk upload ulang |
| API-010 | Sistem internal | GET | /api/health | Health check worker | Public or internal minimal auth [ASUMSI] | Ya, read-only |

### 5.2 Request dan Response Contract
| API ID | Bagian | Field | Tipe | Wajib | Constraint | Deskripsi |
|---|---|---|---|---|---|---|
| API-001 | Request | location | string | Ya | trimmed, max 200 | Lokasi fasilitas yang dilaporkan. |
| API-001 | Request | issue_type | string | Ya | trimmed, max 80 | Jenis masalah. |
| API-001 | Request | description | string | Ya | non-empty | Deskripsi masalah. |
| API-001 | Request | attachments | array<object> | Tidak | opsional | Metadata lampiran yang disiapkan atau placeholder upload. |
| API-001 | Response | report_id | string (UUID) | Ya | immutable | ID laporan baru. |
| API-001 | Response | report_number | string | Ya | unique | Nomor tampilan laporan. |
| API-001 | Response | status | string | Ya | enum new | Status awal. |
| API-002 | Query | status | string | Tidak | enum domain | Filter status. |
| API-002 | Query | category | string | Tidak | free text / enum [ASUMSI] | Filter kategori. |
| API-002 | Query | priority | string | Tidak | low, medium, high, urgent | Filter prioritas. |
| API-002 | Query | from_date | string (date-time) | Tidak | ISO-8601 UTC | Batas bawah waktu. |
| API-002 | Query | to_date | string (date-time) | Tidak | ISO-8601 UTC | Batas atas waktu. |
| API-002 | Query | page | integer | Tidak | >= 1 | Nomor halaman. |
| API-002 | Query | page_size | integer | Tidak | 1..100 [ASUMSI] | Ukuran halaman. |
| API-002 | Response | items | array<report> | Ya | list of domain objects | Daftar laporan. |
| API-002 | Response | page | integer | Ya | >= 1 | Halaman saat ini. |
| API-002 | Response | page_size | integer | Ya | 1..100 | Ukuran halaman. |
| API-002 | Response | total_items | integer | Ya | >= 0 | Total hasil. |
| API-003 | Response | report | object | Ya | see report detail schema | Detail laporan lengkap. |
| API-004 | Request | category | string | Tidak | trimmed, max 80 | Kategori hasil triase. |
| API-004 | Request | priority | string | Tidak | low, medium, high, urgent | Prioritas laporan. |
| API-004 | Request | status | string | Tidak | restricted transitions only | Status yang diizinkan. |
| API-005 | Request | technician_id | string | Ya | role must be technician | ID teknisi yang ditugaskan. |
| API-005 | Request | technician_name | string | Ya | snapshot non-empty | Nama teknisi snapshot. |
| API-006 | Request | status | string | Ya | accepted, in_progress, completed, rejected | Status tujuan. |
| API-006 | Request | reason | string | Tidak | required when rejected | Alasan bila menolak/rollback tertentu. |
| API-007 | Request | body | string | Ya | non-empty, max length [ASUMSI] | Isi komentar/catatan. |
| API-008 | Response | summary_by_status | array<object> | Ya | status + count | Ringkasan per status. |
| API-008 | Response | summary_by_category | array<object> | Ya | category + count | Ringkasan per kategori. |
| API-008 | Response | summary_by_priority | array<object> | Ya | priority + count | Ringkasan per prioritas. |
| API-008 | Response | average_resolution_time_hours | number | Ya | >= 0 | Rata-rata waktu penyelesaian. |
| API-009 | Request | file_name | string | Ya | non-empty | Nama file asli. |
| API-009 | Request | mime_type | string | Ya | allowed image mime only [ASUMSI] | Tipe file. |
| API-009 | Request | file_size_bytes | integer | Ya | <= size limit [ASUMSI] | Ukuran file. |
| API-009 | Response | attachment_id | string (UUID) | Ya | immutable | ID lampiran. |
| API-009 | Response | object_key | string | Ya | unique | Kunci objek di R2. |

### 5.3 Error Contract
| Error Code | HTTP/Transport Status | Kondisi | Pesan Aman | Retryable | Tindakan Consumer |
|---|---|---|---|---|---|
| REPORT_VALIDATION_FAILED | 400 | Field wajib kosong atau format salah | Data laporan tidak valid | Tidak | Tampilkan validasi field. |
| UNAUTHORIZED | 401 | User tidak terautentikasi | Silakan masuk terlebih dahulu | Tidak | Redirect ke login / refresh session. |
| FORBIDDEN | 403 | Role atau resource tidak sesuai | Akses ditolak | Tidak | Sembunyikan aksi yang tidak diizinkan. |
| REPORT_NOT_FOUND | 404 | Laporan tidak ada | Laporan tidak ditemukan | Tidak | Tampilkan state kosong atau kembali ke daftar. |
| INVALID_STATUS_TRANSITION | 409 | Transisi status tidak valid | Perubahan status tidak diizinkan | Tidak | Muat ulang detail dan status terbaru. |
| ASSIGNMENT_CONFLICT | 409 | Assignment sudah ada atau konflik dengan aturan | Laporan sudah memiliki penugasan yang relevan | Tidak | Tampilkan assignment terakhir. |
| ATTACHMENT_UPLOAD_FAILED | 502 / 503 | Gagal menyimpan objek ke R2 | Gagal mengunggah lampiran | Ya | Retry dengan idempotency key atau simpan ulang. |
| STORAGE_UNAVAILABLE | 503 | D1/R2 tidak dapat diakses | Layanan penyimpanan sedang tidak tersedia | Ya | Tampilkan pesan gagal sementara dan retry kemudian. |
| RATE_LIMITED | 429 | Batas request terlampaui | Terlalu banyak permintaan | Ya setelah backoff | Tunggu sebelum mengirim ulang. |

### 5.4 Query, Pagination, dan Rate Limit
| API ID | Filtering/Sorting | Pagination | Batas | Rate Limit | Timeout |
|---|---|---|---|---|---|
| API-002 | Filter by status, category, priority, date range; sort by created_at desc default | Page-based pagination | page_size max 100 [ASUMSI] | 60 req/min/user [ASUMSI] | 5s [ASUMSI] |
| API-003 | No filter; fetch single report by id | N/A | 1 report only | 60 req/min/user [ASUMSI] | 5s [ASUMSI] |
| API-008 | No filter or optional time window [ASUMSI] | N/A | 1 dashboard payload | 30 req/min/user [ASUMSI] | 5s [ASUMSI] |
| API-001, API-004, API-005, API-006, API-007, API-009 | No list pagination | N/A | Single resource mutation | 30 req/min/user [ASUMSI] | 5s [ASUMSI] |

## 6. Event dan Integrasi Eksternal
| Event/Integration ID | Producer | Consumer | Trigger | Schema/Contract | Delivery/Retry | Failure Handling |
|---|---|---|---|---|---|---|
| EVT-001 | API Worker | D1 report_status_history | Status berubah | History row with old_status, new_status, actor, timestamp, reason | Same logical transaction on write path | Jika history gagal, status tidak disimpan. |
| EVT-002 | API Worker | D1 report_comments | Komentar dikirim | Comment row with author snapshot, body, timestamp | Immediate write | Jika write gagal, komentar tidak tampil. |
| EVT-003 | API Worker | R2 | Lampiran diupload | Object key + metadata | Retry by client idempotency key | Jika upload gagal, metadata tidak dibuat. |
| EVT-004 | API Worker | Identity layer [ASUMSI] | Request masuk | Token/session validation | Synchronous validation | Jika gagal, return 401/403. |
| EVT-005 | API Worker | Dashboard read model/query | Dashboard request | Aggregate query on reports/history | On demand read | Jika query lambat, gunakan indeks atau snapshot. |

## 7. Security dan Privacy
| Control ID | Risiko/Data | Kontrol | Enforcement Point | Verifikasi |
|---|---|---|---|---|
| SEC-001 | Akses laporan antar peran | Role-based authorization per endpoint dan per resource | API Worker middleware | Test akses lintas role menghasilkan 403. |
| SEC-002 | Data identitas pengguna | Simpan snapshot identitas minimal pada data domain | API Worker write path | Review payload dan schema tidak menyimpan data berlebih. |
| SEC-003 | Lampiran foto | Whitelist MIME type dan ukuran file | Attachment service | Upload non-image ditolak dengan 400. |
| SEC-004 | Audit trail | Append-only history untuk perubahan status | report_status_history write path | Query history menunjukkan actor dan waktu perubahan. |
| SEC-005 | Error message | Jangan bocorkan stack trace / detail storage | API error handler | Snapshot response error aman dan generik. |
| SEC-006 | Secret handling | Simpan secret di platform secret store | Deployment environment | Inspect config dan pastikan secret tidak ada di repo. |

## 8. Non-Functional Design
| NFR ID | Atribut | Target Terukur | Mekanisme Desain | Cara Verifikasi |
|---|---|---|---|---|
| NFR-001 | Security | 100% endpoint sensitif memerlukan authz berdasarkan role dan resource | Middleware auth guard + row-level checks | Integration test lintas role |
| NFR-002 | Auditability | Setiap perubahan status menghasilkan tepat 1 history row | Single write path pada workflow service | Audit query per scenario |
| NFR-003 | Data Integrity | Tidak ada komentar/status/assignment tanpa report parent yang valid | FK + transactional write boundary | DB constraint test |
| NFR-004 | Usability | Label status konsisten pada list/detail/dashboard | Enum status stabil di API dan DB | UI/API contract test |
| NFR-005 | Availability | Data laporan yang valid kembali sebagai response atau error aman | D1/R2 managed service + graceful error handling | Smoke test deployment dan failure mode |
| NFR-006 | Observability | Request dapat dilacak end-to-end dengan correlation ID | Structured logging di Worker | Log inspection per request |
| NFR-007 | Performance | List/detail/dashboard selesai dalam timeout API yang disepakati [ASUMSI] | Index yang tepat dan query read-only | Performance smoke test |

## 9. Versioning dan Compatibility
| Item ID | Contract/Schema | Strategi | Compatibility | Deprecation/Migration |
|---|---|---|---|---|
| VER-001 | REST API `/api/...` | Versioning path belum dipakai untuk MVP, tetapi perubahan breaking harus ditambah versi baru bila diperlukan | Backward-compatible changes only untuk MVP | Tambahkan v2 jika ada breaking change besar. |
| VER-002 | reports.status enum | Schema evolution dengan menambah nilai baru secara terkendali | Backward-compatible jika consumer mengenali unknown status sebagai fallback [ASUMSI] | Tambahkan status baru setelah validasi business rule. |
| VER-003 | report_comments / history snapshot fields | Tambah kolom nullable lalu backfill | Compatible selama consumer membaca field baru secara opsional | Deprecate field lama setelah semua consumer pindah. |
| VER-004 | attachment metadata | Object key dan metadata tetap stabil | Compatible jika object key format tidak berubah | Gunakan migration job jika nama bucket/key berubah. |

## 10. Traceability Matrix
| Requirement/Rule | Entity/Field | API/Event | Security Control | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| FR-001 / BR-001 | ENT-001 / FLD-005, FLD-006, FLD-007, FLD-011 | API-001, API-009 | SEC-005, SEC-006 | AC-001, AC-002 | Validated |
| FR-002 / BR-001 | ENT-001 / FLD-005, FLD-006, FLD-007 | API-001 | SEC-001, SEC-002 | AC-001, AC-002 | Validated |
| FR-003 / BR-002, BR-003, BR-004 | ENT-001 / FLD-003, FLD-009, FLD-010, FLD-017 | API-002, API-003 | SEC-001, SEC-002 | AC-003, AC-004, AC-005 | Validated |
| FR-004 | ENT-001, ENT-002, ENT-003, ENT-004, ENT-005 | API-003 | SEC-001, SEC-002 | AC-006 | Validated |
| FR-005 / BR-005 | ENT-001 / FLD-008 | API-004 | SEC-001, SEC-002 | AC-007, AC-008 | Validated |
| FR-006 / BR-005 | ENT-001 / FLD-009, FLD-014 | API-004 | SEC-001, SEC-002 | AC-009 | Validated |
| FR-007 / BR-004 | ENT-001, ENT-004 | API-005 | SEC-001, SEC-002 | AC-010, AC-011 | Validated |
| FR-008 / BR-006 | ENT-001 / FLD-010, FLD-012; ENT-003 | API-006, EVT-001 | SEC-001, SEC-004 | AC-011 | Validated |
| FR-009 | ENT-001 / FLD-017, FLD-018, FLD-019; ENT-004 | API-006 | SEC-001, SEC-002 | AC-012, AC-013, AC-014 | Validated |
| FR-010 | ENT-002 | API-007, EVT-002 | SEC-001, SEC-002 | AC-015 | Validated |
| FR-011 / NFR-002 | ENT-003 | EVT-001 | SEC-004 | AC-016 | Validated |
| FR-012 | ENT-001 / FLD-015, FLD-016 | API-004 | SEC-001, SEC-002 | AC-017, AC-018 | Pending Validation |
| FR-013 | ENT-001, ENT-003, ENT-006 [ASUMSI] | API-008, EVT-005 | SEC-001 | AC-019 | Pending Validation |
| NFR-001 | ENT-001-ENT-005 | API-001-API-009 | SEC-001, SEC-002, SEC-003, SEC-005, SEC-006 | Permission and negative tests | Validated |
| NFR-003 | ENT-001-ENT-005 | API-001-API-009 | SEC-003, SEC-004 | Constraint tests and FK tests | Validated |
| NFR-004 | reports.status | API-002, API-003, API-008 | SEC-001 | UI/API consistency checks | Pending Validation |
| NFR-005 | ENT-001, ENT-003 | API-002, API-003, API-008 | SEC-005 | Smoke test and graceful failure tests | Pending Validation |

## 11. Gap, Risiko, dan Pertanyaan Terbuka
### Gap
- Skema identitas internal belum ditetapkan karena auth layer masih asumsi.
- Batas ukuran lampiran foto belum diberikan.
- Retensi lampiran dan kebijakan penghapusan belum ditetapkan.
- Beberapa target NFR seperti timeout, rate limit, dan availability belum diukur dari stakeholder.
- Dashboard minimum masih pending validation dan dapat memengaruhi read model.

### Risiko
- Jika session claims tidak konsisten, audit trail dan role-based authorization perlu desain ulang.
- Jika lampiran foto memiliki batas ukuran besar, R2 upload contract dan cleanup perlu diperketat.
- Jika laporan ditutup atau dibuka kembali dengan rule tambahan, status enum dan transition logic harus diperbarui.
- Jika dashboard akhirnya memerlukan filter waktu yang lebih kompleks, index dan query plan perlu diubah.

### Pertanyaan Terbuka
- Apakah session/auth layer akan memberi `actor_id`, `actor_name`, dan `actor_role` secara konsisten?
- Berapa batas ukuran maksimum file lampiran yang disetujui?
- Apakah ada masa retensi wajib untuk lampiran foto dan audit trail?
- Apakah dashboard awal memerlukan filter tanggal default selain agregat ringkas?
- Apakah status `rejected` dan `closed` memerlukan reason selalu wajib?

## 12. Quality Check Result
| Check | Result | Temuan/Bukti | Tindakan |
|---|---|---|---|
| Lengkap | Lulus | Data flow, entity, field, API, error, security, lifecycle, versioning, dan traceability tersedia. | Tidak ada. |
| Konsisten | Lulus | Status, role, dan data flow selaras dengan architecture dan specification. | Review ulang jika rule bisnis berubah. |
| Berintegritas | Lulus | PK, FK, nullability, uniqueness, dan append-only history didefinisikan. | Validasi physical schema saat implementasi. |
| Efisien | Lulus | Index disusun berdasarkan query nyata untuk daftar, detail, history, dan dashboard. | Tuning lanjutan jika volume berubah. |
| Aman | Lulus | Authz, validation, secret handling, dan audit trail tercakup. | Finalisasi identity provider. |
| Dapat diuji | Lulus | Error contract, FK, enum, endpoint, dan NFR memiliki verifikasi. | Buat integration test sesuai matrix. |
| Traceable | Lulus | Requirement dan business rule terhubung ke entity, field, API, event, dan control. | Tidak ada. |
| Reliable | Lulus | Write path history atomik dan failure handling upload/error didefinisikan. | Tambah retry strategy saat implementasi. |
| Compatible | Lulus | Versioning dan schema evolution disiapkan untuk perubahan berikutnya. | Gunakan additive changes sebagai default. |
| Operable | Lulus | Observability, backup/restore path, dan migration strategy sudah dipertimbangkan. | Lengkapi runbook. |
| Bernilai bisnis | Lulus | Desain mendukung workflow inti dan dashboard tanpa kompleksitas berlebih. | Pertahankan kesederhanaan untuk MVP. |
| Tervalidasi | Parsial | FR-012, FR-013, NFR-004, dan NFR-005 masih pending validation. | Validation spike sebelum freeze. |
