---
name: 08-issue-planning
description: Mengubah requirement, spesifikasi, architecture design, database/API design, atau UI design proyek Campus Service Request and Maintenance System menjadi GitHub Issues yang siap dikerjakan. Gunakan skill ini untuk membuat backlog vertical slice, issue implementasi end-to-end, dependency, acceptance criteria, label, milestone, dan traceability sebelum coding dimulai.
---

# Campus Service Request and Maintenance System - Issue Planning

## Tujuan
Skill ini membantu mengubah requirement dan desain proyek Campus Service Request and Maintenance System menjadi kumpulan GitHub Issues yang siap dikerjakan oleh developer, tim mahasiswa, atau agent otomatis.

Setiap issue sebaiknya berbentuk vertical slice, yaitu potongan kerja kecil yang menghasilkan perilaku end-to-end dan dapat diverifikasi. Issue tidak hanya membahas satu layer seperti database saja atau UI saja, kecuali pekerjaan tersebut memang berupa prefactor, setup, spike, dokumentasi, atau perbaikan teknis yang berdiri sendiri.

Hasil skill ini menjadi jembatan dari dokumen requirement, architecture design, database/API design, dan UI design menuju implementasi.

## Kapan Digunakan
Gunakan skill ini ketika:
- Requirement, PRD, spesifikasi, atau desain perlu dipecah menjadi GitHub Issues.
- Tim ingin membuat backlog implementasi untuk proyek Campus Service Request and Maintenance System.
- Dokumen architecture design, database/API design, atau UI design sudah selesai dan perlu diterjemahkan menjadi pekerjaan teknis.
- User meminta issue untuk fitur seperti submit service request, review laporan, assign teknisi, update status, dashboard, notifikasi, atau attachment.
- Ada issue induk yang perlu dipecah menjadi beberapa child issues.
- Tim perlu memastikan setiap issue memiliki dependency, acceptance criteria, dan requirement traceability.

Jangan gunakan skill ini untuk membuat requirement baru dari nol. Jika requirement belum jelas, minta klarifikasi atau gunakan skill elicitation/specification terlebih dahulu.

## Input
Informasi berikut harus tersedia:
- Dokumen requirement atau spesifikasi dengan requirement ID.
- User stories dan acceptance criteria.
- Business rules, terutama aturan status service request dan role access.
- Architecture design.
- Database dan API design jika sudah ada.
- UI design, wireframe, atau prototype jika issue menyentuh halaman aplikasi.
- Daftar aktor sistem, misalnya Requester, Administrator, Technician, dan Facility Manager.
- Target milestone, sprint, release, atau prioritas jika tersedia.
- Konvensi label GitHub jika tersedia.
- Akses repository GitHub jika user meminta issue langsung dipublish.

Jika GitHub tidak tersedia, hasilkan draft issue dalam Markdown dan jangan berpura-pura sudah mempublish issue.

## Required Context
Baca konteks berikut sebelum membuat issue:
- Requirement untuk pembuatan service request.
- Requirement untuk review dan approval/rejection request.
- Requirement untuk assignment teknisi.
- Requirement untuk update progres dan status maintenance.
- Requirement untuk resolved dan closed request.
- Requirement untuk dashboard, laporan, atau monitoring jika ada.
- Requirement untuk notifikasi, komentar, attachment, atau audit trail jika ada.
- Desain arsitektur untuk mengetahui komponen yang terdampak.
- Desain database/API untuk mengetahui tabel dan endpoint yang sudah direncanakan.
- Desain UI untuk mengetahui halaman, form, tabel, filter, dan state yang perlu diwujudkan.
- Issue existing jika user meminta breakdown dari issue induk atau ingin menghindari duplikasi.

Jangan menebak detail repository, label, assignee, milestone, atau nomor issue jika tidak diberikan.

