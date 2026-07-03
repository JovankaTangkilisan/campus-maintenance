# UI Design Specification: Campus Service Request and Maintenance System

## 1. Ringkasan
- Nama produk/fitur: Campus Service Request and Maintenance System
- Tujuan bisnis: Membuat pelaporan fasilitas kampus terasa terpusat, mudah ditelusuri, dan jelas status penanganannya bagi semua peran.
- Target pengguna: Pelapor, Administrator, Teknisi, dan Manajer Fasilitas.
- Platform dan viewport: Responsive web SPA untuk desktop 1440px, tablet 834px, dan mobile 390px.
- Ruang lingkup: Session gate, beranda role-aware, daftar laporan, detail laporan, buat laporan baru, dashboard manajer fasilitas, state loading/empty/error/permission denied, serta prototype alur inti.
- Di luar ruang lingkup: Desain identity provider final, brand system eksternal, dan aplikasi native terpisah.

## 2. Konteks dan Asumsi
### 2.1 Sumber yang Ditinjau
| Source ID | Sumber | Ringkasan | Relevansi |
|---|---|---|---|
| SRC-001 | output-database-api-design.md | Mendefinisikan data model, endpoint API, error contract, dan security control yang harus didukung UI. | Menjadi acuan field, aksi, state, dan navigasi. |
| SRC-002 | output-architecture-design.md | Menetapkan edge-first modular monolith, Cloudflare Worker, D1, dan R2. | Membatasi pola UI ke SPA yang mengonsumsi API JSON. |
| SRC-003 | output-validation-change.md | Menandai item pending validation untuk penutupan laporan, dashboard minimum, dan beberapa NFR. | Menentukan state UI yang masih perlu perlakuan hati-hati. |
| SRC-004 | output-specification.md | Memuat FR, user stories, acceptance criteria, dan business rules. | Sumber utama alur pengguna dan perilaku UI. |
| SRC-005 | src/App.tsx, src/App.css, src/index.css | Menunjukkan baseline proyek adalah Vite + React starter yang belum berisi desain produk. | Menjadi konteks implementasi frontend saat ini. |

### 2.2 Asumsi
| Assumption ID | Asumsi | Alasan | Validasi yang Dibutuhkan | Risiko Jika Salah |
|---|---|---|---|---|
| ASM-001 | UI ini ditujukan untuk desktop dan mobile, dengan tablet mengikuti layout desktop yang dipadatkan. | Kebutuhan responsive sudah jelas, tetapi ukuran detail hanya disebutkan sebagai web app. | Validasi perangkat utama yang diprioritaskan. | Jika tablet perlu layout khusus, wireframe dan spacing harus diubah. |
| ASM-002 | Identity provider final belum ditentukan, sehingga UI hanya menyiapkan session gate dan state permission denied. | Backend auth layer masih asumsi. | Validasi alur login atau redirect final. | Jika login internal diwajibkan, perlu layar tambahan. |
| ASM-003 | Label status mengikuti domain yang sudah divalidasi di API: new, reviewed, assigned, accepted, in_progress, completed, reopened, closed, rejected. | Harus konsisten dengan API contract. | Validasi wording final di UI copy. | Jika istilah berubah, label dan filter harus disesuaikan. |
| ASM-004 | Dashboard manajer fasilitas menggunakan ringkasan minimum yang sudah disebut di requirement, tanpa analitik lanjutan. | Dashboard lanjutan masih di luar scope. | Validasi metrik minimum dashboard. | Jika dashboard butuh KPI tambahan, layout akan bertambah kompleks. |
| ASM-005 | Lampiran foto ditampilkan sebagai thumbnail dan dapat dibuka penuh dari detail laporan. | Sesuai pola object storage dan kebutuhan visual laporan. | Validasi perilaku preview file. | Jika file viewer tidak didukung, attachment harus diganti daftar tautan. |

