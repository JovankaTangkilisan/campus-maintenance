---
name: 07-database-api-design
description: Panduan untuk merancang, mendokumentasikan, meninjau, dan memvalidasi database serta API perangkat lunak. Gunakan ketika Codex perlu membuat struktur penyimpanan data yang konsisten, efisien, aman, dan terintegrasi; merancang kontrak komunikasi antara frontend, backend, database, dan sistem eksternal; atau menyusun entity, relationship, constraint, index, endpoint, payload, autentikasi, error handling, versioning, dan traceability dari requirement proyek.
---

# 07 Database dan API Design

## Purpose
Gunakan skill ini untuk menghasilkan desain database dan API yang konsisten, efisien, aman, dapat diuji, dapat ditelusuri, dan siap menjadi acuan implementasi.

Skill ini menyelesaikan masalah struktur data yang tidak jelas, duplikasi atau inkonsistensi data, relasi dan constraint yang tidak lengkap, API yang ambigu, komunikasi antarsistem yang rapuh, serta kontrak data yang tidak terhubung dengan requirement bisnis.

## When to Use
Gunakan skill ini ketika pengguna meminta bantuan untuk:

- Merancang database relasional, dokumen, key-value, graph, time-series, atau penyimpanan lain.
- Membuat conceptual, logical, atau physical data model.
- Menentukan entity, atribut, relasi, constraint, index, partisi, dan retensi data.
- Merancang REST, GraphQL, RPC, webhook, event, atau message contract.
- Mendefinisikan komunikasi frontend, backend, database, dan sistem eksternal.
- Membuat API contract, request/response schema, status code, error format, pagination, filtering, dan versioning.
- Meninjau desain untuk integritas, performa, keamanan, privasi, reliability, dan scalability.
- Membuat traceability antara requirement, model data, endpoint, integrasi, dan acceptance criteria.

Jangan gunakan skill ini untuk mengubah database produksi, menjalankan migrasi, atau menerbitkan API tanpa persetujuan dan prosedur operasional yang sesuai.

## Inputs
Informasi berikut harus tersedia sebelum skill dijalankan:

- Nama sistem, modul, atau fitur.
- Tujuan bisnis dan ruang lingkup.
- Functional requirements, non-functional requirements, business rules, user stories, dan acceptance criteria.
- Aktor, peran, permission, dan skenario penggunaan.
- Data yang dibuat, dibaca, diubah, dihapus, dicari, atau dipertukarkan.
- Sumber data, pemilik data, klasifikasi sensitivitas, dan aturan retensi.
- Volume data, pola akses, beban, latency, throughput, availability, dan recovery target jika tersedia.
- Arsitektur sistem, platform, teknologi, dan batasan yang sudah dipilih.
- Sistem eksternal, protokol, autentikasi, dan kontrak integrasi yang sudah ada.
- Kebutuhan audit, keamanan, privasi, compliance, lokalisasi, dan time zone.
- Skema database, API specification, atau kode yang sudah ada jika desain merupakan perubahan.

Jika input penting tidak tersedia, minta klarifikasi sebelum memfinalkan desain.

## Required Context
Baca konteks proyek yang relevan sebelum membuat desain:

- Dokumen elicitation, specification, prioritization, dan architecture.
- Business rules, workflow, state transition, dan domain glossary.
- Existing schema, migration, seed, query, ORM model, dan data dictionary.
- Existing API contract, OpenAPI, GraphQL schema, event schema, SDK, dan integration guide.
- Kode frontend dan backend yang mengonsumsi atau menghasilkan data.
- Diagram sistem, network boundary, deployment topology, dan dependency eksternal.
- Security, privacy, compliance, backup, disaster recovery, dan retention policy.
- Monitoring, incident, performance test, analytics, dan pola penggunaan aktual jika tersedia.

Gunakan fakta yang tersedia. Tandai inferensi sebagai asumsi dan jangan mengarang kapasitas, SLA, field, business rule, atau kontrak sistem eksternal.

