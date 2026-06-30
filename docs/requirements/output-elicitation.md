# Laporan Elicitation: Campus Service Request and Maintenance System

## 1. Tujuan Elicitation
- Tujuan: Menurunkan `output-inception.md` menjadi kebutuhan yang terstruktur, traceable, dan dapat diuji untuk sistem pelaporan dan maintenance kampus.
- Tujuan bisnis: Mendukung pelaporan fasilitas yang terpusat, penanganan yang tertelusur, penugasan teknisi yang jelas, dan ringkasan operasional bagi Manajer Fasilitas.
- Stakeholder: Pelapor, Administrator, Teknisi, dan Manajer Fasilitas.
- Scope: Alur laporan fasilitas dari pembuatan laporan, pemeriksaan, penentuan prioritas, penugasan teknisi, pembaruan status, komentar, riwayat status, penutupan/pembukaan kembali laporan, dan dashboard ringkas.

## 2. Konteks yang Ditinjau
| Source ID | Jenis Sumber | Ringkasan | Relevansi |
|---|---|---|---|
| SRC-001 | Dokumen inception | Menjelaskan problem statement, stakeholder, scope, asumsi, constraint, open questions, dan risiko awal untuk Campus Service Request and Maintenance System. | Sumber utama untuk mengekstrak kebutuhan eksplisit dan implisit. |
| SRC-002 | Use case specification | Mendefinisikan use case UC-01 sampai UC-12, alur status, aktor, dan asumsi operasional. | Sumber evidence perilaku sistem dan alur bisnis yang rinci. |

## 3. Teknik Elicitation
| Technique ID | Teknik | Tujuan | Stakeholder / Sumber | Alasan Pemilihan |
|---|---|---|---|---|
| TECH-001 | Document analysis | Mengekstrak kebutuhan eksplisit dari dokumen yang sudah ada. | SRC-001, SRC-002 | Tidak ada transkrip wawancara; dokumen sudah cukup kaya untuk membentuk kebutuhan awal. |
| TECH-002 | Requirement derivation | Menurunkan kebutuhan implisit dari alur status, hak akses, dan dependency use case. | SRC-001, SRC-002 | Banyak kebutuhan tidak disebut sebagai requirement formal, tetapi tersirat dari workflow. |
| TECH-003 | Gap analysis | Mengidentifikasi pertanyaan terbuka dan data yang belum didefinisikan. | SRC-001 | Inception masih menyisakan deadline, owner validasi, regulasi, dan out-of-scope yang belum jelas. |

## 4. Pertanyaan Wawancara
### 4.1 Pertanyaan Umum
- Q1: Siapa sponsor atau owner yang berhak menyetujui perubahan requirement dan scope?
- Q2: Apa target rilis atau milestone implementasi yang harus dipenuhi?
- Q3: Batasan apa yang harus diperlakukan sebagai out of scope, termasuk integrasi, notifikasi, dan aturan non-fungsional?

### 4.2 Pertanyaan Berdasarkan Peran
| Question ID | Peran Stakeholder | Pertanyaan | Tujuan | Pemicu Follow-Up |
|---|---|---|---|---|
| Q-004 | Pelapor | Apakah konfirmasi hasil pekerjaan dilakukan lewat komentar, tombol persetujuan, atau keduanya? | Memvalidasi mekanisme penutupan laporan. | Jika penutupan membutuhkan alur persetujuan khusus. |
| Q-005 | Pelapor | Data apa saja yang wajib diisi saat membuat laporan baru? | Menetapkan validasi form laporan. | Jika ada field wajib tambahan selain lokasi, jenis masalah, dan deskripsi. |
| Q-006 | Administrator | Kriteria apa yang dipakai untuk menentukan kategori dan prioritas laporan? | Menurunkan rule bisnis triase. | Jika prioritas harus mengikuti skema khusus kampus. |
| Q-007 | Administrator | Dalam kondisi apa laporan boleh ditolak atau dibuka kembali? | Menetapkan exception workflow. | Jika penolakan atau reopen punya alasan wajib. |
| Q-008 | Teknisi | Status apa saja yang boleh diubah oleh teknisi, dan kapan laporan dianggap selesai? | Menetapkan batas tindakan teknisi. | Jika ada status tambahan selain diterima, dikerjakan, dan selesai. |
| Q-009 | Manajer Fasilitas | Ringkasan apa yang wajib tampil di dashboard awal? | Menetapkan minimum dashboard. | Jika dashboard perlu metrik tambahan atau filter waktu. |

