---
name: 06-ui-design
description: Panduan untuk merancang, mendokumentasikan, meninjau, dan memvalidasi UI perangkat lunak yang mencakup wireframe setiap halaman, mockup high-fidelity, prototype interaktif, serta design system berupa warna, tipografi, komponen, state, dan aturan penggunaan. Gunakan ketika Codex perlu menerjemahkan requirement, user flow, atau kebutuhan pengguna menjadi artefak UI yang konsisten, responsif, mudah digunakan, dapat diakses, dan dapat ditelusuri.
---

# 06 UI Design

## Purpose
Gunakan skill ini untuk menghasilkan rancangan UI perangkat lunak yang lengkap, konsisten, dapat divalidasi, dan siap menjadi acuan implementasi.

Skill ini menyelesaikan masalah desain yang hanya menggambarkan sebagian halaman, tidak memiliki state penting, tidak konsisten antarhalaman, tidak terhubung ke requirement, atau belum memiliki prototype dan design system yang memadai.

## When to Use
Gunakan skill ini ketika pengguna meminta bantuan untuk:

- Membuat wireframe untuk setiap halaman atau layar.
- Membuat mockup high-fidelity.
- Membuat prototype interaktif dan alur navigasi.
- Menyusun atau memperbarui design system.
- Menerjemahkan requirement, user story, dan user flow menjadi desain UI.
- Merancang state normal, kosong, loading, error, sukses, disabled, dan permission denied.
- Memvalidasi konsistensi, usability, accessibility, responsiveness, dan traceability desain.
- Menyiapkan spesifikasi desain untuk handoff ke developer.

Jangan gunakan skill ini untuk menetapkan requirement bisnis yang belum divalidasi atau mengubah desain menjadi implementasi produksi tanpa persetujuan pengguna.

## Inputs
Informasi berikut harus tersedia sebelum skill dijalankan:

- Nama produk, modul, fitur, atau platform.
- Tujuan bisnis dan masalah pengguna.
- Target pengguna, persona, atau peran pengguna.
- Functional requirements, non-functional requirements, user stories, dan acceptance criteria yang relevan.
- Daftar halaman atau user flow, jika tersedia.
- Konten utama, data, aksi, dan prioritas informasi pada setiap halaman.
- Platform target, ukuran viewport, dan kebutuhan responsif.
- Identitas merek, logo, warna, font, atau design system yang sudah ada.
- Kebutuhan accessibility, bahasa, lokalisasi, privasi, keamanan, dan compliance.
- Batasan teknis dan komponen frontend yang tersedia.
- Referensi visual atau produk pembanding, jika tersedia.

Jika input penting tidak tersedia, buat daftar gap dan minta klarifikasi sebelum menghasilkan desain final.

## Required Context
Baca konteks proyek yang relevan sebelum merancang UI:

- Product brief, problem statement, dan tujuan bisnis.
- Dokumen elicitation dan specification.
- User story, acceptance criteria, backlog, dan prioritas fitur.
- Sitemap, information architecture, user flow, dan diagram proses.
- Wireframe, mockup, prototype, atau design system yang sudah ada.
- Panduan merek, aset visual, gaya bahasa, dan konten produk.
- Struktur data, API, permission, validasi, dan batasan teknis yang memengaruhi UI.
- Hasil user research, analytics, usability testing, dan feedback pengguna.
- Standar accessibility dan target perangkat/browser yang disepakati.

Gunakan hanya fakta dari konteks. Tandai inferensi sebagai asumsi dan jangan mengarang konten, alur, metrik, atau identitas visual.

## Workflow
1. Tetapkan tujuan dan cakupan desain.
   - Identifikasi tujuan bisnis, kebutuhan pengguna, platform, dan ukuran viewport.
   - Definisikan halaman yang termasuk dan tidak termasuk.
   - Hubungkan scope dengan requirement dan user story.

2. Petakan information architecture dan user flow.
   - Buat inventaris halaman dengan ID `PG-001`, `PG-002`, dan seterusnya.
   - Jelaskan entry point, tujuan halaman, aksi utama, jalur sukses, jalur gagal, dan exit point.
   - Tandai halaman atau transisi yang belum terdefinisi.

3. Susun wireframe setiap halaman.
   - Gunakan ID `WF-001`, `WF-002`, dan seterusnya.
   - Tentukan hierarki informasi, region layout, navigasi, konten, form, aksi utama, dan aksi sekunder.
   - Sertakan state normal, kosong, loading, error, sukses, disabled, dan permission-based bila relevan.
   - Sediakan versi viewport yang diperlukan tanpa menentukan dekorasi visual final terlalu dini.

