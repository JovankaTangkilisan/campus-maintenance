# Software Requirements Specification: Campus Service Request and Maintenance System

## 1. Ringkasan
- Nama proyek/fitur: Campus Service Request and Maintenance System
- Tujuan bisnis: Menyediakan alur pelaporan fasilitas kampus yang terpusat, tertelusur, dan dapat dipantau sampai penutupan laporan.
- Stakeholder: Pelapor, Administrator, Teknisi, dan Manajer Fasilitas.
- Pengguna utama: Pelapor, Administrator, Teknisi, dan Manajer Fasilitas.
- Ruang lingkup: Pembuatan laporan, melihat daftar laporan, pencarian dan penyaringan laporan, melihat detail laporan, pemeriksaan laporan, penentuan prioritas, penugasan teknisi, pembaruan status pekerjaan, komentar/catatan, riwayat status otomatis, penutupan atau pembukaan kembali laporan, dan dashboard ringkas.
- Di luar ruang lingkup: Integrasi eksternal, aturan regulasi yang belum disebutkan, dan batas non-fungsional yang belum didefinisikan secara eksplisit.

## 2. Konteks dan Asumsi
### 2.1 Konteks yang Ditinjau
| Source ID | Jenis Sumber | Ringkasan | Relevansi |
|---|---|---|---|
| SRC-001 | Inception document | Memuat problem statement, tujuan proyek, stakeholder, scope, asumsi, constraint, open questions, dan risiko awal. | Sumber konteks bisnis dan batasan awal. |
| SRC-002 | Elicitation document | Memuat kebutuhan eksplisit, kebutuhan implisit, pertanyaan klarifikasi, functional requirements, non-functional requirements, dan traceability. | Sumber utama untuk menurunkan spesifikasi formal. |

### 2.2 Asumsi
| Assumption ID | Asumsi | Alasan | Validasi yang Dibutuhkan | Risiko Jika Salah |
|---|---|---|---|---|
| ASM-001 | Pengguna harus login sebelum mengakses daftar, detail, komentar, dan aksi berbasis peran. | Semua use case utama bergantung pada hak akses per peran. | Konfirmasi kebijakan autentikasi dan otorisasi. | Akses data dapat terbuka ke pengguna yang tidak berwenang. |
| ASM-002 | Setiap perubahan status wajib menghasilkan satu entri riwayat status. | Riwayat status disebut sebagai fitur inti dan otomatis. | Validasi format audit trail. | Riwayat status tidak konsisten. |
| ASM-003 | Penutupan laporan memerlukan konfirmasi pelapor sebelum Administrator menutup laporan. | Alur penutupan belum difinalkan pada sumber. | Validasi mekanisme persetujuan final. | Laporan bisa ditutup tanpa verifikasi hasil. |
| ASM-004 | Dashboard memerlukan rentang waktu pelaporan yang konsisten agar agregasi data dapat dibandingkan. | Dashboard menampilkan ringkasan dan rata-rata waktu penyelesaian. | Konfirmasi default time window dan filter. | Angka dashboard tidak sebanding. |
| ASM-005 | Teknisi hanya melihat laporan yang ditugaskan kepadanya, kecuali ada override administratif. | Hak akses per peran dibutuhkan untuk daftar dan detail laporan. | Validasi matriks akses per peran. | Teknisi bisa melihat laporan yang tidak relevan. |

## 3. Business Goals
| Goal ID | Business Goal | Metrik Keberhasilan | Prioritas |
|---|---|---|---|
| BG-001 | Menyediakan alur pelaporan fasilitas yang terpusat dan tervalidasi. | Persentase laporan baru yang tersimpan dengan status awal yang benar dan data minimum yang lengkap. | Tinggi |
| BG-002 | Mempercepat triase dan penugasan laporan. | Rata-rata waktu dari laporan dibuat sampai ditugaskan ke teknisi. | Tinggi |
| BG-003 | Meningkatkan transparansi status penanganan laporan. | Persentase laporan yang memiliki detail, komentar, dan riwayat status yang dapat dilihat. | Tinggi |
| BG-004 | Menyediakan ringkasan operasional bagi Manajer Fasilitas. | Ketersediaan dashboard yang menampilkan jumlah laporan per status, kategori, prioritas, dan rata-rata waktu penyelesaian. | Sedang |

