---
name: 03-specification
description: Panduan untuk menyusun spesifikasi kebutuhan software engineering. Gunakan ketika Codex perlu membuat, merapikan, meninjau, atau memvalidasi functional requirements, non-functional requirements, business rules, user stories, dan acceptance criteria dari konteks proyek, hasil elicitation, backlog, dokumen bisnis, atau catatan stakeholder.
---

# 03-specification

## Purpose
Gunakan skill ini untuk menyusun spesifikasi kebutuhan perangkat lunak yang jelas, konsisten, terukur, dapat diuji, dan dapat ditelusuri.

Skill ini menyelesaikan masalah spesifikasi yang masih kabur, bercampur antara kebutuhan bisnis dan solusi teknis, tidak memiliki acceptance criteria, atau tidak memisahkan functional requirements, non-functional requirements, business rules, user stories, dan aturan validasi.

## When to Use
Gunakan skill ini ketika pengguna meminta bantuan untuk:

- Membuat dokumen spesifikasi kebutuhan perangkat lunak.
- Mengubah hasil elicitation menjadi requirement formal.
- Menulis functional requirements.
- Menulis non-functional requirements.
- Menulis business rules.
- Menulis user stories.
- Menulis acceptance criteria.
- Memvalidasi requirement agar tidak ambigu, dapat diuji, dan memiliki business value.
- Membuat traceability antara business goal, requirement, user story, dan acceptance criteria.

Jangan gunakan skill ini untuk membuat desain teknis, arsitektur, kode program, atau rencana implementasi sebelum spesifikasi kebutuhan divalidasi.

## Inputs
Informasi berikut harus tersedia sebelum skill dijalankan:

- Nama proyek, produk, modul, atau fitur.
- Tujuan bisnis atau masalah yang ingin diselesaikan.
- Daftar stakeholder atau target pengguna.
- Hasil elicitation, catatan wawancara, backlog, dokumen bisnis, user feedback, atau tiket.
- Ruang lingkup fitur yang termasuk dan tidak termasuk.
- Proses bisnis saat ini atau proses bisnis yang diharapkan.
- Data utama yang digunakan sistem.
- Integrasi dengan sistem lain, jika ada.
- Batasan bisnis, teknis, hukum, keamanan, privasi, atau operasional.
- Prioritas kebutuhan, jika tersedia.
- Definisi keberhasilan atau metrik hasil, jika tersedia.

Jika input penting tidak tersedia, minta klarifikasi sebelum membuat spesifikasi final.

## Required Context
Baca konteks proyek yang relevan sebelum menulis spesifikasi:

- Dokumen hasil elicitation atau requirement awal.
- Product brief, business case, atau problem statement.
- User stories, backlog, acceptance criteria, dan tiket yang sudah ada.
- Catatan meeting, wawancara stakeholder, atau customer feedback.
- Dokumen proses bisnis, SOP, kebijakan, atau regulasi.
- Wireframe, prototype, diagram alur, atau mockup.
- Dokumen API, integrasi, database, atau batasan sistem yang relevan.
- Dokumen security, privacy, accessibility, performance, availability, dan compliance.

Gunakan hanya fakta yang tersedia dari konteks. Jika harus membuat inferensi, tandai sebagai asumsi dan minta validasi.

## Workflow
1. Tentukan tujuan spesifikasi.
   - Identifikasi nama fitur atau sistem.
   - Jelaskan tujuan bisnis.
   - Tentukan stakeholder, aktor, dan pengguna utama.
   - Tentukan batasan ruang lingkup.

2. Klasifikasikan kebutuhan.
   - Pisahkan kebutuhan menjadi functional requirements, non-functional requirements, business rules, user stories, dan acceptance criteria.
   - Jangan mencampur perilaku sistem dengan kualitas sistem.
   - Jangan mencampur business rule dengan keputusan desain teknis.

3. Susun functional requirements.
   - Tulis setiap requirement sebagai perilaku sistem yang dapat diamati.
   - Gunakan ID `FR-001`, `FR-002`, dan seterusnya.
   - Pastikan setiap functional requirement memiliki sumber, prioritas, dan acceptance criteria.