## 3. Inventaris Halaman
| Page ID | Nama Halaman | Tujuan | Pengguna | Requirement/User Story | Viewport | Status |
|---|---|---|---|---|---|---|
| PG-001 | Session Required / Access Gate | Mengarahkan pengguna ke sesi yang valid atau menampilkan akses ditolak. | Semua peran | NFR-001, FR-003, FR-004 | Desktop, Mobile | Pending Validation |
| PG-002 | Beranda Role-Aware | Menampilkan ringkasan dan pintasan berdasarkan peran pengguna. | Pelapor, Administrator, Teknisi, Manajer Fasilitas | US-001, US-002, US-003, US-004, US-005 | Desktop, Mobile | Draft |
| PG-003 | Daftar Laporan | Menelusuri, memfilter, dan membuka laporan. | Pelapor, Administrator, Teknisi | FR-003, FR-004, BR-002, BR-003, BR-004 | Desktop, Mobile | Draft |
| PG-004 | Detail Laporan | Melihat detail lengkap, histori, komentar, lampiran, dan aksi yang diizinkan. | Pelapor, Administrator, Teknisi | FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012 | Desktop, Mobile | Draft |
| PG-005 | Buat Laporan Baru | Mengisi form laporan dan mengirim laporan baru. | Pelapor | FR-001, FR-002 | Desktop, Mobile | Draft |
| PG-006 | Dashboard Manajer Fasilitas | Melihat ringkasan statistik operasional. | Manajer Fasilitas | FR-013 | Desktop, Mobile | Pending Validation |

## 4. User Flow
| Flow ID | Nama Flow | Entry Point | Langkah | Exit/Outcome | Alternate/Failure Path |
|---|---|---|---|---|---|
| FL-001 | Pelapor membuat laporan | PG-002 atau PG-003 | Pilih "Buat Laporan Baru" -> isi form -> upload foto opsional -> kirim -> lihat konfirmasi sukses | Laporan tersimpan dengan status new | Validasi field gagal, upload gagal, permission denied |
| FL-002 | Administrator memeriksa dan menugaskan laporan | PG-003 atau PG-004 | Buka laporan new -> cek isi -> tetapkan kategori dan prioritas -> pilih teknisi -> simpan assignment | Status menjadi reviewed lalu assigned | Laporan tidak valid, assignment conflict, role denied |
| FL-003 | Teknisi memperbarui status pekerjaan | PG-002 atau PG-004 | Buka tugas -> terima -> update in_progress -> selesai atau reject | Status berubah sampai completed atau rejected | Invalid transition, missing reason, stale data |
| FL-004 | Pelapor meninjau hasil dan berinteraksi | PG-004 | Baca detail -> tambah komentar -> lihat history -> konfirmasi hasil | Komentar tersimpan dan histori terlihat | Akses ditolak, data tidak ditemukan |
| FL-005 | Manajer Fasilitas memantau dashboard | PG-002 atau PG-006 | Buka dashboard -> pilih range waktu -> baca metrik dan tren | Ringkasan operasional terlihat | Data kosong, dashboard minimum belum disepakati |

## 5. Wireframe Setiap Halaman
### PG-001 - Session Required / Access Gate
- Wireframe ID: WF-001
- Tujuan: Mengarahkan pengguna ke sesi yang valid dan mencegah akses ke data tanpa otorisasi.
- Hierarki dan region layout: Header kecil branding sistem, panel utama dengan pesan status sesi, aksi utama untuk masuk/lanjutkan sesi, aksi sekunder untuk kembali atau coba lagi.
- Konten utama: Judul status, penjelasan singkat mengapa akses dibatasi, tombol lanjut ke sesi, tautan bantuan.
- Aksi utama dan sekunder: `Lanjutkan ke Sesi` atau `Coba Lagi`; `Kembali`.
- Navigasi: Jika session valid, lanjut ke PG-002; jika tidak, tetap pada gate dengan pesan error aman.
- State yang dicakup: Normal, loading, permission denied, session expired, error jaringan.
- Catatan responsif: Pada mobile, seluruh konten menjadi satu kolom dengan tombol aksi menempel di bawah.
- Requirement terkait: NFR-001, FR-003, FR-004.

