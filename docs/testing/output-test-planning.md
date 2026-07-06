# Test Plan: Campus Service Request and Maintenance System

## 1. Ringkasan
- Tujuan Pengujian: Memastikan alur pelaporan fasilitas, triase laporan, penugasan teknisi, update progres, komentar, lampiran foto, penutupan atau pembukaan kembali laporan, dan dashboard ringkas berjalan sesuai requirement.
- Sumber Requirement: [output-specification.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/requirements/output-specification.md), [output-validation-change.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/requirements/output-validation-change.md), [output-ui-flow.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/output-ui-flow.md), [output-api-contract.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/output-api-contract.md), [output-database-schema.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/output-database-schema.md), [output-architecture-design.md](/D:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/output-architecture-design.md)
- Platform: Responsive web SPA pada desktop, tablet, dan mobile; API backend di Cloudflare Worker; storage di Cloudflare D1 dan R2.
- Environment: Local development dan staging-like environment [Asumsi]
- Testing Owner: TBD
- Status Dokumen: Draft

## 2. Ruang Lingkup
### In Scope
- Autentikasi/session gate dan akses berbasis peran.
- Pembuatan laporan baru dengan field minimum wajib.
- Upload lampiran foto.
- Daftar dan detail laporan sesuai role.
- Triase laporan oleh Administrator.
- Penugasan teknisi dan perubahan status teknisi.
- Komentar/catatan pada laporan.
- Riwayat status otomatis.
- Penutupan dan pembukaan kembali laporan.
- Dashboard ringkas untuk Manajer Fasilitas.
- Validasi database/API dasar seperti constraint, role access, status transition, dan error handling.

### Out of Scope
- Implementasi automated test code.
- Integrasi eksternal spesifik di luar session/auth layer.
- Notifikasi channel final.
- Analytics lanjutan di luar dashboard ringkas.
- Pengujian performa beban tinggi atau stress test yang tidak didukung requirement.

## 3. Requirement Traceability
| Requirement ID | Requirement Summary | Test Case ID | Coverage Status |
|---|---|---|---|
| FR-001 | Pelapor membuat laporan baru dengan lampiran foto opsional | TC-001, TC-002, TC-003 | Covered |
| FR-002 | Menolak laporan jika field minimum kosong | TC-002 | Covered |
| FR-003 | Menampilkan daftar laporan sesuai peran pengguna | TC-004, TC-005, TC-006 | Covered |
| FR-004 | Menampilkan detail laporan lengkap beserta komentar dan riwayat status | TC-007, TC-008 | Covered |
| FR-005 | Administrator memeriksa laporan dan menetapkan kategori | TC-009 | Covered |
| FR-006 | Administrator menentukan prioritas laporan | TC-009 | Covered |
| FR-007 | Administrator menugaskan teknisi ke laporan | TC-010 | Covered |
| FR-008 | Status laporan berubah menjadi Ditugaskan setelah assignment | TC-010 | Covered |
| FR-009 | Teknisi menerima tugas, memperbarui progres, menolak tugas, dan menandai selesai | TC-011, TC-012, TC-013, TC-014 | Covered |
| FR-010 | Komentar atau catatan pada laporan | TC-015 | Covered |
| FR-011 | Riwayat status otomatis setiap perubahan status | TC-016 | Covered |
| FR-012 | Administrator menutup atau membuka kembali laporan | TC-017, TC-018 | Covered |
| FR-013 | Dashboard sederhana bagi Manajer Fasilitas | TC-019 | Covered |
| BR-001 | Laporan baru harus memiliki lokasi, jenis masalah, dan deskripsi | TC-002 | Covered |
| BR-002 | Pelapor hanya dapat melihat laporan miliknya | TC-004, TC-007 | Covered |
| BR-003 | Administrator dapat melihat seluruh laporan | TC-005, TC-007, TC-009, TC-017, TC-018 | Covered |
| BR-004 | Teknisi hanya dapat melihat laporan yang ditugaskan kepadanya | TC-006, TC-011, TC-012, TC-013, TC-014 | Covered |
| BR-005 | Prioritas hanya boleh memakai nilai yang disetujui | TC-009 | Covered |
| BR-006 | Setiap perubahan status harus dicatat ke riwayat status | TC-010, TC-011, TC-012, TC-013, TC-014, TC-016, TC-017, TC-018 | Covered |
| BR-007 | Laporan hanya boleh ditutup setelah hasil dikonfirmasi pelapor | TC-017 | Covered |
| BR-008 | Laporan dapat dibuka kembali jika hasil belum sesuai | TC-018 | Covered |
| NFR-001 | Security berbasis role | TC-004, TC-005, TC-006, TC-007, TC-009, TC-010, TC-011, TC-015, TC-017, TC-018, TC-019 | Covered |
| NFR-002 | Auditability perubahan status | TC-016 | Covered |
| NFR-003 | Data integrity dan referential integrity | TC-020, TC-021 | Covered |
| NFR-004 | Label status konsisten di UI dan data | TC-007, TC-009, TC-010, TC-011, TC-012, TC-013, TC-014, TC-016, TC-017, TC-018 | Covered |
| NFR-005 | Availability dan graceful failure | TC-022 | Covered |
| NFR-006 | Observability melalui request trace dan error aman | TC-022, TC-023 | Covered |
| NFR-007 | Performance dasar untuk list, detail, dan dashboard | TC-024 | Covered |