## Langkah Kerja
1. Baca seluruh requirement dan desain pendukung. Catat requirement ID, business rule ID, user story ID, dan design decision ID yang relevan.
2. Kelompokkan kebutuhan berdasarkan workflow utama, misalnya request submission, admin review, technician assignment, progress update, request closure, dashboard, dan notification.
3. Identifikasi pekerjaan prefactor atau setup yang harus dilakukan sebelum vertical slice, misalnya setup role access, status model, atau struktur routing dasar.
4. Pecah workflow menjadi vertical slice yang kecil dan dapat diuji. Setiap slice harus memiliki nilai yang bisa didemokan.
5. Pastikan vertical slice memotong layer yang diperlukan, seperti UI, API, database, validation, authorization, dan test, tanpa menjadi terlalu besar.
6. Tentukan dependency antar issue. Issue yang menjadi blocker harus dibuat atau dicatat lebih dulu.
7. Untuk setiap issue, tulis title yang spesifik, requirement traceability, outcome yang dibangun, acceptance criteria, scope, out of scope, test notes, dan dependency.
8. Pisahkan issue horizontal hanya jika memang diperlukan, misalnya environment setup, shared component, data migration, security hardening, spike, atau documentation.
9. Susun draft issue sebagai daftar bernomor dan minta persetujuan manusia jika user ingin issue dipublish ke GitHub.
10. Setelah draft disetujui, publish issue berurutan sesuai dependency jika akses GitHub tersedia dan user memang meminta publish.
11. Jika tidak ada akses GitHub, berhenti pada dokumen draft issue yang siap ditempel ke GitHub.
12. Lakukan quality check untuk memastikan issue lengkap, tidak duplikat, testable, dan traceable.
13. Hentikan jika requirement tidak cukup, dependency tidak jelas, atau user belum menyetujui draft publish.

## Output
Jika user meminta dokumen planning, buat file `campus-service-request-maintenance-issue-plan.md` dengan struktur berikut:

```markdown
# Campus Service Request and Maintenance System - Issue Plan

## 1. Planning Summary
- Source Documents:
- Scope:
- Out of Scope:
- Planning Approach: Vertical slice
- Target Milestone:
- Assumptions:
- Open Questions:

## 2. Epic Overview
| Epic ID | Epic Name | Business Value | Related Requirement ID |
|---|---|---|---|
| EPIC-01 | Service Request Submission | Requester dapat melaporkan masalah fasilitas | FR-01 |

## 3. Issue Breakdown
| Issue ID | Title | Type | Priority | Blocked By | Requirement ID | Status |
|---|---|---|---|---|---|---|
| GH-DRAFT-001 | Submit a new facility service request end-to-end | feature | P1 | None | FR-01 | Draft |

## 4. GitHub Issue Drafts

### GH-DRAFT-001: Submit a new facility service request end-to-end
- Type: feature
- Priority: P1
- Milestone: TBD
- Labels: feature, vertical-slice, service-request
- Assignee: TBD
- Blocked By: None
- Blocks: GH-DRAFT-002
- Requirement Traceability: FR-01, US-01, BR-01

#### Requirement Terkait
- FR-01: Requester dapat membuat service request.
- BR-01: Request baru harus dimulai dari status Submitted.

#### Yang Dibangun
Requester dapat mengisi form service request, mengirim laporan ke backend, data tersimpan, dan request baru tampil dengan status Submitted.

#### Scope
- UI form pembuatan service request.
- Validasi input wajib.
- API untuk membuat service request.
- Penyimpanan data request.
- Status awal Submitted.
- Test untuk skenario berhasil dan validasi gagal.

#### Out of Scope
- Assignment teknisi.
- Notifikasi.
- Upload foto jika belum disetujui.

#### Kriteria Penerimaan
- [ ] Given requester sudah login, when mengirim form valid, then sistem membuat service request baru dengan status Submitted.
- [ ] Given field wajib kosong, when form dikirim, then sistem menampilkan pesan validasi dan request tidak dibuat.
- [ ] Given request berhasil dibuat, when requester membuka daftar request, then request baru muncul di daftar miliknya.

#### Test Notes
- Tambahkan test untuk request valid.
- Tambahkan test untuk payload tidak valid.
- Tambahkan test authorization jika role selain requester tidak boleh membuat request.

#### Diblokir Oleh
- Tidak ada - bisa langsung dikerjakan.

#### Catatan
- Asumsi: Login dan role requester sudah tersedia. Jika belum, buat issue setup auth terlebih dahulu.

## 5. Dependency Order
1. GH-DRAFT-001 - Dibutuhkan sebagai alur dasar pembuatan request.
2. GH-DRAFT-002 - Bergantung pada request yang sudah bisa dibuat.

## 6. Requirement Traceability Matrix
| Requirement ID | Related Issue | Covered? | Notes |
|---|---|---|---|
| FR-01 | GH-DRAFT-001 | Yes | Submit request end-to-end |

## 7. Publish Checklist
- [ ] Draft issue sudah direview manusia.
- [ ] Dependency sudah benar.
- [ ] Label dan milestone sudah dikonfirmasi.
- [ ] Tidak ada issue duplikat.
- [ ] User menyetujui publish ke GitHub.

## 8. Quality Check Result
- Complete:
- Independent:
- Vertical:
- Traceable:
- Testable:
- Dependency Clear:
- Ready to Publish:
```