4. Validasi wireframe.
   - Periksa cakupan halaman, kelengkapan alur, label, prioritas aksi, dan kesesuaian dengan requirement.
   - Selesaikan konflik atau minta klarifikasi sebelum membuat high-fidelity mockup.

5. Susun design system.
   - Gunakan design token untuk warna, tipografi, spacing, radius, border, elevation, dan motion.
   - Dokumentasikan komponen, variant, size, state, behavior, accessibility, dan aturan penggunaan.
   - Bedakan semantic token dari nilai warna mentah.
   - Gunakan ID `DS-001` untuk keputusan sistem dan `CMP-001` untuk komponen.

6. Buat mockup high-fidelity.
   - Gunakan ID `MOCK-001`, `MOCK-002`, dan seterusnya.
   - Terapkan design system secara konsisten pada semua halaman dan state.
   - Gunakan konten realistis dari sumber yang tersedia; tandai placeholder.
   - Pastikan desain responsif, mudah dipindai, dan tidak memiliki overlap atau teks terpotong.

7. Buat prototype interaktif.
   - Gunakan ID `PR-001`, `PR-002`, dan seterusnya.
   - Hubungkan hotspot, navigasi, form, modal, feedback, validasi, dan error recovery.
   - Sertakan happy path, alternate path, dan failure path yang kritis.
   - Definisikan trigger, aksi, destination, transition, dan expected result.

8. Siapkan traceability dan handoff.
   - Hubungkan requirement, user story, halaman, wireframe, mockup, prototype, dan komponen.
   - Dokumentasikan ukuran, behavior, token, aset, konten, dan keputusan desain yang dibutuhkan developer.

9. Lakukan quality checks.
   - Periksa kelengkapan, konsistensi, usability, accessibility, responsiveness, testability, traceability, dan business value.
   - Catat temuan, severity, bukti, rekomendasi, dan status validasi.

10. Hentikan jika informasi tidak mencukupi.
   - Jangan memfinalkan desain jika tujuan, flow, konten, state kritis, atau requirement utama belum dapat divalidasi.
   - Ajukan pertanyaan klarifikasi yang spesifik.

## Output Format
Hasilkan output dengan struktur berikut:

```markdown
# UI Design Specification: <Nama Produk/Fitur>

## 1. Ringkasan
- Nama produk/fitur:
- Tujuan bisnis:
- Target pengguna:
- Platform dan viewport:
- Ruang lingkup:
- Di luar ruang lingkup:

## 2. Konteks dan Asumsi
### 2.1 Sumber yang Ditinjau
| Source ID | Sumber | Ringkasan | Relevansi |
|---|---|---|---|

### 2.2 Asumsi
| Assumption ID | Asumsi | Alasan | Validasi yang Dibutuhkan | Risiko Jika Salah |
|---|---|---|---|---|

## 3. Inventaris Halaman
| Page ID | Nama Halaman | Tujuan | Pengguna | Requirement/User Story | Viewport | Status |
|---|---|---|---|---|---|---|

## 4. User Flow
| Flow ID | Nama Flow | Entry Point | Langkah | Exit/Outcome | Alternate/Failure Path |
|---|---|---|---|---|---|

## 5. Wireframe Setiap Halaman
### <Page ID> - <Nama Halaman>
- Wireframe ID:
- Tujuan:
- Hierarki dan region layout:
- Konten utama:
- Aksi utama dan sekunder:
- Navigasi:
- State yang dicakup:
- Catatan responsif:
- Requirement terkait:

## 6. Design System
### 6.1 Warna
| Token | Peran Semantik | Nilai | Kontras/Accessibility | Penggunaan |
|---|---|---|---|---|

### 6.2 Tipografi
| Token | Font | Ukuran | Weight | Line Height | Penggunaan |
|---|---|---|---|---|---|

### 6.3 Foundation Lain
| Token ID | Kategori | Token | Nilai | Aturan Penggunaan |
|---|---|---|---|---|

### 6.4 Komponen
| Component ID | Komponen | Variant/Size | State | Behavior | Accessibility | Penggunaan |
|---|---|---|---|---|---|---|

## 7. Mockup High-Fidelity
| Mockup ID | Page ID | Viewport | State | Design System Terkait | Link/Lokasi | Status |
|---|---|---|---|---|---|---|

## 8. Prototype Interaktif
| Prototype ID | Flow ID | Dari | Trigger | Aksi/Transition | Tujuan | Expected Result |
|---|---|---|---|---|---|---|

## 9. Spesifikasi Handoff
| Spec ID | Page/Component | Properti atau Behavior | Nilai/Aturan | Token/Aset | Catatan Implementasi |
|---|---|---|---|---|---|

## 10. Traceability Matrix
| Requirement/User Story | Page ID | Wireframe ID | Mockup ID | Prototype ID | Component ID | Status |
|---|---|---|---|---|---|---|

## 11. Gap, Konflik, dan Pertanyaan Terbuka
### Gap
-

### Konflik
-

### Pertanyaan Terbuka
-

## 12. Quality Check Result
| Check | Result | Temuan/Bukti | Tindakan |
|---|---|---|---|
```

