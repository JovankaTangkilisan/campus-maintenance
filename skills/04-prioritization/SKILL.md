---
name: 04-prioritization
description: Panduan untuk memprioritaskan kebutuhan software engineering. Gunakan ketika Codex perlu membantu menyusun prioritas requirement, menangani konflik stakeholder, menganalisis dependency, menerapkan MoSCoW, mengevaluasi trade-off, dan mendokumentasikan alasan keputusan prioritisasi secara traceable.
---

# 04-Prioritization

## Purpose
Gunakan skill ini untuk memprioritaskan kebutuhan perangkat lunak secara transparan, terstruktur, dan dapat dipertanggungjawabkan.

Skill ini menyelesaikan masalah prioritas requirement yang tidak jelas, dipengaruhi opini stakeholder tanpa alasan eksplisit, mengabaikan dependency, atau tidak mencatat trade-off dan dasar keputusan.

## When to Use
Gunakan skill ini ketika pengguna meminta bantuan untuk:

- Memprioritaskan requirement, fitur, user story, backlog item, atau scope rilis.
- Menggunakan metode MoSCoW untuk menentukan `Must Have`, `Should Have`, `Could Have`, dan `Won't Have`.
- Mengidentifikasi konflik antar stakeholder.
- Menilai dependency antar requirement atau fitur.
- Membuat trade-off antara value, effort, risk, time, cost, compliance, security, usability, dan technical constraint.
- Menjelaskan alasan keputusan prioritisasi.
- Membuat rekomendasi scope MVP, release planning, atau backlog ordering.
- Memvalidasi apakah prioritas sudah traceable ke business goal dan kebutuhan pengguna.

Jangan gunakan skill ini untuk membuat estimasi teknis detail atau jadwal implementasi final jika data effort, kapasitas tim, dan constraint rilis belum tersedia.

## Inputs
Informasi berikut harus tersedia sebelum skill dijalankan:

- Daftar requirement, fitur, user story, backlog item, atau scope kandidat.
- Business goals dan metrik keberhasilan.
- Stakeholder dan kepentingannya.
- Prioritas awal dari stakeholder, jika tersedia.
- Nilai bisnis atau dampak pengguna untuk setiap item.
- Risiko bisnis, teknis, operasional, security, privacy, compliance, atau reputasi.
- Dependency antar requirement, fitur, sistem, tim, data, atau proses.
- Constraint waktu, biaya, kapasitas tim, rilis, regulasi, atau kontrak.
- Estimasi effort atau kompleksitas, jika tersedia.
- Deadline atau target release, jika tersedia.
- Kriteria keputusan yang disepakati.

Jika input penting tidak tersedia, minta klarifikasi sebelum membuat keputusan prioritas final.

## Required Context
Baca konteks proyek yang relevan sebelum melakukan prioritisasi:

- Dokumen requirement atau software specification.
- Hasil elicitation, interview, workshop, dan catatan stakeholder.
- Product roadmap, release goal, OKR, KPI, atau business case.
- Backlog, user stories, acceptance criteria, dan bug atau support tickets.
- Dokumen dependency teknis, arsitektur, integrasi, API, data, atau platform.
- Constraint compliance, security, privacy, accessibility, SLA, atau operasional.
- Estimasi effort, kapasitas tim, timeline, dan risiko pengiriman.
- Keputusan prioritas sebelumnya beserta alasan atau notulen rapat.

Gunakan hanya informasi yang tersedia. Jika membuat inferensi, tandai sebagai asumsi dan minta validasi.

## Workflow
1. Tetapkan tujuan prioritisasi.
   - Identifikasi apakah prioritisasi untuk MVP, rilis tertentu, backlog ordering, roadmap, atau scope reduction.
   - Catat business goal, target pengguna, constraint waktu, dan kriteria keberhasilan.
   - Tentukan stakeholder yang memengaruhi keputusan.

2. Inventarisasi item yang akan diprioritaskan.
   - Beri ID pada setiap item menggunakan format `REQ-001`, `FEAT-001`, atau `US-001`.
   - Ringkas value, source, owner, effort, risk, dan status validasi setiap item.
   - Tandai item yang deskripsinya belum cukup jelas.

3. Identifikasi konflik stakeholder.
   - Catat stakeholder yang memiliki kebutuhan, prioritas, atau constraint yang berbeda.
   - Jelaskan konflik sebagai perbedaan tujuan, scope, deadline, risiko, biaya, compliance, atau user impact.
   - Jangan memilih pihak tertentu tanpa alasan keputusan yang eksplisit.
   - Tandai konflik yang membutuhkan keputusan sponsor, product owner, atau governance.

