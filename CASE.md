# Use Case Specification
## Campus Service Request and Maintenance System

---

## 1. Daftar Use Case

| ID | Nama Use Case | Aktor Utama |
|----|----------------------------------|--------------------------|
| UC-01 | Membuat Laporan Baru | Pelapor |
| UC-02 | Melihat Daftar Laporan | Pelapor, Administrator, Teknisi |
| UC-03 | Mencari dan Menyaring Laporan | Pelapor, Administrator, Teknisi |
| UC-04 | Melihat Detail Laporan | Pelapor, Administrator, Teknisi |
| UC-05 | Memeriksa Laporan | Administrator |
| UC-06 | Menentukan Prioritas | Administrator |
| UC-07 | Menugaskan Teknisi | Administrator |
| UC-08 | Mengubah Status Pekerjaan | Teknisi |
| UC-09 | Menambahkan Komentar atau Catatan | Pelapor, Administrator, Teknisi |
| UC-10 | Menyimpan Riwayat Status | Sistem (otomatis) |
| UC-11 | Menutup atau Membuka Kembali Laporan | Administrator |
| UC-12 | Menampilkan Dashboard Sederhana | Manajer Fasilitas |

---

## 2. Aktor Sistem

| Aktor | Deskripsi |
|-------|-----------|
| **Pelapor** | Mahasiswa atau dosen yang melaporkan masalah fasilitas kampus. Dapat membuat laporan, melihat status, menambahkan komentar, dan mengonfirmasi hasil. |
| **Administrator** | Pihak yang memeriksa laporan, menentukan kategori dan prioritas, menugaskan teknisi, serta menutup laporan. |
| **Teknisi** | Pihak yang melihat tugas, menerima tugas, memperbarui progres, dan menandai pekerjaan selesai. |
| **Manajer Fasilitas** | Pihak yang melihat dashboard dan laporan ringkas. |

---

## 3. Spesifikasi Use Case

### UC-01 — Membuat Laporan Baru

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Pelapor |
| **Deskripsi** | Pelapor membuat laporan baru terkait masalah fasilitas kampus (mis. proyektor rusak, internet bermasalah, AC tidak dingin, kursi rusak, alat laboratorium bermasalah, ruangan kotor). |
| **Precondition** | Pelapor telah login ke sistem. |
| **Postcondition** | Laporan baru tersimpan dengan status "Baru" dan dapat dilihat oleh Administrator. |

**Basic Flow**
1. Pelapor memilih menu "Buat Laporan Baru".
2. Sistem menampilkan formulir laporan (lokasi, jenis masalah, deskripsi, lampiran foto opsional).
3. Pelapor mengisi formulir dan mengirimkan laporan.
4. Sistem memvalidasi data yang dimasukkan.
5. Sistem menyimpan laporan dengan status "Baru" dan mencatat waktu pelaporan.
6. Sistem menampilkan konfirmasi bahwa laporan berhasil dibuat.

**Alternate Flow**
- A1. Jika data tidak lengkap, sistem menampilkan pesan kesalahan dan meminta pelapor melengkapi formulir.

---

### UC-02 — Melihat Daftar Laporan

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Pelapor, Administrator, Teknisi |
| **Deskripsi** | Aktor melihat daftar laporan sesuai dengan hak aksesnya (Pelapor hanya laporan miliknya, Administrator seluruh laporan, Teknisi laporan yang ditugaskan kepadanya). |
| **Precondition** | Aktor telah login ke sistem. |
| **Postcondition** | Daftar laporan ditampilkan sesuai hak akses aktor. |

**Basic Flow**
1. Aktor memilih menu "Daftar Laporan".
2. Sistem mengambil data laporan sesuai peran aktor.
3. Sistem menampilkan daftar laporan beserta status singkatnya (judul, kategori, prioritas, status, tanggal).

**Alternate Flow**
- A1. Jika tidak ada laporan, sistem menampilkan pesan "Belum ada laporan".

---

### UC-03 — Mencari dan Menyaring Laporan

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Pelapor, Administrator, Teknisi |
| **Deskripsi** | Aktor mencari laporan tertentu atau menyaring daftar laporan berdasarkan kriteria seperti status, kategori, prioritas, atau rentang tanggal. |
| **Precondition** | Aktor berada pada halaman Daftar Laporan. |
| **Postcondition** | Daftar laporan yang ditampilkan sesuai dengan kata kunci/filter yang dipilih. |

**Basic Flow**
1. Aktor memasukkan kata kunci pencarian dan/atau memilih filter (status, kategori, prioritas, tanggal).
2. Sistem memproses pencarian/penyaringan.
3. Sistem menampilkan hasil yang sesuai dengan kriteria.

**Alternate Flow**
- A1. Jika tidak ditemukan hasil yang sesuai, sistem menampilkan pesan "Laporan tidak ditemukan".

---

