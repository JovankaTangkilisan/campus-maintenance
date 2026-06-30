---
name: 02-elicitation
description: Panduan untuk melakukan elicitation kebutuhan dalam software engineering. Gunakan saat mengumpulkan, mengklarifikasi, mewawancarai, menganalisis, dan mendokumentasikan kebutuhan stakeholder, termasuk teknik elicitation, pertanyaan wawancara, kebutuhan eksplisit dan implisit, temuan elicitation, functional requirements, non-functional requirements, asumsi, konflik, dan requirement ID yang traceable.
---

# 02-elicitation

## Purpose
Gunakan skill ini untuk melakukan dan mendokumentasikan requirements elicitation dalam pekerjaan software engineering.

Skill ini menyelesaikan masalah kebutuhan yang belum jelas, belum lengkap, ambigu, atau sulit diuji dengan membantu Codex untuk:

- Memilih teknik elicitation yang sesuai.
- Menyusun pertanyaan wawancara untuk stakeholder.
- Membedakan kebutuhan eksplisit dan kebutuhan implisit.
- Mengidentifikasi temuan, asumsi, batasan, risiko, dan pertanyaan terbuka.
- Mengubah hasil elicitation menjadi requirement yang traceable dan dapat diuji.

## When to Use
Gunakan skill ini ketika user meminta Codex untuk mendukung elicitation kebutuhan software, termasuk:

- Merencanakan sesi elicitation.
- Membuat pertanyaan wawancara untuk stakeholder.
- Mengekstrak requirement dari catatan rapat, transkrip, dokumen, tiket, atau user story.
- Memisahkan functional requirements dan non-functional requirements.
- Mengidentifikasi kebutuhan implisit di balik pernyataan stakeholder.
- Menghasilkan temuan elicitation dan requirement ID.
- Meninjau requirement agar jelas, dapat diuji, traceable, dan memiliki business value.

Jangan gunakan skill ini untuk perencanaan implementasi kecuali output elicitation sudah lengkap dan tervalidasi.

## Inputs
Sebelum menjalankan skill ini, kumpulkan sebanyak mungkin informasi berikut:

- Nama proyek atau nama produk.
- Tujuan bisnis atau problem statement.
- Peran dan tanggung jawab stakeholder.
- Target user atau user persona.
- Catatan, dokumen, tiket, user story, transkrip, atau diagram yang sudah ada.
- Business rules, kebijakan, batasan, dan asumsi yang sudah diketahui.
- Konteks sistem saat ini, jika proyek mengganti atau meningkatkan sistem yang sudah ada.
- Kriteria keberhasilan atau hasil yang diharapkan.
- Batasan scope, termasuk yang termasuk scope dan di luar scope.
- Batasan regulasi, keamanan, performa, availability, usability, accessibility, atau integrasi.

Jika input penting belum tersedia, ajukan pertanyaan klarifikasi yang spesifik sebelum menghasilkan requirement final.

## Required Context
Baca semua konteks proyek yang tersedia dan berpotensi berisi maksud stakeholder atau batasan sistem:

- Product brief, problem statement, atau business case.
- Dokumen requirement, user story, acceptance criteria, dan backlog item yang sudah ada.
- Catatan rapat, transkrip wawancara, chat log, support ticket, dan customer feedback.
- Diagram arsitektur, dokumen API, catatan database schema, dan dokumen integrasi sistem.
- UI mockup, wireframe, prototype, atau diagram workflow.
- Requirement compliance, security, privacy, accessibility, service-level, atau operational.

Saat membaca konteks, ekstrak hanya evidence yang relevan dengan requirement. Jangan membuat maksud stakeholder yang tidak didukung oleh material yang diberikan.

## Workflow
1. Identifikasi tujuan elicitation.
   - Tentukan keputusan atau hasil software yang harus didukung oleh elicitation.
   - Identifikasi stakeholder, user, sistem yang terdampak, dan tujuan bisnis.
   - Catat konteks yang belum tersedia sebagai pertanyaan terbuka.