### PG-002 - Beranda Role-Aware
- Wireframe ID: WF-002
- Tujuan: Memberi titik masuk cepat ke tindakan paling penting sesuai peran.
- Hierarki dan region layout: Top app bar, greeting ringkas, hero summary card, quick actions, daftar tugas/laporan terdekat, panel status.
- Konten utama: Ringkasan jumlah laporan relevan, kartu pintas berdasarkan peran, update terbaru, dan status tugas/priority.
- Aksi utama dan sekunder: `Buat Laporan Baru`, `Lihat Daftar Laporan`, `Buka Dashboard`, `Lihat Tugas Saya`; sekunder `Refresh`.
- Navigasi: Role-specific CTA membawa ke PG-003, PG-005, atau PG-006.
- State yang dicakup: Normal, loading, empty, error, permission-based variant.
- Catatan responsif: Pada mobile, quick actions ditampilkan sebagai grid 2 kolom; kartu ringkasan ditumpuk vertikal.
- Requirement terkait: US-001 sampai US-005, FR-013.

### PG-003 - Daftar Laporan
- Wireframe ID: WF-003
- Tujuan: Menemukan laporan dengan cepat melalui pencarian, filter, dan status.
- Hierarki dan region layout: Search bar, filter chips, toolbar aksi, daftar tabel/card, pagination, empty state.
- Konten utama: Nomor laporan, judul/issue type, lokasi, kategori, prioritas, status, tanggal, assignee ringkas.
- Aksi utama dan sekunder: `Buka Detail`; `Buat Laporan Baru` untuk Pelapor; `Reset Filter`.
- Navigasi: Klik baris membuka PG-004; action create membuka PG-005.
- State yang dicakup: Normal, loading, empty, no results, error, permission denied.
- Catatan responsif: Desktop memakai tabel 1 baris per laporan; mobile memakai kartu laporan dengan 3-4 field terpenting.
- Requirement terkait: FR-003, FR-004, BR-002, BR-003, BR-004.

### PG-004 - Detail Laporan
- Wireframe ID: WF-004
- Tujuan: Menampilkan semua informasi yang dibutuhkan untuk menindaklanjuti satu laporan.
- Hierarki dan region layout: Header detail dengan report number, status badge, priority, assignee; kolom utama timeline dan komentar; rail aksi kontekstual; panel lampiran dan metadata.
- Konten utama: Data pelapor, lokasi, issue type, kategori, status, prioritas, technician, history timeline, comments thread, attachment thumbnails.
- Aksi utama dan sekunder: `Tambah Komentar`, `Ubah Status`, `Tugaskan Teknisi`, `Tutup Laporan`, `Buka Kembali`, `Kembali ke Daftar`.
- Navigasi: Kembali ke PG-003; action create comment atau assign membuka modal/side sheet di halaman yang sama.
- State yang dicakup: Normal, loading, empty history, empty comments, upload in progress, validation error, permission denied, stale state.
- Catatan responsif: Desktop memakai layout 2 kolom; mobile memindahkan rail aksi ke bottom sheet dan menumpuk timeline di bawah metadata.
- Requirement terkait: FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012.

### PG-005 - Buat Laporan Baru
- Wireframe ID: WF-005
- Tujuan: Memudahkan Pelapor mengirim laporan baru dengan field minimum yang jelas.
- Hierarki dan region layout: Step header, form section, attachment uploader, submit area, help text.
- Konten utama: Location, issue type, description, file upload, preview attachment, validasi inline.
- Aksi utama dan sekunder: `Kirim Laporan`; `Simpan Draft` [ASUMSI]; `Batal`.
- Navigasi: Submit sukses mengarah ke PG-004 laporan baru; batal kembali ke PG-003 atau PG-002.
- State yang dicakup: Normal, field error, upload progress, submit loading, submit success, submit error, disabled.
- Catatan responsif: Pada mobile, attachment uploader berada setelah field wajib dan tombol submit sticky di bawah.
- Requirement terkait: FR-001, FR-002.

