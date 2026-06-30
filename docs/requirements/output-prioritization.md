# Prioritization Report: Campus Service Request and Maintenance System

## 1. Tujuan Prioritisasi
- Tujuan prioritisasi: Menentukan urutan implementasi kebutuhan untuk rilis awal/MVP berdasarkan nilai bisnis, dependency, risiko operasional, dan status validasi.
- Business goal: Mendukung alur pelaporan fasilitas yang terpusat, penanganan yang tertelusur, penugasan teknisi yang jelas, dan ringkasan operasional dasar.
- Target rilis / periode keputusan: [ASUMSI] Rilis awal / MVP.
- Stakeholder utama: Pelapor, Administrator, Teknisi, dan Manajer Fasilitas.
- Constraint utama: Beberapa keputusan bisnis masih pending validation, terutama penutupan laporan, reopen, dan dashboard.
- Kriteria keputusan: Business-critical, dependency-critical, operational-critical, user value, dan risiko jika tertunda.

## 2. Konteks yang Ditinjau
| Source ID | Jenis Sumber | Ringkasan | Relevansi |
|---|---|---|---|
| SRC-001 | Inception document | Memuat problem statement, tujuan proyek, stakeholder, scope, asumsi, constraint, open questions, dan risiko awal. | Menyediakan konteks bisnis dan batasan keputusan prioritas. |
| SRC-002 | Software Requirements Specification | Memuat business goals, user stories, functional requirements, non-functional requirements, business rules, acceptance criteria, dan traceability. | Sumber utama item prioritisasi dan dependency antar kebutuhan. |

## 3. Item yang Diprioritaskan
| Item ID | Item | Jenis | Source | Business Value | Effort / Complexity | Status Validasi |
|---|---|---|---|---|---|---|
| REQ-001 | Sistem harus memungkinkan Pelapor membuat laporan baru dengan lokasi, jenis masalah, deskripsi, dan lampiran foto opsional. | Requirement | SRC-002 | Memulai alur bisnis inti pelaporan. | Sedang | Validated |
| REQ-002 | Sistem harus menolak pembuatan laporan jika lokasi, jenis masalah, atau deskripsi kosong. | Requirement | SRC-002 | Menjamin kualitas data minimum untuk laporan. | Rendah | Validated |
| REQ-003 | Sistem harus menampilkan daftar laporan sesuai peran pengguna. | Requirement | SRC-002 | Memungkinkan akses operasional per peran. | Sedang | Validated |
| REQ-004 | Sistem harus menampilkan detail laporan lengkap beserta komentar dan riwayat status. | Requirement | SRC-002 | Memberi transparansi penanganan laporan. | Sedang | Validated |
| REQ-005 | Administrator harus dapat memeriksa laporan dan menetapkan kategori masalah. | Requirement | SRC-002 | Menjalankan triase laporan. | Sedang | Validated |
| REQ-006 | Administrator harus dapat menentukan prioritas laporan dari nilai yang telah disetujui. | Requirement | SRC-002 | Mendukung pengurutan kerja berdasarkan urgensi. | Rendah | Validated |
| REQ-007 | Administrator harus dapat menugaskan teknisi ke laporan. | Requirement | SRC-002 | Meneruskan pekerjaan ke petugas yang tepat. | Sedang | Validated |
| REQ-008 | Sistem harus mengubah status laporan menjadi "Ditugaskan" setelah teknisi dipilih dan penugasan disimpan. | Requirement | SRC-002 | Menjaga status workflow tetap konsisten. | Rendah | Validated |
| REQ-009 | Teknisi harus dapat menerima tugas, memperbarui progres, menolak tugas dengan alasan, dan menandai pekerjaan selesai. | Requirement | SRC-002 | Menggerakkan proses penyelesaian laporan. | Sedang | Validated |
| REQ-010 | Sistem harus memungkinkan komentar atau catatan pada laporan dari aktor yang berwenang. | Requirement | SRC-002 | Menyediakan komunikasi pada satu tiket laporan. | Rendah | Validated |
| REQ-011 | Sistem harus menyimpan riwayat status secara otomatis setiap kali status berubah. | Requirement | SRC-002 | Menyediakan audit trail dan traceability. | Rendah | Validated |
| REQ-012 | Administrator harus dapat menutup laporan atau membuka kembali laporan yang belum sesuai. | Requirement | SRC-002 | Menyelesaikan siklus layanan atau memulai pengerjaan ulang. | Sedang | Pending Validation |
| REQ-013 | Sistem harus menampilkan dashboard sederhana bagi Manajer Fasilitas. | Requirement | SRC-002 | Memberi ringkasan operasional untuk monitoring. | Sedang | Pending Validation |