## 4. Jenis Pengujian
| Test Type | Alasan Digunakan | Area yang Diuji |
|---|---|---|
| Functional | Memastikan setiap requirement utama bekerja sesuai alur bisnis | Create report, list, detail, triase, assignment, status update, komentar, close/reopen, dashboard |
| Negative | Memverifikasi penolakan input tidak valid dan akses tidak sah | Form validation, unauthorized access, invalid status transition, missing reason |
| Integration | Memastikan UI, API, database, dan storage saling terhubung benar | Report create, attachment upload, history write, dashboard read |
| API | Endpoint contract, role access, payload, response, dan error | Semua endpoint pada output-api-contract |
| UI | State halaman, navigasi, dan permission-based rendering | Session gate, home, list, detail, create report, dashboard |
| Database Integrity | Menjamin FK, NOT NULL, CHECK, dan append-only history berjalan | Tables pada output-database-schema |
| Security Dasar | Menjamin role-based access dan data sensitif tidak bocor | Access gate, resource-level authz, error message aman |
| Regression | Menjaga fitur inti tetap stabil setelah perbaikan atau perubahan | Semua alur inti MVP |
| Performance Dasar | Memastikan list/detail/dashboard masih layak dipakai pada beban normal | GET /api/reports, GET /api/reports/:reportId, GET /api/dashboard |