4. Analisis dependency.
   - Identifikasi dependency antar requirement, data, integrasi, sistem, tim, proses bisnis, legal approval, atau infrastruktur.
   - Tandai blocker, predecessor, successor, dan dependency eksternal.
   - Jangan memprioritaskan item sebagai `Must Have` untuk rilis tertentu jika dependency kritisnya tidak dapat dipenuhi, kecuali risikonya dicatat.

5. Terapkan MoSCoW.
   - `Must Have`: wajib untuk mencapai tujuan bisnis, compliance, keamanan, operasi minimum, atau rilis tidak valid tanpanya.
   - `Should Have`: penting dan bernilai tinggi, tetapi rilis masih dapat berjalan tanpa item tersebut dalam jangka pendek.
   - `Could Have`: bernilai, tetapi dampaknya lebih rendah atau dapat ditunda tanpa risiko besar.
   - `Won't Have`: tidak masuk scope periode keputusan saat ini, tetapi dapat dipertimbangkan di masa depan.
   - Berikan alasan untuk setiap kategori.

6. Evaluasi trade-off.
   - Bandingkan value, effort, risk, time, cost, dependency, stakeholder impact, dan technical constraint.
   - Catat apa yang dikorbankan dan apa yang diperoleh dari setiap keputusan.
   - Jangan menyembunyikan konsekuensi negatif dari keputusan prioritas.

7. Dokumentasikan alasan keputusan.
   - Untuk setiap item, tulis decision rationale yang menjelaskan mengapa item mendapat prioritas tersebut.
   - Hubungkan alasan ke business goal, user impact, dependency, risk, atau constraint.
   - Tandai asumsi dan informasi yang belum divalidasi.

8. Buat rekomendasi prioritas.
   - Susun hasil dalam urutan prioritas.
   - Tandai item yang siap diputuskan, item yang perlu klarifikasi, dan item yang diblokir dependency.
   - Berikan rekomendasi scope MVP atau release jika diminta.

9. Lakukan quality checks.
   - Periksa apakah semua item memiliki kategori MoSCoW, alasan keputusan, dependency, dan status validasi.
   - Pastikan konflik stakeholder dan trade-off dicatat.
   - Pastikan keputusan dapat ditelusuri ke business goal atau constraint.

10. Hentikan jika informasi tidak mencukupi.
   - Jangan menetapkan prioritas final jika data value, dependency, constraint, atau konflik kritis tidak jelas.
   - Minta klarifikasi dengan pertanyaan spesifik.

## Output Format
Hasilkan output dengan struktur berikut:

```markdown
# Prioritization Report: <Nama Proyek/Fitur/Rilis>

## 1. Tujuan Prioritisasi
- Tujuan prioritisasi:
- Business goal:
- Target rilis / periode keputusan:
- Stakeholder utama:
- Constraint utama:
- Kriteria keputusan:

## 2. Konteks yang Ditinjau
| Source ID | Jenis Sumber | Ringkasan | Relevansi |
|---|---|---|---|

## 3. Item yang Diprioritaskan
| Item ID | Item | Jenis | Source | Business Value | Effort / Complexity | Status Validasi |
|---|---|---|---|---|---|---|

## 4. Konflik Stakeholder
| Conflict ID | Stakeholder Terkait | Konflik | Dampak | Keputusan / Status | Klarifikasi Dibutuhkan |
|---|---|---|---|---|---|

## 5. Dependency Analysis
| Dependency ID | Item Terkait | Dependency | Jenis Dependency | Dampak Jika Tidak Terpenuhi | Status |
|---|---|---|---|---|---|

## 6. MoSCoW Prioritization
| Item ID | Item | MoSCoW | Alasan Kategori | Dependency | Risiko | Status Validasi |
|---|---|---|---|---|---|---|

## 7. Trade-Off Analysis
| Trade-Off ID | Keputusan | Opsi yang Dibandingkan | Yang Diperoleh | Yang Dikorbankan | Risiko | Alasan Keputusan |
|---|---|---|---|---|---|---|

## 8. Decision Rationale
| Decision ID | Item / Konflik / Trade-Off | Keputusan | Alasan | Evidence / Source | Assumption | Owner Validasi |
|---|---|---|---|---|---|---|

## 9. Rekomendasi Prioritas
### Must Have
- 

### Should Have
- 

### Could Have
- 

### Won't Have
- 

## 10. Gap dan Pertanyaan Terbuka
### Gap
- 

### Pertanyaan Terbuka
- 

## 11. Traceability Matrix
| Business Goal | Item ID | MoSCoW | Dependency ID | Conflict ID | Trade-Off ID | Decision ID |
|---|---|---|---|---|---|---|

## 12. Quality Check Result
| Check | Result | Catatan |
|---|---|---|
```