## Workflow
1. Tetapkan tujuan dan batas desain.
   - Identifikasi business goal, use case, aktor, data, sistem terlibat, dan scope.
   - Catat constraint, assumption, keputusan yang sudah final, dan pertanyaan terbuka.

2. Petakan aliran dan kepemilikan data.
   - Identifikasi producer, consumer, system of record, data owner, klasifikasi, dan lifecycle.
   - Gambarkan aliran frontend-backend-database-sistem eksternal.
   - Gunakan ID `DF-001`, `DF-002`, dan seterusnya.

3. Pilih pola penyimpanan.
   - Evaluasi kebutuhan consistency, transaction, query, scale, latency, availability, dan operasional.
   - Dokumentasikan alasan pemilihan jenis database atau pola polyglot persistence.
   - Jangan memilih teknologi hanya berdasarkan preferensi tanpa kebutuhan yang mendukung.

4. Susun model data.
   - Buat entity dengan ID `ENT-001`, atribut `FLD-001`, dan relationship `REL-001`.
   - Tentukan primary key, foreign key, cardinality, nullability, uniqueness, default, validation, dan referential action.
   - Normalisasi untuk konsistensi; denormalisasi hanya dengan alasan dan strategi sinkronisasi yang jelas.
   - Dokumentasikan enum, status transition, audit field, soft delete, history, dan temporal data jika relevan.

5. Rancang performa dan lifecycle data.
   - Definisikan index berdasarkan query nyata, bukan semua field.
   - Dokumentasikan pagination, partitioning, archival, retention, backup, restore, migration, dan growth strategy.
   - Gunakan metrik terukur untuk latency, throughput, volume, RPO, dan RTO jika telah diberikan.

6. Rancang API dan kontrak komunikasi.
   - Pilih style API berdasarkan pola interaksi dan constraint.
   - Gunakan ID `API-001` untuk operation dan `EVT-001` untuk event.
   - Definisikan method/operation, path/topic, authorization, parameter, request, response, status/error, idempotency, timeout, retry, dan rate limit.
   - Gunakan schema terstruktur dan format waktu, angka, mata uang, encoding, dan identifier yang konsisten.

7. Rancang integrasi antarsistem.
   - Bedakan komunikasi synchronous dan asynchronous.
   - Definisikan ownership, delivery semantics, ordering, deduplication, correlation ID, retry, backoff, dead-letter handling, dan reconciliation bila relevan.
   - Jangan mengasumsikan exactly-once delivery tanpa dukungan teknis yang tervalidasi.

8. Rancang keamanan dan privasi.
   - Terapkan authentication, authorization, least privilege, input validation, encryption, secret handling, audit, dan data minimization.
   - Larang sensitive data pada URL, log, error, atau event tanpa perlindungan yang sesuai.
   - Dokumentasikan threat dan kontrol dengan ID `SEC-001`.

9. Rancang evolusi dan kompatibilitas.
   - Definisikan API versioning, schema evolution, deprecation, compatibility, dan migration strategy.
   - Pastikan perubahan dapat di-roll back atau memiliki recovery plan.

10. Buat traceability dan keputusan desain.
   - Hubungkan requirement, business rule, entity, field, API, event, security control, dan acceptance criteria.
   - Catat keputusan dengan ID `ADR-001`, alternatif, alasan, dan konsekuensi.

11. Lakukan quality checks.
   - Periksa integritas, konsistensi, efisiensi, keamanan, testability, operability, compatibility, traceability, dan business value.

12. Hentikan jika informasi tidak mencukupi.
   - Jangan memfinalkan schema atau kontrak bila semantics, ownership, business rule, keamanan, atau integrasi kritis belum jelas.
   - Ajukan pertanyaan klarifikasi yang spesifik.

## Output Format
Hasilkan output dengan struktur berikut:

```markdown
# Database and API Design: <Nama Sistem/Fitur>

## 1. Ringkasan
- Tujuan bisnis:
- Ruang lingkup:
- Di luar ruang lingkup:
- Aktor dan sistem terlibat:
- Teknologi/batasan yang diberikan:

## 2. Konteks dan Asumsi
### 2.1 Sumber yang Ditinjau
| Source ID | Sumber | Ringkasan | Relevansi |
|---|---|---|---|

### 2.2 Asumsi
| Assumption ID | Asumsi | Alasan | Validasi | Risiko Jika Salah |
|---|---|---|---|---|

## 3. Data Flow dan Ownership
| Data Flow ID | Data | Producer | Consumer | System of Record | Trigger/Protocol | Sensitivitas |
|---|---|---|---|---|---|---|

## 4. Database Design
### 4.1 Pilihan Penyimpanan
| Decision ID | Kebutuhan | Pilihan | Alternatif | Alasan | Konsekuensi |
|---|---|---|---|---|---|

### 4.2 Entity dan Relationship
| Entity ID | Entity | Tujuan | Primary Key | Relationship | Requirement |
|---|---|---|---|---|---|

### 4.3 Data Dictionary
| Field ID | Entity.Field | Tipe | Null | Default | Constraint/Validasi | Sensitivitas | Deskripsi |
|---|---|---|---|---|---|---|---|

### 4.4 Index dan Pola Akses
| Index ID | Entity | Kolom | Tipe/Urutan | Query yang Didukung | Trade-off |
|---|---|---|---|---|---|

### 4.5 Lifecycle dan Migration
| Item ID | Area | Aturan/Strategi | Trigger/Jadwal | Recovery/Rollback |
|---|---|---|---|---|

## 5. API Design
### 5.1 API Operations
| API ID | Consumer | Method/Operation | Path/Topic | Tujuan | Authorization | Idempotency |
|---|---|---|---|---|---|---|

### 5.2 Request dan Response Contract
| API ID | Bagian | Field | Tipe | Wajib | Constraint | Deskripsi |
|---|---|---|---|---|---|---|

### 5.3 Error Contract
| Error Code | HTTP/Transport Status | Kondisi | Pesan Aman | Retryable | Tindakan Consumer |
|---|---|---|---|---|---|

### 5.4 Query, Pagination, dan Rate Limit
| API ID | Filtering/Sorting | Pagination | Batas | Rate Limit | Timeout |
|---|---|---|---|---|---|

## 6. Event dan Integrasi Eksternal
| Event/Integration ID | Producer | Consumer | Trigger | Schema/Contract | Delivery/Retry | Failure Handling |
|---|---|---|---|---|---|---|

## 7. Security dan Privacy
| Control ID | Risiko/Data | Kontrol | Enforcement Point | Verifikasi |
|---|---|---|---|---|

## 8. Non-Functional Design
| NFR ID | Atribut | Target Terukur | Mekanisme Desain | Cara Verifikasi |
|---|---|---|---|---|

## 9. Versioning dan Compatibility
| Item ID | Contract/Schema | Strategi | Compatibility | Deprecation/Migration |
|---|---|---|---|---|

## 10. Traceability Matrix
| Requirement/Rule | Entity/Field | API/Event | Security Control | Acceptance Criteria | Status |
|---|---|---|---|---|---|

## 11. Gap, Risiko, dan Pertanyaan Terbuka
### Gap
-

### Risiko
-

### Pertanyaan Terbuka
-

## 12. Quality Check Result
| Check | Result | Temuan/Bukti | Tindakan |
|---|---|---|---|
```

Jika format machine-readable diminta, hasilkan kontrak menggunakan standar yang sesuai seperti OpenAPI, AsyncAPI, JSON Schema, GraphQL SDL, atau DDL, lalu pastikan konsisten dengan dokumen desain. Jangan mengklaim kontrak valid sebelum melakukan validasi syntax/schema.