Jika user meminta format body GitHub Issue individual, gunakan template berikut:

```markdown
## Requirement Terkait
- [Requirement ID dan ringkasan]

## Yang Dibangun
[Deskripsi perilaku end-to-end yang akan selesai setelah issue ini dikerjakan.]

## Scope
- ...

## Out of Scope
- ...

## Kriteria Penerimaan
- [ ] Given ..., when ..., then ...

## Test Notes
- ...

## Diblokir Oleh
- Tidak ada - bisa langsung dikerjakan
atau
- #123

## Catatan
- Asumsi: ...
```

## Aturan
- Jangan membuat fakta, fitur, role, status, atau dependency yang tidak diberikan.
- Tandai asumsi secara eksplisit dengan label `Asumsi`.
- Gunakan requirement ID, user story ID, business rule ID, atau design decision ID di setiap issue.
- Jika dokumen sumber tidak memiliki ID, buat ID sementara seperti `REQ-TEMP-001` dan jelaskan bahwa ID tersebut sementara.
- Utamakan vertical slice yang bisa didemokan end-to-end.
- Jangan memecah semua pekerjaan berdasarkan layer saja, seperti hanya database, hanya API, atau hanya UI, kecuali pekerjaan tersebut memang setup, prefactor, spike, test, docs, atau technical task.
- Setiap issue harus memiliki acceptance criteria yang dapat diuji.
- Setiap issue harus memiliki scope dan out of scope.
- Setiap dependency harus jelas dan tidak melingkar.
- Jangan mencantumkan nomor issue GitHub nyata jika issue belum dipublish.
- Jangan menutup, mengubah, atau menghapus issue induk kecuali user meminta secara eksplisit.
- Jangan publish issue ke GitHub sebelum user menyetujui draft breakdown.
- Jangan menggunakan label, milestone, assignee, atau story point yang tidak tersedia.
- Jangan menambahkan path file atau detail kode yang mudah basi kecuali user meminta rencana implementasi teknis sangat detail.

## Quality Check
Periksa hasil sebelum diberikan:
- Apakah setiap requirement penting sudah masuk ke minimal satu issue?
- Apakah setiap issue dapat diverifikasi secara mandiri?
- Apakah setiap feature issue berbentuk vertical slice?
- Apakah acceptance criteria memakai format yang jelas dan dapat diuji?
- Apakah dependency issue masuk akal dan tidak melingkar?
- Apakah issue terlalu besar dan perlu dipecah?
- Apakah issue terlalu kecil dan hanya menyentuh satu detail tanpa nilai verifikasi?
- Apakah istilah domain konsisten dengan requirement?
- Apakah semua asumsi dan open questions ditulis terpisah?
- Apakah draft siap direview sebelum publish?
- Apakah publish checklist sudah terpenuhi jika user meminta GitHub publish?