## 4. Konflik Stakeholder
| Conflict ID | Stakeholder Terkait | Konflik | Dampak | Keputusan / Status | Klarifikasi Dibutuhkan |
|---|---|---|---|---|---|
| CON-001 | Pelapor, Administrator | Tidak ada konflik prioritas eksplisit, tetapi mekanisme penutupan laporan masih belum disepakati secara final. | Prioritas REQ-012 belum bisa ditetapkan dengan kepastian penuh. | Pending Validation | Ya |
| CON-002 | Manajer Fasilitas, tim delivery | Dashboard bernilai bisnis, tetapi belum ada definisi metrik minimum dan rentang waktu. | REQ-013 berisiko berubah scope jika diprioritaskan terlalu awal. | Pending Validation | Ya |

## 5. Dependency Analysis
| Dependency ID | Item Terkait | Dependency | Jenis Dependency | Dampak Jika Tidak Terpenuhi | Status |
|---|---|---|---|---|---|
| DEP-001 | REQ-002 | Bergantung pada REQ-001 agar validasi form dapat dijalankan pada proses pembuatan laporan. | Predecessor | Laporan bisa tersimpan tanpa data minimum. | Satisfied |
| DEP-002 | REQ-004 | Bergantung pada REQ-003 agar detail dapat diakses dari daftar laporan. | Predecessor | Pengguna tidak dapat mencapai halaman detail secara efektif. | Satisfied |
| DEP-003 | REQ-007 | Bergantung pada REQ-005 dan REQ-006 karena penugasan teknisi terjadi setelah triase dan prioritas ditetapkan. | Predecessor | Penugasan bisa terjadi sebelum laporan dipahami dan diprioritaskan. | Satisfied |
| DEP-004 | REQ-008 | Bergantung pada REQ-007 karena status "Ditugaskan" terjadi setelah teknisi dipilih. | Predecessor | Workflow status menjadi tidak konsisten. | Satisfied |
| DEP-005 | REQ-009 | Bergantung pada REQ-007 dan REQ-008 karena teknisi harus memiliki tugas sebelum dapat mengubah progres. | Predecessor | Teknisi tidak memiliki konteks tugas yang valid. | Satisfied |
| DEP-006 | REQ-011 | Bergantung pada REQ-008, REQ-009, dan REQ-012 karena riwayat status mencatat semua perubahan status. | Successor | Audit trail tidak lengkap jika status belum didefinisikan sepenuhnya. | Satisfied |
| DEP-007 | REQ-012 | Bergantung pada REQ-011 dan validasi mekanisme konfirmasi pelapor. | External / Validation | Penutupan laporan berisiko tidak sesuai proses bisnis. | Blocked |
| DEP-008 | REQ-013 | Bergantung pada REQ-011 dan definisi metrik dashboard yang disepakati. | External / Validation | Dashboard bisa menampilkan agregat yang tidak konsisten. | Blocked |

## 6. MoSCoW Prioritization
| Item ID | Item | MoSCoW | Alasan Kategori | Dependency | Risiko | Status Validasi |
|---|---|---|---|---|---|---|
| REQ-001 | Sistem harus memungkinkan Pelapor membuat laporan baru dengan lokasi, jenis masalah, deskripsi, dan lampiran foto opsional. | Must Have | Ini adalah pintu masuk alur bisnis inti dan tanpa ini sistem tidak memiliki nilai operasional utama. | DEP-001 | Rendah | Validated |
| REQ-002 | Sistem harus menolak pembuatan laporan jika lokasi, jenis masalah, atau deskripsi kosong. | Must Have | Validasi data minimum bersifat dependency-critical untuk menjaga kualitas laporan. | DEP-001 | Rendah | Validated |
| REQ-003 | Sistem harus menampilkan daftar laporan sesuai peran pengguna. | Must Have | Akses berbasis peran diperlukan agar masing-masing stakeholder dapat menjalankan proses utama. | Tidak ada blocker kritis | Sedang | Validated |
| REQ-004 | Sistem harus menampilkan detail laporan lengkap beserta komentar dan riwayat status. | Must Have | Transparansi dan traceability alur layanan adalah kebutuhan inti. | DEP-002 | Sedang | Validated |
| REQ-005 | Administrator harus dapat memeriksa laporan dan menetapkan kategori masalah. | Must Have | Triase adalah langkah wajib sebelum penugasan teknisi. | DEP-003 | Sedang | Validated |
| REQ-006 | Administrator harus dapat menentukan prioritas laporan dari nilai yang telah disetujui. | Must Have | Prioritas menentukan urutan kerja dan risk handling operasional. | DEP-003 | Rendah | Validated |
| REQ-007 | Administrator harus dapat menugaskan teknisi ke laporan. | Must Have | Penugasan adalah transisi wajib menuju penyelesaian. | DEP-003 | Sedang | Validated |
| REQ-008 | Sistem harus mengubah status laporan menjadi "Ditugaskan" setelah teknisi dipilih dan penugasan disimpan. | Must Have | Konsistensi status adalah dependency-critical untuk workflow berikutnya. | DEP-004 | Rendah | Validated |
| REQ-009 | Teknisi harus dapat menerima tugas, memperbarui progres, menolak tugas dengan alasan, dan menandai pekerjaan selesai. | Must Have | Tanpa ini proses penyelesaian tidak dapat berjalan end-to-end. | DEP-005 | Sedang | Validated |
| REQ-010 | Sistem harus memungkinkan komentar atau catatan pada laporan dari aktor yang berwenang. | Should Have | Bernilai untuk komunikasi, tetapi rilis awal tetap dapat berjalan tanpa fitur ini. | Tidak ada blocker kritis | Rendah | Validated |
| REQ-011 | Sistem harus menyimpan riwayat status secara otomatis setiap kali status berubah. | Must Have | Audit trail adalah inti traceability dan operational accountability. | DEP-006 | Rendah | Validated |
| REQ-012 | Administrator harus dapat menutup laporan atau membuka kembali laporan yang belum sesuai. | Should Have | Penting untuk siklus layanan penuh, tetapi mekanisme final masih perlu validasi stakeholder. | DEP-007 | Sedang | Pending Validation |
| REQ-013 | Sistem harus menampilkan dashboard sederhana bagi Manajer Fasilitas. | Could Have | Memberi nilai monitoring, tetapi tidak menghalangi alur layanan inti jika ditunda. | DEP-008 | Sedang | Pending Validation |