4. Susun non-functional requirements.
   - Tulis setiap requirement sebagai kualitas sistem yang dapat diukur.
   - Gunakan ID `NFR-001`, `NFR-002`, dan seterusnya.
   - Kelompokkan berdasarkan atribut kualitas seperti performance, security, availability, usability, accessibility, maintainability, compatibility, privacy, auditability, atau reliability.
   - Sertakan ukuran atau threshold yang dapat diuji.

5. Susun business rules.
   - Tulis aturan bisnis yang mengatur validasi, keputusan, perhitungan, batasan, otorisasi, atau proses.
   - Gunakan ID `BR-001`, `BR-002`, dan seterusnya.
   - Jelaskan kondisi, aturan, pengecualian, dan dampak jika aturan dilanggar.

6. Susun user stories.
   - Gunakan format: `Sebagai <peran>, saya ingin <tujuan>, sehingga <manfaat>.`
   - Gunakan ID `US-001`, `US-002`, dan seterusnya.
   - Hubungkan setiap user story ke functional requirement dan business goal yang relevan.

7. Susun acceptance criteria.
   - Gunakan ID `AC-001`, `AC-002`, dan seterusnya.
   - Gunakan format Given-When-Then jika cocok.
   - Pastikan setiap acceptance criteria dapat diuji secara objektif.
   - Sertakan skenario berhasil, gagal, edge case, permission, validasi data, dan error handling bila relevan.

8. Buat traceability.
   - Hubungkan business goal, user story, requirement, business rule, dan acceptance criteria.
   - Tandai requirement yang belum memiliki sumber atau acceptance criteria.

9. Lakukan quality checks.
   - Periksa kelengkapan, konsistensi, kejelasan, testability, traceability, feasibility, dan business value.
   - Perbaiki kata ambigu dengan ukuran yang jelas.
   - Tandai asumsi, konflik, dan gap.

10. Hentikan jika informasi tidak mencukupi.
   - Jangan membuat requirement final jika konteks tidak cukup, bertentangan, atau tidak dapat divalidasi.
   - Minta klarifikasi dengan pertanyaan yang spesifik.

## Output Format
Hasilkan output dengan struktur berikut:

```markdown
# Software Requirements Specification: <Nama Proyek/Fitur>

## 1. Ringkasan
- Nama proyek/fitur:
- Tujuan bisnis:
- Stakeholder:
- Pengguna utama:
- Ruang lingkup:
- Di luar ruang lingkup:

## 2. Konteks dan Asumsi
### 2.1 Konteks yang Ditinjau
| Source ID | Jenis Sumber | Ringkasan | Relevansi |
|---|---|---|---|

### 2.2 Asumsi
| Assumption ID | Asumsi | Alasan | Validasi yang Dibutuhkan | Risiko Jika Salah |
|---|---|---|---|---|

## 3. Business Goals
| Goal ID | Business Goal | Metrik Keberhasilan | Prioritas |
|---|---|---|---|

## 4. User Stories
| User Story ID | User Story | Business Goal | Prioritas | Status Validasi |
|---|---|---|---|---|

## 5. Functional Requirements
| Requirement ID | Functional Requirement | User Story / Source | Prioritas | Acceptance Criteria | Status Validasi |
|---|---|---|---|---|---|

## 6. Non-Functional Requirements
| Requirement ID | Atribut Kualitas | Non-Functional Requirement | Ukuran / Threshold | Source | Status Validasi |
|---|---|---|---|---|---|

## 7. Business Rules
| Rule ID | Business Rule | Kondisi | Pengecualian | Requirement Terkait | Status Validasi |
|---|---|---|---|---|---|

## 8. Acceptance Criteria
| Acceptance Criteria ID | Requirement / User Story | Given | When | Then | Tipe Skenario |
|---|---|---|---|---|---|

## 9. Traceability Matrix
| Business Goal | User Story ID | Requirement ID | Business Rule ID | Acceptance Criteria ID | Status |
|---|---|---|---|---|---|

## 10. Gap, Konflik, dan Pertanyaan Terbuka
### Gap
- 

### Konflik
- 

### Pertanyaan Terbuka
- 

## 11. Quality Check Result
| Check | Result | Catatan |
|---|---|---|
```