2. Pilih teknik elicitation.
   - Pilih teknik berdasarkan konteks yang tersedia dan akses terhadap stakeholder.
   - Gunakan wawancara untuk memahami tujuan individu, pain point, business rules, dan prioritas.
   - Gunakan workshop untuk alignment lintas fungsi, konflik, process mapping, dan prioritisasi.
   - Gunakan document analysis untuk kebijakan, requirement lama, kontrak, tiket, dan keputusan historis.
   - Gunakan observasi atau contextual inquiry untuk memahami workflow saat ini, workaround, dan masalah usability.
   - Gunakan prototyping ketika stakeholder sulit menjelaskan perilaku sistem secara abstrak.
   - Gunakan survei hanya untuk pengumpulan preferensi secara luas, bukan untuk validasi requirement yang detail.

3. Siapkan pertanyaan elicitation.
   - Buat pertanyaan yang dikelompokkan berdasarkan topik, peran stakeholder, dan tujuan.
   - Sertakan pertanyaan tentang tujuan, workflow saat ini, pain point, data, aturan, exception, integrasi, reporting, security, performance, usability, dan success criteria.
   - Hindari pertanyaan yang mengarahkan stakeholder pada solusi tertentu.
   - Tandai pertanyaan yang membutuhkan follow-up atau validasi.

4. Ekstrak kebutuhan eksplisit dan implisit.
   - Perlakukan kebutuhan eksplisit sebagai pernyataan stakeholder yang didukung langsung oleh evidence.
   - Perlakukan kebutuhan implisit sebagai kebutuhan hasil inferensi dari masalah berulang, batasan, workflow, atau dependency yang tidak dinyatakan langsung.
   - Labeli setiap kebutuhan implisit sebagai asumsi sampai tervalidasi.
   - Hubungkan setiap kebutuhan dengan sumber evidence jika tersedia.

5. Ubah kebutuhan menjadi requirement.
   - Berikan requirement ID unik untuk setiap requirement.
   - Pisahkan functional requirements dan non-functional requirements.
   - Tulis setiap requirement dengan bahasa yang dapat diuji.
   - Ganti istilah ambigu dengan kriteria yang terukur.
   - Sertakan priority, rationale, source, acceptance criteria, dan validation status jika memungkinkan.

6. Dokumentasikan temuan elicitation.
   - Ringkas temuan utama, tujuan stakeholder, konflik, gap, risiko, batasan, dan business value.
   - Identifikasi pertanyaan yang belum terjawab dan langkah validasi yang dibutuhkan.
   - Jelaskan pernyataan yang saling bertentangan secara eksplisit dan minta klarifikasi.

7. Lakukan quality checks.
   - Periksa kelengkapan, konsistensi, kejelasan, testability, traceability, feasibility, dan business value.
   - Pastikan setiap requirement memiliki ID, tipe, source, dan validation status.
   - Pastikan asumsi ditandai secara eksplisit.
   - Pastikan functional dan non-functional requirements dipisahkan.

8. Hentikan jika informasi tidak mencukupi.
   - Jangan memfinalisasi requirement ketika konteks penting hilang, bertentangan, atau tidak dapat divalidasi.
   - Ajukan pertanyaan klarifikasi yang spesifik dan jelaskan keputusan requirement yang terblokir.

## Output Format
Hasilkan output dengan struktur berikut:

```markdown
# Laporan Elicitation: <Nama Proyek atau Fitur>

## 1. Tujuan Elicitation
- Tujuan:
- Tujuan bisnis:
- Stakeholder:
- Scope:

## 2. Konteks yang Ditinjau
| Source ID | Jenis Sumber | Ringkasan | Relevansi |
|---|---|---|---|

## 3. Teknik Elicitation
| Technique ID | Teknik | Tujuan | Stakeholder / Sumber | Alasan Pemilihan |
|---|---|---|---|---|

## 4. Pertanyaan Wawancara
### 4.1 Pertanyaan Umum
- Q1:
- Q2:

### 4.2 Pertanyaan Berdasarkan Peran
| Question ID | Peran Stakeholder | Pertanyaan | Tujuan | Pemicu Follow-Up |
|---|---|---|---|---|

## 5. Kebutuhan Eksplisit
| Need ID | Stakeholder / Sumber | Kebutuhan yang Dinyatakan | Evidence | Business Value |
|---|---|---|---|---|

## 6. Kebutuhan Implisit dan Asumsi
| Assumption ID | Kebutuhan yang Diinferensi | Dasar Inferensi | Validasi yang Dibutuhkan | Risiko jika Salah |
|---|---|---|---|---|

## 7. Functional Requirements
| Requirement ID | Requirement | Source Need | Priority | Acceptance Criteria | Validation Status |
|---|---|---|---|---|---|

## 8. Non-Functional Requirements
| Requirement ID | Quality Attribute | Requirement | Measurement / Threshold | Source Need | Validation Status |
|---|---|---|---|---|---|

## 9. Temuan Elicitation
### Temuan Utama
- 

### Konflik atau Kontradiksi
- 

### Gap dan Pertanyaan Terbuka
- 

### Risiko
- 

## 10. Traceability Matrix
| Need ID | Requirement ID | Source ID | Acceptance Criteria ID | Status |
|---|---|---|---|---|

## 11. Hasil Quality Check
| Check | Hasil | Catatan |
|---|---|---|
```