## Rules
- Jangan membuat fakta yang tidak diberikan.
- Tandai asumsi secara eksplisit.
- Gunakan ID yang stabil:
  - `SRC-001` untuk sumber.
  - `ITEM-001` untuk item prioritisasi umum.
  - `REQ-001` untuk requirement.
  - `US-001` untuk user story.
  - `FEAT-001` untuk fitur.
  - `CON-001` untuk konflik stakeholder.
  - `DEP-001` untuk dependency.
  - `TRD-001` untuk trade-off.
  - `DEC-001` untuk keputusan.
  - `ASM-001` untuk asumsi.
- Gunakan MoSCoW secara konsisten.
- Jangan memberi kategori `Must Have` hanya karena stakeholder menginginkannya.
- Kategori `Must Have` harus memiliki alasan kuat seperti business-critical, legal-critical, safety-critical, security-critical, operational-critical, atau dependency-critical.
- Pisahkan prioritas stakeholder dari keputusan prioritas final.
- Setiap keputusan prioritas harus memiliki alasan keputusan.
- Setiap trade-off harus menjelaskan yang diperoleh dan yang dikorbankan.
- Setiap dependency kritis harus dicatat sebelum rekomendasi prioritas final.
- Konflik stakeholder harus dicatat sebagai konflik, bukan diselesaikan secara diam-diam.
- Jangan menggunakan kata ambigu tanpa ukuran, seperti penting, mudah, cepat, besar, kecil, tinggi, rendah, segera, atau banyak, kecuali didefinisikan dengan kriteria yang jelas.
- Jangan membuat rekomendasi final jika data yang diperlukan untuk keputusan kritis belum tersedia.

## Quality Checks
Sebelum finalisasi, periksa apakah output:

- Lengkap: mencakup item prioritas, konflik stakeholder, dependency, MoSCoW, trade-off, alasan keputusan, rekomendasi, dan traceability.
- Konsisten: kategori MoSCoW tidak bertentangan dengan dependency, risiko, atau constraint.
- Tidak ambigu: alasan prioritas menggunakan kriteria yang jelas.
- Traceable: setiap keputusan prioritas dapat ditelusuri ke business goal, source, dependency, conflict, trade-off, atau asumsi.
- Terjustifikasi: setiap item memiliki alasan keputusan, bukan hanya label prioritas.
- Feasible: item prioritas tinggi tidak diblokir dependency yang belum terselesaikan tanpa catatan risiko.
- Transparan: konflik stakeholder dan konsekuensi trade-off tidak disembunyikan.
- Bernilai bisnis: prioritas mendukung business goal, user value, compliance, risk reduction, atau operational continuity.
- Tervalidasi: status validasi jelas, seperti `Validated`, `Pending Validation`, `Assumption`, `Conflict`, atau `Blocked`.

## Failure Conditions
Skill harus berhenti atau meminta klarifikasi jika:

- Tujuan prioritisasi tidak tersedia.
- Daftar item yang akan diprioritaskan tidak tersedia.
- Business goal atau kriteria keputusan tidak jelas.
- Stakeholder utama tidak diketahui.
- Dependency kritis belum dapat diidentifikasi.
- Konflik stakeholder memengaruhi scope, budget, compliance, security, deadline, atau business value dan belum ada otoritas keputusan.
- Tidak ada informasi yang cukup untuk membedakan `Must Have`, `Should Have`, `Could Have`, dan `Won't Have`.
- Trade-off utama tidak dapat dievaluasi karena data value, effort, risk, atau constraint tidak tersedia.
- Pengguna meminta prioritas final tetapi input hanya berisi opini tanpa konteks bisnis, dependency, atau constraint.

Saat berhenti, berikan:

- Bagian prioritisasi yang terblokir.
- Informasi yang kurang atau bertentangan.
- Pertanyaan klarifikasi yang diperlukan untuk melanjutkan.

