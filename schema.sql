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
    rejection_reason TEXT
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