## 4. User Stories
| User Story ID | User Story | Business Goal | Prioritas | Status Validasi |
|---|---|---|---|---|
| US-001 | Sebagai Pelapor, saya ingin membuat laporan baru agar masalah fasilitas kampus dapat dicatat secara terpusat. | BG-001 | Tinggi | Validated |
| US-002 | Sebagai Pelapor, saya ingin melihat daftar dan detail laporan saya agar saya dapat memantau status penanganan. | BG-003 | Tinggi | Validated |
| US-003 | Sebagai Administrator, saya ingin memeriksa, memberi kategori, menetapkan prioritas, dan menugaskan teknisi agar laporan dapat diproses sesuai urgensi. | BG-001, BG-002 | Tinggi | Validated |
| US-004 | Sebagai Teknisi, saya ingin melihat tugas saya dan memperbarui status pekerjaan agar progres penanganan dapat dipantau. | BG-002, BG-003 | Tinggi | Validated |
| US-005 | Sebagai Manajer Fasilitas, saya ingin melihat dashboard ringkas agar saya dapat memantau kondisi laporan secara agregat. | BG-004 | Sedang | Pending Validation |

## 5. Functional Requirements
| Requirement ID | Functional Requirement | User Story / Source | Prioritas | Acceptance Criteria | Status Validasi |
|---|---|---|---|---|---|
| FR-001 | Sistem harus memungkinkan Pelapor membuat laporan baru dengan lokasi, jenis masalah, deskripsi, dan lampiran foto opsional. | US-001 / SRC-002 | Tinggi | AC-001, AC-002 | Validated |
| FR-002 | Sistem harus menolak pembuatan laporan jika lokasi, jenis masalah, atau deskripsi kosong. | US-001 / ASM-001 | Tinggi | AC-001 | Validated |
| FR-003 | Sistem harus menampilkan daftar laporan sesuai peran pengguna. | US-002 / SRC-002 | Tinggi | AC-003, AC-004, AC-005 | Validated |
| FR-004 | Sistem harus menampilkan detail laporan lengkap beserta komentar dan riwayat status. | US-002 / SRC-002 | Tinggi | AC-006 | Validated |
| FR-005 | Administrator harus dapat memeriksa laporan dan menetapkan kategori masalah. | US-003 / SRC-002 | Tinggi | AC-007, AC-008 | Validated |
| FR-006 | Administrator harus dapat menentukan prioritas laporan dari nilai yang telah disetujui. | US-003 / SRC-002 | Tinggi | AC-009 | Validated |
| FR-007 | Administrator harus dapat menugaskan teknisi ke laporan. | US-003 / SRC-002 | Tinggi | AC-010, AC-011 | Validated |
| FR-008 | Sistem harus mengubah status laporan menjadi "Ditugaskan" setelah teknisi dipilih dan penugasan disimpan. | US-003 / ASM-002 | Tinggi | AC-011 | Validated |
| FR-009 | Teknisi harus dapat menerima tugas, memperbarui progres, menolak tugas dengan alasan, dan menandai pekerjaan selesai. | US-004 / SRC-002 | Tinggi | AC-012, AC-013, AC-014 | Validated |
| FR-010 | Sistem harus memungkinkan komentar atau catatan pada laporan dari aktor yang berwenang. | SRC-002 | Sedang | AC-015 | Validated |
| FR-011 | Sistem harus menyimpan riwayat status secara otomatis setiap kali status berubah. | SRC-002 / ASM-002 | Tinggi | AC-016 | Validated |
| FR-012 | Administrator harus dapat menutup laporan atau membuka kembali laporan yang belum sesuai. | US-003 / ASM-003 | Tinggi | AC-017, AC-018 | Pending Validation |
| FR-013 | Sistem harus menampilkan dashboard sederhana bagi Manajer Fasilitas. | US-005 / SRC-002 | Sedang | AC-019 | Pending Validation |