## 5. Test Scenarios / Test Cases
| Test Case ID | Requirement ID | Priority | Test Type | Scenario | Precondition | Steps | Expected Result | Test Data |
|---|---|---|---|---|---|---|---|---|
| TC-001 | FR-001 | High | Functional / UI / API | Pelapor membuat laporan baru dengan data valid | Pelapor sudah login | Buka form laporan, isi field wajib, kirim form | Laporan tersimpan dengan status `Baru` dan detail laporan baru dapat dibuka | Location valid, issue_type valid, description valid |
| TC-002 | FR-001, FR-002, BR-001 | High | Negative / Functional | Kirim laporan tanpa field wajib | Pelapor sudah login | Kosongkan salah satu field wajib lalu submit | Sistem menolak submit dan menampilkan validasi pada field yang kosong | `location` kosong atau `issue_type` kosong atau `description` kosong |
| TC-003 | FR-001 | Medium | Integration | Upload lampiran foto untuk laporan baru | Pelapor sudah login dan laporan tersedia | Upload file gambar dari detail atau form | File tersimpan di R2, metadata tersimpan di D1, dan thumbnail muncul di detail | File gambar valid, ukuran dalam batas |
| TC-004 | FR-003, BR-002 | High | Functional / Security | Pelapor melihat daftar laporan miliknya | Pelapor sudah login | Buka halaman daftar laporan | Hanya laporan milik pelapor yang tampil | Akun pelapor dengan data laporan sendiri |
| TC-005 | FR-003, BR-003 | High | Functional / Security | Administrator melihat seluruh laporan | Administrator sudah login | Buka halaman daftar laporan | Semua laporan yang dapat diakses tampil | Akun administrator |
| TC-006 | FR-003, BR-004 | High | Functional / Security | Teknisi melihat daftar tugas miliknya | Teknisi sudah login | Buka halaman daftar laporan | Hanya laporan yang ditugaskan kepadanya yang tampil | Akun teknisi dengan assignment aktif |
| TC-007 | FR-004, BR-002, BR-003, BR-004 | High | Functional / Security | Pengguna membuka detail laporan yang diizinkan | Akun sesuai role sudah login | Klik salah satu laporan yang bisa diakses | Detail laporan, komentar, lampiran, dan riwayat status tampil | Report ID valid |
| TC-008 | FR-004 | Medium | Functional | Detail laporan memuat komentar dan riwayat status | Laporan punya komentar dan history | Buka detail laporan | Thread komentar dan timeline history tampil lengkap | Laporan dengan komentar dan history |
| TC-009 | FR-005, FR-006, BR-005 | High | Functional / API | Administrator melakukan triase laporan | Administrator sudah login dan laporan berstatus valid untuk triase | Pilih kategori dan prioritas lalu simpan | Status menjadi `Diperiksa`, kategori dan prioritas tersimpan | Kategori valid, priority `high` |
| TC-010 | FR-007, FR-008, BR-006 | High | Functional / API / Integration | Administrator menugaskan teknisi | Administrator sudah login | Pilih teknisi dan simpan assignment | Assignment aktif tersimpan dan status berubah menjadi `Ditugaskan` | Technician ID valid |
| TC-011 | FR-009, BR-004, BR-006 | High | Functional / API | Teknisi menerima tugas yang ditugaskan kepadanya | Teknisi sudah login dan ada assignment aktif | Buka tugas lalu klik terima | Status berubah menjadi `Diterima` dan history bertambah | Assignment milik teknisi |
| TC-012 | FR-009, BR-004, BR-006 | High | Functional / API | Teknisi memulai pengerjaan tugas | Teknisi sudah menerima tugas | Klik mulai dikerjakan | Status berubah menjadi `Sedang Dikerjakan` | Assignment aktif |
| TC-013 | FR-009, BR-004, BR-006 | High | Functional / API | Teknisi menolak tugas dengan alasan | Teknisi sudah login dan assignment aktif | Klik tolak lalu isi alasan | Penolakan tersimpan dan status/assignment mengikuti aturan yang ditetapkan | Reason valid |
| TC-014 | FR-009, BR-004, BR-006 | High | Functional / API | Teknisi menandai pekerjaan selesai | Teknisi sudah login dan status berjalan | Klik selesai dikerjakan | Status berubah menjadi `Selesai Dikerjakan` dan history bertambah | Assignment aktif |
| TC-015 | FR-010 | Medium | Functional / UI / API | Pengguna menambah komentar pada laporan | Pengguna berwenang sudah login | Buka detail laporan, isi komentar, kirim | Komentar tersimpan dan tampil di thread dengan timestamp | Body komentar valid |
| TC-016 | FR-011, NFR-002, BR-006 | High | Functional / Database Integrity | Setiap perubahan status membuat riwayat status baru | Ada laporan dengan perubahan status | Ubah status melalui alur yang sah | Tepat satu baris history baru tercatat dengan old_status, new_status, actor, dan waktu | Perubahan status valid |
| TC-017 | FR-012, BR-007 | High | Functional / Negative | Administrator menutup laporan yang sudah memenuhi konfirmasi hasil | Laporan siap ditutup dan admin login | Klik tutup pada detail laporan | Status menjadi `Ditutup` | Laporan siap close |
| TC-018 | FR-012, BR-008 | High | Functional / Negative | Administrator membuka kembali laporan yang hasilnya belum sesuai | Laporan tertutup atau selesai dikerjakan dan admin login | Klik buka kembali lalu simpan alasan | Status menjadi `Dibuka Kembali` dan masuk alur penugasan lagi | Reason valid |
| TC-019 | FR-013 | Medium | Functional / UI | Manajer Fasilitas melihat dashboard ringkas | Manajer Fasilitas sudah login | Buka dashboard | Ringkasan per status, kategori, prioritas, dan rata-rata waktu tampil | Data dashboard tersedia |
| TC-020 | NFR-003 | High | Database Integrity | Komentar tidak boleh tersimpan tanpa laporan induk | Database tersedia | Coba simpan komentar dengan request_id tidak valid | Insert gagal karena referensi laporan tidak ada | request_id invalid |
| TC-021 | NFR-003 | High | Database Integrity | Lampiran tidak boleh tersimpan tanpa laporan induk | Database tersedia | Coba simpan metadata attachment dengan request_id invalid | Insert gagal karena FK constraint atau validasi API | request_id invalid |
| TC-022 | NFR-005, NFR-006 | Medium | Security / Integration | Sistem mengembalikan error aman saat storage tidak tersedia | D1 atau R2 tidak tersedia sementara | Akses list, detail, atau upload lampiran | Sistem menampilkan pesan error aman tanpa stack trace | Simulasi storage down |
| TC-023 | NFR-006 | Medium | API / Observability | Response error aman pada akses ilegal | User login tanpa role yang cukup | Akses endpoint yang tidak diizinkan | Response 403 aman dan tercatat dengan request trace | Akun role tidak sesuai |
| TC-024 | NFR-007 | Medium | Performance Dasar | List, detail, dan dashboard merespons dalam batas normal | Environment staging dengan seed data | Panggil daftar, detail, dan dashboard beberapa kali | Response tetap layak dipakai pada beban normal dan tidak timeout pada batas yang disepakati | Seed data representative |