## Rules
- Jangan membuat fakta, field, endpoint, business rule, volume, SLA, atau kontrak eksternal yang tidak diberikan.
- Tandai asumsi secara eksplisit dengan ID `ASM-001`, `ASM-002`, dan seterusnya.
- Gunakan ID stabil untuk data flow, entity, field, relationship, index, API, event, security control, keputusan, dan error.
- Gunakan istilah domain yang konsisten dan dokumentasikan definisinya.
- Setiap entity dan field harus memiliki tujuan atau sumber yang jelas.
- Setiap relationship harus memiliki cardinality dan referential behavior.
- Setiap constraint harus dapat diuji.
- Jangan menggunakan tipe data generik jika precision, timezone, encoding, ukuran, atau batas nilainya penting.
- Jangan menyimpan nilai turunan tanpa alasan, ownership, dan mekanisme sinkronisasi.
- Jangan membuat index tanpa query atau pola akses yang mendukungnya.
- Jangan mengekspos struktur database sebagai kontrak API tanpa pertimbangan domain, keamanan, dan compatibility.
- Setiap API operation harus memiliki consumer, tujuan, authorization, input, output, dan error behavior.
- Gunakan status code dan error code secara konsisten; jangan membocorkan stack trace atau data sensitif.
- Operasi retryable harus memiliki idempotency atau strategi deduplication yang jelas.
- List endpoint harus mendefinisikan pagination dan batas hasil.
- Perubahan kontrak harus memiliki versioning, compatibility, deprecation, atau migration strategy.
- Pisahkan authentication dari authorization.
- Terapkan least privilege dan data minimization.
- Gunakan transaksi hanya untuk boundary konsistensi yang jelas.
- Jangan menggunakan kata ambigu seperti cepat, besar, scalable, aman, real-time, atau high availability tanpa ukuran dan kondisi pengujian.
- Jangan menghasilkan desain yang tidak dapat diuji atau ditelusuri ke requirement.

## Quality Checks
Sebelum finalisasi, periksa apakah output:

- Lengkap: data flow, ownership, schema, relationship, constraint, API contract, error, keamanan, lifecycle, dan integrasi relevan tersedia.
- Konsisten: nama, tipe, enum, identifier, waktu, status, dan semantics sama pada database dan API.
- Berintegritas: key, uniqueness, nullability, referential action, transaction boundary, dan validation jelas.
- Efisien: query utama memiliki pola akses dan index yang tepat; desain menghindari over-fetching, N+1, dan pertukaran data berlebihan.
- Aman: authentication, authorization, validation, encryption, audit, secret, dan sensitive data handling jelas.
- Dapat diuji: schema, constraint, endpoint, error, retry, compatibility, dan NFR memiliki cara verifikasi.
- Traceable: requirement dan business rule terhubung ke entity, field, API, event, security control, dan acceptance criteria.
- Reliable: timeout, retry, idempotency, deduplication, failure handling, dan recovery tersedia jika relevan.
- Compatible: versioning dan schema evolution melindungi consumer yang ada.
- Operable: monitoring, correlation, audit, backup, restore, retention, dan migration dipertimbangkan.
- Bernilai bisnis: data dan operasi mendukung use case serta tidak menambah kompleksitas tanpa manfaat.
- Tervalidasi: status item jelas seperti `Draft`, `Pending Validation`, `Validated`, `Assumption`, `Conflict`, atau `Blocked`.

## Failure Conditions
Skill harus berhenti atau meminta klarifikasi jika:

- Tujuan bisnis, scope, atau use case utama tidak tersedia.
- Arti, sumber, owner, atau lifecycle data kritis tidak diketahui.
- Business rule atau requirement saling bertentangan.
- Consumer, producer, atau system of record tidak dapat ditentukan.
- Permission, klasifikasi data, atau kebutuhan compliance kritis tidak jelas.
- API operation tidak memiliki behavior, input, output, atau error outcome yang dapat divalidasi.
- Kontrak sistem eksternal tidak tersedia dan tidak boleh diasumsikan.
- Target performa, availability, RPO, atau RTO diwajibkan tetapi tidak memiliki ukuran.
- Perubahan schema atau API berisiko merusak consumer tanpa migration atau compatibility plan.
- Desain memerlukan keputusan arsitektur yang berada di luar scope dan belum disetujui.

Saat berhenti, berikan:

- Bagian desain yang terblokir.
- Informasi yang kurang atau bertentangan.
- Risiko jika desain dilanjutkan berdasarkan asumsi.
- Pertanyaan klarifikasi yang diperlukan.