---
name: software-engineering-prioritization
description: Panduan untuk memprioritaskan kebutuhan software engineering. Gunakan ketika Codex perlu membantu menyusun prioritas requirement, menangani konflik stakeholder, menganalisis dependency, menerapkan MoSCoW, mengevaluasi trade-off, dan mendokumentasikan alasan keputusan prioritisasi secara traceable.
---

# Software Engineering Prioritization

## Purpose
Gunakan skill ini untuk memprioritaskan kebutuhan perangkat lunak secara transparan, terstruktur, dan dapat dipertanggungjawabkan.

Skill ini menyelesaikan masalah prioritas requirement yang tidak jelas, dipengaruhi opini stakeholder tanpa alasan eksplisit, mengabaikan dependency, atau tidak mencatat trade-off dan dasar keputusan.

## When to Use
Gunakan skill ini ketika pengguna meminta bantuan untuk:

- Memprioritaskan requirement, fitur, user story, backlog item, atau scope rilis.
- Menggunakan metode MoSCoW untuk menentukan `Must Have`, `Should Have`, `Could Have`, dan `Won't Have`.
- Mengidentifikasi konflik antar stakeholder.
- Menilai dependency antar requirement atau fitur.
- Membuat trade-off antara value, effort, risk, time, cost, compliance, security, usability, dan technical constraint.
- Menjelaskan alasan keputusan prioritisasi.
- Membuat rekomendasi scope MVP, release planning, atau backlog ordering.
- Memvalidasi apakah prioritas sudah traceable ke business goal dan kebutuhan pengguna.

Jangan gunakan skill ini untuk membuat estimasi teknis detail atau jadwal implementasi final jika data effort, kapasitas tim, dan constraint rilis belum tersedia.

## Inputs
Informasi berikut harus tersedia sebelum skill dijalankan:

- Daftar requirement, fitur, user story, backlog item, atau scope kandidat.
- Business goals dan metrik keberhasilan.
- Stakeholder dan kepentingannya.
- Prioritas awal dari stakeholder, jika tersedia.
- Nilai bisnis atau dampak pengguna untuk setiap item.
- Risiko bisnis, teknis, operasional, security, privacy, compliance, atau reputasi.
- Dependency antar requirement, fitur, sistem, tim, data, atau proses.
- Constraint waktu, biaya, kapasitas tim, rilis, regulasi, atau kontrak.
- Estimasi effort atau kompleksitas, jika tersedia.
- Deadline atau target release, jika tersedia.
- Kriteria keputusan yang disepakati.

Jika input penting tidak tersedia, minta klarifikasi sebelum membuat keputusan prioritas final.

## Required Context
Baca konteks proyek yang relevan sebelum melakukan prioritisasi:

- Dokumen requirement atau software specification.
- Hasil elicitation, interview, workshop, dan catatan stakeholder.
- Product roadmap, release goal, OKR, KPI, atau business case.
- Backlog, user stories, acceptance criteria, dan bug atau support tickets.
- Dokumen dependency teknis, arsitektur, integrasi, API, data, atau platform.
- Constraint compliance, security, privacy, accessibility, SLA, atau operasional.
- Estimasi effort, kapasitas tim, timeline, dan risiko pengiriman.
- Keputusan prioritas sebelumnya beserta alasan atau notulen rapat.

Gunakan hanya informasi yang tersedia. Jika membuat inferensi, tandai sebagai asumsi dan minta validasi.

## Workflow
1. Tetapkan tujuan prioritisasi.
   - Identifikasi apakah prioritisasi untuk MVP, rilis tertentu, backlog ordering, roadmap, atau scope reduction.
   - Catat business goal, target pengguna, constraint waktu, dan kriteria keberhasilan.
   - Tentukan stakeholder yang memengaruhi keputusan.

2. Inventarisasi item yang akan diprioritaskan.
   - Beri ID pada setiap item menggunakan format `REQ-001`, `FEAT-001`, atau `US-001`.
   - Ringkas value, source, owner, effort, risk, dan status validasi setiap item.
   - Tandai item yang deskripsinya belum cukup jelas.

3. Identifikasi konflik stakeholder.
   - Catat stakeholder yang memiliki kebutuhan, prioritas, atau constraint yang berbeda.
   - Jelaskan konflik sebagai perbedaan tujuan, scope, deadline, risiko, biaya, compliance, atau user impact.
   - Jangan memilih pihak tertentu tanpa alasan keputusan yang eksplisit.
   - Tandai konflik yang membutuhkan keputusan sponsor, product owner, atau governance.

