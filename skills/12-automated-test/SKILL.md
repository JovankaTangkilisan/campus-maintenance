---
name: 12-automated-test
description: Membuat atau memperbarui unit test, integration test, dan automated regression test untuk kode yang sudah diimplementasikan berdasarkan requirement, acceptance criteria, test plan, dan codebase. Gunakan skill ini ketika user meminta automated test, unit test, integration test, test untuk endpoint/API, test untuk modul frontend/backend, atau verifikasi otomatis setelah implementation dan code review.
---

# 12 Automated Test

## Tujuan
Skill ini membantu membuat automated test untuk bagian aplikasi yang sudah diimplementasikan.

Fokus skill ini adalah membuktikan bahwa kode berjalan sesuai requirement, acceptance criteria, test plan, dan kontrak teknis yang sudah disetujui. Skill ini tidak digunakan untuk membuat fitur baru atau mengubah business logic utama, kecuali perubahan kecil diperlukan agar kode dapat diuji dan dijelaskan secara eksplisit.

Automated test yang dibuat harus:
- Traceable ke requirement atau acceptance criteria.
- Konsisten dengan test runner dan pola test yang sudah ada.
- Dapat dijalankan ulang tanpa bergantung pada data manual atau environment produksi.
- Mencakup happy path, negative case, edge case, authorization, dan integration behavior jika relevan.

## Kapan Digunakan
Gunakan skill ini ketika user meminta:
- Membuat unit test.
- Membuat integration test.
- Membuat automated regression test.
- Membuat test untuk endpoint API.
- Membuat test untuk fungsi, service, handler, component, hook, atau modul frontend/backend.
- Menambahkan test untuk issue yang sudah diimplementasikan.
- Memastikan acceptance criteria sudah memiliki automated test.
- Memperbaiki atau melengkapi test coverage yang kurang.

Gunakan setelah implementation selesai dan idealnya setelah code review menemukan tidak ada blocker besar.

Jangan gunakan skill ini untuk:
- Menulis test plan dokumen.
- Acceptance testing manual.
- Debugging fitur yang belum jelas requirement-nya.
- Mengubah fitur utama di luar kebutuhan test.

## Input
Informasi berikut harus tersedia:
- Requirement ID, issue ID, user story ID, atau acceptance criteria yang akan diuji.
- Test plan jika sudah ada.
- Kode implementasi yang akan diuji.
- API contract, database schema, UI design, atau architecture design jika relevan.
- Test yang sudah ada untuk area serupa.
- Konfigurasi test runner, misalnya `package.json`, Jest/Vitest config, Playwright config, pytest config, atau konfigurasi framework lain.
- Instruksi menjalankan test.
- Data uji atau aturan pembuatan data uji jika tersedia.

Jika requirement atau acceptance criteria tidak tersedia, jangan membuat test berdasarkan tebakan perilaku.

## Required Context
Baca konteks berikut sebelum menulis test:
- File implementasi yang akan diuji.
- Test existing yang paling dekat dengan area perubahan.
- Helper test, fixture, mock, factory, setup, teardown, dan test database utilities yang sudah dipakai.
- Type definition, validation schema, API route, service layer, atau component props yang relevan.
- Database migration atau schema jika test menyentuh data.
- Authorization rules jika test menyentuh role access.
- Error handling dan response format jika test menyentuh API.
- Test plan atau acceptance criteria untuk menentukan skenario.

Ikuti pola test yang sudah ada di codebase. Jangan memperkenalkan test runner, folder structure, atau helper baru jika pola lama sudah cukup.