Jika alat desain tersedia, hasilkan atau perbarui artefak visual yang diminta dan cantumkan lokasi atau tautannya pada tabel terkait. Jika alat tidak tersedia, hasilkan spesifikasi tekstual yang cukup presisi untuk direalisasikan tanpa mengklaim bahwa file visual telah dibuat.

## Rules
- Jangan membuat fakta, requirement, konten, aset merek, atau hasil riset yang tidak diberikan.
- Tandai semua asumsi secara eksplisit dengan ID `ASM-001`, `ASM-002`, dan seterusnya.
- Gunakan ID yang stabil untuk sumber, flow, halaman, wireframe, mockup, prototype, design system, komponen, dan temuan.
- Buat wireframe untuk setiap halaman dalam scope, bukan hanya happy path.
- Pisahkan wireframe low-fidelity, mockup high-fidelity, prototype interaktif, dan design system.
- Jangan menggunakan kata ambigu seperti modern, menarik, intuitif, mudah, cepat, bersih, atau responsif tanpa kriteria yang dapat dinilai.
- Jangan menghasilkan keputusan desain yang tidak dapat ditelusuri ke kebutuhan pengguna, requirement, prinsip usability, accessibility, atau batasan proyek.
- Jangan mengklaim prototype interaktif jika hanya menghasilkan gambar statis.
- Gunakan komponen dan token yang konsisten; jangan membuat variasi baru tanpa alasan dan dokumentasi.
- Definisikan state komponen dan halaman yang relevan, termasuk focus, hover, active, disabled, loading, error, empty, dan success.
- Pastikan warna bukan satu-satunya pembeda informasi atau status.
- Pastikan urutan fokus, label, target interaksi, kontras, dan penggunaan keyboard dapat divalidasi.
- Gunakan konten realistis dari sumber. Tandai teks atau data sementara sebagai placeholder.
- Dokumentasikan perbedaan desktop, tablet, dan mobile jika platform tersebut termasuk scope.
- Jangan memaksakan pola visual yang bertentangan dengan design system atau konvensi produk yang telah disepakati.
- Jangan memfinalkan high-fidelity mockup sebelum struktur halaman dan alur utama tervalidasi.

## Quality Checks
Sebelum finalisasi, periksa apakah output:

- Lengkap: setiap halaman dalam scope memiliki wireframe, state relevan, dan kaitan ke flow.
- Konsisten: warna, tipografi, spacing, komponen, label, navigasi, dan behavior mengikuti design system.
- Tidak ambigu: layout, state, aksi, transisi, breakpoint, dan behavior memiliki definisi yang jelas.
- Dapat divalidasi: interaksi memiliki trigger dan expected result; keputusan desain memiliki kriteria pemeriksaan.
- Traceable: requirement dan user story terhubung ke halaman, wireframe, mockup, prototype, dan komponen.
- Memiliki business value: setiap halaman dan aksi utama mendukung tujuan pengguna atau tujuan bisnis.
- Usable: hierarki informasi, navigasi, feedback, pencegahan error, dan recovery jelas.
- Accessible: kontras, keyboard, focus, label, semantic structure, dan target interaksi telah dipertimbangkan.
- Responsif: konten tidak terpotong, overlap, atau kehilangan fungsi pada viewport target.
- Siap handoff: token, komponen, state, behavior, aset, ukuran, dan keputusan penting terdokumentasi.
- Tervalidasi: status setiap artefak jelas, seperti `Draft`, `Pending Validation`, `Validated`, `Assumption`, atau `Blocked`.

## Failure Conditions
Skill harus berhenti atau meminta klarifikasi jika:

- Tujuan bisnis atau masalah pengguna tidak tersedia.
- Target pengguna atau platform tidak diketahui.
- Daftar halaman dan user flow utama tidak dapat diturunkan dari konteks.
- Requirement atau acceptance criteria penting saling bertentangan.
- Konten, data, permission, atau state kritis tidak dapat ditentukan.
- Identitas visual wajib disebutkan tetapi aset atau panduannya tidak tersedia.
- Kebutuhan responsif atau accessibility wajib tidak dapat divalidasi.
- Prototype membutuhkan tujuan transisi yang belum didefinisikan.
- Pengguna meminta artefak visual aktual tetapi alat atau format keluaran yang diperlukan tidak tersedia.