4. Analisis dependency.
   - Identifikasi dependency antar requirement, data, integrasi, sistem, tim, proses bisnis, legal approval, atau infrastruktur.
   - Tandai blocker, predecessor, successor, dan dependency eksternal.
   - Jangan memprioritaskan item sebagai `Must Have` untuk rilis tertentu jika dependency kritisnya tidak dapat dipenuhi, kecuali risikonya dicatat.

5. Terapkan MoSCoW.
   - `Must Have`: wajib untuk mencapai tujuan bisnis, compliance, keamanan, operasi minimum, atau rilis tidak valid tanpanya.
   - `Should Have`: penting dan bernilai tinggi, tetapi rilis masih dapat berjalan tanpa item tersebut dalam jangka pendek.
   - `Could Have`: bernilai, tetapi dampaknya lebih rendah atau dapat ditunda tanpa risiko besar.
   - `Won't Have`: tidak masuk scope periode keputusan saat ini, tetapi dapat dipertimbangkan di masa depan.
   - Berikan alasan untuk setiap kategori.

6. Evaluasi trade-off.
   - Bandingkan value, effort, risk, time, cost, dependency, stakeholder impact, dan technical constraint.
   - Catat apa yang dikorbankan dan apa yang diperoleh dari setiap keputusan.
   - Jangan menyembunyikan konsekuensi negatif dari keputusan prioritas.

7. Dokumentasikan alasan keputusan.
   - Untuk setiap item, tulis decision rationale yang menjelaskan mengapa item mendapat prioritas tersebut.
   - Hubungkan alasan ke business goal, user impact, dependency, risk, atau constraint.
   - Tandai asumsi dan informasi yang belum divalidasi.

8. Buat rekomendasi prioritas.
   - Susun hasil dalam urutan prioritas.
   - Tandai item yang siap diputuskan, item yang perlu klarifikasi, dan item yang diblokir dependency.
   - Berikan rekomendasi scope MVP atau release jika diminta.

9. Lakukan quality checks.
   - Periksa apakah semua item memiliki kategori MoSCoW, alasan keputusan, dependency, dan status validasi.
   - Pastikan konflik stakeholder dan trade-off dicatat.
   - Pastikan keputusan dapat ditelusuri ke business goal atau constraint.

10. Hentikan jika informasi tidak mencukupi.
   - Jangan menetapkan prioritas final jika data value, dependency, constraint, atau konflik kritis tidak jelas.
   - Minta klarifikasi dengan pertanyaan spesifik.

## Output Format
Hasilkan output dengan struktur berikut:

```markdown
# Prioritization Report: <Nama Proyek/Fitur/Rilis>

## 1. Tujuan Prioritisasi
- Tujuan prioritisasi:
- Business goal:
- Target rilis / periode keputusan:
- Stakeholder utama:
- Constraint utama:
- Kriteria keputusan:

## 2. Konteks yang Ditinjau
| Source ID | Jenis Sumber | Ringkasan | Relevansi |
|---|---|---|---|

## 3. Item yang Diprioritaskan
| Item ID | Item | Jenis | Source | Business Value | Effort / Complexity | Status Validasi |
|---|---|---|---|---|---|---|

## 4. Konflik Stakeholder
| Conflict ID | Stakeholder Terkait | Konflik | Dampak | Keputusan / Status | Klarifikasi Dibutuhkan |
|---|---|---|---|---|---|

## 5. Dependency Analysis
| Dependency ID | Item Terkait | Dependency | Jenis Dependency | Dampak Jika Tidak Terpenuhi | Status |
|---|---|---|---|---|---|

## 6. MoSCoW Prioritization
| Item ID | Item | MoSCoW | Alasan Kategori | Dependency | Risiko | Status Validasi |
|---|---|---|---|---|---|---|

## 7. Trade-Off Analysis
| Trade-Off ID | Keputusan | Opsi yang Dibandingkan | Yang Diperoleh | Yang Dikorbankan | Risiko | Alasan Keputusan |
|---|---|---|---|---|---|---|

## 8. Decision Rationale
| Decision ID | Item / Konflik / Trade-Off | Keputusan | Alasan | Evidence / Source | Assumption | Owner Validasi |
|---|---|---|---|---|---|---|

## 9. Rekomendasi Prioritas
### Must Have
- 

### Should Have
- 

### Could Have
- 

### Won't Have
- 

## 10. Gap dan Pertanyaan Terbuka
### Gap
- 

### Pertanyaan Terbuka
- 

## 11. Traceability Matrix
| Business Goal | Item ID | MoSCoW | Dependency ID | Conflict ID | Trade-Off ID | Decision ID |
|---|---|---|---|---|---|---|

## 12. Quality Check Result
| Check | Result | Catatan |
|---|---|---|
```