## 7. Trade-Off Analysis
| Trade-Off ID | Keputusan | Opsi yang Dibandingkan | Yang Diperoleh | Yang Dikorbankan | Risiko | Alasan Keputusan |
|---|---|---|---|---|---|---|
| TRD-001 | Dahulukan alur layanan inti daripada dashboard. | Dashboard awal vs pelaporan, triase, dan penugasan. | Rilis awal langsung memiliki nilai operasional utama. | Ringkasan manajerial ditunda. | Manajer Fasilitas belum mendapat dashboard di awal. | Nilai bisnis inti ada pada penanganan laporan end-to-end. |
| TRD-002 | Jadikan komentar sebagai Should Have. | Komunikasi lintas peran vs alur inti minimum. | Rilis awal tetap lebih ramping dan fokus pada workflow utama. | Interaksi tambahan untuk klarifikasi laporan ditunda. | Komunikasi pada laporan kurang kaya di versi awal. | Komentar mendukung value, tetapi tidak memblokir proses inti. |
| TRD-003 | Tunda reopen dan penutupan formal ke prioritas setelah validasi. | Menutup siklus penuh vs mengeksekusi workflow inti yang sudah jelas. | Mengurangi risiko salah aturan bisnis pada status akhir. | Siklus layanan belum lengkap pada rilis awal. | Perlu revisi jika stakeholder mengubah aturan konfirmasi. | Mekanisme final masih pending validation sehingga lebih aman ditunda. |

## 8. Decision Rationale
| Decision ID | Item / Konflik / Trade-Off | Keputusan | Alasan | Evidence / Source | Assumption | Owner Validasi |
|---|---|---|---|---|---|---|
| DEC-001 | REQ-001 | Must Have | Ini adalah titik awal seluruh alur bisnis dan tanpa fitur ini sistem tidak punya fungsi utama. | SRC-002 | -- | Sponsor Proyek |
| DEC-002 | REQ-002 | Must Have | Validasi data minimum diperlukan agar laporan layak diproses. | SRC-002 | -- | Administrator |
| DEC-003 | REQ-003 | Must Have | Hak akses daftar laporan diperlukan oleh semua peran inti. | SRC-002 | ASM-001 | Administrator |
| DEC-004 | REQ-004 | Must Have | Detail laporan dan riwayat adalah inti transparansi layanan. | SRC-002 | ASM-002 | Administrator |
| DEC-005 | REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, REQ-011 | Must Have | Item-item ini membentuk workflow penyelesaian laporan dari triase sampai eksekusi dan audit trail. | SRC-002 | ASM-002 | Administrator |
| DEC-006 | REQ-010 | Should Have | Komentar berguna untuk klarifikasi, tetapi rilis awal masih dapat berjalan tanpa fitur ini. | SRC-002 | -- | Product Owner |
| DEC-007 | REQ-012 | Should Have | Penutupan dan reopen penting untuk siklus layanan lengkap, namun aturan finalnya belum tervalidasi. | SRC-002 | ASM-003 | Sponsor Proyek |
| DEC-008 | REQ-013 | Could Have | Dashboard memberi nilai monitoring, tetapi tidak memblokir operasi inti. | SRC-002 | ASM-004 | Manajer Fasilitas |
| DEC-009 | CON-001 | Pending Validation | Mekanisme penutupan laporan belum final. | SRC-002 | ASM-003 | Sponsor Proyek |
| DEC-010 | CON-002 | Pending Validation | Definisi minimum dashboard belum disepakati. | SRC-002 | ASM-004 | Manajer Fasilitas |
| DEC-011 | TRD-001 | Dahulukan alur inti | Fokus pada value yang langsung dirasakan pengguna operasional. | SRC-002 | -- | Sponsor Proyek |
| DEC-012 | TRD-002 | Tunda komentar ke Should Have | Menjaga scope MVP tetap kecil dan aman. | SRC-002 | -- | Product Owner |
| DEC-013 | TRD-003 | Tunda reopen/penutupan formal | Menghindari keputusan status akhir yang belum disepakati. | SRC-002 | ASM-003 | Sponsor Proyek |