## Langkah Kerja
1. Baca requirement, acceptance criteria, test plan, dan issue yang menjadi sumber test.
2. Baca kode implementasi yang akan diuji dan pahami input, output, side effect, state, error handling, dan dependency.
3. Baca test existing untuk memahami naming, assertion style, mocking, fixture, dan setup/teardown.
4. Tentukan jenis test yang tepat:
   - Unit test untuk fungsi, validator, mapper, reducer, utility, atau business logic terisolasi.
   - Integration test untuk endpoint, service dengan database, workflow antar modul, atau API contract.
   - Component test untuk UI component yang memiliki state, event, atau rendering penting.
   - End-to-end test hanya jika user meminta atau proyek sudah memiliki pola e2e yang jelas.
5. Susun daftar skenario sebelum menulis test:
   - Happy path.
   - Invalid input.
   - Missing required data.
   - Boundary value.
   - Unauthorized atau forbidden access.
   - Not found atau conflict.
   - State transition valid dan tidak valid.
   - Regression case jika test dibuat untuk bug fix.
6. Petakan setiap skenario ke requirement ID atau acceptance criteria.
7. Tulis test dengan pola yang sudah digunakan proyek.
8. Buat data uji secara mandiri melalui fixture, factory, mock, atau setup test. Jangan bergantung pada data produksi/manual.
9. Pastikan test bersifat deterministic, repeatable, dan dapat dijalankan di CI.
10. Jalankan test yang baru dibuat dan test terkait.
11. Jika test gagal karena bug implementasi, laporkan bug tersebut. Jangan mengubah logic produksi di luar scope kecuali user meminta fix.
12. Jika test gagal karena ekspektasi requirement ambigu, hentikan dan minta klarifikasi.
13. Berikan ringkasan test, mapping requirement, file yang berubah, dan hasil eksekusi.

## Output Format
Hasil kerja harus mencakup:
- File test baru atau file test yang diperbarui.
- Ringkasan skenario yang diuji.
- Mapping requirement/acceptance criteria ke test.
- Hasil eksekusi test.
- Asumsi dan gap jika ada.

Gunakan ringkasan berikut:

```markdown
# Automated Test Summary: [Issue/Fitur/Modul]

## Scope Tested
- ...

## Requirement / Acceptance Criteria Mapping
| ID | Requirement or Acceptance Criteria | Test File | Test Scenario | Status |
|---|---|---|---|---|
| REQ-001 | ... | tests/... | ... | Covered |

## Test Files Changed
| File | Change Summary | Reason |
|---|---|---|
| tests/... | ... | ... |

## Test Scenarios
| Scenario ID | Type | Scenario | Expected Result |
|---|---|---|---|
| TS-001 | Happy path | ... | ... |

## Test Run Result
- Command:
- Result:
- Passed:
- Failed:
- Not Run:

## Assumptions
- Asumsi: ...

## Gaps / Not Covered
- ...
```

Jika user meminta hanya daftar test case sebelum coding, berikan daftar skenario dulu dan tunggu persetujuan sebelum menulis test.

## Aturan
- Jangan membuat fakta baru tentang perilaku sistem.
- Tandai asumsi dengan label `Asumsi`.
- Gunakan requirement ID, issue ID, atau acceptance criteria pada nama test, deskripsi test, komentar singkat, atau ringkasan.
- Jangan menulis automated test untuk fitur yang belum diimplementasikan kecuali user meminta test-first/TDD.
- Jangan mengubah business logic produksi hanya agar test lulus.
- Jangan menghapus test existing tanpa izin.
- Jangan melemahkan assertion test existing.
- Jangan memperkenalkan test runner baru jika proyek sudah memiliki test runner.
- Jangan bergantung pada database produksi, data manual, credential nyata, layanan eksternal langsung, atau urutan test tertentu.
- Mock layanan eksternal jika proyek belum memiliki environment test yang aman.
- Gunakan fixture/factory/setup test yang sudah ada sebelum membuat pola baru.
- Test harus deterministic dan bisa dijalankan berulang.
- Test name harus menjelaskan perilaku yang diuji, bukan `test1` atau `should work`.
- Pisahkan unit test dan integration test jika struktur proyek mendukungnya.

