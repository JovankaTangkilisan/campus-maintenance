# Code Review Result

## Findings
### [P1] Seeded login now exposes every role with the same trivial password
- File/Line: `schema.sql:116-126`, `worker/index.ts:96-103`
- Severity: P1
- Issue: Semua akun demo disimpan dengan hash SHA-256 yang sama untuk `password123`, dan login menerima username/password tersebut tanpa salt atau mekanisme hashing yang lebih kuat. Akibatnya, siapa pun yang mengetahui password demo dapat masuk sebagai Pelapor, Administrator, Teknisi, atau Manajer Fasilitas.
- Impact: Otentikasi untuk akun seeded praktis tidak melindungi boundary role, sehingga akses ke data dan aksi sensitif bisa diambil alih dengan kredensial yang sangat mudah ditebak.
- Recommendation: Jangan commit kredensial demo ke schema produksi. Jika akun seed tetap diperlukan, gunakan password unik per user, hash yang salted, dan pisahkan seed lokal dari skema deployment.
- Related Requirement/AC: NFR-001, security boundary untuk role-based access

### [P1] Create-report handler tidak sesuai payload requirement yang disetujui
- File/Line: `worker/index.ts:202-232`
- Severity: P1
- Issue: Handler `POST /api/reports` mewajibkan `title` dan `category`, lalu menyimpannya ke `service_requests`, padahal requirement dan kontrak desain yang disetujui mendefinisikan input minimum sebagai lokasi, jenis masalah, dan deskripsi, dengan lampiran foto opsional. Request valid menurut spesifikasi akan ditolak jika `title` tidak dikirim, dan payload yang dipakai UI/API contract tidak cocok dengan implementasi.
- Impact: FR-001 dan FR-002 gagal untuk client yang mengikuti spesifikasi. Form create report dari UI akan berpotensi gagal submit walau field yang diwajibkan sudah diisi.
- Recommendation: Selaraskan handler dengan kontrak yang disetujui. Jika `title` memang diperlukan, perbarui requirement/UI/API contract terlebih dahulu; jika tidak, hapus validasi dan penyimpanan `title` dari jalur create report.
- Related Requirement/AC: FR-001, FR-002, AC-001, AC-002

### [P1] Attachment upload tidak akan jalan di deployment default
- File/Line: `wrangler.jsonc:51-56`, `worker/index.ts:307-315`
- Severity: P1
- Issue: Binding R2 `ATTACHMENTS` dikomentari di konfigurasi Wrangler, tetapi route upload tetap mensyaratkan binding tersebut dan melempar `500` bila tidak tersedia. Artinya fitur upload lampiran yang ada di scope tidak dapat berjalan pada deployment default saat ini.
- Impact: FR-001 untuk lampiran foto terblokir, dan alur upload akan gagal di environment yang dibangun dari konfigurasi repo sekarang. Ini juga konsisten dengan test yang time out pada kasus attachment.
- Recommendation: Pulihkan binding R2 di `wrangler.jsonc` atau gate fitur ini secara eksplisit jika memang belum siap. Pastikan environment test dan deployment sama-sama punya bucket yang terkonfigurasi.
- Related Requirement/AC: FR-001, attachment upload

## Open Questions
- Apakah akun demo memang sengaja dipertahankan di skema deployment, atau seharusnya dipindah ke setup lokal בלבד?
- Apakah `title` adalah field produk yang benar-benar disetujui, atau hanya sisa implementasi lama?
- Apakah attachment upload memang harus aktif di deployment sekarang, atau masih dalam tahap pending validation?

## Test / Verification
- Tests Run: `cmd /c npm test`
- Tests Not Run: `npm test` via PowerShell gagal karena execution policy memblokir `npm.ps1`
- Test Gaps: 3 test gagal di `worker/tests/router.test.ts`, termasuk 2 kasus attachment yang time out dan 1 assertion mismatch untuk pesan error auth tanpa header.

## Summary
- Reviewed Scope: `schema.sql`, `worker/index.ts`, `worker/middleware/auth.ts`, `worker/types.ts`, dan `wrangler.jsonc`
- Overall Risk: High
- Merge Recommendation: Do not merge until the three P1 issues above are fixed or explicitly waived

## Human Review
- Perubahan ini perlu ditinjau manusia karena ada dampak langsung ke autentikasi, konfigurasi deployment, dan kesesuaian requirement.
- Reviewer manusia perlu memastikan apakah akun demo memang boleh ada di repo, atau harus dipindah ke setup lokal saja.
- Reviewer manusia perlu memutuskan apakah field `title` dan `category` adalah requirement produk yang valid, atau sisa implementasi lama yang harus dihapus.
- Reviewer manusia perlu mengonfirmasi apakah upload lampiran harus aktif di deployment sekarang, atau masih boleh ditunda sampai binding R2 siap.
- Reviewer manusia perlu memeriksa ulang hasil test karena dua kasus attachment masih time out dan pesan error autentikasi sudah berubah.