### PG-006 - Dashboard Manajer Fasilitas
- Wireframe ID: WF-006
- Tujuan: Memberikan ringkasan operasional tingkat tinggi.
- Hierarki dan region layout: Time range selector, metric cards, bar/donut charts, resolution time card, recent trends, empty state.
- Konten utama: Jumlah laporan per status, per kategori, per prioritas, rata-rata waktu penyelesaian.
- Aksi utama dan sekunder: `Ganti Rentang Waktu`, `Muat Ulang`, `Buka Detail Laporan`.
- Navigasi: Klik metrik atau item membuka PG-004 atau PG-003 yang sudah difilter.
- State yang dicakup: Normal, loading, empty data, partial data, error, pending validation copy.
- Catatan responsif: Pada mobile, chart disusun vertikal dan metric cards menjadi carousel ringan atau stack.
- Requirement terkait: FR-013.

## 6. Design System
### 6.1 Warna
| Token | Peran Semantik | Nilai | Kontras/Accessibility | Penggunaan |
|---|---|---|---|---|
| color-bg | Latar utama | #F8FAFC | Aman untuk teks gelap | Background halaman |
| color-surface | Permukaan kartu | #FFFFFF | AA untuk teks gelap | Card, panel, modal |
| color-border | Garis pemisah | #D7DEE8 | Tidak dipakai sebagai satu-satunya indikator | Divider dan border input |
| color-text-primary | Teks utama | #0F172A | Target AA/AAA di atas surface | Heading, body utama |
| color-text-secondary | Teks pendukung | #475569 | Target AA di atas surface | Label, hint, metadata |
| color-brand-primary | Aksi utama | #0F766E | AA dengan teks putih | Tombol utama, status fokus utama |
| color-brand-hover | Hover aksi utama | #115E59 | AA dengan teks putih | Hover primary button |
| color-accent | Sorotan operasional | #D97706 | AA dengan teks gelap | Prioritas tinggi, badge penting |
| color-success | Sukses | #16A34A | AA dengan teks putih | Completed, success toast |
| color-warning | Peringatan | #B45309 | AA dengan teks putih | Pending, attention badge |
| color-danger | Error / rejected | #DC2626 | AA dengan teks putih | Validation error, rejected, destructive action |
| color-info | Informasi | #2563EB | AA dengan teks putih | Info banner, links, state active |

### 6.2 Tipografi
| Token | Font | Ukuran | Weight | Line Height | Penggunaan |
|---|---|---|---|---|---|
| type-display | Space Grotesk | 40-56px | 600 | 1.05-1.15 | Judul halaman dan hero summary |
| type-heading | Space Grotesk | 20-28px | 600 | 1.15-1.25 | Section title, card title |
| type-body | IBM Plex Sans | 14-16px | 400-500 | 1.45-1.6 | Konten utama, form label, body text |
| type-caption | IBM Plex Sans | 12-13px | 400 | 1.4 | Hint, metadata, helper text |
| type-mono | IBM Plex Mono | 12-13px | 400 | 1.4 | Report number, timestamps, code-like tokens |

### 6.3 Foundation Lain
| Token ID | Kategori | Token | Nilai | Aturan Penggunaan |
|---|---|---|---|---|
| DS-001 | Spacing | space-1..space-8 | 4, 8, 12, 16, 20, 24, 32, 48 | Gunakan 8pt grid sebagai dasar; spacing kecil untuk form, besar untuk section. |
| DS-002 | Radius | radius-sm/md/lg | 8 / 12 / 16px | Kartu dan input memakai radius medium; modal dan dashboard cards memakai radius large. |
| DS-003 | Shadow | shadow-sm/md/lg | Elevation ringan-sedang | Shadow hanya untuk hierarchy, bukan dekorasi. |
| DS-004 | Border | border-standard | 1px solid color-border | Dipakai pada card, input, table row, dan divider. |
| DS-005 | Motion | motion-fast/standard | 120ms / 180ms | Hover, focus, fade, drawer, dan modal harus singkat dan tidak mengganggu. |
| DS-006 | Layout | grid-desktop/mobile | 12 kolom / 4 kolom | Desktop untuk tabel dan detail 2 kolom; mobile untuk stack satu kolom. |