## Example Invocation
```text
Gunakan skill software-engineering-database-api-design untuk merancang database dan REST API fitur pemesanan konsultasi. Jelaskan struktur data, relationship, constraint, index, endpoint, request/response, error handling, authentication, authorization, komunikasi frontend-backend, serta integrasi payment gateway. Gunakan requirement proyek sebagai sumber dan tandai asumsi secara eksplisit.
```

## Expected Output Example
```markdown
# Database and API Design: Pemesanan Konsultasi

## 3. Data Flow dan Ownership
| Data Flow ID | Data | Producer | Consumer | System of Record | Trigger/Protocol | Sensitivitas |
|---|---|---|---|---|---|---|
| DF-001 | Data pemesanan | Frontend pelanggan | Booking Service | Booking Database | HTTPS/JSON | Internal |

## 4. Database Design
### 4.2 Entity dan Relationship
| Entity ID | Entity | Tujuan | Primary Key | Relationship | Requirement |
|---|---|---|---|---|---|
| ENT-001 | bookings | Menyimpan pemesanan konsultasi | booking_id (UUID) | Pelanggan 1:N booking; slot 1:1 booking aktif | FR-001, BR-001 |

### 4.3 Data Dictionary
| Field ID | Entity.Field | Tipe | Null | Default | Constraint/Validasi | Sensitivitas | Deskripsi |
|---|---|---|---|---|---|---|---|
| FLD-001 | bookings.status | VARCHAR(20) | Tidak | pending | Enum: pending, confirmed, cancelled | Internal | Status lifecycle pemesanan |

### 4.4 Index dan Pola Akses
| Index ID | Entity | Kolom | Tipe/Urutan | Query yang Didukung | Trade-off |
|---|---|---|---|---|---|
| IDX-001 | bookings | customer_id, created_at DESC | B-tree | Riwayat booking pelanggan berdasarkan waktu | Menambah biaya write dan storage |

## 5. API Design
### 5.1 API Operations
| API ID | Consumer | Method/Operation | Path/Topic | Tujuan | Authorization | Idempotency |
|---|---|---|---|---|---|---|
| API-001 | Frontend pelanggan | POST | /v1/bookings | Membuat pemesanan | Pelanggan terautentikasi | Header Idempotency-Key wajib |

### 5.2 Request dan Response Contract
| API ID | Bagian | Field | Tipe | Wajib | Constraint | Deskripsi |
|---|---|---|---|---|---|---|
| API-001 | Request | slot_id | UUID | Ya | Harus merujuk slot tersedia | Slot konsultasi yang dipilih |
| API-001 | Response | booking_id | UUID | Ya | Identifier unik | ID pemesanan yang dibuat |

### 5.3 Error Contract
| Error Code | HTTP/Transport Status | Kondisi | Pesan Aman | Retryable | Tindakan Consumer |
|---|---|---|---|---|---|
| SLOT_UNAVAILABLE | 409 | Slot sudah dipesan | Slot tidak lagi tersedia | Tidak | Tampilkan pilihan jadwal terbaru |

## 7. Security dan Privacy
| Control ID | Risiko/Data | Kontrol | Enforcement Point | Verifikasi |
|---|---|---|---|---|
| SEC-001 | Akses booking milik pengguna lain | Cocokkan customer_id token dengan owner booking | API authorization middleware | Integration test akses lintas pengguna menghasilkan 403 |

## 10. Traceability Matrix
| Requirement/Rule | Entity/Field | API/Event | Security Control | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| FR-001 / BR-001 | ENT-001 / FLD-001 | API-001 | SEC-001 | AC-001 | Pending Validation |

## 12. Quality Check Result
| Check | Result | Temuan/Bukti | Tindakan |
|---|---|---|---|
| Integritas | Pass | Slot aktif dibatasi satu booking melalui constraint yang harus ditetapkan pada physical design. | Validasi DBMS target. |
| Traceability | Pass | FR-001 terhubung ke entity, API, security control, dan AC-001. | Tidak ada. |
| Integrasi eksternal | Needs Follow-Up | Kontrak payment gateway belum diberikan. | Minta API specification resmi dari provider. |
```