Saat berhenti, berikan:

- Artefak atau halaman yang terblokir.
- Informasi yang kurang atau bertentangan.
- Dampaknya terhadap desain.
- Pertanyaan klarifikasi yang diperlukan untuk melanjutkan.

## Example Invocation
```text
Gunakan skill software-engineering-ui-design untuk merancang UI fitur pemesanan konsultasi. Buat wireframe setiap halaman, mockup high-fidelity, prototype interaktif, dan design system yang mencakup warna, font, serta komponen. Gunakan requirement dan user story proyek sebagai sumber, buat desain responsif untuk desktop dan mobile, serta tandai asumsi secara eksplisit.
```

## Expected Output Example
```markdown
# UI Design Specification: Pemesanan Konsultasi

## 3. Inventaris Halaman
| Page ID | Nama Halaman | Tujuan | Pengguna | Requirement/User Story | Viewport | Status |
|---|---|---|---|---|---|---|
| PG-001 | Daftar Konsultan | Memilih konsultan yang tersedia | Pelanggan | US-001 | Desktop, Mobile | Pending Validation |
| PG-002 | Pilih Jadwal | Memilih tanggal dan waktu konsultasi | Pelanggan | US-002 | Desktop, Mobile | Pending Validation |

## 5. Wireframe Setiap Halaman
### PG-002 - Pilih Jadwal
- Wireframe ID: WF-002
- Tujuan: Memungkinkan pelanggan memilih satu slot yang tersedia.
- Hierarki dan region layout: Header, ringkasan konsultan, kontrol tanggal, daftar slot, ringkasan pilihan, aksi lanjut.
- Aksi utama dan sekunder: `Lanjutkan`; `Kembali`.
- State yang dicakup: Normal, loading, tanggal tanpa slot, error pemuatan, slot terpilih.
- Catatan responsif: Pada mobile, daftar slot ditampilkan satu kolom dan ringkasan pilihan tetap terlihat sebelum aksi lanjut.
- Requirement terkait: FR-002, US-002.

## 6. Design System
### 6.1 Warna
| Token | Peran Semantik | Nilai | Kontras/Accessibility | Penggunaan |
|---|---|---|---|---|
| color-action-primary | Aksi utama | ASM-001: #176B5B | Perlu diuji minimal WCAG AA terhadap teks putih | Tombol utama dan state terpilih |

### 6.4 Komponen
| Component ID | Komponen | Variant/Size | State | Behavior | Accessibility | Penggunaan |
|---|---|---|---|---|---|---|
| CMP-001 | Time Slot | Default/Compact | Default, hover, focus, selected, disabled | Memilih satu slot dan memperbarui ringkasan | Dapat dioperasikan dengan keyboard; selected state memiliki teks dan indikator visual | PG-002 |

## 7. Mockup High-Fidelity
| Mockup ID | Page ID | Viewport | State | Design System Terkait | Link/Lokasi | Status |
|---|---|---|---|---|---|---|
| MOCK-002 | PG-002 | Mobile | Slot terpilih | CMP-001, color-action-primary | Belum dibuat | Blocked: warna merek belum divalidasi |

## 8. Prototype Interaktif
| Prototype ID | Flow ID | Dari | Trigger | Aksi/Transition | Tujuan | Expected Result |
|---|---|---|---|---|---|---|
| PR-001 | FL-001 | PG-001 | Memilih konsultan | Buka halaman jadwal | PG-002 | Nama konsultan tampil dan slot yang tersedia dimuat |

## 10. Traceability Matrix
| Requirement/User Story | Page ID | Wireframe ID | Mockup ID | Prototype ID | Component ID | Status |
|---|---|---|---|---|---|---|
| US-002 / FR-002 | PG-002 | WF-002 | MOCK-002 | PR-001 | CMP-001 | Pending Validation |

## 12. Quality Check Result
| Check | Result | Temuan/Bukti | Tindakan |
|---|---|---|---|
| Lengkap | Pass | Semua halaman dalam flow utama memiliki wireframe. | Lanjutkan validasi stakeholder. |
| Accessibility | Needs Follow-Up | Nilai warna utama masih asumsi. | Validasi warna merek dan uji kontras. |
| Traceable | Pass | US-002 terhubung ke halaman, wireframe, mockup, prototype, dan komponen. | Tidak ada. |
```
