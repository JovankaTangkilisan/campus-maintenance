---
name: 11-test-planning
description: Membuat rencana pengujian atau test plan untuk software development berdasarkan requirement, user story, acceptance criteria, PRD, spesifikasi API, UI design, atau issue planning. Gunakan skill ini ketika user meminta test plan, rencana pengujian, skenario pengujian, test case, QA plan, strategi testing, atau traceability pengujian sebelum rilis. Skill ini menghasilkan dokumen perencanaan pengujian, bukan kode automated test.
---

# 11 Test Planning

## Tujuan
Skill ini membantu menyusun rencana pengujian yang jelas, terstruktur, traceable, dan siap direview oleh tim QA, developer, product owner, dosen, atau reviewer proyek.

Test plan harus menjawab:
- Apa yang harus diuji?
- Requirement mana yang dicakup?
- Jenis pengujian apa yang relevan?
- Skenario apa yang harus dijalankan?
- Kapan pengujian dianggap lolos atau gagal?
- Risiko apa yang perlu diperhatikan sebelum eksekusi test?

Skill ini tidak menulis kode automated test. Fokusnya adalah perencanaan pengujian berdasarkan requirement dan acceptance criteria.

## Kapan Digunakan
Gunakan skill ini ketika user meminta:
- Test plan.
- Rencana pengujian.
- Skenario pengujian.
- Test case tingkat tinggi.
- QA plan.
- Strategi testing untuk fitur, modul, API, UI, atau rilis.
- Traceability matrix antara requirement dan test case.
- Review kelengkapan test plan terhadap requirement.

Gunakan juga ketika user memberikan requirement, PRD, user story, acceptance criteria, API contract, UI design, atau issue planning dan meminta dibuatkan rencana pengujiannya.

Jangan gunakan skill ini untuk menjalankan test, debugging bug spesifik, atau menulis script unit/integration/e2e test. Untuk hal tersebut, gunakan skill implementation atau debugging yang sesuai.

## Input
Informasi berikut harus tersedia:
- Requirement, PRD, user story, atau spesifikasi fitur.
- Acceptance criteria.
- Requirement ID, user story ID, business rule ID, atau issue ID.
- Platform target, misalnya web, mobile, API, desktop, atau backend service.
- Environment pengujian jika tersedia, misalnya local, staging, QA, atau production-like.
- UI design, wireframe, prototype, atau API contract jika relevan.
- Role atau aktor sistem.
- Business rules dan batasan validasi.
- Risiko, constraint, atau area kritis yang diketahui.
- Tools testing yang dipakai tim jika tersedia.

Jika requirement belum memiliki ID, buat ID sementara seperti `REQ-TEMP-001` dan jelaskan bahwa ID tersebut dibuat untuk kebutuhan test plan.

## Required Context
Baca konteks berikut sebelum membuat test plan:
- Semua requirement yang menjadi sumber pengujian.
- Acceptance criteria untuk setiap requirement.
- Business rules yang memengaruhi expected result.
- UI flow atau API contract yang akan diuji.
- Role access dan permission jika fitur bergantung pada aktor.
- Data model atau database/API design jika test menyentuh data.
- Issue planning jika test plan dibuat untuk backlog tertentu.
- Bug history atau risiko fitur serupa jika tersedia.
- Definition of Done atau release criteria jika tersedia.

Jangan membuat expected result yang tidak didukung requirement. Jika hasil yang diharapkan belum jelas, tulis sebagai pertanyaan klarifikasi.

