# Validation Change Report: Campus Service Request and Maintenance System

## 1. Ringkasan
- Perubahan yang divalidasi: Prioritisasi requirement untuk rilis awal/MVP pada `output-prioritization.md`.
- Tujuan perubahan: Menentukan urutan implementasi kebutuhan berdasarkan nilai bisnis, dependency, risiko operasional, dan status validasi.
- Artefak yang ditinjau: `output-prioritization.md` dan sumber turunannya dari spesifikasi sebelumnya.
- Kesimpulan umum: Prioritisasi sudah cukup kuat untuk dipakai sebagai baseline MVP, tetapi ada beberapa dependency dan asumsi yang masih perlu dipertegas sebelum eksekusi.

## 2. Asumsi
| Assumption ID | Asumsi | Alasan | Dampak jika Salah |
|---|---|---|---|
| ASM-001 | Prioritisasi ini ditujukan untuk rilis awal atau MVP. | Dokumen menyatakan target rilis sebagai `[ASUMSI] Rilis awal / MVP`. | Urutan prioritas bisa berubah jika konteksnya backlog jangka panjang, bukan MVP. |
| ASM-002 | Tidak ada target release, kapasitas tim, atau estimasi effort detail yang tersedia. | Informasi tersebut tidak dicantumkan dalam dokumen prioritisasi. | Prioritas masih layak untuk baseline, tetapi belum cukup untuk penjadwalan final. |
| ASM-003 | Prioritas final akan dipakai sebagai masukan untuk perencanaan berikutnya, bukan sebagai keputusan implementasi teknis final. | Skill ini memvalidasi perubahan sebelum dieksekusi. | Jika dipakai sebagai keputusan final tanpa klarifikasi tambahan, risiko scope mismatch meningkat. |

## 3. Temuan Validasi
| Temuan ID | Referensi | Dimensi | Dampak | Saran Perbaikan |
|---|---|---|---|---|
| FV-001 | REQ-011, DEP-006 | Traceability, Consistency | Dependency riwayat status terlalu sempit karena dikaitkan dengan `REQ-012`, padahal audit trail juga bergantung pada status-changing flow yang sudah ada di `REQ-005` sampai `REQ-009`. | Perluas dependency `REQ-011` agar mencakup semua requirement yang mengubah status, atau jelaskan bahwa `REQ-012` hanya salah satu sumber perubahan status yang tercatat. |
| FV-002 | REQ-012, CON-001, DEP-007 | Feasibility, Clarity | `REQ-012` berada di kondisi `Should Have` namun masih `Blocked` karena mekanisme konfirmasi pelapor belum disepakati. Ini benar sebagai status sementara, tetapi keputusan prioritas akhir belum sepenuhnya final. | Tegaskan aturan konfirmasi pelapor dan kriteria status akhir sebelum memulai implementasi item ini. |
| FV-003 | REQ-013, CON-002, DEP-008 | Completeness, Testability | Dashboard sudah diprioritaskan sebagai `Could Have`, tetapi metrik minimum dan rentang waktu belum didefinisikan sehingga acceptance criteria belum cukup stabil untuk eksekusi. | Definisikan metrik minimum dashboard dan default time window sebelum item ini masuk backlog implementasi. |
| FV-004 | Item prioritas secara keseluruhan | Consistency, Business Value | Urutan prioritas inti sudah konsisten dengan business goal: alur pelaporan, triase, penugasan, dan audit trail didahulukan sebelum fitur komunikasi dan monitoring tambahan. | Pertahankan urutan ini sebagai baseline MVP, sambil memvalidasi item yang masih pending. |
| FV-005 | REQ-010 | Business Value, Scope | Komentar ditempatkan sebagai `Should Have`, yang konsisten dengan nilainya sebagai fitur pendukung, bukan pembuka alur bisnis. | Tidak ada perubahan wajib; cukup pertahankan sebagai fitur pasca inti. |

## 4. Traceability
| Item / Requirement ID | Sumber Terkait | Status Prioritas | Catatan Validasi |
|---|---|---|---|
| REQ-001 | SRC-002 | Must Have | Cukup jelas dan dapat diuji. |
| REQ-002 | SRC-002 | Must Have | Cukup jelas dan dapat diuji. |
| REQ-003 | SRC-002 | Must Have | Cukup jelas dan dapat diuji. |
| REQ-004 | SRC-002 | Must Have | Cukup jelas dan dapat diuji. |
| REQ-005 | SRC-002 | Must Have | Cukup jelas dan dapat diuji. |
| REQ-006 | SRC-002 | Must Have | Cukup jelas dan dapat diuji. |
| REQ-007 | SRC-002 | Must Have | Cukup jelas dan dapat diuji. |
| REQ-008 | SRC-002 | Must Have | Cukup jelas dan dapat diuji. |
| REQ-009 | SRC-002 | Must Have | Cukup jelas dan dapat diuji. |
| REQ-010 | SRC-002 | Should Have | Traceable ke kebutuhan komunikasi pada laporan. |
| REQ-011 | SRC-002 | Must Have | Traceability perlu diperluas pada dependency status-changing flow. |
| REQ-012 | SRC-002 | Should Have | Masih menunggu validasi aturan konfirmasi hasil pekerjaan. |
| REQ-013 | SRC-002 | Could Have | Perlu definisi metrik minimum sebelum implementasi. |

## 5. Impact Analysis
### Dampak Bisnis
- Prioritas inti yang ditetapkan sudah mendukung nilai bisnis utama: pelaporan, triase, penugasan, dan pelacakan status.
- Item yang masih pending validation tidak menghalangi baseline MVP, tetapi dapat memengaruhi kelengkapan siklus layanan.

### Dampak Teknis
- Implementasi workflow inti dapat dimulai tanpa menunggu dashboard.
- Riwayat status perlu cakupan dependency yang lebih akurat agar test coverage dan audit trail tidak salah dipersempit.

### Dampak Proses
- Tim dapat memulai dari item `Must Have` dengan risiko scope yang relatif terkendali.
- Item `Should Have` dan `Could Have` memerlukan klarifikasi lebih lanjut sebelum masuk ke tahap delivery.

## 6. Pertanyaan Klarifikasi
- Apakah `REQ-011` harus mencatat semua perubahan status dari seluruh workflow, atau hanya status tertentu yang dianggap final?
- Apa aturan final yang dipakai untuk mengonfirmasi hasil pekerjaan sebelum laporan ditutup?
- Metrik apa saja yang wajib tampil pada dashboard awal, dan apakah ada rentang waktu default yang harus dipakai?

## 7. Rekomendasi
- Pertahankan prioritas `Must Have` yang ada sebagai baseline MVP.
- Revisi dependency `REQ-011` agar mencerminkan seluruh status-changing requirement, bukan hanya `REQ-012`.
- Jangan mulai implementasi `REQ-012` dan `REQ-013` sebelum klarifikasi stakeholder selesai.
- Jika tim butuh baseline yang lebih aman, perlakukan `REQ-012` sebagai blocked backlog item dan `REQ-013` sebagai candidate item setelah dashboard scope disepakati.