## Kondisi Gagal
Skill harus berhenti atau meminta klarifikasi jika:
- Requirement, PRD, atau spesifikasi belum tersedia.
- Requirement terlalu ambigu untuk dipecah menjadi issue.
- User meminta publish ke GitHub tetapi repository atau akses GitHub tidak tersedia.
- User belum menyetujui draft breakdown untuk dipublish.
- Label atau milestone wajib tidak diketahui.
- Dependency antar fitur tidak dapat ditentukan tanpa menebak.
- Acceptance criteria tidak dapat dibuat tanpa menambahkan perilaku baru.
- Terdapat konflik antara requirement dan desain yang memengaruhi scope issue.
- Issue induk disebutkan tetapi isinya tidak dapat dibaca.

Jika kondisi gagal terjadi, keluarkan daftar pertanyaan klarifikasi dan jangan menghasilkan issue final yang terlihat siap publish.

## Human Review
Sebelum publish atau sebelum issue dipakai untuk implementasi:
- Mahasiswa harus mengecek apakah granularitas issue sudah pas.
- Mahasiswa harus memastikan dependency antar issue benar.
- Mahasiswa harus memastikan semua requirement wajib sudah tercakup.
- Mahasiswa harus mengonfirmasi asumsi yang dibuat AI.
- Mahasiswa harus mengecek acceptance criteria agar sesuai dengan ekspektasi dosen/reviewer.
- Reviewer dapat memeriksa apakah setiap issue punya value, traceability, dan testability.

## Example Invocation
```text
Gunakan skill campus-service-request-maintenance-issue-planning untuk mengubah requirement dan desain Campus Service Request and Maintenance System menjadi GitHub Issue draft berbasis vertical slice. Sertakan epic, issue breakdown, dependency, acceptance criteria, test notes, dan traceability matrix.
```

## Expected Output Example
```markdown
# Campus Service Request and Maintenance System - Issue Plan

## 1. Planning Summary
- Source Documents: requirements.md, architecture-design.md, database-api-design.md
- Scope: Service request submission, admin review, technician assignment, and status update.
- Out of Scope: Inventory management.
- Planning Approach: Vertical slice
- Target Milestone: MVP
- Assumptions:
  - Asumsi: Authentication dasar sudah tersedia.
- Open Questions:
  - Apakah upload foto termasuk scope MVP?

## 2. Epic Overview
| Epic ID | Epic Name | Business Value | Related Requirement ID |
|---|---|---|---|
| EPIC-01 | Service Request Lifecycle | Pengguna kampus dapat melaporkan dan memantau maintenance | FR-01, FR-02, FR-03 |

## 3. Issue Breakdown
| Issue ID | Title | Type | Priority | Blocked By | Requirement ID | Status |
|---|---|---|---|---|---|---|
| GH-DRAFT-001 | Submit service request end-to-end | feature | P1 | None | FR-01 | Draft |
| GH-DRAFT-002 | Review submitted request as administrator | feature | P1 | GH-DRAFT-001 | FR-02 | Draft |

## 4. GitHub Issue Drafts

### GH-DRAFT-001: Submit service request end-to-end
- Type: feature
- Priority: P1
- Milestone: MVP
- Labels: feature, vertical-slice
- Assignee: TBD
- Blocked By: None
- Blocks: GH-DRAFT-002
- Requirement Traceability: FR-01, US-01

#### Requirement Terkait
- FR-01: Requester dapat membuat service request.

#### Yang Dibangun
Requester dapat membuat service request melalui form, sistem menyimpan data, dan request muncul dengan status Submitted.

#### Kriteria Penerimaan
- [ ] Given requester sudah login, when mengirim data valid, then request baru tersimpan dengan status Submitted.
- [ ] Given data tidak valid, when form dikirim, then sistem menampilkan pesan validasi.

#### Diblokir Oleh
- Tidak ada - bisa langsung dikerjakan.

## 8. Quality Check Result
- Complete: Partial, karena upload foto belum dikonfirmasi.
- Independent: Yes.
- Vertical: Yes.
- Traceable: Yes.
- Testable: Yes.
- Dependency Clear: Yes.
- Ready to Publish: No, menunggu review manusia.
```