## 6. Negative, Edge, and Boundary Cases
| Test Case ID | Requirement ID | Case Type | Scenario | Expected Result |
|---|---|---|---|---|
| TC-NEG-001 | FR-001, FR-002 | Negative | Submit laporan tanpa description | Sistem menolak dan menampilkan error validasi |
| TC-NEG-002 | FR-003, BR-002, BR-004 | Negative | Pelapor atau teknisi mencoba membuka laporan di luar hak akses | Sistem menampilkan forbidden / tidak menampilkan data |
| TC-NEG-003 | FR-006, BR-005 | Boundary | Administrator mengirim prioritas di luar nilai yang disetujui | Request ditolak dengan validation error |
| TC-NEG-004 | FR-009, BR-006 | Negative | Teknisi mencoba mengubah status tanpa assignment aktif | Sistem menolak action dengan conflict atau forbidden |
| TC-NEG-005 | FR-010 | Negative | Komentar dikirim dengan body kosong | Sistem menolak komentar |
| TC-NEG-006 | FR-012, BR-007 | Negative | Administrator menutup laporan tanpa konfirmasi hasil | Sistem menolak close |
| TC-NEG-007 | FR-013 | Negative | Dashboard dibuka oleh role selain Manajer Fasilitas | Sistem menolak akses |
| TC-BND-001 | FR-001 | Boundary | Lampiran foto berada tepat di batas ukuran maksimum | Upload diterima jika masih dalam batas, ditolak jika melebihi batas |
| TC-BND-002 | FR-003, NFR-007 | Boundary | Pagination request memakai `page_size` maksimum | Sistem tetap merespons dan membatasi page_size sesuai contract |
| TC-BND-003 | NFR-002 | Boundary | Perubahan status berulang pada laporan yang sama | Setiap perubahan sah menghasilkan satu history row tanpa duplikasi |

