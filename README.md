# Campus Maintenance - Service Request Management System

Sistem manajemen permintaan layanan pemeliharaan kampus berbasis Cloudflare Workers + React.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Cloudflare Workers + Custom Router
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2 (file attachments)
- **Styling:** Neo-Brutalism (bold borders, flat shadows)

## Known Limitations

### Mock Authentication (Development Only)

Autentikasi saat ini menggunakan mock header (`x-actor-id`, `x-actor-name`, `x-actor-role`). Ini hanya untuk development dan testing.

**Keterbatasan:**
- Tidak ada keamanan nyata — klien bisa memerankan role apa pun
- Tidak ada session management
- Tidak ada password/token

**Yang diperlukan untuk produksi:**
- Integrasi dengan identity provider (OAuth, JWT, dll)
- Server-side session atau token validation
- Rate limiting dan CSRF protection

## Development

```bash
# Install dependencies
npm install

# Run frontend dev server
npm run dev

# Run backend worker locally
npm run dev:worker

# Run tests
npm test

# Type check
npx tsc --noEmit

# Lint
npx eslint src/
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/ping | Public | Health check |
| POST | /api/reports | Pelapor | Create new report |
| GET | /api/reports | All | List reports (role-scoped) |
| GET | /api/reports/:id | All | Report detail |
| PATCH | /api/reports/:id/triage | Admin | Approve/reject report |
| PATCH | /api/reports/:id/priority | Admin | Set priority |
| POST | /api/reports/:id/assign | Admin | Assign technician |
| POST | /api/reports/:id/assignment/accept | Teknisi | Accept assignment |
| POST | /api/reports/:id/assignment/reject | Teknisi | Reject assignment |
| POST | /api/reports/:id/progress/start | Teknisi | Start work |
| POST | /api/reports/:id/progress/complete | Teknisi | Complete work |
| POST | /api/reports/:id/close | Admin/Pelapor | Close report |
| POST | /api/reports/:id/reopen | Admin | Reopen report |
| POST | /api/reports/:id/comments | All | Add comment |
| GET | /api/dashboard | Admin/Manager | Dashboard statistics |

## Report Status Flow

```
baru → diperiksa → ditugaskan → diterima → sedang_dikerjakan → selesai_dikerjakan → ditutup
  │                        │                            │
  └──→ ditolak             └──→ (reject) → diperiksa     └──→ dibuka_kembali → ditugaskan
```

## Testing

```bash
npm test                    # Run all tests
npx vitest run --reporter=verbose  # Verbose output
```

## Deployment

```bash
# Apply database migrations
npx wrangler d1 migrations apply campus-maintenance-db

# Deploy to Cloudflare
npm run deploy
```
