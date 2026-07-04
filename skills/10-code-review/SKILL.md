---
name: 10-code-review
description: Melakukan review kode, patch, pull request, atau perubahan implementasi dengan fokus pada bug, risiko regresi, keamanan, konsistensi requirement, test coverage, dan maintainability. Gunakan skill ini ketika user meminta code review, PR review, patch review, pemeriksaan diff, audit perubahan, atau validasi implementasi sebelum merge.
---

# Code Review

## Tujuan
Skill ini membantu memeriksa kode atau perubahan implementasi sebelum digabung, dikirim, atau dipakai lebih lanjut.

Fokus utama review adalah menemukan masalah nyata yang dapat menyebabkan bug, regresi, pelanggaran requirement, celah keamanan, data loss, perilaku tidak teruji, atau maintainability yang buruk.

Skill ini tidak bertujuan menulis ulang seluruh kode. Review harus memberi temuan yang jelas, dapat ditindaklanjuti, dan didukung referensi file/baris.

## Kapan Digunakan
Gunakan skill ini ketika user meminta:
- Review kode.
- Review pull request.
- Review patch atau diff.
- Review implementasi dari issue tertentu.
- Cek apakah kode sudah sesuai requirement dan acceptance criteria.
- Cek risiko bug, security, performance, atau test gap.
- Validasi sebelum merge atau submit tugas.

Jangan gunakan skill ini untuk implementasi fitur baru kecuali user secara eksplisit meminta perbaikan setelah review.

## Input
Informasi berikut sebaiknya tersedia:
- Diff, patch, pull request, atau daftar file yang berubah.
- Requirement ID, issue ID, acceptance criteria, atau tujuan perubahan.
- Codebase terkait untuk memahami konteks.
- Test yang sudah ada dan hasil test jika tersedia.
- Instruksi build, test, lint, atau typecheck jika tersedia.
- Konvensi coding, architecture design, database/API design, atau UI design jika relevan.

Jika input hanya berupa potongan kode tanpa konteks, review hanya pada risiko lokal dan tandai keterbatasan review.

## Required Context
Baca konteks berikut sebelum memberi review:
- File yang berubah.
- File yang memanggil atau dipanggil oleh kode yang berubah.
- Test terkait area perubahan.
- Kontrak API, schema database, atau type definition jika perubahan menyentuh data/API.
- Requirement atau acceptance criteria jika review diminta berdasarkan issue.
- Konfigurasi lint/typecheck/test jika perlu memahami cara verifikasi.
- Dokumentasi arsitektur atau pola modul jika perubahan menyentuh boundary sistem.

Jangan menilai perubahan hanya dari satu file jika perilakunya bergantung pada file lain yang tersedia.

## Langkah Kerja
1. Pahami tujuan perubahan dari issue, requirement, PR description, atau pesan user.
2. Identifikasi file yang berubah dan area sistem yang terdampak.
3. Baca kode sekitar perubahan untuk memahami alur data, lifecycle, state, error handling, authorization, dan dependency.
4. Periksa kesesuaian perubahan dengan requirement dan acceptance criteria.
5. Cari bug potensial, regresi perilaku, edge case yang terlewat, masalah concurrency/state, error handling, security, privacy, data consistency, dan performance.
6. Periksa apakah test baru/lama menutup perilaku penting yang berubah.
7. Jika memungkinkan, jalankan test, lint, typecheck, atau build yang relevan.
8. Susun temuan berdasarkan severity, dari paling penting ke paling ringan.
9. Untuk setiap temuan, berikan file/baris, dampak, alasan, dan saran perbaikan singkat.
10. Jika tidak menemukan masalah, katakan dengan jelas dan sebutkan batasan review atau test yang belum bisa dijalankan.
11. Hentikan atau minta klarifikasi jika konteks tidak cukup untuk menilai risiko utama.

## Output Format
Gunakan format berikut:

```markdown
# Code Review Result

## Findings
### [P1] Judul masalah singkat
- File/Line: `path/to/file.ext:123`
- Severity: P1
- Issue:
- Impact:
- Recommendation:
- Related Requirement/AC:

### [P2] Judul masalah singkat
- File/Line:
- Severity:
- Issue:
- Impact:
- Recommendation:
- Related Requirement/AC:

## Open Questions
- ...

## Test / Verification
- Tests Run:
- Tests Not Run:
- Test Gaps:

## Summary
- Reviewed Scope:
- Overall Risk:
- Merge Recommendation:
```

Jika tidak ada temuan:

```markdown
# Code Review Result

## Findings
No blocking issues found.

## Test / Verification
- Tests Run:
- Tests Not Run:
- Residual Risk:

## Summary
- Reviewed Scope:
- Merge Recommendation:
```