## Rules
- Jangan membuat fakta yang tidak diberikan.
- Tandai asumsi secara eksplisit.
- Gunakan requirement ID.
- Gunakan ID yang stabil:
  - `SRC-001` untuk sumber.
  - `ASM-001` untuk asumsi.
  - `BG-001` untuk business goal.
  - `US-001` untuk user story.
  - `FR-001` untuk functional requirement.
  - `NFR-001` untuk non-functional requirement.
  - `BR-001` untuk business rule.
  - `AC-001` untuk acceptance criteria.
- Pisahkan functional requirements dan non-functional requirements.
- Pisahkan business rules dari requirement sistem.
- Jangan menggunakan kata ambigu tanpa ukuran, seperti cepat, mudah, aman, scalable, stabil, optimal, user-friendly, banyak, sedikit, sering, jarang, atau segera.
- Jangan menghasilkan requirement yang tidak dapat diuji.
- Setiap functional requirement harus menjelaskan perilaku sistem yang dapat diamati.
- Setiap non-functional requirement harus memiliki ukuran, threshold, atau kondisi pengujian.
- Setiap user story harus memiliki peran, tujuan, dan manfaat.
- Setiap acceptance criteria harus dapat diuji dengan hasil pass/fail.
- Setiap requirement harus memiliki sumber, user story, business goal, atau asumsi eksplisit.
- Jika ada konflik antar sumber, dokumentasikan konflik dan minta klarifikasi.
- Jangan mengubah solusi teknis menjadi requirement kecuali solusi tersebut merupakan batasan yang diberikan oleh stakeholder atau konteks proyek.

## Quality Checks
Sebelum finalisasi, periksa apakah output:

- Lengkap: mencakup functional requirements, non-functional requirements, business rules, user stories, dan acceptance criteria.
- Konsisten: tidak ada requirement atau business rule yang saling bertentangan tanpa catatan konflik.
- Tidak ambigu: semua istilah subjektif memiliki definisi atau ukuran.
- Dapat diuji: setiap requirement dan acceptance criteria memiliki hasil yang dapat diverifikasi.
- Traceable: setiap item dapat ditelusuri ke business goal, user story, source, atau asumsi.
- Bernilai bisnis: setiap requirement mendukung tujuan bisnis, kebutuhan pengguna, compliance, efisiensi operasional, pengurangan risiko, atau peningkatan kualitas layanan.
- Feasible: requirement tidak bertentangan dengan batasan yang diketahui.
- Terprioritaskan: prioritas tersedia atau ditandai sebagai perlu konfirmasi.
- Tervalidasi: status validasi jelas, seperti `Validated`, `Pending Validation`, `Assumption`, `Conflict`, atau `Rejected`.

## Failure Conditions
Skill harus berhenti atau meminta klarifikasi jika:

- Tujuan bisnis tidak tersedia.
- Ruang lingkup fitur tidak jelas.
- Stakeholder atau pengguna utama tidak diketahui.
- Sumber kebutuhan tidak tersedia.
- Functional requirement tidak dapat diturunkan dari konteks yang diberikan.
- Non-functional requirement tidak memiliki ukuran yang dapat diuji.
- Business rule bertentangan dengan requirement atau sumber lain.
- User story tidak memiliki manfaat yang jelas.
- Acceptance criteria tidak dapat diverifikasi.
- Ada konflik yang memengaruhi scope, prioritas, aturan bisnis, data, keamanan, compliance, atau acceptance criteria.

Saat berhenti, berikan:

- Bagian spesifikasi yang terblokir.
- Informasi yang kurang atau bertentangan.
- Pertanyaan klarifikasi yang diperlukan untuk melanjutkan.