## 5. Kebutuhan Eksplisit
| Need ID | Stakeholder / Sumber | Kebutuhan yang Dinyatakan | Evidence | Business Value |
|---|---|---|---|---|
| NEED-001 | SRC-002 | Sistem harus memungkinkan Pelapor membuat laporan baru dengan lokasi, jenis masalah, deskripsi, dan foto opsional. | UC-01 | Memusatkan pelaporan dan mengurangi laporan yang tercecer. |
| NEED-002 | SRC-002 | Sistem harus menampilkan daftar laporan sesuai hak akses masing-masing peran. | UC-02 | Membatasi akses dan menampilkan data yang relevan bagi tiap peran. |
| NEED-003 | SRC-002 | Sistem harus mendukung pencarian dan penyaringan laporan berdasarkan status, kategori, prioritas, dan tanggal. | UC-03 | Mempercepat penemuan laporan yang relevan. |
| NEED-004 | SRC-002 | Sistem harus menampilkan detail laporan lengkap, termasuk deskripsi, status, prioritas, teknisi, riwayat status, dan komentar. | UC-04 | Memberi visibilitas penuh atas penanganan laporan. |
| NEED-005 | SRC-002 | Administrator harus dapat memeriksa laporan dan menetapkan kategori masalah. | UC-05 | Menjamin triase laporan sebelum diproses lanjut. |
| NEED-006 | SRC-002 | Administrator harus dapat menentukan prioritas laporan. | UC-06 | Membantu pengurutan kerja berdasarkan urgensi. |
| NEED-007 | SRC-002 | Administrator harus dapat menugaskan teknisi dan sistem harus mengirim notifikasi tugas baru. | UC-07 | Menjamin pekerjaan diteruskan ke petugas yang tepat. |
| NEED-008 | SRC-002 | Teknisi harus dapat menerima tugas dan memperbarui status pekerjaan sampai selesai dikerjakan. | UC-08 | Memastikan progres pekerjaan dapat dipantau. |
| NEED-009 | SRC-002 | Sistem harus mendukung komentar atau catatan dari Pelapor, Administrator, dan Teknisi. | UC-09 | Menyediakan kanal komunikasi pada satu laporan. |
| NEED-010 | SRC-002 | Sistem harus menyimpan riwayat status secara otomatis setiap kali status berubah. | UC-10 | Menyediakan audit trail dan timeline historis. |
| NEED-011 | SRC-002 | Administrator harus dapat menutup atau membuka kembali laporan setelah hasil pekerjaan ditinjau. | UC-11 | Menutup loop penyelesaian atau mengaktifkan pengerjaan ulang. |
| NEED-012 | SRC-002 | Manajer Fasilitas harus dapat melihat dashboard sederhana berisi ringkasan jumlah laporan per status, kategori, prioritas, dan rata-rata waktu penyelesaian. | UC-12 | Mendukung pengawasan operasional dan pengambilan keputusan. |

