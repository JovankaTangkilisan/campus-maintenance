---
name: 09-implementation
description: Mengerjakan satu issue atau ticket proyek Campus Service Request and Maintenance System menjadi kode implementasi nyata yang traceable ke requirement, acceptance criteria, dan issue planning. Gunakan skill ini ketika user meminta implementasi fitur, bug fix, patch, atau perubahan kode untuk service request, maintenance workflow, role access, database, API, UI, testing, atau integrasi berdasarkan issue yang jelas.
---

# Campus Service Request and Maintenance System - Implementation

## Tujuan
Skill ini membantu mengerjakan satu issue/ticket menjadi perubahan kode nyata pada proyek Campus Service Request and Maintenance System.

Fokus utama skill ini adalah memastikan implementasi:
- Sesuai dengan requirement dan acceptance criteria.
- Mengikuti arsitektur, database/API design, dan UI design yang sudah disepakati.
- Tidak melebar ke scope lain.
- Dapat diuji dan ditelusuri kembali ke requirement ID atau issue ID.

Skill ini digunakan setelah requirement, architecture design, database/API design, UI design, dan issue planning sudah cukup jelas.

## Kapan Digunakan
Gunakan skill ini ketika user meminta:
- Mengerjakan satu GitHub Issue atau ticket.
- Mengimplementasikan fitur dari issue planning.
- Memperbaiki bug berdasarkan deskripsi ticket.
- Membuat patch untuk fitur Campus Service Request and Maintenance System.
- Menambahkan atau memperbarui kode untuk flow seperti submit request, review request, assign technician, update progress, close request, dashboard, notification, attachment, atau role access.
- Menambahkan test untuk acceptance criteria tertentu.

Jangan gunakan skill ini untuk membuat requirement baru, merancang arsitektur dari nol, merancang database/API dari awal, atau membuat issue planning. Gunakan skill sebelumnya jika konteks tersebut belum tersedia.

## Input
Informasi berikut harus tersedia sebelum implementasi:
- Issue/ticket yang akan dikerjakan.
- Requirement ID, user story ID, business rule ID, atau acceptance criteria yang terkait.
- Architecture design yang relevan.
- Database/API design yang relevan jika issue menyentuh data atau backend.
- UI design/wireframe/prototype jika issue menyentuh tampilan.
- Codebase proyek.
- File konfigurasi proyek, misalnya package manager, test runner, formatter, linting, environment config, atau migration config.
- Test yang sudah ada untuk area terkait.
- Instruksi menjalankan aplikasi dan test jika tersedia.

Jika issue tidak punya requirement ID, gunakan acceptance criteria sebagai sumber traceability. Jika acceptance criteria juga tidak tersedia, minta klarifikasi.

## Required Context
Baca konteks berikut sebelum mengubah kode:
- Isi lengkap issue/ticket.
- File yang disebut langsung pada issue.
- Modul terkait di codebase berdasarkan kata kunci domain.
- Pola folder dan naming convention yang sudah digunakan.
- Existing routes, API handlers, database access layer, components, hooks, services, tests, dan types yang relevan.
- Dokumen design yang menjadi sumber issue.
- Migration atau schema yang sudah ada jika issue menyentuh database.
- Endpoint contract jika issue menyentuh API.
- Role access rules jika issue menyentuh authorization.

Jangan mulai mengedit sebelum memahami pola codebase yang sudah ada.

## Langkah Kerja
1. Baca issue/ticket sampai lengkap. Pecah isi issue menjadi daftar acceptance criteria yang dapat diverifikasi.
2. Catat requirement ID, issue ID, business rule ID, dan design decision ID yang menjadi sumber perubahan.
3. Telusuri codebase untuk menemukan modul yang relevan dengan issue. Utamakan pola yang sudah ada dalam proyek.
4. Identifikasi layer yang terdampak:
   - Database atau migration.
   - Backend/API.
   - Authorization atau role access.
   - Frontend/UI.
   - State management atau API client.
   - Test.
   - Documentation jika diminta.