### 6.4 Komponen
| Component ID | Komponen | Variant/Size | State | Behavior | Accessibility | Penggunaan |
|---|---|---|---|---|---|---|
| CMP-001 | Top App Bar | Default / Compact | Normal, scrolled, mobile | Menampilkan judul halaman, role badge, avatar/session, dan quick actions | Fokus keyboard urut, tombol dapat diakses | PG-002, PG-003, PG-004, PG-006 |
| CMP-002 | Status Badge | New/Reviewed/Assigned/Accepted/In Progress/Completed/Reopened/Closed/Rejected | Default, active, muted | Menandai status dengan teks dan warna semantik | Tidak bergantung warna saja; selalu ada label teks | PG-002, PG-003, PG-004, PG-006 |
| CMP-003 | Metric Card | Standard | Normal, loading, empty | Menampilkan angka ringkas dan trend kecil | Heading dan angka terbaca jelas; kontras tinggi | PG-002, PG-006 |
| CMP-004 | Report Row / Report Card | Table/Card | Hover, selected, empty, loading | Membuka detail laporan saat diklik | Row/card punya fokus visible dan area klik besar | PG-003 |
| CMP-005 | Filter Bar | Desktop / Stack | Normal, expanded, reset | Filter status, kategori, prioritas, tanggal, dan search | Label jelas; chip dapat dioperasikan keyboard | PG-003, PG-006 |
| CMP-006 | Timeline Item | Default | Normal, latest, muted | Menunjukkan perubahan status kronologis | Urutan kronologis diumumkan secara semantik | PG-004 |
| CMP-007 | Comment Thread | Standard | Normal, empty, loading | Menampilkan komentar dan composer | Text area memiliki label dan hint | PG-004 |
| CMP-008 | Attachment Uploader | Dropzone / List | Normal, uploading, error, disabled | Upload file foto dan tampilkan thumbnail | Mendukung keyboard upload; status upload diumumkan | PG-004, PG-005 |
| CMP-009 | Form Field Group | Text / Select / Textarea | Normal, error, disabled | Label, help text, dan inline validation | Error terasosiasi dengan field | PG-005 |
| CMP-010 | Action Drawer / Bottom Sheet | Desktop drawer / mobile sheet | Open, closed, loading | Menampilkan aksi kontekstual seperti assign, status update, close/reopen | Fokus trap saat open | PG-004 |
| CMP-011 | Empty State | Default | Empty, no-results, no-data | Menjelaskan kondisi kosong dan memberi CTA | Teks informatif, CTA jelas | PG-003, PG-004, PG-006 |
| CMP-012 | Toast / Banner | Info / success / error | Visible, dismissible | Memberi feedback sukses atau gagal | Pesan ringkas dan tidak bergantung warna | Semua halaman |