## 6. Kebutuhan Implisit dan Asumsi
| Assumption ID | Kebutuhan yang Diinferensi | Dasar Inferensi | Validasi yang Dibutuhkan | Risiko jika Salah |
|---|---|---|---|---|
| ASM-001 | Sistem memerlukan autentikasi sebelum akses ke daftar, detail, komentar, dan tindakan berbasis peran. | Semua use case utama mensyaratkan login atau hak akses tertentu. | Konfirmasi kebijakan login dan otorisasi. | Akses data bisa salah sasaran. |
| ASM-002 | Setiap perubahan status harus menghasilkan satu catatan riwayat yang memuat status lama, status baru, aktor, dan waktu. | UC-10 dan alur status pada inception. | Validasi format audit trail. | Riwayat status tidak konsisten atau tidak lengkap. |
| ASM-003 | Penutupan laporan memerlukan mekanisme persetujuan pelapor sebelum status ditutup oleh Administrator. | UC-11 dan catatan asumsi di inception. | Konfirmasi alur persetujuan final. | Laporan dapat ditutup tanpa verifikasi hasil. |
| ASM-004 | Dashboard membutuhkan definisi rentang waktu pelaporan agar angka agregat dapat dibandingkan secara konsisten. | UC-12 menampilkan statistik dan rata-rata waktu penyelesaian. | Tentukan default time window dan filter. | Dashboard menampilkan angka yang tidak sebanding. |
| ASM-005 | Akses teknisi dibatasi pada laporan yang ditugaskan kepadanya kecuali ada override administratif. | UC-02 dan UC-04 menyebut hak akses per peran. | Validasi matriks akses per peran. | Teknisi dapat melihat laporan yang tidak relevan. |

## 7. Functional Requirements
| Requirement ID | Requirement | Source Need | Priority | Acceptance Criteria | Validation Status |
|---|---|---|---|---|---|
| FR-001 | Sistem harus memungkinkan Pelapor membuat laporan baru yang berisi lokasi, jenis masalah, deskripsi, dan lampiran foto opsional. | NEED-001 | Must Have | AC-001: Form laporan menolak submit jika lokasi, jenis masalah, atau deskripsi kosong; AC-002: laporan tersimpan dengan status awal "Baru". | Tervalidasi |
| FR-002 | Sistem harus menampilkan daftar laporan sesuai peran pengguna. | NEED-002 | Must Have | AC-003: Pelapor hanya melihat laporan miliknya; AC-004: Administrator melihat seluruh laporan; AC-005: Teknisi melihat laporan yang ditugaskan kepadanya. | Tervalidasi |
| FR-003 | Sistem harus mendukung pencarian dan penyaringan laporan berdasarkan status, kategori, prioritas, dan tanggal. | NEED-003 | Should Have | AC-006: hasil filter hanya menampilkan laporan yang memenuhi kriteria yang dipilih; AC-007: jika tidak ada hasil, sistem menampilkan pesan "Laporan tidak ditemukan". | Tervalidasi |
| FR-004 | Sistem harus menampilkan detail laporan lengkap beserta riwayat status dan komentar. | NEED-004 | Must Have | AC-008: halaman detail menampilkan data pelapor, kategori, prioritas, status, teknisi, riwayat status, dan komentar yang tersimpan. | Tervalidasi |
| FR-005 | Administrator harus dapat memeriksa laporan dan menetapkan kategori masalah. | NEED-005 | Must Have | AC-009: laporan berstatus "Baru" dapat diubah menjadi "Diperiksa"; AC-010: kategori laporan tersimpan pada detail laporan. | Tervalidasi |
| FR-006 | Administrator harus dapat menentukan prioritas laporan. | NEED-006 | Must Have | AC-011: prioritas hanya dapat dipilih dari nilai yang disetujui; AC-012: perubahan prioritas tersimpan pada laporan. | Tervalidasi |
| FR-007 | Administrator harus dapat menugaskan teknisi ke laporan dan sistem harus mencatat status "Ditugaskan". | NEED-007 | Must Have | AC-013: daftar teknisi tersedia saat penugasan; AC-014: setelah disimpan, status berubah menjadi "Ditugaskan". | Tervalidasi |
| FR-008 | Teknisi harus dapat menerima tugas, memperbarui progres, menolak tugas dengan alasan, dan menandai pekerjaan selesai. | NEED-008 | Must Have | AC-015: teknisi dapat mengubah status menjadi "Diterima", "Sedang Dikerjakan", atau "Selesai Dikerjakan"; AC-016: penolakan tugas menyimpan alasan dan mengembalikan laporan ke status yang ditentukan. | Tervalidasi |
| FR-009 | Sistem harus memungkinkan komentar atau catatan pada laporan dari aktor yang berwenang. | NEED-009 | Should Have | AC-017: komentar tersimpan dengan nama pengirim dan waktu pengiriman; AC-018: komentar tampil di detail laporan. | Tervalidasi |
| FR-010 | Sistem harus menyimpan riwayat status secara otomatis setiap kali status berubah. | NEED-010 | Must Have | AC-019: setiap perubahan status menghasilkan satu entri riwayat; AC-020: entri memuat status lama, status baru, aktor, dan waktu. | Tervalidasi |
| FR-011 | Administrator harus dapat menutup laporan atau membuka kembali laporan yang belum sesuai. | NEED-011 | Must Have | AC-021: laporan dapat diubah ke status "Ditutup" hanya setelah kondisi validasi yang disepakati terpenuhi; AC-022: reopen mengembalikan laporan ke alur penugasan. | Menunggu Validasi |
| FR-012 | Sistem harus menampilkan dashboard sederhana bagi Manajer Fasilitas. | NEED-012 | Should Have | AC-023: dashboard menampilkan jumlah laporan per status, kategori, prioritas, dan rata-rata waktu penyelesaian ketika data tersedia. | Menunggu Validasi |