## 9. Rekomendasi Prioritas
### Must Have
- REQ-001
- REQ-002
- REQ-003
- REQ-004
- REQ-005
- REQ-006
- REQ-007
- REQ-008
- REQ-009
- REQ-011

### Should Have
- REQ-010
- REQ-012

### Could Have
- REQ-013

### Won't Have
- [BELUM DIDEFINISIKAN - tidak ada item eksplisit yang diputuskan sebagai Won't Have dalam sumber saat ini]

## 10. Gap dan Pertanyaan Terbuka
### Gap
- Mekanisme penutupan laporan dan reopen masih pending validation.
- Detail minimum dashboard untuk Manajer Fasilitas belum disepakati.
- Target rilis dan kapasitas tim tidak tersedia, sehingga prioritas ini diasumsikan untuk MVP awal.

### Pertanyaan Terbuka
- Apakah penutupan laporan memerlukan konfirmasi Pelapor dalam bentuk komentar, tombol persetujuan, atau keduanya?
- Metrik minimum apa yang wajib ada di dashboard awal?
- Apakah ada dependency teknis atau operasional yang belum tercatat di spesifikasi?

## 11. Traceability Matrix
| Business Goal | Item ID | MoSCoW | Dependency ID | Conflict ID | Trade-Off ID | Decision ID |
|---|---|---|---|---|---|---|
| BG-001 | REQ-001 | Must Have | DEP-001 | -- | TRD-001 | DEC-001 |
| BG-001 | REQ-002 | Must Have | DEP-001 | -- | -- | DEC-002 |
| BG-001, BG-003 | REQ-003 | Must Have | -- | -- | -- | DEC-003 |
| BG-003 | REQ-004 | Must Have | DEP-002 | -- | -- | DEC-004 |
| BG-001, BG-002 | REQ-005 | Must Have | DEP-003 | -- | -- | DEC-005 |
| BG-002 | REQ-006 | Must Have | DEP-003 | -- | -- | DEC-005 |
| BG-002 | REQ-007 | Must Have | DEP-003 | -- | -- | DEC-005 |
| BG-002 | REQ-008 | Must Have | DEP-004 | -- | -- | DEC-005 |
| BG-002, BG-003 | REQ-009 | Must Have | DEP-005 | -- | -- | DEC-005 |
| BG-003 | REQ-010 | Should Have | -- | -- | TRD-002 | DEC-006 |
| BG-003 | REQ-011 | Must Have | DEP-006 | -- | -- | DEC-005 |
| BG-003 | REQ-012 | Should Have | DEP-007 | CON-001 | TRD-003 | DEC-007 |
| BG-004 | REQ-013 | Could Have | DEP-008 | CON-002 | TRD-001 | DEC-008 |

## 12. Quality Check Result
| Check | Result | Catatan |
|---|---|---|
| Lengkap | Lulus | Mencakup item prioritas, konflik, dependency, MoSCoW, trade-off, alasan keputusan, rekomendasi, dan traceability. |
| Konsisten | Lulus | Kategori prioritas selaras dengan dependency dan status validasi yang tersedia. |
| Tidak ambigu | Lulus | Alasan prioritas menggunakan kriteria business-critical, dependency-critical, dan operational value. |
| Traceable | Lulus | Setiap keputusan ditelusuri ke business goal, source, dependency, konflik, trade-off, atau asumsi. |
| Terjustifikasi | Lulus | Setiap item prioritas memiliki rationale yang eksplisit. |
| Feasible | Lulus | Item Must Have tidak diblokir dependency kritis yang belum diselesaikan. |
| Transparan | Lulus | Konflik dan trade-off dicatat secara eksplisit. |
| Bernilai bisnis | Lulus | Prioritas mendukung alur layanan inti dan kebutuhan monitoring dasar. |
| Tervalidasi | Parsial | REQ-012 dan REQ-013 masih menunggu validasi stakeholder. |