### UC-04 — Melihat Detail Laporan

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Pelapor, Administrator, Teknisi |
| **Deskripsi** | Aktor melihat informasi lengkap suatu laporan, termasuk deskripsi masalah, status, prioritas, teknisi yang ditugaskan, riwayat status, dan komentar. |
| **Precondition** | Aktor telah login dan memiliki hak akses terhadap laporan yang dipilih. |
| **Postcondition** | Detail laporan ditampilkan secara lengkap. |

**Basic Flow**
1. Aktor memilih salah satu laporan dari daftar laporan.
2. Sistem menampilkan detail laporan: data pelapor, kategori, prioritas, status saat ini, teknisi yang ditugaskan, riwayat status, dan komentar.

**Alternate Flow**
- A1. Jika aktor tidak memiliki hak akses terhadap laporan tersebut, sistem menampilkan pesan "Akses ditolak".

---

### UC-05 — Memeriksa Laporan

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Administrator |
| **Deskripsi** | Administrator memeriksa laporan baru yang masuk untuk menentukan kelayakan dan kategori laporan sebelum diproses lebih lanjut. |
| **Precondition** | Terdapat laporan dengan status "Baru". |
| **Postcondition** | Laporan berubah status menjadi "Diperiksa" dan kategori laporan ditetapkan. |

**Basic Flow**
1. Administrator membuka laporan berstatus "Baru".
2. Administrator meninjau isi laporan.
3. Administrator menetapkan/mengonfirmasi kategori masalah.
4. Sistem memperbarui status laporan menjadi "Diperiksa" dan mencatat ke riwayat status (lihat UC-10).

**Alternate Flow**
- A1. Jika laporan dinilai tidak valid (mis. duplikat atau bukan masalah fasilitas), Administrator dapat menolak laporan dengan mencantumkan alasan; status diubah menjadi "Ditolak".

---

### UC-06 — Menentukan Prioritas

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Administrator |
| **Deskripsi** | Administrator menetapkan tingkat prioritas laporan (mis. Rendah, Sedang, Tinggi, Mendesak) berdasarkan dampak dan urgensi masalah. |
| **Precondition** | Laporan telah berstatus "Diperiksa". |
| **Postcondition** | Prioritas laporan tersimpan dan tercatat dalam riwayat status. |

**Basic Flow**
1. Administrator membuka detail laporan.
2. Administrator memilih tingkat prioritas dari daftar pilihan.
3. Sistem menyimpan prioritas dan mencatatnya ke riwayat status.

---

### UC-07 — Menugaskan Teknisi

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Administrator |
| **Deskripsi** | Administrator menugaskan laporan kepada teknisi yang sesuai untuk ditindaklanjuti. |
| **Precondition** | Laporan telah memiliki prioritas. |
| **Postcondition** | Laporan ditugaskan kepada teknisi tertentu dan status berubah menjadi "Ditugaskan". Teknisi menerima notifikasi tugas baru. |

**Basic Flow**
1. Administrator memilih laporan yang akan ditugaskan.
2. Sistem menampilkan daftar teknisi yang tersedia.
3. Administrator memilih teknisi yang sesuai.
4. Sistem mengubah status laporan menjadi "Ditugaskan" dan mencatat ke riwayat status.
5. Sistem mengirimkan notifikasi kepada teknisi terkait.

**Alternate Flow**
- A1. Jika teknisi yang dipilih sedang memiliki beban tugas penuh, sistem menampilkan peringatan namun tetap mengizinkan penugasan jika Administrator melanjutkan.

---

### UC-08 — Mengubah Status Pekerjaan

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Teknisi |
| **Deskripsi** | Teknisi menerima tugas, memperbarui progres pekerjaan, dan menandai pekerjaan selesai. |
| **Precondition** | Laporan telah ditugaskan kepada teknisi yang bersangkutan. |
| **Postcondition** | Status laporan diperbarui (mis. "Diterima", "Sedang Dikerjakan", "Selesai Dikerjakan") dan tercatat ke riwayat status. |

**Basic Flow**
1. Teknisi membuka daftar tugas miliknya.
2. Teknisi memilih laporan yang ditugaskan dan menekan "Terima Tugas".
3. Sistem mengubah status menjadi "Diterima".
4. Teknisi memperbarui progres pekerjaan secara berkala (status "Sedang Dikerjakan").
5. Setelah pekerjaan selesai, Teknisi menandai laporan sebagai "Selesai Dikerjakan".
6. Sistem mencatat setiap perubahan status ke riwayat status dan mengirimkan notifikasi kepada Pelapor.

**Alternate Flow**
- A1. Jika Teknisi tidak dapat mengerjakan tugas, Teknisi dapat menolak tugas dengan alasan; status kembali menjadi "Diperiksa" dan Administrator dapat menugaskan ulang.

---