## 8. Non-Functional Requirements
| Requirement ID | Quality Attribute | Requirement | Measurement / Threshold | Source Need | Validation Status |
|---|---|---|---|---|---|
| NFR-001 | Security | Sistem harus membatasi akses fitur berdasarkan peran pengguna yang berwenang. | 100% halaman dan aksi yang sensitif memerlukan validasi otorisasi. | ASM-001, NEED-002, NEED-004, NEED-007, NEED-011, NEED-012 | Tervalidasi |
| NFR-002 | Auditability | Sistem harus merekam jejak perubahan status secara konsisten. | Setiap perubahan status menghasilkan tepat 1 entri audit dengan old status, new status, actor, dan timestamp. | ASM-002, NEED-010 | Tervalidasi |
| NFR-003 | Data Integrity | Sistem harus menyimpan data laporan, komentar, prioritas, dan status tanpa kehilangan relasi antar entitas. | 0 perubahan status atau komentar boleh tersimpan tanpa referensi laporan yang valid. | NEED-004, NEED-009, NEED-010 | Tervalidasi |
| NFR-004 | Usability | Sistem harus menyediakan label status yang konsisten pada seluruh daftar, detail, dan dashboard. | Semua tampilan memakai himpunan status yang sama: Baru, Diperiksa, Ditugaskan, Diterima, Sedang Dikerjakan, Selesai Dikerjakan, Ditutup, Dibuka Kembali, Ditolak. | SRC-002, ASM-002 | Menunggu Validasi |

## 9. Temuan Elicitation
### Temuan Utama
- Sistem memiliki empat peran utama: Pelapor, Administrator, Teknisi, dan Manajer Fasilitas.
- Alur bisnis inti berpusat pada laporan fasilitas dari pembuatan sampai penutupan.
- Riwayat status adalah kebutuhan inti, bukan tambahan.
- Dashboard Manajer Fasilitas bergantung pada data status, kategori, prioritas, dan waktu penyelesaian.

### Konflik atau Kontradiksi
- Tidak ditemukan kontradiksi langsung antara `output-inception.md` dan `CASE.md`.
- Ada ketidakjelasan pada mekanisme persetujuan penutupan laporan: disebutkan sebagai komentar/konfirmasi, tetapi bentuk interaksinya belum difinalkan.