## Langkah Kerja
1. Baca seluruh requirement, user story, acceptance criteria, business rules, dan desain terkait.
2. Identifikasi semua requirement ID yang harus diuji.
3. Jika ID belum tersedia, buat ID sementara dan tandai sebagai ID buatan skill.
4. Kelompokkan requirement berdasarkan fitur, workflow, aktor, API, UI, atau risiko.
5. Tentukan ruang lingkup pengujian: in scope dan out of scope.
6. Pilih jenis pengujian yang relevan, misalnya functional, negative, boundary, integration, regression, API, UI, accessibility dasar, security dasar, performance dasar, compatibility, atau usability.
7. Jangan memasukkan semua jenis pengujian secara otomatis. Pilih hanya yang relevan dengan requirement dan risiko.
8. Buat test scenario atau test case tingkat tinggi untuk setiap requirement.
9. Untuk setiap test case, tulis ID test case, requirement ID, precondition, langkah singkat, expected result, prioritas, jenis test, dan data uji jika tersedia.
10. Tambahkan negative case, edge case, dan boundary case hanya jika didukung requirement atau wajar untuk memverifikasi acceptance criteria.
11. Susun traceability matrix untuk memastikan setiap requirement punya minimal satu test case.
12. Catat asumsi, risiko pengujian, dependency, dan pertanyaan terbuka.
13. Tentukan kriteria lolos/gagal untuk test plan.
14. Lakukan quality check.
15. Hentikan atau minta klarifikasi jika requirement terlalu ambigu untuk menentukan expected result.

## Output Format
Buat dokumen test plan dengan struktur berikut:

```markdown
# Test Plan: [Nama Fitur/Modul/Aplikasi]

## 1. Ringkasan
- Tujuan Pengujian:
- Sumber Requirement:
- Platform:
- Environment:
- Testing Owner:
- Status Dokumen:

## 2. Ruang Lingkup
### In Scope
- ...

### Out of Scope
- ...

## 3. Requirement Traceability
| Requirement ID | Requirement Summary | Test Case ID | Coverage Status |
|---|---|---|---|
| REQ-001 | ... | TC-001, TC-002 | Covered |

## 4. Jenis Pengujian
| Test Type | Alasan Digunakan | Area yang Diuji |
|---|---|---|
| Functional | Memastikan fitur memenuhi requirement | ... |

## 5. Test Scenarios / Test Cases
| Test Case ID | Requirement ID | Priority | Test Type | Scenario | Precondition | Steps | Expected Result | Test Data |
|---|---|---|---|---|---|---|---|---|
| TC-001 | REQ-001 | High | Functional | ... | ... | ... | ... | ... |

## 6. Negative, Edge, and Boundary Cases
| Test Case ID | Requirement ID | Case Type | Scenario | Expected Result |
|---|---|---|---|---|
| TC-NEG-001 | REQ-001 | Negative | ... | ... |

## 7. Test Data
| Data ID | Purpose | Data Description | Related Test Case |
|---|---|---|---|
| TD-001 | ... | ... | TC-001 |

## 8. Entry Criteria
- ...

## 9. Exit Criteria / Kriteria Lolos-Gagal
- ...

## 10. Risiko Pengujian
| Risk | Impact | Mitigation | Owner/TBD |
|---|---|---|---|
| ... | ... | ... | TBD |

## 11. Asumsi
- Asumsi: ...

## 12. Open Questions
- ...

## 13. Human Review Checklist
- [ ] Requirement coverage sudah benar.
- [ ] Prioritas test case sudah disetujui.
- [ ] Expected result sudah sesuai requirement.
- [ ] Risiko pengujian sudah diterima atau dimitigasi.

## 14. Quality Check Result
- Complete:
- Traceable:
- Testable:
- Consistent:
- No Hidden Assumptions:
- Ready for QA Review:
```

Jika user meminta format spreadsheet, hasilkan tabel yang siap dipindahkan ke spreadsheet dengan kolom:
- Test Case ID.
- Requirement ID.
- Priority.
- Test Type.
- Scenario.
- Precondition.
- Steps.
- Expected Result.
- Test Data.
- Status.
- Notes.

## Aturan
- Jangan membuat fakta baru yang tidak diberikan.
- Tandai asumsi secara eksplisit dengan label `Asumsi`.
- Gunakan requirement ID pada setiap test case.
- Jika tidak ada requirement ID, buat ID sementara dan jelaskan bahwa ID tersebut bukan dari dokumen asli.
- Jangan membuat expected result yang tidak bisa ditelusuri ke requirement atau acceptance criteria.
- Jangan memasukkan test case untuk fitur di luar scope.
- Jangan menulis kode automated test sebagai pengganti test plan.
- Pisahkan functional, negative, edge, boundary, integration, API, UI, security, performance, dan regression test jika relevan.
- Jangan menggunakan kata ambigu tanpa ukuran, misalnya `cepat`, `aman`, atau `mudah` tanpa indikator verifikasi.
- Setiap test case harus dapat dieksekusi oleh manusia atau diterjemahkan menjadi automated test.
- Prioritas harus masuk akal berdasarkan risiko dan nilai bisnis.
- Test case eksplorasi boleh ditambahkan hanya jika ditandai sebagai `Exploratory` dan dipisahkan dari coverage requirement utama.