### UC-09 — Menambahkan Komentar atau Catatan

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Pelapor, Administrator, Teknisi |
| **Deskripsi** | Aktor menambahkan komentar atau catatan tambahan pada suatu laporan untuk keperluan komunikasi atau klarifikasi. |
| **Precondition** | Aktor memiliki hak akses terhadap laporan tersebut. |
| **Postcondition** | Komentar tersimpan dan ditampilkan pada detail laporan beserta waktu dan nama pengirim. |

**Basic Flow**
1. Aktor membuka detail laporan.
2. Aktor menulis komentar/catatan pada kolom yang tersedia.
3. Aktor mengirimkan komentar.
4. Sistem menyimpan komentar beserta nama pengirim dan waktu pengiriman.
5. Sistem menampilkan komentar pada riwayat percakapan laporan.

---

### UC-10 — Menyimpan Riwayat Status

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Sistem (dipicu secara otomatis oleh UC-05, UC-06, UC-07, UC-08, UC-11) |
| **Deskripsi** | Sistem mencatat setiap perubahan status laporan secara otomatis sebagai jejak riwayat (audit trail), termasuk status sebelumnya, status baru, aktor yang melakukan perubahan, dan waktu perubahan. |
| **Precondition** | Terjadi perubahan status pada suatu laporan. |
| **Postcondition** | Riwayat status tersimpan dan dapat ditampilkan secara kronologis pada detail laporan. |

**Basic Flow**
1. Salah satu use case (UC-05, UC-06, UC-07, UC-08, atau UC-11) memicu perubahan status.
2. Sistem mencatat status sebelumnya, status baru, aktor, dan waktu perubahan ke dalam riwayat status.
3. Riwayat status ditambahkan pada lini masa (timeline) di halaman detail laporan.

---

### UC-11 — Menutup atau Membuka Kembali Laporan

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Administrator |
| **Deskripsi** | Setelah Pelapor mengonfirmasi hasil pekerjaan, Administrator menutup laporan. Jika hasil pekerjaan belum sesuai, laporan dapat dibuka kembali. |
| **Precondition** | Laporan berstatus "Selesai Dikerjakan" dan Pelapor telah memberikan konfirmasi. |
| **Postcondition** | Status laporan menjadi "Ditutup", atau jika dibuka kembali menjadi "Dibuka Kembali" dan dikembalikan kepada Teknisi/Administrator untuk ditindaklanjuti. |

**Basic Flow**
1. Pelapor meninjau hasil pekerjaan pada laporan berstatus "Selesai Dikerjakan" dan memberikan konfirmasi (lihat catatan di UC-09 untuk mekanisme komentar/konfirmasi).
2. Administrator meninjau konfirmasi dari Pelapor.
3. Administrator menutup laporan.
4. Sistem mengubah status menjadi "Ditutup" dan mencatat ke riwayat status.

**Alternate Flow**
- A1. Jika Pelapor menyatakan hasil pekerjaan belum sesuai, Administrator dapat membuka kembali laporan; status berubah menjadi "Dibuka Kembali" dan laporan dikembalikan ke proses penugasan (UC-07).

---

### UC-12 — Menampilkan Dashboard Sederhana

| Item | Deskripsi |
|------|-----------|
| **Aktor** | Manajer Fasilitas |
| **Deskripsi** | Manajer Fasilitas melihat ringkasan statistik laporan, seperti jumlah laporan per status, per kategori, per prioritas, dan rata-rata waktu penyelesaian. |
| **Precondition** | Manajer Fasilitas telah login ke sistem. |
| **Postcondition** | Dashboard menampilkan ringkasan data laporan terkini. |

**Basic Flow**
1. Manajer Fasilitas membuka menu "Dashboard".
2. Sistem mengambil dan mengagregasi data laporan.
3. Sistem menampilkan ringkasan dalam bentuk grafik/angka (jumlah laporan per status, per kategori, per prioritas, rata-rata waktu penyelesaian).

**Alternate Flow**
- A1. Jika belum ada data yang cukup, sistem menampilkan dashboard kosong dengan pesan informatif.

---

## 4. Catatan Asumsi

[ASUMSI] Status laporan mengikuti alur: **Baru → Diperiksa → (Ditolak | Prioritas Ditentukan) → Ditugaskan → Diterima → Sedang Dikerjakan → Selesai Dikerjakan → Ditutup**, dengan kemungkinan kembali ke **Dibuka Kembali** jika Pelapor menolak hasil pekerjaan.

[ASUMSI] Mekanisme "konfirmasi hasil" oleh Pelapor diimplementasikan melalui kombinasi komentar (UC-09) dan tindakan persetujuan eksplisit sebelum laporan dapat ditutup (UC-11).

[ASUMSI] UC-10 (Menyimpan Riwayat Status) bersifat otomatis/sistemik dan tidak memiliki interaksi langsung dari aktor manusia, melainkan dipicu oleh use case lain yang mengubah status laporan.