### Gap dan Pertanyaan Terbuka
- Pemilik proyek atau sponsor belum ditentukan.
- Deadline atau target rilis belum ditentukan.
- Batas out of scope untuk integrasi, notifikasi, dan kebutuhan non-fungsional belum ditetapkan.
- Aturan regulasi, privasi, dan retensi data belum dijelaskan.
- Format final untuk konfirmasi hasil pekerjaan oleh Pelapor belum dipastikan.

### Risiko
- Scope creep jika batas out of scope tidak dikunci.
- Validasi status akan salah jika transisi workflow tidak disepakati.
- Akses data bisa salah jika matriks peran tidak divalidasi.
- Dashboard bisa menampilkan agregat yang tidak konsisten jika rentang waktu tidak ditetapkan.

## 10. Traceability Matrix
| Need ID | Requirement ID | Source ID | Acceptance Criteria ID | Status |
|---|---|---|---|---|
| NEED-001 | FR-001 | SRC-002 | AC-001, AC-002 | Tervalidasi |
| NEED-002 | FR-002 | SRC-002 | AC-003, AC-004, AC-005 | Tervalidasi |
| NEED-003 | FR-003 | SRC-002 | AC-006, AC-007 | Tervalidasi |
| NEED-004 | FR-004 | SRC-002 | AC-008 | Tervalidasi |
| NEED-005 | FR-005 | SRC-002 | AC-009, AC-010 | Tervalidasi |
| NEED-006 | FR-006 | SRC-002 | AC-011, AC-012 | Tervalidasi |
| NEED-007 | FR-007 | SRC-002 | AC-013, AC-014 | Tervalidasi |
| NEED-008 | FR-008 | SRC-002 | AC-015, AC-016 | Tervalidasi |
| NEED-009 | FR-009 | SRC-002 | AC-017, AC-018 | Tervalidasi |
| NEED-010 | FR-010 | SRC-002 | AC-019, AC-020 | Tervalidasi |
| NEED-011 | FR-011 | SRC-002 | AC-021, AC-022 | Menunggu Validasi |
| NEED-012 | FR-012 | SRC-002 | AC-023 | Menunggu Validasi |
| ASM-001 | NFR-001 | SRC-001, SRC-002 | AC-003, AC-004, AC-005 | Asumsi |
| ASM-002 | NFR-002 | SRC-002 | AC-019, AC-020 | Asumsi |
| ASM-003 | FR-011 | SRC-001, SRC-002 | AC-021, AC-022 | Asumsi |
| ASM-004 | FR-012 | SRC-002 | AC-023 | Asumsi |
| ASM-005 | FR-002 | SRC-001, SRC-002 | AC-005 | Asumsi |

## 11. Hasil Quality Check
| Check | Hasil | Catatan |
|---|---|---|
| Lengkap | Lulus | Mencakup tujuan, teknik, pertanyaan, kebutuhan, requirement, temuan, traceability, dan quality check. |
| Konsisten | Lulus | Tidak ada kontradiksi eksplisit; area yang belum pasti ditandai sebagai asumsi atau pertanyaan terbuka. |
| Tidak ambigu | Lulus | Requirement inti dibuat testable; istilah yang belum pasti diberi penanda menunggu validasi. |
| Dapat diuji | Lulus | Setiap FR dan NFR memiliki acceptance criteria atau threshold. |
| Traceable | Lulus | Setiap requirement terhubung ke need, source, dan acceptance criteria. |
| Bernilai bisnis | Lulus | Semua requirement utama mendukung pelaporan, triase, penugasan, audit trail, atau dashboard. |
| Tervalidasi | Parsial | Beberapa item strategis masih menunggu validasi stakeholder, terutama penutupan laporan dan dashboard. |