## Rules
- Jangan membuat fakta yang tidak diberikan.
- Tandai setiap asumsi secara eksplisit.
- Gunakan requirement ID.
- Gunakan prefix ID yang stabil:
  - `SRC-001` untuk sumber.
  - `TECH-001` untuk teknik elicitation.
  - `Q-001` untuk pertanyaan.
  - `NEED-001` untuk kebutuhan eksplisit.
  - `ASM-001` untuk asumsi atau kebutuhan implisit.
  - `FR-001` untuk functional requirements.
  - `NFR-001` untuk non-functional requirements.
  - `AC-001` untuk acceptance criteria.
- Pisahkan functional dan non-functional requirements.
- Jangan menggunakan kata ambigu tanpa ukuran, termasuk: cepat, mudah, sederhana, aman, scalable, ramah pengguna, andal, robust, efisien, seamless, banyak, sedikit, sering, atau secepat mungkin.
- Jangan menghasilkan requirement yang tidak dapat diuji.
- Setiap requirement harus memiliki source need atau asumsi eksplisit.
- Setiap requirement implisit harus tetap ditandai sebagai asumsi sampai divalidasi oleh stakeholder atau sumber yang sah.
- Jika evidence saling bertentangan, dokumentasikan konflik tersebut alih-alih memilih salah satu tanpa validasi.
- Tulis requirement secara ringkas dengan satu perilaku atau satu quality attribute per requirement.
- Sertakan business value untuk kebutuhan dan temuan ketika didukung oleh konteks.

## Quality Checks
Sebelum finalisasi, pastikan output:

- Lengkap: mencakup tujuan, teknik, pertanyaan, kebutuhan, requirement, temuan, traceability, dan hasil quality check.
- Konsisten: tidak berisi requirement yang saling bertentangan kecuali konflik ditandai dengan jelas.
- Tidak ambigu: menghindari istilah subjektif yang tidak didefinisikan.
- Dapat diuji: setiap requirement memiliki acceptance criteria atau threshold yang terukur.
- Traceable: setiap requirement terhubung ke kebutuhan, sumber, atau asumsi eksplisit.
- Bernilai bisnis: setiap requirement atau kebutuhan terhubung ke tujuan bisnis, tujuan user, pengurangan risiko, compliance, atau nilai operasional.
- Tervalidasi: setiap item memiliki validation status seperti `Tervalidasi`, `Menunggu Validasi`, `Asumsi`, atau `Ditolak`.

## Failure Conditions
Hentikan proses dan minta klarifikasi ketika:

- Tujuan proyek tidak tersedia.
- Peran stakeholder tidak diketahui dan tidak dapat disimpulkan dari konteks.
- Source material tidak cukup untuk mengidentifikasi kebutuhan.
- Requirement bergantung pada asumsi yang belum tervalidasi dan berdampak tinggi pada bisnis atau keselamatan.
- Input berisi kontradiksi yang memengaruhi scope, prioritas, business rules, compliance, data handling, atau acceptance criteria.
- Requirement yang diminta tidak dapat dibuat terukur atau dapat diuji.
- User meminta requirement final tetapi hanya memberikan ide solusi tanpa tujuan bisnis atau kebutuhan user.

Saat menghentikan proses, berikan:

- Keputusan yang terblokir.
- Informasi yang hilang atau bertentangan.
- Pertanyaan klarifikasi yang dibutuhkan untuk melanjutkan.