## Quality Checks
Periksa sebelum menyatakan selesai:
- Apakah setiap acceptance criteria terkait memiliki minimal satu test?
- Apakah happy path dan negative case tercakup?
- Apakah edge/boundary case penting tercakup?
- Apakah authorization/permission diuji jika fitur bergantung pada role?
- Apakah test menggunakan pola dan helper yang sudah ada?
- Apakah test tidak bergantung pada data produksi atau state global yang bocor?
- Apakah test dapat dijalankan ulang tanpa efek samping?
- Apakah assertion benar-benar memverifikasi behavior penting?
- Apakah test yang dibuat sudah dijalankan?
- Apakah hasil test dilaporkan secara jujur?
- Apakah gap dan asumsi ditulis eksplisit?

## Failure Conditions
Skill harus berhenti atau meminta klarifikasi jika:
- Requirement atau acceptance criteria tidak tersedia.
- Kode implementasi yang akan diuji belum ada.
- Test runner tidak tersedia dan user belum meminta setup test runner.
- Expected behavior tidak jelas atau bertentangan.
- Database/API schema tidak konsisten dengan kode yang diuji.
- Test membutuhkan credential, layanan eksternal, atau data produksi yang tidak aman digunakan.
- Perubahan yang diperlukan untuk membuat test berjalan akan mengubah business logic di luar scope.
- Test gagal karena bug implementasi dan user hanya meminta penulisan test, bukan fix.

Jika failure condition terjadi, jelaskan bagian yang terblokir, informasi yang dibutuhkan, dan test mana yang masih bisa dibuat dengan aman.

## Human Review
Manusia harus memeriksa:
- Apakah skenario test benar-benar mewakili risiko utama.
- Apakah asumsi yang ditandai sesuai maksud requirement.
- Apakah test tidak terlalu rapuh terhadap detail implementasi.
- Apakah mock tidak menyembunyikan bug integrasi penting.
- Apakah test aman dijalankan di CI.
- Apakah gap coverage perlu dibuatkan issue lanjutan.

## Example Invocation
```text
Gunakan skill 12-automated-test untuk membuat unit test dan integration test untuk endpoint POST /service-requests berdasarkan FR-01 dan acceptance criteria yang sudah ada. Ikuti test runner proyek, jalankan test terkait, dan beri automated test summary.
```

## Expected Output Example
```markdown
# Automated Test Summary: POST /service-requests

## Scope Tested
- Requester dapat membuat service request valid.
- Payload kosong ditolak.
- User tanpa login tidak boleh membuat request.

## Requirement / Acceptance Criteria Mapping
| ID | Requirement or Acceptance Criteria | Test File | Test Scenario | Status |
|---|---|---|---|---|
| FR-01 | Requester can submit service request | tests/service-requests.test.ts | Create request with valid payload | Covered |
| AC-01.2 | Required fields must be validated | tests/service-requests.test.ts | Reject missing title | Covered |
| NFR-SEC-01 | Endpoint requires authentication | tests/service-requests.test.ts | Reject unauthenticated request | Covered |

## Test Files Changed
| File | Change Summary | Reason |
|---|---|---|
| tests/service-requests.test.ts | Menambahkan integration test submit request | Verifikasi FR-01 dan AC-01.2 |

## Test Scenarios
| Scenario ID | Type | Scenario | Expected Result |
|---|---|---|---|
| TS-001 | Happy path | Submit payload valid sebagai requester | Response 201 dan status Submitted |
| TS-002 | Negative | Submit tanpa title | Response 400 validation error |
| TS-003 | Authorization | Submit tanpa login | Response 401 unauthorized |

## Test Run Result
- Command: `npm test -- service-requests`
- Result: Passed
- Passed: 3
- Failed: 0
- Not Run: Full test suite

## Assumptions
- Asumsi: Test database setup sudah memakai fixture proyek.

## Gaps / Not Covered
- Upload attachment belum diuji karena tidak termasuk scope FR-01.
```
