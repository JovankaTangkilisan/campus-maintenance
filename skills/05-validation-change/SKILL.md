---
name: 05-validation-change
description: Validasi perubahan software engineering yang menilai clarity, completeness, consistency, feasibility, testability, traceability, dan impact analysis. Gunakan saat perlu meninjau requirement, change request, user story, spesifikasi fitur, PRD, desain teknis, atau rencana implementasi sebelum perubahan diproses lebih lanjut.
---

# 05-Validation Change

## Purpose
Menilai kualitas sebuah perubahan software engineering sebelum dieksekusi atau dipublikasikan.
Skill ini membantu menemukan requirement yang tidak jelas, tidak lengkap, saling bertentangan, tidak dapat diuji, sulit dilacak, atau memiliki dampak yang belum dianalisis.

## When to Use
Gunakan skill ini ketika perlu:
- Meninjau requirement baru atau perubahan requirement.
- Memvalidasi user story, acceptance criteria, PRD, technical spec, atau change request.
- Mengecek apakah perubahan layak dikerjakan oleh tim.
- Menilai dampak perubahan terhadap sistem, proses, data, API, UI, keamanan, performa, dan test.
- Menyiapkan review sebelum estimasi, development, atau approval.

## Inputs
Pastikan informasi berikut tersedia sebelum menjalankan skill:
- Deskripsi perubahan yang ingin divalidasi.
- Tujuan bisnis atau tujuan pengguna.
- Scope in-scope dan out-of-scope.
- Requirement atau acceptance criteria yang ada.
- Sistem, modul, API, data model, atau alur yang terdampak.
- Constraint bisnis, teknis, legal, keamanan, atau waktu.
- Definisi pihak terkait, jika ada.
- Kriteria sukses, jika sudah ditetapkan.
- Referensi dokumen atau tiket terkait, jika ada.

## Required Context
Baca konteks proyek yang relevan sebelum menilai perubahan, minimal:
- Dokumen kebutuhan: PRD, BRD, user story, change request, atau tiket.
- Spesifikasi teknis: design doc, arsitektur, API spec, schema, atau sequence flow.
- Artefak yang terdampak: modul kode, konfigurasi, migration plan, test plan, atau release note.
- Requirement historis atau keputusan terdahulu yang masih relevan.
- Aturan domain, kebijakan internal, atau constraint yang wajib dipatuhi.

## Workflow
1. Pahami perubahan yang diminta dan tulis ulang secara singkat dengan kata-kata sendiri.
2. Identifikasi requirement, asumsi, dependensi, constraint, dan artifact yang terdampak.
3. Validasi perubahan terhadap tujuh dimensi: clarity, completeness, consistency, feasibility, testability, traceability, dan impact analysis.
4. Catat temuan, risiko, gap, dan pertanyaan klarifikasi secara eksplisit.
5. Lakukan quality checks terakhir.
6. Hentikan dan minta klarifikasi jika informasi tidak cukup untuk memvalidasi secara andal.

## Output Format
Hasil wajib mengikuti struktur berikut:
1. `Ringkasan`
2. `Asumsi`
3. `Temuan Validasi`
4. `Traceability`
5. `Impact Analysis`
6. `Pertanyaan Klarifikasi`
7. `Rekomendasi`

Setiap temuan harus memuat:
- ID temuan.
- Requirement ID atau referensi sumber terkait.
- Dimensi yang terdampak.
- Dampak bisnis atau teknis.
- Saran perbaikan yang konkret.

## Rules
- Jangan membuat fakta yang tidak diberikan.
- Tandai asumsi secara eksplisit.
- Gunakan requirement ID untuk setiap requirement yang dianalisis.
- Pisahkan functional requirements dan non-functional requirements.
- Jangan menggunakan kata ambigu tanpa ukuran.
- Jangan menghasilkan requirement yang tidak dapat diuji.
- Jika ada konflik antar sumber, tulis konflik itu sebagai temuan, bukan diselesaikan diam-diam.
- Jika ada dampak yang belum bisa dinilai, sebutkan batasannya secara jujur.
- Prioritaskan business value, risiko, dan dependency ketika memberi rekomendasi.

## Quality Checks
Sebelum mengembalikan hasil, periksa bahwa output:
- Lengkap untuk konteks yang tersedia.
- Konsisten antar bagian.
- Tidak ambigu dan memakai ukuran yang jelas.
- Dapat diuji atau diverifikasi.
- Traceable ke sumber atau requirement ID.
- Memuat impact analysis yang relevan.
- Menjelaskan business value atau risiko utama.

## Failure Conditions
Hentikan proses atau minta klarifikasi jika:
- Input terlalu sedikit untuk menilai perubahan secara bertanggung jawab.
- Sumber informasi saling bertentangan dan tidak ada dasar untuk memilih salah satunya.
- Requirement tidak memiliki konteks yang cukup untuk diuji atau ditrace.
- Dampak penting tidak diketahui, tetapi keputusan memerlukan kepastian.
