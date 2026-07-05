export interface HistoryEntry {
  status: string;
  actor: string;
  timestamp: string;
  notes?: string;
}

export interface CommentEntry {
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  priority: 'Rendah' | 'Sedang' | 'Tinggi' | 'Mendesak' | '';
  status: 'Baru' | 'Diperiksa' | 'Ditugaskan' | 'Diterima' | 'Sedang Dikerjakan' | 'Selesai Dikerjakan' | 'Ditutup' | 'Ditolak' | 'Dibuka Kembali';
  reporter: string;
  reporterId: string;
  technician: string;
  dateCreated: string;
  history: HistoryEntry[];
  comments: CommentEntry[];
  attachments?: any[];
}

export interface ReportListItem {
  reportCode: string;
  title: string;
  location: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  createdBy?: string;
  assignedTechnicianId?: string | null;
  technician?: string;
}