## Rules
- Jangan membuat fakta yang tidak diberikan.
- Tandai asumsi secara eksplisit.
- Gunakan ID yang stabil:
  - `SRC-001` untuk sumber.
  - `ITEM-001` untuk item prioritisasi umum.
  - `REQ-001` untuk requirement.
  - `US-001` untuk user story.
  - `FEAT-001` untuk fitur.
  - `CON-001` untuk konflik stakeholder.
  - `DEP-001` untuk dependency.
  - `TRD-001` untuk trade-off.
  - `DEC-001` untuk keputusan.
  - `ASM-001` untuk asumsi.
- Gunakan MoSCoW secara konsisten.
- Jangan memberi kategori `Must Have` hanya karena stakeholder menginginkannya.
- Kategori `Must Have` harus memiliki alasan kuat seperti business-critical, legal-critical, safety-critical, security-critical, operational-critical, atau dependency-critical.
- Pisahkan prioritas stakeholder dari keputusan prioritas final.
- Setiap keputusan prioritas harus memiliki alasan keputusan.
- Setiap trade-off harus menjelaskan yang diperoleh dan yang dikorbankan.
- Setiap dependency kritis harus dicatat sebelum rekomendasi prioritas final.
- Konflik stakeholder harus dicatat sebagai konflik, bukan diselesaikan secara diam-diam.
- Jangan menggunakan kata ambigu tanpa ukuran, seperti penting, mudah, cepat, besar, kecil, tinggi, rendah, segera, atau banyak, kecuali didefinisikan dengan kriteria yang jelas.
- Jangan membuat rekomendasi final jika data yang diperlukan untuk keputusan kritis belum tersedia.

## Quality Checks
Sebelum finalisasi, periksa apakah output:

- Lengkap: mencakup item prioritas, konflik stakeholder, dependency, MoSCoW, trade-off, alasan keputusan, rekomendasi, dan traceability.
- Konsisten: kategori MoSCoW tidak bertentangan dengan dependency, risiko, atau constraint.
- Tidak ambigu: alasan prioritas menggunakan kriteria yang jelas.
- Traceable: setiap keputusan prioritas dapat ditelusuri ke business goal, source, dependency, conflict, trade-off, atau asumsi.
- Terjustifikasi: setiap item memiliki alasan keputusan, bukan hanya label prioritas.
- Feasible: item prioritas tinggi tidak diblokir dependency yang belum terselesaikan tanpa catatan risiko.
- Transparan: konflik stakeholder dan konsekuensi trade-off tidak disembunyikan.
- Bernilai bisnis: prioritas mendukung business goal, user value, compliance, risk reduction, atau operational continuity.
- Tervalidasi: status validasi jelas, seperti `Validated`, `Pending Validation`, `Assumption`, `Conflict`, atau `Blocked`.

## Failure Conditions
Skill harus berhenti atau meminta klarifikasi jika:

- Tujuan prioritisasi tidak tersedia.
- Daftar item yang akan diprioritaskan tidak tersedia.
- Business goal atau kriteria keputusan tidak jelas.
- Stakeholder utama tidak diketahui.
- Dependency kritis belum dapat diidentifikasi.
- Konflik stakeholder memengaruhi scope, budget, compliance, security, deadline, atau business value dan belum ada otoritas keputusan.
- Tidak ada informasi yang cukup untuk membedakan `Must Have`, `Should Have`, `Could Have`, dan `Won't Have`.
- Trade-off utama tidak dapat dievaluasi karena data value, effort, risk, atau constraint tidak tersedia.
- Pengguna meminta prioritas final tetapi input hanya berisi opini tanpa konteks bisnis, dependency, atau constraint.

Saat berhenti, berikan:

- Bagian prioritisasi yang terblokir.
- Informasi yang kurang atau bertentangan.
- Pertanyaan klarifikasi yang diperlukan untuk melanjutkan.