5. Buat rencana implementasi singkat berdasarkan acceptance criteria, bukan berdasarkan asumsi.
6. Implementasikan perubahan secara kecil dan terarah.
7. Jika issue adalah vertical slice, pastikan jalur end-to-end bekerja dari UI/API sampai penyimpanan data atau response yang diharapkan.
8. Jika issue hanya bug fix, ubah bagian minimum yang memperbaiki bug tanpa mengubah perilaku lain.
9. Tambahkan atau perbarui test yang relevan dengan acceptance criteria.
10. Jalankan test, lint, typecheck, build, atau verifikasi manual sesuai kemampuan proyek.
11. Baca ulang perubahan dan pastikan tidak ada scope tambahan yang tidak diminta.
12. Buat ringkasan implementasi yang memetakan acceptance criteria ke file yang berubah dan status verifikasi.
13. Hentikan atau minta klarifikasi jika ada requirement ambigu, konflik desain, atau file penting tidak tersedia.

## Output
Hasil implementasi harus mencakup:
- Perubahan kode pada file yang relevan.
- Test baru atau test yang diperbarui jika perilaku berubah.
- Ringkasan implementasi.
- Hasil verifikasi.
- Daftar asumsi dan bagian yang tidak dikerjakan jika ada.

Gunakan format ringkasan berikut:

```markdown
# Implementation Summary: [Issue ID/Title]

## Scope Implemented
- ...

## Requirement / Acceptance Criteria Mapping
| ID | Requirement or Acceptance Criteria | Files Changed | Status |
|---|---|---|---|
| FR-01 | Requester can submit service request | src/... | Done |

## Files Changed
| File | Change Summary | Reason |
|---|---|---|
| src/... | ... | ... |

## Verification
- [ ] Unit tests:
- [ ] Integration tests:
- [ ] UI/manual check:
- [ ] Lint/typecheck/build:

## Assumptions
- Asumsi: ...

## Not Implemented
- ...

## Follow-up Notes
- ...
```

Jika user meminta PR/commit message, gunakan format:

```text
Implement [issue title]

- [Perubahan utama 1]
- [Perubahan utama 2]
- [Test/verifikasi]

Requirement: FR-xx, US-xx, BR-xx
Issue: #xxx
```

## Aturan
- Kerjakan hanya satu issue utama per eksekusi skill.
- Jangan membuat requirement, business rule, role, status, endpoint, atau UI flow baru yang tidak ada di issue/desain.
- Tandai asumsi dengan label `Asumsi`.
- Gunakan requirement ID, issue ID, atau acceptance criteria sebagai traceability.
- Ikuti pola codebase yang sudah ada.
- Jangan mengganti arsitektur proyek tanpa permintaan eksplisit.
- Jangan melakukan refactor besar kecuali diperlukan langsung untuk menyelesaikan issue.
- Jika refactor kecil diperlukan, jelaskan alasannya di ringkasan.
- Pisahkan concern sesuai pola proyek, misalnya component, service/API client, handler, validation, type, dan test.
- Jangan menaruh semua logika baru dalam satu file besar jika proyek sudah memakai struktur modular.
- Jangan menambahkan dependency baru tanpa alasan kuat dan tanpa melaporkannya.
- Jangan menyimpan atau menampilkan data sensitif yang tidak diminta requirement.
- Jangan mengubah test agar sekadar lolos jika perubahan itu melemahkan validasi.
- Jangan menghapus kode atau behavior lama kecuali issue memang meminta atau test membuktikan behavior itu salah.
- Jangan mengabaikan error handling dan authorization jika issue menyentuh API atau role access.