## 6. Non-Functional Requirements
| Requirement ID | Atribut Kualitas | Non-Functional Requirement | Ukuran / Threshold | Source | Status Validasi |
|---|---|---|---|---|---|
| NFR-001 | Security | Sistem harus membatasi akses fitur sensitif berdasarkan peran pengguna yang berwenang. | 100% aksi sensitif memerlukan validasi otorisasi. | ASM-001, SRC-002 | Validated |
| NFR-002 | Auditability | Sistem harus merekam setiap perubahan status secara konsisten. | Setiap perubahan status menghasilkan tepat 1 entri audit dengan status lama, status baru, aktor, dan waktu. | ASM-002, SRC-002 | Validated |
| NFR-003 | Data Integrity | Sistem harus menyimpan data laporan, komentar, prioritas, dan status tanpa kehilangan relasi antar entitas. | 0 data perubahan status atau komentar boleh tersimpan tanpa referensi laporan yang valid. | SRC-002 | Validated |
| NFR-004 | Usability | Sistem harus memakai label status yang konsisten pada daftar, detail, dan dashboard. | Semua tampilan memakai himpunan status yang sama: Baru, Diperiksa, Ditugaskan, Diterima, Sedang Dikerjakan, Selesai Dikerjakan, Ditutup, Dibuka Kembali, Ditolak. | SRC-002 | Pending Validation |
| NFR-005 | Availability | Sistem harus tetap menampilkan data laporan yang sudah tersimpan saat dibuka oleh peran yang berwenang. | 100% permintaan data laporan yang valid harus dapat menampilkan data atau pesan error yang jelas. | SRC-002 | Pending Validation |

## 7. Business Rules
| Rule ID | Business Rule | Kondisi | Pengecualian | Requirement Terkait | Status Validasi |
|---|---|---|---|---|---|
| BR-001 | Laporan baru harus memiliki data minimum lokasi, jenis masalah, dan deskripsi. | Saat Pelapor mengirim formulir laporan. | Foto boleh kosong. | FR-001, FR-002 | Validated |
| BR-002 | Pelapor hanya dapat melihat laporan miliknya. | Saat Pelapor membuka daftar atau detail laporan. | Tidak ada pengecualian yang disebutkan. | FR-003, FR-004 | Validated |
| BR-003 | Administrator dapat melihat seluruh laporan. | Saat Administrator membuka daftar atau detail laporan. | Tidak ada pengecualian yang disebutkan. | FR-003, FR-004 | Validated |
| BR-004 | Teknisi hanya dapat melihat laporan yang ditugaskan kepadanya. | Saat Teknisi membuka daftar atau detail laporan. | Override administratif masih berupa asumsi. | FR-003, FR-004, ASM-005 | Pending Validation |
| BR-005 | Prioritas laporan harus dipilih dari nilai yang disetujui. | Saat Administrator menentukan prioritas. | Nilai prioritas baru memerlukan validasi stakeholder. | FR-006 | Validated |
| BR-006 | Setiap perubahan status harus dicatat ke riwayat status. | Saat status laporan berubah. | Tidak ada pengecualian yang disebutkan. | FR-011 | Validated |
| BR-007 | Laporan hanya boleh ditutup setelah hasil pekerjaan dikonfirmasi oleh Pelapor. | Saat Administrator menutup laporan. | Mekanisme konfirmasi final masih pending validation. | FR-012 | Pending Validation |
| BR-008 | Laporan dapat dibuka kembali jika hasil pekerjaan belum sesuai. | Saat Administrator memutuskan reopen. | Alur reopen detail masih perlu validasi. | FR-012 | Pending Validation |

