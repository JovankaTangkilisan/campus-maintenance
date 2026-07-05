-- Skema Database Relasional Cloudflare D1
-- untuk Campus Service Request and Maintenance System

-- 1. Tabel Utama: service_requests
CREATE TABLE IF NOT EXISTS service_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL CHECK(status IN ('baru', 'diperiksa', 'ditolak', 'ditugaskan', 'diterima', 'sedang_dikerjakan', 'selesai_dikerjakan', 'ditutup', 'dibuka_kembali')),
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    rejection_reason TEXT,
    assigned_technician_id TEXT,
    started_at DATETIME,
    completed_at DATETIME,
    closed_at DATETIME,
    reopened_at DATETIME
);

-- 2. Tabel Komentar: service_request_comments
CREATE TABLE IF NOT EXISTS service_request_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_request_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE
);

-- 3. Tabel Riwayat Status (Audit Trail): service_request_status_history
CREATE TABLE IF NOT EXISTS service_request_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_request_id INTEGER NOT NULL,
    old_status TEXT CHECK(old_status IS NULL OR old_status IN ('baru', 'diperiksa', 'ditolak', 'ditugaskan', 'diterima', 'sedang_dikerjakan', 'selesai_dikerjakan', 'ditutup', 'dibuka_kembali')),
    new_status TEXT NOT NULL CHECK(new_status IN ('baru', 'diperiksa', 'ditolak', 'ditugaskan', 'diterima', 'sedang_dikerjakan', 'selesai_dikerjakan', 'ditutup', 'dibuka_kembali')),
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes TEXT,
    FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE
);

-- 4. Tabel Penugasan Teknisi: service_request_assignments
CREATE TABLE IF NOT EXISTS service_request_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_request_id INTEGER NOT NULL,
    technician_id TEXT NOT NULL,
    assigned_by TEXT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('assigned', 'accepted', 'rejected', 'completed')) DEFAULT 'assigned',
    is_active INTEGER DEFAULT 1,
    acknowledged_at DATETIME,
    rejected_at DATETIME,
    rejection_reason TEXT,
    FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE
);

-- 5. Tabel Lampiran: service_request_attachments
CREATE TABLE IF NOT EXISTS service_request_attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_request_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE
);

-- 6. Tabel Pengguna: users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Pelapor', 'Administrator', 'Teknisi', 'Manajer Fasilitas')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. Tabel Sesi Login: sessions
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indeks Kinerja untuk Kueri Pencarian, Filter, dan Timeline
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_priority ON service_requests(priority);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_by ON service_requests(created_by);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_comments_service_request_id ON service_request_comments(service_request_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON service_request_comments(created_at);

CREATE INDEX IF NOT EXISTS idx_status_history_service_request_id ON service_request_status_history(service_request_id);
CREATE INDEX IF NOT EXISTS idx_status_history_changed_at ON service_request_status_history(changed_at);

CREATE INDEX IF NOT EXISTS idx_assignments_service_request_id ON service_request_assignments(service_request_id);
CREATE INDEX IF NOT EXISTS idx_assignments_technician_id ON service_request_assignments(technician_id);

CREATE INDEX IF NOT EXISTS idx_attachments_service_request_id ON service_request_attachments(service_request_id);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Seed data: demo users (password: password123)
-- SHA-256 hash of "password123"
INSERT OR IGNORE INTO users (id, username, password_hash, name, role) VALUES
    ('pelapor-1', 'fajar', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Fajar Ramadhan (Asisten Lab)', 'Pelapor'),
    ('pelapor-2', 'hermawan', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Dr. Hermawan (Dosen)', 'Pelapor'),
    ('admin-1', 'admin', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Administrator', 'Administrator'),
    ('teknisi-1', 'budi', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Budi Santoso', 'Teknisi'),
    ('teknisi-2', 'andi', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Andi Wijaya', 'Teknisi'),
    ('teknisi-3', 'joko', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Joko Susilo', 'Teknisi'),
    ('teknisi-4', 'slamet', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Slamet Riyadi', 'Teknisi'),
    ('manajer-1', 'manager', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Facility Manager', 'Manajer Fasilitas');