## 7. Mockup High-Fidelity
| Mockup ID | Page ID | Viewport | State | Design System Terkait | Link/Lokasi | Status |
|---|---|---|---|---|---|---|
| MOCK-001 | PG-002 | Desktop 1440 | Normal | DS-001..DS-006, CMP-001..CMP-003, CMP-012 | [role_aware_home_mockup_1783078634109.jpg](file:///d:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/images/role_aware_home_mockup_1783078634109.jpg) | Completed |
| MOCK-002 | PG-003 | Desktop 1440 | Normal, no-results | DS-001..DS-006, CMP-001, CMP-002, CMP-004, CMP-005, CMP-011 | [report_list_mockup_1783078646020.jpg](file:///d:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/images/report_list_mockup_1783078646020.jpg) | Completed |
| MOCK-003 | PG-004 | Desktop 1440 | Normal, loading, permission denied | DS-001..DS-006, CMP-001, CMP-002, CMP-006..CMP-010, CMP-012 | [report_detail_mockup_1783078657691.jpg](file:///d:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/images/report_detail_mockup_1783078657691.jpg) | Completed |
| MOCK-004 | PG-005 | Mobile 390 | Validation error, upload progress | DS-001..DS-006, CMP-008, CMP-009, CMP-012 | [create_report_mobile_mockup_1783078667162.jpg](file:///d:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/images/create_report_mobile_mockup_1783078667162.jpg) | Completed |
| MOCK-005 | PG-006 | Desktop 1440 | Normal, empty | DS-001..DS-006, CMP-001..CMP-003, CMP-011, CMP-012 | [facility_manager_dashboard_mockup_1783078679325.jpg](file:///d:/queen/sem8/finance-ai-frontend/campus-maintenance/docs/design/images/facility_manager_dashboard_mockup_1783078679325.jpg) | Validated |

## 8. Prototype Interaktif
| Prototype ID | Flow ID | Dari | Trigger | Aksi/Transition | Tujuan | Expected Result |
|---|---|---|---|---|---|---|
| PR-001 | FL-001 | PG-002 | Klik `Buat Laporan Baru` | Navigasi ke PG-005 | Memulai pembuatan laporan | Form kosong tampil dengan helper text |
| PR-002 | FL-001 | PG-005 | Klik `Kirim Laporan` | Validasi lalu submit ke PG-004 | Menguji happy path pengiriman laporan | Muncul success state dan detail laporan baru |
| PR-003 | FL-002 | PG-003/PG-004 | Klik laporan dan `Tugaskan Teknisi` | Buka action drawer lalu simpan | Menjalankan triase dan assignment | Status berubah, assignee tampil, toast sukses |
| PR-004 | FL-003 | PG-004 | Klik `Ubah Status` | Buka sheet status lalu submit | Mengubah progres kerja | History bertambah dan badge status update |
| PR-005 | FL-004 | PG-004 | Klik `Tambah Komentar` | Composer inline/expanded lalu kirim | Menambah catatan pada laporan | Komentar muncul di thread dan timestamp tampil |
| PR-006 | FL-005 | PG-002/PG-006 | Pilih rentang waktu dashboard | Refresh chart dan metric card | Memantau statistik operasional | Angka dashboard menyesuaikan filter |

## 9. Spesifikasi Handoff
| Spec ID | Page/Component | Properti atau Behavior | Nilai/Aturan | Token/Aset | Catatan Implementasi |
|---|---|---|---|---|---|
| HND-001 | PG-003 / CMP-005 | Filter status | Multi-select chip; default kosong berarti semua status | DS-001, DS-004, CMP-002 | Sinkron dengan API query parameter. |
| HND-002 | PG-004 / CMP-010 | Action drawer | Desktop = right drawer, mobile = bottom sheet | DS-002, DS-005 | Focus trap wajib saat open. |
| HND-003 | PG-004 / CMP-006 | Timeline order | Urut descending berdasarkan changed_at terbaru | DS-001, DS-004 | Item terbaru paling atas, latest badge. |
| HND-004 | PG-005 / CMP-008 | Upload lampiran | Hanya image; tampilkan progress dan thumbnail | DS-003, DS-005 | Non-image harus ditolak di UI sebelum request. |
| HND-005 | PG-006 / CMP-003 | Metric card | Menampilkan label, value, dan delta kecil jika ada | DS-001, DS-003 | Jika data kosong, gunakan empty copy aman. |
| HND-006 | Semua | Notifikasi | Toast success/error harus muncul kurang dari 2 detik setelah aksi | DS-005, CMP-012 | Jangan bergantung pada warna saja. |
| HND-007 | PG-001 | Access gate | Tampilkan pesan aman, tanpa bocor detail auth | DS-001, CMP-012 | Gunakan CTA yang jelas untuk lanjut sesi. |
| HND-008 | PG-002 | Quick actions | Action berbeda per role, tidak menampilkan CTA yang tidak relevan | DS-001, CMP-001, CMP-002 | Rendering harus role-aware dari session. |

## 10. Traceability Matrix
| Requirement/User Story | Page ID | Wireframe ID | Mockup ID | Prototype ID | Component ID | Status |
|---|---|---|---|---|---|---|
| FR-001, FR-002 / US-001 | PG-005 | WF-005 | MOCK-004 | PR-001, PR-002 | CMP-008, CMP-009, CMP-012 | Draft |
| FR-003, FR-004 / US-002 | PG-003, PG-004 | WF-003, WF-004 | MOCK-002, MOCK-003 | PR-003, PR-005 | CMP-002, CMP-004, CMP-005, CMP-006, CMP-007, CMP-010 | Draft |
| FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011 / US-003, US-004 | PG-004 | WF-004 | MOCK-003 | PR-003, PR-004, PR-005 | CMP-002, CMP-006, CMP-007, CMP-010, CMP-012 | Draft |
| FR-013 / US-005 | PG-006 | WF-006 | MOCK-005 | PR-006 | CMP-001, CMP-003, CMP-005, CMP-011, CMP-012 | Pending Validation |
| NFR-001, FR-003, FR-004 | PG-001, PG-003, PG-004 | WF-001, WF-003, WF-004 | MOCK-001, MOCK-002, MOCK-003 | PR-001, PR-003 | CMP-001, CMP-012 | Draft |
| NFR-004, NFR-005 | PG-003, PG-004, PG-006 | WF-003, WF-004, WF-006 | MOCK-002, MOCK-003, MOCK-005 | PR-003, PR-004, PR-006 | CMP-002, CMP-003, CMP-006, CMP-011 | Pending Validation |

## 11. Gap, Konflik, dan Pertanyaan Terbuka
### Gap
- Identity provider final belum ditetapkan, jadi layar session gate hanya bisa ditentukan sampai level perilaku.
- Copy label status final harus tetap selaras dengan API enum dan business rules.
- Metrik minimum dashboard manajer fasilitas masih pending validation.
- Batas ukuran file dan perilaku preview lampiran belum final.
- Asset brand atau logo spesifik belum tersedia.

### Konflik
- Tidak ada konflik eksplisit antar sumber desain.
- Ada ketegangan scope antara dashboard ringkas dan kebutuhan analytics lanjutan, tetapi analytics lanjutan berada di luar scope.

### Pertanyaan Terbuka
- Apakah pengguna diarahkan ke identity provider eksternal atau ada session login internal?
- Apakah PG-001 perlu tombol login formal atau hanya interstitial redirect?
- Metrik minimum apa yang wajib muncul di dashboard awal?
- Apakah mobile harus menampilkan tabel daftar laporan atau full card list saja?
- Apakah aksi `Simpan Draft` pada PG-005 benar-benar diinginkan atau perlu ditarik dari scope?

## 12. Quality Check Result
| Check | Result | Temuan/Bukti | Tindakan |
|---|---|---|---|
| Lengkap | Lulus | Semua halaman utama, wireframe, design system, prototype, dan traceability tercakup. | Tidak ada. |
| Konsisten | Lulus | Warna, tipografi, komponen, dan layout mengikuti sistem yang sama di seluruh halaman. | Review saat implementasi visual. |
| Tidak ambigu | Lulus | Setiap halaman punya tujuan, state, dan aksi yang jelas. | Tidak ada. |
| Dapat divalidasi | Lulus | Setiap prototype punya trigger dan expected result. | Uji alur dengan stakeholder. |
| Traceable | Lulus | Requirement dan user story terhubung ke page, wireframe, mockup, prototype, dan komponen. | Tidak ada. |
| Memiliki business value | Lulus | Fokus pada pelaporan, triase, penugasan, dan monitoring. | Tidak ada. |
| Usable | Lulus | Hierarki informasi, feedback, dan recovery didefinisikan. | Finalisasi microcopy saat implementasi. |
| Accessible | Lulus | Fokus, label, target interaksi, dan kontras dipertimbangkan. | Uji kontras dan keyboard flow. |
| Responsif | Lulus | Desktop, tablet, dan mobile memiliki aturan layout. | Validasi pada viewport aktual. |
| Siap handoff | Lulus | Token, komponen, behavior, dan catatan implementasi terdokumentasi. | Tidak ada. |
| Tervalidasi | Parsial | PG-001, PG-006, dan beberapa copy/behavior masih bergantung pada keputusan stakeholder. | Validation spike sebelum final mockup. |