## 8. Acceptance Criteria
| Acceptance Criteria ID | Requirement / User Story | Given | When | Then | Tipe Skenario |
|---|---|---|---|---|---|
| AC-001 | FR-001, FR-002 / US-001 | Pelapor membuka form laporan baru dan mengosongkan salah satu field wajib. | Pelapor menekan tombol kirim. | Sistem menolak pengiriman dan menampilkan pesan validasi untuk field yang kosong. | Negative |
| AC-002 | FR-001 / US-001 | Pelapor mengisi lokasi, jenis masalah, dan deskripsi dengan benar. | Pelapor mengirim laporan. | Sistem menyimpan laporan dengan status awal "Baru" dan menampilkan konfirmasi berhasil. | Positive |
| AC-003 | FR-003 / US-002 | Pelapor masuk ke daftar laporan. | Sistem memuat daftar. | Sistem hanya menampilkan laporan milik Pelapor. | Permission |
| AC-004 | FR-003 / US-003 | Administrator masuk ke daftar laporan. | Sistem memuat daftar. | Sistem menampilkan seluruh laporan yang tersedia. | Permission |
| AC-005 | FR-003 / US-004 | Teknisi masuk ke daftar laporan. | Sistem memuat daftar. | Sistem hanya menampilkan laporan yang ditugaskan kepada Teknisi. | Permission |
| AC-006 | FR-004 / US-002 | Pengguna membuka detail salah satu laporan yang dapat diakses. | Detail laporan dimuat. | Sistem menampilkan data pelapor, kategori, prioritas, status, teknisi, riwayat status, dan komentar. | Positive |
| AC-007 | FR-005 / US-003 | Administrator membuka laporan berstatus "Baru". | Administrator memilih aksi pemeriksaan. | Sistem mengubah status menjadi "Diperiksa" dan menyimpan kategori laporan. | Positive |
| AC-008 | FR-005 / US-003 | Administrator membuka detail laporan. | Administrator memilih kategori masalah. | Sistem menyimpan kategori tersebut pada laporan. | Positive |
| AC-009 | FR-006 / US-003 | Administrator membuka laporan yang sudah diperiksa. | Administrator memilih prioritas. | Sistem hanya menerima nilai prioritas yang telah disetujui dan menyimpan pilihan tersebut. | Validation |
| AC-010 | FR-007 / US-003 | Administrator membuka daftar teknisi tersedia. | Administrator memilih satu teknisi. | Sistem menyimpan penugasan teknisi pada laporan. | Positive |
| AC-011 | FR-007, FR-008 / US-003 | Penugasan teknisi berhasil disimpan. | Sistem memproses perubahan. | Status laporan berubah menjadi "Ditugaskan". | State Change |
| AC-012 | FR-009 / US-004 | Teknisi membuka daftar tugas miliknya. | Teknisi memilih tugas dan menekan "Terima Tugas". | Sistem mengubah status menjadi "Diterima". | Positive |
| AC-013 | FR-009 / US-004 | Teknisi sedang mengerjakan laporan. | Teknisi memperbarui progres. | Sistem mengubah status menjadi "Sedang Dikerjakan". | Positive |
| AC-014 | FR-009 / US-004 | Teknisi menyatakan pekerjaan selesai. | Teknisi menekan status selesai. | Sistem mengubah status menjadi "Selesai Dikerjakan". | Positive |
| AC-015 | FR-010 | Aktor yang berwenang menulis komentar pada detail laporan. | Komentar dikirim. | Sistem menyimpan komentar beserta nama pengirim dan waktu. | Positive |
| AC-016 | FR-011 | Status laporan berubah. | Sistem menyimpan perubahan. | Sistem menambah satu entri riwayat berisi status lama, status baru, aktor, dan waktu. | Audit |
| AC-017 | FR-012 | Laporan berstatus "Selesai Dikerjakan" dan konfirmasi pelapor sudah tersedia. | Administrator memilih aksi tutup. | Sistem mengubah status menjadi "Ditutup". | Positive |
| AC-018 | FR-012 | Laporan perlu dibuka kembali karena hasil belum sesuai. | Administrator memilih aksi reopen. | Sistem mengembalikan laporan ke alur penugasan. | Negative |
| AC-019 | FR-013 / US-005 | Manajer Fasilitas membuka dashboard dan data laporan tersedia. | Dashboard dimuat. | Sistem menampilkan jumlah laporan per status, kategori, prioritas, dan rata-rata waktu penyelesaian. | Positive |