Severity gunakan:
- `P0`: Critical, dapat menyebabkan data loss, security breach, crash besar, atau produksi tidak bisa berjalan.
- `P1`: High, bug utama, requirement gagal, celah authorization, atau regresi penting.
- `P2`: Medium, edge case penting, test gap berisiko, maintainability yang dapat menyebabkan bug.
- `P3`: Low, naming, minor clarity, dokumentasi, atau style yang tidak memblokir.

## Aturan
- Temuan harus didukung bukti dari kode, diff, requirement, atau test.
- Jangan membuat fakta yang tidak ada di kode atau dokumen sumber.
- Tandai asumsi secara eksplisit.
- Prioritaskan bug, risiko, security, data correctness, requirement mismatch, dan missing tests.
- Jangan memenuhi review dengan preferensi style kecil jika ada risiko yang lebih penting.
- Jangan memberi approval penuh jika test penting belum dijalankan atau konteks utama tidak tersedia.
- Jangan menyarankan refactor besar kecuali refactor itu diperlukan untuk menghilangkan risiko nyata.
- Gunakan requirement ID atau acceptance criteria jika tersedia.
- Setiap temuan harus dapat ditindaklanjuti.
- Jangan mengubah kode kecuali user meminta review sekaligus fix.
- Jika memberi saran fix, jelaskan secara ringkas tanpa menulis ulang seluruh file.

## Quality Checks
Sebelum menyerahkan review, periksa:
- Apakah temuan paling serius ditempatkan paling atas?
- Apakah setiap temuan memiliki file/baris yang jelas?
- Apakah dampak masalah dijelaskan?
- Apakah rekomendasi perbaikan dapat dilakukan?
- Apakah review membedakan fakta, asumsi, dan pertanyaan?
- Apakah requirement/acceptance criteria yang relevan sudah diperiksa?
- Apakah test gap disebutkan?
- Apakah hasil test/lint/typecheck dilaporkan jika dijalankan?
- Apakah summary tidak menutupi temuan penting?

## Failure Conditions
Hentikan atau minta klarifikasi jika:
- Kode/diff yang perlu direview tidak tersedia.
- File yang berubah tidak dapat dibaca.
- Requirement atau tujuan perubahan tidak tersedia padahal review diminta berdasarkan requirement.
- Perubahan bergantung pada sistem eksternal, credential, atau data yang tidak tersedia dan tidak bisa diverifikasi.
- Diff terlalu besar dan user belum menentukan scope review.
- Konflik konteks membuat review berisiko salah arah.

Jika kondisi gagal terjadi, jelaskan informasi apa yang diperlukan agar review bisa dilanjutkan.

## Human Review
Manusia tetap perlu memeriksa:
- Keputusan produk atau requirement yang tidak tertulis.
- Risiko keamanan yang membutuhkan audit mendalam.
- Dampak bisnis dari edge case.
- Kesesuaian dengan standar tim yang tidak tersedia di repository.
- Keputusan akhir merge atau reject.

## Example Invocation
```text
Gunakan skill code-review untuk mereview perubahan pada PR ini. Fokus pada bug, security, requirement mismatch, dan missing tests. Sertakan severity, file/baris, dampak, dan rekomendasi.
```

## Expected Output Example
```markdown
# Code Review Result

## Findings
### [P1] Technician can update requests not assigned to them
- File/Line: `src/api/serviceRequests.ts:88`
- Severity: P1
- Issue: Handler hanya memeriksa role technician, tetapi tidak memeriksa apakah request tersebut ditugaskan ke technician yang sedang login.
- Impact: Teknisi dapat mengubah status request milik teknisi lain.
- Recommendation: Tambahkan pengecekan assignment sebelum menerima update status.
- Related Requirement/AC: FR-04, AC-04.2

### [P2] Missing test for invalid status transition
- File/Line: `tests/serviceRequests.test.ts:42`
- Severity: P2
- Issue: Test hanya mencakup transisi valid dan belum menguji transisi langsung dari Submitted ke Resolved.
- Impact: Regresi status workflow bisa lolos.
- Recommendation: Tambahkan test untuk transisi status yang tidak diizinkan.
- Related Requirement/AC: BR-02

## Open Questions
- Apakah Facility Manager boleh override assignment teknisi?

## Test / Verification
- Tests Run: `npm test`
- Tests Not Run: none
- Test Gaps: Authorization per assignment perlu ditambah.

## Summary
- Reviewed Scope: API status update dan test terkait.
- Overall Risk: High sampai authorization diperbaiki.
- Merge Recommendation: Do not merge until P1 is fixed.
```