## Quality Check
Periksa sebelum menyatakan selesai:
- Apakah semua acceptance criteria sudah dipenuhi atau ditandai belum bisa dikerjakan?
- Apakah setiap perubahan kode dapat ditelusuri ke issue atau requirement?
- Apakah implementasi tetap mengikuti architecture design?
- Apakah database/API/UI tetap konsisten dengan desain yang sudah ada?
- Apakah authorization sesuai role access?
- Apakah validasi input dan error handling cukup jelas?
- Apakah test relevan ditambahkan atau diperbarui?
- Apakah test/lint/typecheck/build sudah dijalankan jika tersedia?
- Apakah tidak ada file atau fitur di luar scope yang ikut berubah?
- Apakah asumsi dan risiko sudah ditulis eksplisit?
- Apakah ringkasan implementasi cukup jelas untuk reviewer?

## Kondisi Gagal
Berhenti dan minta klarifikasi jika:
- Issue/ticket tidak tersedia atau terlalu umum.
- Acceptance criteria tidak jelas dan implementasi bisa memiliki beberapa tafsir.
- Requirement bertentangan dengan architecture design, database/API design, atau codebase.
- File penting yang disebut issue tidak ditemukan.
- Codebase tidak memiliki instruksi build/test dan verifikasi manual juga tidak bisa dilakukan.
- Perubahan membutuhkan credential, secret, akses eksternal, atau data produksi yang tidak tersedia.
- Issue meminta perubahan yang terlalu besar untuk satu ticket dan perlu dipecah ulang.
- Implementasi membutuhkan keputusan produk atau desain yang belum disetujui.

Saat berhenti, jelaskan:
- Bagian mana yang tidak bisa dikerjakan.
- Informasi apa yang dibutuhkan.
- Bagian mana yang masih aman untuk dikerjakan jika ada.

## Human Review
Sebelum merge atau submit:
- Reviewer memeriksa logic bisnis dan kesesuaian dengan requirement.
- Reviewer memeriksa security, terutama authorization, input validation, dan data sensitif.
- Reviewer memeriksa dampak perubahan terhadap workflow service request.
- Reviewer memeriksa apakah test cukup mewakili acceptance criteria.
- Reviewer mengonfirmasi semua asumsi yang dibuat AI.
- Reviewer menentukan apakah follow-up issue perlu dibuat untuk scope tambahan yang ditemukan.

## Example Invocation
```text
Gunakan skill campus-service-request-maintenance-implementation untuk mengerjakan issue GH-001: Submit service request end-to-end. Ikuti acceptance criteria, update kode dan test, lalu berikan implementation summary dengan mapping ke FR-01 dan BR-01.
```

## Expected Output Example
```markdown
# Implementation Summary: GH-001 - Submit Service Request End-to-End

## Scope Implemented
- Menambahkan form submit service request untuk requester.
- Menambahkan API call untuk membuat service request.
- Menyimpan request baru dengan status Submitted.
- Menambahkan test validasi input wajib.

## Requirement / Acceptance Criteria Mapping
| ID | Requirement or Acceptance Criteria | Files Changed | Status |
|---|---|---|---|
| FR-01 | Requester can submit service request | src/pages/..., src/api/... | Done |
| BR-01 | New request starts as Submitted | src/server/..., tests/... | Done |

## Files Changed
| File | Change Summary | Reason |
|---|---|---|
| src/components/ServiceRequestForm.tsx | Menambahkan form request | Mendukung FR-01 |
| src/api/serviceRequests.ts | Menambahkan client create request | Menghubungkan UI ke API |
| tests/service-request.test.ts | Menambahkan test submit valid dan invalid | Verifikasi acceptance criteria |

## Verification
- [x] Unit tests: passed
- [x] UI/manual check: submit valid dan invalid berhasil dicek
- [ ] Build: tidak dijalankan karena script build tidak tersedia

## Assumptions
- Asumsi: Authentication requester sudah tersedia.

## Not Implemented
- Upload foto tidak dikerjakan karena tidak termasuk issue.

## Follow-up Notes
- Buat issue terpisah untuk notifikasi jika fitur tersebut disetujui.
```