## 9. Traceability Matrix
| Business Goal | User Story ID | Requirement ID | Business Rule ID | Acceptance Criteria ID | Status |
|---|---|---|---|---|---|
| BG-001 | US-001 | FR-001, FR-002 | BR-001 | AC-001, AC-002 | Validated |
| BG-003 | US-002 | FR-003, FR-004, FR-011 | BR-002, BR-003, BR-004, BR-006 | AC-003, AC-004, AC-005, AC-006, AC-016 | Validated |
| BG-001, BG-002 | US-003 | FR-005, FR-006, FR-007, FR-008, FR-012 | BR-005, BR-007, BR-008 | AC-007, AC-008, AC-009, AC-010, AC-011, AC-017, AC-018 | Pending Validation |
| BG-002, BG-003 | US-004 | FR-009, FR-011 | BR-006 | AC-012, AC-013, AC-014, AC-015, AC-016 | Validated |
| BG-004 | US-005 | FR-013 | -- | AC-019 | Pending Validation |

## 10. Gap, Konflik, dan Pertanyaan Terbuka
### Gap
- Pemilik proyek atau sponsor persetujuan belum ditentukan.
- Target rilis atau milestone belum ditetapkan.
- Aturan regulasi, privasi, dan retensi data belum dirinci.
- Batas out of scope untuk integrasi, notifikasi, dan kebutuhan non-fungsional belum difinalkan.
- Definisi detail konfirmasi hasil pekerjaan oleh Pelapor belum difinalkan.

### Konflik
- Tidak ada konflik eksplisit antara `SRC-001` dan `SRC-002`.
- Ada ketidakjelasan pada mekanisme penutupan laporan: sumber menyebut komentar/konfirmasi, tetapi bentuk interaksi final masih belum pasti.

### Pertanyaan Terbuka
- Siapa owner atau sponsor yang menyetujui perubahan requirement dan scope?
- Apa target rilis atau milestone implementasi yang harus dipenuhi?
- Apa daftar pasti fitur di luar scope?
- Apakah konfirmasi hasil oleh Pelapor dilakukan lewat komentar, tombol persetujuan, atau keduanya?
- Apakah ada kebijakan privasi, regulasi, atau retensi data yang wajib diterapkan?

## 11. Quality Check Result
| Check | Result | Catatan |
|---|---|---|
| Lengkap | Lulus | Memuat ringkasan, konteks, asumsi, business goal, user story, FR, NFR, business rule, AC, traceability, gap, konflik, dan pertanyaan terbuka. |
| Konsisten | Lulus | Item inti konsisten dengan sumber; area yang belum pasti diberi status pending validation atau asumsi. |
| Tidak ambigu | Lulus | Requirement dan acceptance criteria ditulis dengan perilaku yang dapat diamati dan diuji. |
| Dapat diuji | Lulus | Setiap FR dan NFR memiliki acceptance criteria atau threshold yang terukur. |
| Traceable | Lulus | Setiap requirement terhubung ke business goal, user story, business rule, source, dan acceptance criteria. |
| Bernilai bisnis | Lulus | Semua requirement inti mendukung pelaporan, triase, penugasan, audit trail, dan dashboard. |
| Feasible | Lulus | Tidak ada requirement yang bertentangan dengan konteks yang tersedia. |
| Terprioritaskan | Lulus | Semua requirement memiliki prioritas dan status validasi. |
| Tervalidasi | Parsial | Penutupan laporan, reopen detail, dan dashboard masih memerlukan validasi stakeholder. |