## 7. Test Data
| Data ID | Purpose | Data Description | Related Test Case |
|---|---|---|---|
| TD-001 | Laporan valid | `location`, `issue_type`, `description` lengkap | TC-001 |
| TD-002 | Laporan invalid | Salah satu field wajib kosong | TC-002, TC-NEG-001 |
| TD-003 | File gambar valid | Foto `.jpg` atau `.png` dalam batas ukuran | TC-003, TC-BND-001 |
| TD-004 | Akun pelapor | Akun dengan satu atau lebih laporan milik sendiri | TC-004, TC-007 |
| TD-005 | Akun administrator | Role administrator dengan akses penuh | TC-005, TC-009, TC-017, TC-018 |
| TD-006 | Akun teknisi | Akun teknisi dengan assignment aktif | TC-006, TC-011, TC-012, TC-013, TC-014 |
| TD-007 | Akun manajer fasilitas | Role manajer fasilitas | TC-019, TC-NEG-007 |
| TD-008 | Laporan dengan history | Laporan yang sudah melalui beberapa perubahan status | TC-008, TC-016, TC-BND-003 |
| TD-009 | Storage down simulation | D1 atau R2 tidak tersedia | TC-022 |

## 8. Entry Criteria
- Requirement, acceptance criteria, dan dokumen desain utama sudah tersedia.
- Environment staging atau local test environment sudah siap.
- Seed data dasar untuk role, laporan, dan assignment sudah disiapkan.
- Dependency identity/session layer tersedia atau disimulasikan.
- Stakeholder menyetujui scope in-scope test plan.

## 9. Exit Criteria / Kriteria Lolos-Gagal
- Seluruh requirement di traceability matrix memiliki minimal satu test case.
- Test case prioritas tinggi untuk alur inti lulus tanpa defect blocker.
- Tidak ada defect critical pada pembuatan laporan, assignment, status update, atau akses role.
- Error handling utama menghasilkan pesan aman dan perilaku yang dapat diprediksi.
- Database integrity untuk FK, NOT NULL, dan append-only history terverifikasi.
- FR-012 dan FR-013 boleh tetap bertanda pending validation, tetapi test case dan expected result-nya harus disepakati sebelum sign-off final.

## 10. Risiko Pengujian
| Risk | Impact | Mitigation | Owner/TBD |
|---|---|---|---|
| Mekanisme konfirmasi penutupan laporan belum final | Test close bisa berubah | Tandai TC-017 sebagai review item dan validasi ulang sebelum eksekusi final | TBD |
| Dashboard minimum belum disepakati | Expected result dashboard bisa bergeser | Validasi metrik minimum sebelum sign-off | TBD |
| Identity/session final belum jelas | Role-based testing bisa berubah | Gunakan akun test simulasi dengan role yang sudah disebut | TBD |
| Upload lampiran bergantung pada storage | Test attachment dapat flaky | Siapkan storage simulasi dan fixture file kecil | TBD |
| Perubahan status bergantung pada state sebelumnya | Test jadi order-dependent | Reset seed data atau gunakan data terisolasi per test | TBD |

## 11. Asumsi
- Asumsi: Pengujian dilakukan pada environment local dan staging-like terlebih dahulu.
- Asumsi: Test data role `Pelapor`, `Administrator`, `Teknisi`, dan `Manajer Fasilitas` tersedia.
- Asumsi: URI API mengikuti kontrak pada output-api-contract.
- Asumsi: Nilai status UI mengikuti label yang digunakan di dokumen desain dan API.
- Asumsi: `FR-012` dan `FR-013` memerlukan review stakeholder sebelum final sign-off.

## 12. Open Questions
- Apakah close/reopen memerlukan bukti konfirmasi pelapor yang eksplisit di UI atau API?
- Apakah dashboard awal wajib menampilkan filter waktu default tertentu?
- Apakah komentar dapat dipakai sebagai bukti konfirmasi hasil atau hanya catatan?
- Apakah attachment preview harus selalu thumbnail, atau bisa daftar file saja?
- Apakah pengujian regression akan dijalankan per pull request atau hanya menjelang rilis?

## 13. Human Review Checklist
- [ ] Requirement coverage sudah benar.
- [ ] Prioritas test case sudah disetujui.
- [ ] Expected result sudah sesuai requirement.
- [ ] Risiko pengujian sudah diterima atau dimitigasi.
- [ ] Test case untuk FR-012 dan FR-013 sudah disetujui stakeholder.
- [ ] Data test untuk role, status, dan attachment sudah siap.

## 14. Quality Check Result
- Complete: Yes
- Traceable: Yes
- Testable: Yes
- Consistent: Yes
- No Hidden Assumptions: Yes
- Ready for QA Review: Yes