## Quality Checks
Periksa sebelum menyerahkan hasil:
- Apakah setiap requirement memiliki minimal satu test case?
- Apakah setiap test case memiliki requirement ID?
- Apakah expected result jelas dan dapat diverifikasi?
- Apakah test type yang dipilih relevan?
- Apakah negative, edge, dan boundary case tidak keluar dari scope?
- Apakah prioritas test case masuk akal?
- Apakah asumsi ditulis terpisah dari fakta requirement?
- Apakah risiko pengujian dan mitigasi sudah dicatat?
- Apakah entry criteria dan exit criteria jelas?
- Apakah ada requirement yang belum tercakup?
- Apakah ada test case yang tidak punya sumber requirement?

## Failure Conditions
Skill harus berhenti atau meminta klarifikasi jika:
- Requirement atau spesifikasi tidak tersedia.
- Requirement terlalu singkat atau ambigu untuk menentukan expected result.
- Requirement saling bertentangan.
- Platform atau target pengujian tidak jelas dan sangat memengaruhi scope.
- Acceptance criteria tidak tersedia untuk fitur yang kompleks.
- User meminta test plan untuk sistem eksternal tetapi tidak memberikan perilaku yang harus diuji.
- User meminta automated test code, bukan test plan.

Jika failure condition terjadi, berikan daftar pertanyaan klarifikasi singkat dan jangan menghasilkan test plan final yang terlihat pasti.

## Human Review
Bagian berikut harus direview manusia:
- Semua asumsi.
- Prioritas test case.
- Expected result untuk workflow bisnis penting.
- Scope in/out.
- Risiko pengujian.
- Entry criteria dan exit criteria.
- Coverage requirement terhadap test case.

Reviewer manusia harus mengonfirmasi test plan sebelum dipakai sebagai dasar eksekusi QA.

## Example Invocation
```text
Gunakan skill 11-test-planning untuk membuat test plan dari requirement fitur service request. Sertakan traceability matrix, test case, negative case, risiko, entry criteria, exit criteria, dan human review checklist.
```

## Expected Output Example
```markdown
# Test Plan: Service Request Submission

## 1. Ringkasan
- Tujuan Pengujian: Memastikan requester dapat membuat service request dengan data valid.
- Sumber Requirement: FR-01, AC-01.1, BR-01
- Platform: Web
- Environment: Staging
- Testing Owner: TBD
- Status Dokumen: Draft

## 2. Ruang Lingkup
### In Scope
- Submit service request dengan data valid.
- Validasi field wajib.
- Status awal request.

### Out of Scope
- Assignment teknisi.
- Notifikasi email.

## 3. Requirement Traceability
| Requirement ID | Requirement Summary | Test Case ID | Coverage Status |
|---|---|---|---|
| FR-01 | Requester dapat membuat service request | TC-001, TC-002 | Covered |
| BR-01 | Request baru berstatus Submitted | TC-001 | Covered |

## 5. Test Scenarios / Test Cases
| Test Case ID | Requirement ID | Priority | Test Type | Scenario | Precondition | Steps | Expected Result | Test Data |
|---|---|---|---|---|---|---|---|---|
| TC-001 | FR-01, BR-01 | High | Functional | Submit request valid | Requester sudah login | Isi form dan submit | Request tersimpan dengan status Submitted | Data request valid |
| TC-002 | FR-01 | High | Negative | Submit tanpa title | Requester sudah login | Kosongkan title dan submit | Sistem menampilkan error validasi | Title kosong |

## 10. Risiko Pengujian
| Risk | Impact | Mitigation | Owner/TBD |
|---|---|---|---|
| Data lokasi belum tersedia | Test submit tidak realistis | Siapkan seed data lokasi | TBD |

## 14. Quality Check Result
- Complete: Yes
- Traceable: Yes
- Testable: Yes
- Consistent: Yes
- No Hidden Assumptions: Yes
- Ready for QA Review: Yes
```
