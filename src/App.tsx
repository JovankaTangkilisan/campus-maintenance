import { useEffect, useState, useMemo } from 'react';
import './App.css';

// --- INTERFACES ---
interface HistoryEntry {
  status: string;
  actor: string;
  timestamp: string;
  notes?: string;
}

interface CommentEntry {
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

interface Report {
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

interface ReportListItem {
  reportCode: string;
  title: string;
  location: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  createdBy?: string;
  assignedTechnicianId?: string | null;
}

// --- MOCK CONSTANTS ---
const CATEGORIES = [
  'AC & Pendingin Ruangan',
  'Jaringan & Internet',
  'Alat Presentasi/Proyektor',
  'Furnitur/Mebel',
  'Alat Laboratorium',
  'Kebersihan & Sanitasi',
  'Kelistrikan & Penerangan',
  'Lain-lain'
];

const TECHNICIANS = [
  { name: 'Budi Santoso', specialty: 'AC & Kelistrikan' },
  { name: 'Andi Wijaya', specialty: 'Furnitur & Sipil' },
  { name: 'Joko Susilo', specialty: 'IT & Jaringan' },
  { name: 'Slamet Riyadi', specialty: 'Kebersihan & Mekanikal' }
];

const ROLE_SESSION_MAP = {
  pelapor: { actorId: 'pelapor-1', actorName: 'Fajar Ramadhan (Asisten Lab)', actorRole: 'Pelapor' },
  admin: { actorId: 'admin-1', actorName: 'Administrator', actorRole: 'Administrator' },
  teknisi: { actorId: 'teknisi-1', actorName: 'Budi Santoso', actorRole: 'Teknisi' },
  manajer: { actorId: 'manajer-1', actorName: 'Facility Manager', actorRole: 'Manajer Fasilitas' }
} as const;

function getSessionForRole(role: keyof typeof ROLE_SESSION_MAP) {
  return ROLE_SESSION_MAP[role];
}

function toStatusLabel(status: string) {
  const normalized = status.toLowerCase();
  const statusMap: Record<string, string> = {
    baru: 'Baru',
    diperiksa: 'Diperiksa',
    ditolak: 'Ditolak',
    ditugaskan: 'Ditugaskan',
    diterima: 'Diterima',
    sedang_dikerjakan: 'Sedang Dikerjakan',
    selesai_dikerjakan: 'Selesai Dikerjakan',
    ditutup: 'Ditutup',
    dibuka_kembali: 'Dibuka Kembali'
  };

  return statusMap[normalized] || status;
}

function toPriorityLabel(priority: string) {
  const normalized = priority.toLowerCase();
  const priorityMap: Record<string, string> = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    urgent: 'Mendesak'
  };

  return priorityMap[normalized] || priority;
}

function normalizeLocalReport(report: Report): ReportListItem {
  return {
    reportCode: report.id,
    title: report.title,
    location: report.location,
    category: report.category,
    priority: report.priority ? toPriorityLabel(report.priority) : '',
    status: report.status,
    createdAt: report.dateCreated,
    createdBy: report.reporterId,
    assignedTechnicianId: null
  };
}

function normalizeApiReport(report: any): ReportListItem {
  return {
    reportCode: report.report_code || `CM-${report.id}`,
    title: report.issue_type || report.title || 'Tanpa judul',
    location: report.location || '-',
    category: report.category || '',
    priority: report.priority ? toPriorityLabel(report.priority) : '',
    status: toStatusLabel(report.status || ''),
    createdAt: report.created_at || '',
    createdBy: report.created_by,
    assignedTechnicianId: report.assigned_technician_id ?? null
  };
}

const INITIAL_REPORTS: Report[] = [
  {
    id: 'CM-101',
    title: 'AC Mati di Lab Komputer 3 Gedung D',
    description: 'Sudah 2 hari AC di sisi belakang lab mengeluarkan bunyi bising dan sekarang mati total. Suhu lab menjadi sangat panas sehingga praktikum tidak kondusif.',
    location: 'Gedung D, Lantai 2, Ruang Lab 3',
    category: 'AC & Pendingin Ruangan',
    priority: 'Tinggi',
    status: 'Selesai Dikerjakan',
    reporter: 'Fajar Ramadhan (Asisten Lab)',
    reporterId: 'pelapor-1',
    technician: 'Budi Santoso',
    dateCreated: '2026-06-29 09:15',
    history: [
      { status: 'Baru', actor: 'Fajar Ramadhan (Asisten Lab)', timestamp: '2026-06-29 09:15', notes: 'Laporan pertama kali dibuat.' },
      { status: 'Diperiksa', actor: 'Administrator', timestamp: '2026-06-29 10:30', notes: 'Laporan terverifikasi. AC perlu perbaikan kompresor.' },
      { status: 'Ditugaskan', actor: 'Administrator', timestamp: '2026-06-29 11:00', notes: 'Ditugaskan kepada Budi Santoso.' },
      { status: 'Diterima', actor: 'Budi Santoso', timestamp: '2026-06-29 13:45', notes: 'Tugas diterima, sedang menyiapkan perkakas.' },
      { status: 'Sedang Dikerjakan', actor: 'Budi Santoso', timestamp: '2026-06-30 08:30', notes: 'Mulai pembongkaran kompresor AC.' },
      { status: 'Selesai Dikerjakan', actor: 'Budi Santoso', timestamp: '2026-07-01 14:00', notes: 'Freon diisi ulang, kompresor sudah diganti. AC kembali dingin.' }
    ],
    comments: [
      { author: 'Fajar Ramadhan (Asisten Lab)', role: 'Pelapor', text: 'Mohon segera ditangani ya Pak, besok pagi ada jadwal praktikum basis data 3 kelas berturut-turut.', timestamp: '2026-06-29 09:20' },
      { author: 'Administrator', role: 'Admin', text: 'Siap Mas Fajar, prioritas sudah diubah ke Tinggi dan Teknisi Budi sedang meluncur ke lokasi.', timestamp: '2026-06-29 11:02' },
      { author: 'Budi Santoso', role: 'Teknisi', text: 'Perbaikan selesai. Sudah dites nyala selama 2 jam dan suhu stabil di 18 derajat.', timestamp: '2026-07-01 14:02' }
    ]
  },
  {
    id: 'CM-102',
    title: 'Proyektor Buram & Kuning di R. Kelas A-201',
    description: 'Lampu proyektor tampak redup dan warna output condong kuning/biru. Sangat sulit dibaca oleh mahasiswa di kursi belakang.',
    location: 'Gedung A, Lantai 2, Ruang A-201',
    category: 'Alat Presentasi/Proyektor',
    priority: 'Sedang',
    status: 'Ditugaskan',
    reporter: 'Dr. Hermawan (Dosen)',
    reporterId: 'pelapor-2',
    technician: 'Andi Wijaya',
    dateCreated: '2026-07-01 08:30',
    history: [
      { status: 'Baru', actor: 'Dr. Hermawan (Dosen)', timestamp: '2026-07-01 08:30', notes: 'Laporan dibuat dari portal dosen.' },
      { status: 'Diperiksa', actor: 'Administrator', timestamp: '2026-07-01 09:00', notes: 'Dikonfirmasi, lensa/lampu LCD perlu dibersihkan atau diganti.' },
      { status: 'Ditugaskan', actor: 'Administrator', timestamp: '2026-07-01 09:15', notes: 'Ditugaskan kepada Andi Wijaya karena Budi sedang penuh.' }
    ],
    comments: [
      { author: 'Administrator', role: 'Admin', text: 'Mas Andi, tolong cek apakah filternya berdebu atau memang lampunya sudah habis masa pakai (life hours).', timestamp: '2026-07-01 09:16' }
    ]
  },
  {
    id: 'CM-103',
    title: 'Lampu Koridor Gedung B Padam Total',
    description: 'Seluruh baris lampu di koridor lantai 1 Gedung B padam sejak tadi malam. Lorong menjadi sangat gelap di sore/malam hari dan membahayakan akses jalan.',
    location: 'Gedung B, Lantai 1, Koridor Tengah',
    category: '',
    priority: '',
    status: 'Baru',
    reporter: 'Siti Aminah (Mahasiswa)',
    reporterId: 'pelapor-3',
    technician: '',
    dateCreated: '2026-07-01 20:45',
    history: [
      { status: 'Baru', actor: 'Siti Aminah (Mahasiswa)', timestamp: '2026-07-01 20:45', notes: 'Laporan masuk dari aplikasi mobile.' }
    ],
    comments: []
  },
  {
    id: 'CM-104',
    title: 'WiFi Putus-Putus di Perpustakaan Lantai Dasar',
    description: 'Koneksi ke SSID "Kampus-Hotspot" selalu terputus setiap 5 menit. IP Address sering tidak didapatkan (DHCP Timeout). Sangat mengganggu mahasiswa yang belajar.',
    location: 'Gedung Rektorat/Perpustakaan, Lantai 1',
    category: 'Jaringan & Internet',
    priority: 'Mendesak',
    status: 'Sedang Dikerjakan',
    reporter: 'Rian Hidayat (Mahasiswa)',
    reporterId: 'pelapor-4',
    technician: 'Joko Susilo',
    dateCreated: '2026-06-30 11:10',
    history: [
      { status: 'Baru', actor: 'Rian Hidayat (Mahasiswa)', timestamp: '2026-06-30 11:10', notes: 'Laporan dibuat.' },
      { status: 'Diperiksa', actor: 'Administrator', timestamp: '2026-06-30 11:30', notes: 'Diteruskan ke tim IT Infrastruktur.' },
      { status: 'Ditugaskan', actor: 'Administrator', timestamp: '2026-06-30 11:40', notes: 'Ditugaskan ke Joko Susilo.' },
      { status: 'Diterima', actor: 'Joko Susilo', timestamp: '2026-06-30 13:00', notes: 'Tugas diterima, mendiagnosis akses poin nomor AP-04.' },
      { status: 'Sedang Dikerjakan', actor: 'Joko Susilo', timestamp: '2026-07-01 10:00', notes: 'Sedang mengganti kabel LAN Cat6 dan memeriksa konfigurasi switch port.' }
    ],
    comments: [
      { author: 'Joko Susilo', role: 'Teknisi', text: 'Ada indikasi switch port mengalami flapping. Sedang kami alihkan ke port cadangan.', timestamp: '2026-07-01 10:15' }
    ]
  },
  {
    id: 'CM-105',
    title: 'Kursi Kuliah Patah di R. Sidang C-102',
    description: 'Sandaran kursi lipat berbahan besi-kayu nomor 12 patah pada bagian engsel bawah. Kursi tidak bisa diduduki dan disimpan di sudut ruangan.',
    location: 'Gedung C, Lantai 1, Ruang Sidang Utama C-102',
    category: 'Furnitur/Mebel',
    priority: 'Rendah',
    status: 'Ditutup',
    reporter: 'Lutfi Hakim (Staf Tata Usaha)',
    reporterId: 'pelapor-5',
    technician: 'Andi Wijaya',
    dateCreated: '2026-06-25 14:00',
    history: [
      { status: 'Baru', actor: 'Lutfi Hakim (Staf Tata Usaha)', timestamp: '2026-06-25 14:00', notes: 'Laporan dibuat.' },
      { status: 'Diperiksa', actor: 'Administrator', timestamp: '2026-06-25 15:30', notes: 'Disetujui untuk diperbaiki oleh tukang las.' },
      { status: 'Ditugaskan', actor: 'Administrator', timestamp: '2026-06-25 16:00', notes: 'Ditugaskan ke Andi Wijaya.' },
      { status: 'Diterima', actor: 'Andi Wijaya', timestamp: '2026-06-26 09:00', notes: 'Tugas diterima.' },
      { status: 'Sedang Dikerjakan', actor: 'Andi Wijaya', timestamp: '2026-06-26 10:30', notes: 'Proses pengelasan ulang engsel besi.' },
      { status: 'Selesai Dikerjakan', actor: 'Andi Wijaya', timestamp: '2026-06-26 14:30', notes: 'Engsel diperkuat dengan plat besi baru. Kursi kokoh kembali.' },
      { status: 'Ditutup', actor: 'Administrator', timestamp: '2026-06-27 10:00', notes: 'Pelapor mengonfirmasi kursi sudah diletakkan kembali ke barisan dan aman. Laporan ditutup.' }
    ],
    comments: [
      { author: 'Lutfi Hakim (Staf Tata Usaha)', role: 'Pelapor', text: 'Terima kasih Mas Andi, las-lasannya rapi sekali dan kursi sangat stabil.', timestamp: '2026-06-27 09:40' }
    ]
  }
];

// --- CUSTOM SVG ICONS COMPONENT ---
const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Tag: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Wrench: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  Message: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
};

export default function App() {
  // --- APPLICATION STATE ---
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [activeRole, setActiveRole] = useState<'pelapor' | 'admin' | 'teknisi' | 'manajer'>('pelapor');
  const [listReports, setListReports] = useState<ReportListItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [listRefreshToken, setListRefreshToken] = useState(0);
  
  // Detail state (from API)
  const [detailReport, setDetailReport] = useState<Report | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  
  // Selection
  const [selectedReportId, setSelectedReportId] = useState<string>('CM-101');
  
  // Tabs in Details panel: 'detail' or 'timeline' or 'komentar'
  const [activeDetailTab, setActiveDetailTab] = useState<'detail' | 'timeline' | 'komentar'>('detail');
  
  // Pelapor Form Modal state
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Technician specific filters
  const [selectedTechnicianName, setSelectedTechnicianName] = useState<string>('Budi Santoso');
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Comment Box input state
  const [commentInput, setCommentInput] = useState('');
  
  // Admin Action Form states
  const [assignCategory, setAssignCategory] = useState('');
  const [assignPriority, setAssignPriority] = useState<'Rendah' | 'Sedang' | 'Tinggi' | 'Mendesak' | ''>('');
  const [assignTech, setAssignTech] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  
  // Get currently selected report (prefer API detail data, fallback to local mock)
  const selectedReport = useMemo(() => {
    if (detailReport) return detailReport;
    if (reports.length > 0) {
      return reports.find(r => r.id === selectedReportId) || reports[0];
    }
    return null;
  }, [detailReport, reports, selectedReportId]);

  const activeSession = getSessionForRole(activeRole);

  useEffect(() => {
    const controller = new AbortController();

    const loadReports = async () => {
      setListLoading(true);
      setListError('');

      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter.toLowerCase().replace(/\s+/g, '_'));
        
        // Map priority filter to backend formats ('low', 'medium', 'high', 'urgent')
        if (priorityFilter) {
          const priorityFilterMap: Record<string, string> = {
            'rendah': 'low',
            'sedang': 'medium',
            'tinggi': 'high',
            'mendesak': 'urgent'
          };
          const mappedPriority = priorityFilterMap[priorityFilter.toLowerCase()] || priorityFilter.toLowerCase();
          params.set('priority', mappedPriority);
        }

        if (categoryFilter) params.set('category', categoryFilter);
        if (searchQuery.trim()) params.set('search', searchQuery.trim());
        params.set('sort', 'created_at_desc');
        params.set('page', String(currentPage));
        params.set('page_size', String(pageSize));

        const response = await fetch(`/api/reports?${params.toString()}`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'x-actor-id': activeSession.actorId,
            'x-actor-name': activeSession.actorName,
            'x-actor-role': activeSession.actorRole
          }
        });

        const data: any = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Gagal memuat daftar laporan.');
        }

        const items = data.items || [];

        setListReports(items.map(normalizeApiReport));
        setCurrentPage(data.page || currentPage);
        setTotalPages(data.total_pages || 1);
        setTotalItems(data.total_items || 0);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          return;
        }

        setListError(error.message || 'Gagal memuat daftar laporan.');
        setListReports([]);
      } finally {
        if (!controller.signal.aborted) {
          setListLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      controller.abort();
    };
  }, [activeRole, activeSession.actorId, activeSession.actorName, activeSession.actorRole, categoryFilter, currentPage, listRefreshToken, pageSize, priorityFilter, searchQuery, statusFilter]);

  useEffect(() => {
    if (listReports.length > 0 && !listReports.some(report => report.reportCode === selectedReportId)) {
      setSelectedReportId(listReports[0].reportCode);
    }
  }, [listReports, selectedReportId]);

  // Detail fetch: when selectedReportId changes, load detail from API
  useEffect(() => {
    if (!selectedReportId) return;

    const numericId = selectedReportId.replace(/^CM-/, '');
    const controller = new AbortController();

    const loadDetail = async () => {
      setDetailLoading(true);
      setDetailError('');
      setDetailReport(null);

      try {
        const response = await fetch(`/api/reports/${numericId}`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'x-actor-id': activeSession.actorId,
            'x-actor-name': activeSession.actorName,
            'x-actor-role': activeSession.actorRole
          }
        });

        const data: any = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Gagal memuat detail laporan.');
        }

        const report = data.report;
        const authorName = report.created_by === 'pelapor-1'
          ? 'Fajar Ramadhan (Asisten Lab)'
          : report.created_by;
        const uiReport = mapDbReportToUi(report, authorName);
        setDetailReport(uiReport);
        setDetailError('');
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        setDetailError(error.message || 'Gagal memuat detail laporan.');
        setDetailReport(null);
      } finally {
        if (!controller.signal.aborted) {
          setDetailLoading(false);
        }
      }
    };

    loadDetail();

    return () => { controller.abort(); };
  }, [selectedReportId, activeSession.actorId, activeSession.actorName, activeSession.actorRole]);

  // --- MAPPING & HELPERS ---
  const TECHNICIAN_ID_TO_NAME: Record<string, string> = {
    'teknisi-1': 'Budi Santoso',
    'teknisi-2': 'Andi Wijaya',
    'teknisi-3': 'Joko Susilo',
    'teknisi-4': 'Slamet Riyadi'
  };

  const getCurrentTimestamp = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // UC-01: Buat Laporan Baru (REST API)
  const mapDbReportToUi = (dbReport: any, authorName: string): Report => {
    const statusMap: Record<string, Report['status']> = {
      'baru': 'Baru',
      'diperiksa': 'Diperiksa',
      'ditolak': 'Ditolak',
      'ditugaskan': 'Ditugaskan',
      'diterima': 'Diterima',
      'sedang_dikerjakan': 'Sedang Dikerjakan',
      'selesai_dikerjakan': 'Selesai Dikerjakan',
      'ditutup': 'Ditutup',
      'dibuka_kembali': 'Dibuka Kembali'
    };

    const priorityMap: Record<string, Report['priority']> = {
      'low': 'Rendah',
      'medium': 'Sedang',
      'high': 'Tinggi',
      'urgent': 'Mendesak'
    };

    return {
      id: `CM-${dbReport.id}`,
      title: dbReport.title,
      description: dbReport.description,
      location: dbReport.location,
      category: dbReport.category,
      priority: priorityMap[dbReport.priority] || '',
      status: statusMap[dbReport.status] || 'Baru',
      reporter: authorName,
      reporterId: dbReport.created_by,
      technician: dbReport.assigned_technician_id
        ? (TECHNICIAN_ID_TO_NAME[dbReport.assigned_technician_id] || dbReport.assigned_technician_id)
        : '',
      dateCreated: dbReport.created_at,
      history: dbReport.status_history
        ? dbReport.status_history.map((h: any) => ({
            status: statusMap[h.new_status] || h.new_status,
            actor: h.actor_id === 'pelapor-1' ? 'Fajar Ramadhan (Asisten Lab)' : h.actor_id,
            timestamp: h.changed_at,
            notes: h.notes || ''
          }))
        : dbReport.history
          ? dbReport.history.map((h: any) => ({
              status: statusMap[h.new_status] || h.new_status,
              actor: h.actor_id === 'pelapor-1' ? 'Fajar Ramadhan (Asisten Lab)' : h.actor_id,
              timestamp: h.changed_at,
              notes: h.notes || ''
            }))
          : [
              { status: 'Baru', actor: authorName, timestamp: dbReport.created_at, notes: 'Laporan berhasil diajukan.' }
            ],
      comments: dbReport.comments
        ? dbReport.comments.map((c: any) => ({
            author: c.sender_name || c.author,
            role: c.sender_role || c.role,
            text: c.comment || c.text,
            timestamp: c.created_at || c.timestamp
          }))
        : [],
      attachments: dbReport.attachments ? dbReport.attachments.map((att: any) => ({
        file_name: att.file_name,
        file_type: att.file_type,
        file_size: att.file_size,
        file_url: att.file_url || `https://placehold.co/200x150?text=${encodeURIComponent(att.file_name)}`
      })) : []
    };
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newLocation || !newCategory) {
      setSubmitError('Mohon lengkapi semua data wajib!');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    const session = activeSession;

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-actor-id': session.actorId,
          'x-actor-name': session.actorName,
          'x-actor-role': session.actorRole
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          location: newLocation,
          category: newCategory
        })
      });

      const data: any = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat menyimpan laporan.');
      }

      let finalReport = { ...data.report, attachments: [] as any[] };

      // Jika ada berkas lampiran yang dipilih, lakukan unggah ke R2
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const attachResponse = await fetch(`/api/reports/${data.report.id}/attachments`, {
          method: 'POST',
          headers: {
            'x-actor-id': session.actorId,
            'x-actor-name': session.actorName,
            'x-actor-role': session.actorRole
          },
          body: formData
        });

        const attachData: any = await attachResponse.json();

        if (!attachResponse.ok) {
          throw new Error(attachData.message || 'Laporan berhasil dibuat, tetapi gagal mengunggah lampiran foto.');
        }

        finalReport.attachments = [attachData.attachment];
      }

      setSubmitSuccess(true);

      const newUiReport = mapDbReportToUi(finalReport, session.actorName);
      setReports(prev => [newUiReport, ...prev]);
      setSelectedReportId(newUiReport.id);
      setCurrentPage(1);
      setListRefreshToken(token => token + 1);

      // Reset form dan tutup modal setelah jeda 1.5 detik
      setTimeout(() => {
        setNewTitle('');
        setNewDescription('');
        setNewLocation('');
        setNewCategory('');
        setSelectedFile(null);
        setSubmitSuccess(false);
        setIsNewReportModalOpen(false);
      }, 1500);

    } catch (err: any) {
      setSubmitError(err.message || 'Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validasi format file (hanya JPEG/PNG)
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      alert('Hanya diperbolehkan mengunggah file gambar dengan format JPEG atau PNG!');
      e.target.value = ''; // Reset input
      setSelectedFile(null);
      return;
    }

    // Validasi batas ukuran file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file tidak boleh melebihi batas maksimal 5MB!');
      e.target.value = ''; // Reset input
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // UC-05: Memeriksa Laporan (Terima/Tolak)
  const handleVerifyReport = (accept: boolean) => {
    const timestamp = getCurrentTimestamp();
    setReports(prev => prev.map(r => {
      if (r.id !== selectedReportId) return r;
      
      const newStatus = accept ? 'Diperiksa' : 'Ditolak';
      const reasonNotes = accept 
        ? `Laporan diperiksa & kategori disetujui: ${assignCategory || 'Lain-lain'}` 
        : `Laporan ditolak. Alasan: ${rejectReason || 'Masalah tidak valid'}`;
        
      return {
        ...r,
        status: newStatus,
        category: accept ? (assignCategory || 'Lain-lain') : r.category,
        history: [
          ...r.history,
          { status: newStatus, actor: 'Administrator', timestamp, notes: reasonNotes }
        ]
      };
    }));
    
    // Reset inputs
    setRejectReason('');
  };

  // UC-06: Menentukan Prioritas
  const handleSetPriority = () => {
    if (!assignPriority) return;
    const timestamp = getCurrentTimestamp();
    setReports(prev => prev.map(r => {
      if (r.id !== selectedReportId) return r;
      
      return {
        ...r,
        priority: assignPriority,
        history: [
          ...r.history,
          { status: r.status, actor: 'Administrator', timestamp, notes: `Tingkat prioritas ditetapkan ke: ${assignPriority}` }
        ]
      };
    }));
  };

  // UC-07: Menugaskan Teknisi
  const handleAssignTechnician = () => {
    if (!assignTech) return;
    const timestamp = getCurrentTimestamp();
    setReports(prev => prev.map(r => {
      if (r.id !== selectedReportId) return r;
      
      return {
        ...r,
        status: 'Ditugaskan',
        technician: assignTech,
        history: [
          ...r.history,
          { status: 'Ditugaskan', actor: 'Administrator', timestamp, notes: `Ditugaskan kepada teknisi: ${assignTech}.` }
        ]
      };
    }));
  };

  // UC-08: Mengubah Status Pekerjaan (Teknisi)
  const handleUpdateJobStatus = (nextStatus: 'Diterima' | 'Sedang Dikerjakan' | 'Selesai Dikerjakan' | 'Diperiksa') => {
    const timestamp = getCurrentTimestamp();
    const actorName = selectedTechnicianName;
    
    setReports(prev => prev.map(r => {
      if (r.id !== selectedReportId) return r;
      
      let note = '';
      if (nextStatus === 'Diterima') note = 'Tugas diterima oleh teknisi.';
      else if (nextStatus === 'Sedang Dikerjakan') note = 'Pekerjaan mulai dikerjakan di lokasi.';
      else if (nextStatus === 'Selesai Dikerjakan') note = 'Pekerjaan selesai. Mengirim konfirmasi ke pelapor.';
      else if (nextStatus === 'Diperiksa') note = `Tugas ditolak oleh teknisi. Alasan: ${rejectReason || 'Tidak disebutkan'}`;
      
      return {
        ...r,
        status: nextStatus,
        // If rejected, remove assigned technician so admin can reassign
        technician: nextStatus === 'Diperiksa' ? '' : r.technician,
        history: [
          ...r.history,
          { status: nextStatus, actor: actorName, timestamp, notes: note }
        ]
      };
    }));
    
    setRejectReason('');
  };

  // UC-09: Menambahkan Komentar
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    
    const timestamp = getCurrentTimestamp();
    let author = 'Anonim';
    let role = 'User';
    
    if (activeRole === 'pelapor') {
      author = 'Fajar Ramadhan (Asisten Lab)';
      role = 'Pelapor';
    } else if (activeRole === 'admin') {
      author = 'Administrator';
      role = 'Admin';
    } else if (activeRole === 'teknisi') {
      author = selectedTechnicianName;
      role = 'Teknisi';
    } else if (activeRole === 'manajer') {
      author = 'Facility Manager';
      role = 'Manajer';
    }

    const newComment: CommentEntry = {
      author,
      role,
      text: commentInput,
      timestamp
    };

    setReports(prev => prev.map(r => {
      if (r.id !== selectedReportId) return r;
      return {
        ...r,
        comments: [...r.comments, newComment]
      };
    }));

    setCommentInput('');
  };

  // UC-11: Konfirmasi Pelapor & Penutupan/Pembukaan Kembali (Admin)
  const handleConfirmResult = (approve: boolean) => {
    const timestamp = getCurrentTimestamp();
    const actorName = activeRole === 'pelapor' ? 'Fajar Ramadhan (Asisten Lab)' : 'Administrator';
    
    setReports(prev => prev.map(r => {
      if (r.id !== selectedReportId) return r;
      
      const newStatus = approve ? 'Ditutup' : 'Dibuka Kembali';
      const note = approve 
        ? 'Pelapor menyetujui hasil pekerjaan. Laporan ditutup.' 
        : 'Pelapor tidak puas dengan hasil pekerjaan. Laporan dibuka kembali untuk ditugaskan ulang.';
        
      return {
        ...r,
        status: newStatus,
        history: [
          ...r.history,
          { status: newStatus, actor: actorName, timestamp, notes: note }
        ]
      };
    }));
  };

  // --- FILTERS LOGIC ---
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      // Role scope filter
      if (activeRole === 'pelapor') {
        if (r.reporterId !== activeSession.actorId) {
          return false;
        }
      } else if (activeRole === 'teknisi') {
        if (r.technician !== selectedTechnicianName) {
          return false;
        }
      }
      
      // Search term
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesDesc = r.description.toLowerCase().includes(query);
        const matchesLocation = r.location.toLowerCase().includes(query);
        const matchesId = r.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLocation && !matchesId) return false;
      }
      
      // Status filter
      if (statusFilter && r.status !== statusFilter) return false;
      
      // Priority filter
      if (priorityFilter && r.priority !== priorityFilter) return false;
      
      // Category filter
      if (categoryFilter && r.category !== categoryFilter) return false;
      
      return true;
    });
  }, [reports, activeRole, activeSession.actorId, selectedTechnicianName, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const displayReports = useMemo(() => {
    return listError ? filteredReports.map(normalizeLocalReport) : listReports;
  }, [filteredReports, listError, listReports]);

  const visibleTotalItems = listError ? filteredReports.length : totalItems;
  const displayTotalPages = listError
    ? (visibleTotalItems > 0 ? Math.ceil(visibleTotalItems / pageSize) : 0)
    : totalPages;

  // --- MANAGER ANALYTICS STATS ---
  const stats = useMemo(() => {
    const total = reports.length;
    const active = reports.filter(r => r.status !== 'Ditutup' && r.status !== 'Ditolak').length;
    const closed = reports.filter(r => r.status === 'Ditutup').length;
    const pendingAssign = reports.filter(r => r.status === 'Baru' || r.status === 'Diperiksa').length;
    
    // Status breakdown counts
    const statusCounts: Record<string, number> = {
      'Baru': 0, 'Diperiksa': 0, 'Ditugaskan': 0, 'Sedang Dikerjakan': 0, 'Selesai Dikerjakan': 0, 'Ditutup': 0, 'Ditolak': 0, 'Dibuka Kembali': 0
    };
    
    // Kategori breakdown counts
    const categoryCounts: Record<string, number> = {};
    CATEGORIES.forEach(c => { categoryCounts[c] = 0; });
    categoryCounts['Belum Ditentukan'] = 0;
    
    // Prioritas breakdown counts
    const priorityCounts = { 'Rendah': 0, 'Sedang': 0, 'Tinggi': 0, 'Mendesak': 0, 'Belum Ditentukan': 0 };

    reports.forEach(r => {
      if (statusCounts[r.status] !== undefined) statusCounts[r.status]++;
      else statusCounts[r.status] = 1;
      
      if (r.category) {
        categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      } else {
        categoryCounts['Belum Ditentukan']++;
      }
      
      if (r.priority) {
        priorityCounts[r.priority]++;
      } else {
        priorityCounts['Belum Ditentukan']++;
      }
    });

    return {
      total,
      active,
      closed,
      pendingAssign,
      statusCounts,
      categoryCounts,
      priorityCounts
    };
  }, [reports]);

  // Helper to count status numbers for top bar
  const getStatusCount = (statusName: string) => {
    return reports.filter(r => r.status === statusName).length;
  };

  return (
    <div className="app-container">
      
      {/* HEADER & ROLE SWITCHER */}
      <header className="header">
        <div className="header-top">
          <div className="brand">
            <h1>CampusCare</h1>
            <span className="brand-badge">Maintenance Wireframe</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-fg-light)' }}>
              Local Time: 2026-07-02
            </span>
          </div>
        </div>
        
        <div className="role-switcher-container">
          <div className="role-switcher-title">Simulasi Peran Aktor (Pilih untuk Masuk Ke Dasbor Peran):</div>
          <div className="role-grid">
            
            <button 
              className={`role-btn ${activeRole === 'pelapor' ? 'active' : ''}`}
              onClick={() => { setActiveRole('pelapor'); setStatusFilter(''); setCurrentPage(1); }}
            >
              <span className="role-name">Pelapor</span>
              <span className="role-desc">Mahasiswa / Dosen. Buat laporan & konfirmasi perbaikan.</span>
            </button>
            
            <button 
              className={`role-btn ${activeRole === 'admin' ? 'active' : ''}`}
              onClick={() => { setActiveRole('admin'); setStatusFilter(''); setCurrentPage(1); }}
            >
              <span className="role-name">Administrator</span>
              <span className="role-desc">Pusat Layanan Fasilitas. Kelola status, kategori, prioritas, & teknisi.</span>
            </button>
            
            <button 
              className={`role-btn ${activeRole === 'teknisi' ? 'active' : ''}`}
              onClick={() => { setActiveRole('teknisi'); setStatusFilter(''); setCurrentPage(1); }}
            >
              <span className="role-name">Teknisi</span>
              <span className="role-desc">Petugas Lapangan. Terima & kerjakan tugas perbaikan.</span>
            </button>
            
            <button 
              className={`role-btn ${activeRole === 'manajer' ? 'active' : ''}`}
              onClick={() => { setActiveRole('manajer'); setCurrentPage(1); }}
            >
              <span className="role-name">Facility Manager</span>
              <span className="role-desc">Direktur Sarana Prasarana. Tinjau dashboard & tren penyelesaian.</span>
            </button>
            
          </div>
        </div>

        {/* Technician selector helper if active role is Technician */}
        {activeRole === 'teknisi' && (
          <div className="action-box animate-pop-in" style={{ padding: '10px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>PILIH TEKNISI AKTIF:</span>
            <select 
              className="filter-select"
              value={selectedTechnicianName}
              onChange={(e) => { setSelectedTechnicianName(e.target.value); setCurrentPage(1); }}
              style={{ width: '200px' }}
            >
              {TECHNICIANS.map(t => (
                <option key={t.name} value={t.name}>{t.name} ({t.specialty})</option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>
              Menampilkan {filteredReports.length} tugas untuk {selectedTechnicianName}
            </span>
          </div>
        )}
      </header>

      {/* VIEW: MANAJER FASILITAS (DASHBOARD STATISTIK UTAMA) */}
      {activeRole === 'manajer' ? (
        <div className="manager-dashboard animate-slide-up">
          
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Total Laporan Masuk</span>
              <span className="kpi-value">{stats.total}</span>
              <span className="kpi-subtext">Semua tiket terdaftar</span>
            </div>
            <div className="kpi-card" style={{ borderColor: 'var(--color-warning)' }}>
              <span className="kpi-label">Laporan Aktif</span>
              <span className="kpi-value">{stats.active}</span>
              <span className="kpi-subtext">Masih dalam proses pengerjaan</span>
            </div>
            <div className="kpi-card" style={{ borderColor: 'var(--color-primary)' }}>
              <span className="kpi-label">Selesai / Ditutup</span>
              <span className="kpi-value">{stats.closed}</span>
              <span className="kpi-subtext">Masalah berhasil diatasi</span>
            </div>
            <div className="kpi-card" style={{ borderColor: 'var(--color-info)' }}>
              <span className="kpi-label">Menunggu Penugasan</span>
              <span className="kpi-value">{stats.pendingAssign}</span>
              <span className="kpi-subtext">Belum memiliki teknisi</span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            
            {/* Status Breakdown (Vertical Bar Chart) */}
            <div className="chart-card">
              <span className="chart-title">Status Distribusi Laporan</span>
              <div className="bar-chart-vertical">
                {Object.entries(stats.statusCounts).map(([status, count]) => {
                  const maxCount = Math.max(...Object.values(stats.statusCounts), 1);
                  const percentage = (count / maxCount) * 100;
                  
                  let barColor = 'var(--color-bg-base)';
                  if (status === 'Baru') barColor = '#cbd5e1';
                  else if (status === 'Diperiksa') barColor = 'var(--color-warning-light)';
                  else if (status === 'Ditugaskan') barColor = 'var(--color-info-light)';
                  else if (status === 'Sedang Dikerjakan') barColor = 'var(--color-warning)';
                  else if (status === 'Selesai Dikerjakan') barColor = 'var(--color-primary-light)';
                  else if (status === 'Ditutup') barColor = 'var(--color-primary)';
                  else if (status === 'Ditolak') barColor = 'var(--color-accent)';
                  
                  return (
                    <div className="bar-item-vertical" key={status}>
                      <div 
                        className="bar-fill-vertical" 
                        style={{ 
                          height: `${Math.max(percentage, 5)}%`, 
                          backgroundColor: barColor 
                        }}
                        title={`${status}: ${count} Laporan`}
                      >
                        {count > 0 ? count : ''}
                      </div>
                      <div className="bar-label-vertical" title={status}>{status}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kategori Breakdown (Horizontal Bar Chart) */}
            <div className="chart-card">
              <span className="chart-title">Distribusi Kategori Masalah</span>
              <div className="bar-chart-horizontal">
                {Object.entries(stats.categoryCounts).map(([cat, count]) => {
                  const maxCount = Math.max(...Object.values(stats.categoryCounts), 1);
                  const percentage = (count / maxCount) * 100;
                  
                  return (
                    <div className="bar-item-horizontal" key={cat}>
                      <div className="bar-label-horizontal" title={cat}>{cat}</div>
                      <div className="bar-track-horizontal">
                        <div 
                          className="bar-fill-horizontal" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: count > 0 ? 'var(--color-secondary)' : '#cbd5e1'
                          }}
                        />
                        <span className="bar-val-horizontal">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Low Panel (Auditing List) */}
          <div className="chart-card">
            <span className="chart-title">Daftar Pantau Seluruh Laporan Fasilitas</span>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '10px 8px', fontSize: '0.8rem', fontWeight: 800 }}>TICKET ID</th>
                    <th style={{ padding: '10px 8px', fontSize: '0.8rem', fontWeight: 800 }}>MASALAH</th>
                    <th style={{ padding: '10px 8px', fontSize: '0.8rem', fontWeight: 800 }}>LOKASI</th>
                    <th style={{ padding: '10px 8px', fontSize: '0.8rem', fontWeight: 800 }}>STATUS</th>
                    <th style={{ padding: '10px 8px', fontSize: '0.8rem', fontWeight: 800 }}>PRIORITAS</th>
                    <th style={{ padding: '10px 8px', fontSize: '0.8rem', fontWeight: 800 }}>TEKNISI</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr 
                      key={r.id} 
                      style={{ borderBottom: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}
                      onClick={() => { setActiveRole('admin'); setSelectedReportId(r.id); }}
                    >
                      <td style={{ padding: '10px 8px', fontWeight: 700 }}>{r.id}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <div>{r.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-fg-light)' }}>Kategori: {r.category || 'Belum diisi'}</div>
                      </td>
                      <td style={{ padding: '10px 8px', fontSize: '0.85rem' }}>{r.location}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span className={`badge badge-${r.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        {r.priority ? (
                          <span className={`priority-badge priority-${r.priority.toLowerCase()}`}>
                            {r.priority}
                          </span>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '10px 8px', fontSize: '0.85rem', fontWeight: 600 }}>{r.technician || 'Belum ditunjuk'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        
        /* VIEWS: PELAPOR / ADMIN / TEKNISI (MAIN WORKSPACE: LIST + DETAILS) */
        <div className="dashboard-grid animate-slide-up">
          
          {/* LEFT SIDEBAR: REPORT LIST & FILTERS */}
          <div className="sidebar-panel">
            <div className="panel-header">
              <h2 className="panel-title">
                {activeRole === 'pelapor' ? 'Laporan Saya' : activeRole === 'admin' ? 'Semua Laporan' : 'Tugas Saya'}
              </h2>
              {activeRole === 'pelapor' && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsNewReportModalOpen(true)}
                >
                  <Icons.Plus /> Laporan Baru
                </button>
              )}
            </div>

            {/* Quick Status Pill Bar (Only for Admin & Pelapor for better UX) */}
            {activeRole === 'admin' && (
              <div className="status-summary-bar">
                <div 
                  className={`status-summary-card ${statusFilter === '' ? 'active' : ''}`}
                  onClick={() => { setStatusFilter(''); setCurrentPage(1); }}
                >
                  <span className="status-summary-num">{reports.length}</span>
                  <span className="status-summary-name">Semua</span>
                </div>
                <div 
                  className={`status-summary-card ${statusFilter === 'Baru' ? 'active' : ''}`}
                  onClick={() => { setStatusFilter('Baru'); setCurrentPage(1); }}
                >
                  <span className="status-summary-num">{getStatusCount('Baru')}</span>
                  <span className="status-summary-name">Baru</span>
                </div>
                <div 
                  className={`status-summary-card ${statusFilter === 'Diperiksa' ? 'active' : ''}`}
                  onClick={() => { setStatusFilter('Diperiksa'); setCurrentPage(1); }}
                >
                  <span className="status-summary-num">{getStatusCount('Diperiksa')}</span>
                  <span className="status-summary-name">Check</span>
                </div>
                <div 
                  className={`status-summary-card ${statusFilter === 'Ditugaskan' ? 'active' : ''}`}
                  onClick={() => { setStatusFilter('Ditugaskan'); setCurrentPage(1); }}
                >
                  <span className="status-summary-num">{getStatusCount('Ditugaskan')}</span>
                  <span className="status-summary-name">Tugas</span>
                </div>
                <div 
                  className={`status-summary-card ${statusFilter === 'Selesai Dikerjakan' ? 'active' : ''}`}
                  onClick={() => { setStatusFilter('Selesai Dikerjakan'); setCurrentPage(1); }}
                >
                  <span className="status-summary-num">{getStatusCount('Selesai Dikerjakan')}</span>
                  <span className="status-summary-name">Selesai</span>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="search-filter-box">
              <div className="search-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Cari kata kunci, lokasi, ID..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
                <span className="search-icon-svg">
                  <Icons.Search />
                </span>
              </div>

              <div className="filter-grid">
                <select 
                  className="filter-select"
                  value={priorityFilter}
                  onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Semua Prioritas</option>
                  <option value="Rendah">Rendah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Mendesak">Mendesak</option>
                </select>

                <select 
                  className="filter-select"
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Semua Kategori</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List */}
            {listError && displayReports.length > 0 && (
              <div style={{ marginBottom: '12px', padding: '10px 12px', borderRadius: '8px', background: 'var(--color-warning-light)', color: 'var(--color-warning-hover)', border: '1px solid var(--color-warning)' }}>
                Backend daftar belum tersedia, jadi tampilan memakai data demo lokal sementara.
              </div>
            )}
            <div className="report-list">
              {listLoading && displayReports.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon"><Icons.Alert /></span>
                  <p>Memuat daftar laporan...</p>
                  <p style={{ fontSize: '0.75rem' }}>Mohon tunggu sebentar.</p>
                </div>
              ) : displayReports.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon"><Icons.Alert /></span>
                  <p>Tidak ada laporan ditemukan</p>
                  <p style={{ fontSize: '0.75rem' }}>Coba ubah kata kunci pencarian atau filter Anda.</p>
                </div>
              ) : (
                displayReports.map(r => (
                  <div 
                    key={r.reportCode} 
                    className={`report-card ${selectedReportId === r.reportCode ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedReportId(r.reportCode);
                      setActiveDetailTab('detail');
                    }}
                  >
                    <div className="report-card-top">
                      <span className="report-id">{r.reportCode}</span>
                      <span className={`badge badge-${r.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {r.status}
                      </span>
                    </div>

                    <div className="report-title">{r.title}</div>
                    
                    <div className="report-meta-row">
                      <div className="meta-item">
                        <span className="meta-icon"><Icons.MapPin /></span>
                        <span>{r.location.split(',')[0]}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon"><Icons.Clock /></span>
                        <span>{r.createdAt.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-fg-light)' }}>
                        {r.category ? r.category.split('/')[0] : 'Kategori Kosong'}
                      </span>
                      {r.priority && (
                        <span className={`priority-badge priority-${r.priority.toLowerCase()}`}>
                          {r.priority}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {displayTotalPages > 1 && (
              <div className="pagination-bar">
                <button
                  className="btn btn-sm"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </button>
                <span className="pagination-meta">
                  Halaman {currentPage} dari {displayTotalPages} · {visibleTotalItems} laporan
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="pagination-label" htmlFor="page-size-select">Tampilkan</label>
                  <select
                    id="page-size-select"
                    className="filter-select"
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    style={{ width: '88px' }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <button
                  className="btn btn-sm"
                  onClick={() => setCurrentPage(page => Math.min(displayTotalPages, page + 1))}
                  disabled={currentPage >= displayTotalPages}
                >
                  Berikutnya
                </button>
              </div>
            )}
          </div>

          {/* RIGHT VIEW: REPORT DETAILS */}
          <div className="detail-panel">
            
            {detailLoading && !detailReport && (
              <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                <span className="empty-icon"><Icons.Alert /></span>
                <p>Memuat detail laporan...</p>
              </div>
            )}

            {detailError && !detailReport && (
              <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                <span className="empty-icon"><Icons.Alert /></span>
                <p style={{ color: 'var(--color-accent)' }}>{detailError}</p>
                <p style={{ fontSize: '0.75rem' }}>Menampilkan data lokal sebagai cadangan.</p>
              </div>
            )}

            {selectedReport && (
            <>
            {/* Header Detail */}
            <div className="detail-header">
              <div className="detail-title-row">
                <h1 className="detail-title">{selectedReport.title}</h1>
                <span className="report-id" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>{selectedReport.id}</span>
              </div>

              <div className="detail-badges">
                <span className={`badge badge-${selectedReport.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  Status: {selectedReport.status}
                </span>
                
                {selectedReport.priority && (
                  <span className={`priority-badge priority-${selectedReport.priority.toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                    Prioritas: {selectedReport.priority}
                  </span>
                )}
                
                {selectedReport.category && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)' }}>
                    Kategori: {selectedReport.category}
                  </span>
                )}
              </div>
            </div>

            {/* Detail Tabs selector */}
            <div className="detail-tab-row">
              <button 
                className={`detail-tab ${activeDetailTab === 'detail' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('detail')}
              >
                Informasi & Aksi
              </button>
              <button 
                className={`detail-tab ${activeDetailTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('timeline')}
              >
                Riwayat Status ({selectedReport.history.length})
              </button>
              <button 
                className={`detail-tab ${activeDetailTab === 'komentar' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('komentar')}
              >
                Komentar & Catatan ({selectedReport.comments.length})
              </button>
            </div>

            {/* TAB CONTENT: DETAILS */}
            {activeDetailTab === 'detail' && (
              <div className="detail-body animate-pop-in">
                
                {/* Meta info grid */}
                <div className="detail-info-grid">
                  <div className="info-block">
                    <span className="info-label">Pelapor</span>
                    <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icons.User /> {selectedReport.reporter}
                    </span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">Lokasi Masalah</span>
                    <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icons.MapPin /> {selectedReport.location}
                    </span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">Tanggal Pelaporan</span>
                    <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icons.Clock /> {selectedReport.dateCreated}
                    </span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">Teknisi Ditugaskan</span>
                    <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icons.Wrench /> {selectedReport.technician || 'Belum ditugaskan'}
                    </span>
                  </div>
                </div>

                <div className="info-block">
                  <h3 className="section-title">Deskripsi Masalah</h3>
                  <div className="description-text">{selectedReport.description}</div>
                </div>

                {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                  <div className="info-block" style={{ marginTop: '16px' }}>
                    <h3 className="section-title">Lampiran Foto Bukti</h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {selectedReport.attachments.map((att: any, idx: number) => (
                        <div key={idx} style={{ border: '1px solid var(--color-border-subtle)', borderRadius: '8px', overflow: 'hidden', padding: '8px', backgroundColor: 'var(--color-bg-base)', maxWidth: '240px', boxShadow: 'var(--shadow-sm)' }}>
                          <img 
                            src={att.file_url} 
                            alt={att.file_name} 
                            style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px', display: 'block' }} 
                          />
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', marginTop: '6px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 500 }} title={att.file_name}>
                            📎 {att.file_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- CONTEXTUAL ACTION BOXES PER ROLE --- */}
                
                {/* 1. PELAPOR ACTION BOX: Confirm Work Completion */}
                {activeRole === 'pelapor' && selectedReport.status === 'Selesai Dikerjakan' && (
                  <div className="action-box animate-pop-in">
                    <span className="action-title"><Icons.Alert /> Konfirmasi Hasil Pekerjaan</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', marginBottom: '8px' }}>
                      Teknisi telah menandai pekerjaan ini selesai. Apakah perbaikan fasilitas di lokasi sudah sesuai dan dapat ditutup?
                    </p>
                    <div className="action-row">
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleConfirmResult(true)}
                      >
                        <Icons.Check /> Ya, Sesuai (Tutup Laporan)
                      </button>
                      <button 
                        className="btn btn-accent" 
                        onClick={() => handleConfirmResult(false)}
                      >
                        Belum Sesuai (Re-Open)
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. ADMINISTRATOR ACTION BOXES */}
                {activeRole === 'admin' && (
                  <>
                    {/* Check / Verify Section for status 'Baru' */}
                    {selectedReport.status === 'Baru' && (
                      <div className="action-box action-box-admin animate-pop-in">
                        <span className="action-title">Verifikasi Kelayakan Laporan</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', marginBottom: '8px' }}>
                          Periksa laporan ini. Tentukan kategori untuk meneruskan laporan, atau tolak jika tidak valid.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                          <div className="form-group">
                            <label className="form-label">Pilih Kategori Masalah</label>
                            <select 
                              className="form-select"
                              value={assignCategory}
                              onChange={(e) => setAssignCategory(e.target.value)}
                            >
                              <option value="">-- Pilih Kategori --</option>
                              {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleVerifyReport(true)}
                            disabled={!assignCategory}
                            style={{ height: '42px', opacity: assignCategory ? 1 : 0.6 }}
                          >
                            <Icons.Check /> Setujui & Proses
                          </button>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', marginTop: '4px' }}>
                          <div className="form-group" style={{ marginBottom: '8px' }}>
                            <label className="form-label">Catatan Penolakan Laporan (Opsional jika ditolak)</label>
                            <input 
                              type="text" 
                              placeholder="Contoh: Tiket duplikat dengan CM-99" 
                              className="form-input"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                            />
                          </div>
                          <button 
                            className="btn btn-accent"
                            onClick={() => handleVerifyReport(false)}
                          >
                            Tolak Laporan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Prioritization Section if status is 'Diperiksa' and priority is not set */}
                    {selectedReport.status === 'Diperiksa' && !selectedReport.priority && (
                      <div className="action-box action-box-admin animate-pop-in">
                        <span className="action-title">Tetapkan Prioritas Masalah</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', marginBottom: '8px' }}>
                          Urutkan penanganan berdasarkan dampak kerusakan.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                          <div className="form-group">
                            <label className="form-label">Tingkat Prioritas</label>
                            <select 
                              className="form-select"
                              value={assignPriority}
                              onChange={(e) => setAssignPriority(e.target.value as any)}
                            >
                              <option value="">-- Pilih Prioritas --</option>
                              <option value="Rendah">Rendah (Fungsi kosmetik, minor)</option>
                              <option value="Sedang">Sedang (Ada alternatif/dapat digunakan terbatas)</option>
                              <option value="Tinggi">Tinggi (Merusak jalannya aktivitas belajar)</option>
                              <option value="Mendesak">Mendesak (Isu keselamatan/fasilitas kritis lumpuh)</option>
                            </select>
                          </div>
                          <button 
                            className="btn btn-primary"
                            onClick={handleSetPriority}
                            disabled={!assignPriority}
                            style={{ height: '42px', opacity: assignPriority ? 1 : 0.6 }}
                          >
                            Tetapkan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Assignment Section if priority is set but technician is not assigned */}
                    {selectedReport.status === 'Diperiksa' && selectedReport.priority && (
                      <div className="action-box action-box-admin animate-pop-in">
                        <span className="action-title">Tugaskan Teknisi</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', marginBottom: '8px' }}>
                          Pilih teknisi yang berkompeten sesuai spesialisasi masalah.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                          <div className="form-group">
                            <label className="form-label">Daftar Teknisi Lapangan</label>
                            <select 
                              className="form-select"
                              value={assignTech}
                              onChange={(e) => setAssignTech(e.target.value)}
                            >
                              <option value="">-- Pilih Teknisi --</option>
                              {TECHNICIANS.map(t => (
                                <option key={t.name} value={t.name}>{t.name} ({t.specialty})</option>
                              ))}
                            </select>
                          </div>
                          <button 
                            className="btn btn-primary"
                            onClick={handleAssignTechnician}
                            disabled={!assignTech}
                            style={{ height: '42px', opacity: assignTech ? 1 : 0.6 }}
                          >
                            Tugaskan & Kirim Notif
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Admin Close/Reopen option if reporter completed but ticket hasn't been closed */}
                    {selectedReport.status === 'Selesai Dikerjakan' && (
                      <div className="action-box action-box-admin animate-pop-in">
                        <span className="action-title">Tutup / Buka Kembali (Admin Kontrol)</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', marginBottom: '8px' }}>
                          Teknisi telah menyelesaikan pekerjaan. Sebagai Administrator, Anda dapat menutup tiket secara manual jika pelapor tidak menanggapi konfirmasi.
                        </p>
                        <div className="action-row">
                          <button className="btn btn-primary" onClick={() => handleConfirmResult(true)}>
                            Tutup Laporan
                          </button>
                          <button className="btn btn-accent" onClick={() => handleConfirmResult(false)}>
                            Re-Open
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* 3. TEKNISI ACTION BOX */}
                {activeRole === 'teknisi' && selectedReport.technician === selectedTechnicianName && (
                  <div className="action-box animate-pop-in">
                    <span className="action-title">Aksi Pengerjaan Tugas</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)' }}>
                      Perbarui progres pengerjaan Anda secara berkala agar pelapor dan admin mendapatkan notifikasi status terkini.
                    </p>
                    
                    {selectedReport.status === 'Ditugaskan' && (
                      <div className="action-row" style={{ marginTop: '8px' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleUpdateJobStatus('Diterima')}
                        >
                          Terima Tugas
                        </button>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <input 
                            type="text" 
                            placeholder="Alasan penolakan tugas..." 
                            className="form-input" 
                            style={{ padding: '6px' }}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                          />
                          <button 
                            className="btn btn-accent btn-sm"
                            onClick={() => handleUpdateJobStatus('Diperiksa')}
                          >
                            Tolak Tugas
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedReport.status === 'Diterima' && (
                      <div className="action-row" style={{ marginTop: '8px' }}>
                        <button 
                          className="btn btn-warning"
                          onClick={() => handleUpdateJobStatus('Sedang Dikerjakan')}
                        >
                          Mulai Pengerjaan
                        </button>
                      </div>
                    )}

                    {selectedReport.status === 'Sedang Dikerjakan' && (
                      <div className="action-row" style={{ marginTop: '8px' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleUpdateJobStatus('Selesai Dikerjakan')}
                        >
                          Pekerjaan Selesai
                        </button>
                      </div>
                    )}

                    {selectedReport.status === 'Selesai Dikerjakan' && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-hover)' }}>
                        Menunggu konfirmasi pelapor terkait hasil perbaikan.
                      </span>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: TIMELINE */}
            {activeDetailTab === 'timeline' && (
              <div className="timeline animate-pop-in">
                {selectedReport.history.map((log, index) => (
                  <div className="timeline-item" key={index}>
                    <span className={`timeline-marker ${index === selectedReport.history.length - 1 ? 'active' : ''}`} />
                    <div className="timeline-content">
                      <span className="timeline-status">Status Berubah Ke: <span className="badge badge-baru">{log.status}</span></span>
                      {log.notes && <span style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: '4px 0' }}>"{log.notes}"</span>}
                      <span className="timeline-meta">Oleh: <strong>{log.actor}</strong> &bull; {log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: KOMENTAR & CHAT */}
            {activeDetailTab === 'komentar' && (
              <div className="comments-container animate-pop-in">
                <div className="comment-list">
                  {selectedReport.comments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-fg-light)' }}>
                      Belum ada komentar untuk laporan ini. Tulis komentar di bawah untuk berkomunikasi.
                    </div>
                  ) : (
                    selectedReport.comments.map((comment, index) => (
                      <div className="comment-card" key={index}>
                        <div className="comment-header">
                          <span className="comment-author">
                            {comment.author} 
                            <span className="comment-author-badge">{comment.role}</span>
                          </span>
                          <span className="comment-time">{comment.timestamp}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form className="comment-form" onSubmit={handleAddComment}>
                  <input 
                    type="text" 
                    placeholder="Tulis tanggapan atau catatan pemeliharaan..." 
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">Kirim</button>
                </form>
              </div>
            )}

            </>
          )}

          </div>

        </div>
      )}

      {/* --- FORM MODAL: BUAT LAPORAN BARU (PELAPOR) --- */}
      {isNewReportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop-in">
            <div className="modal-header">
              <h2 className="panel-title">Buat Laporan Kerusakan Baru</h2>
              <button className="modal-close" onClick={() => setIsNewReportModalOpen(false)}>&times;</button>
            </div>
            
             <form onSubmit={handleCreateReport}>
              <div className="modal-body">
                {submitError && (
                  <div style={{ padding: '10px 14px', backgroundColor: '#fde8e8', color: '#9b1c1c', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid #f8b4b4' }}>
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div style={{ padding: '10px 14px', backgroundColor: '#def7ec', color: '#03543f', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid #bcf0da' }}>
                    Laporan baru berhasil diajukan dengan status <strong>Baru</strong>!
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Judul Laporan / Kerusakan *</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: AC Bocor, Proyektor Mati, Engsel Kursi Patah..." 
                    className="form-input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Jenis Masalah / Kategori *</label>
                  <select 
                    className="form-input"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">-- Pilih Jenis Masalah --</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Lokasi Kerusakan Fasilitas *</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Gedung D, Ruang Lab Komputer 1, Lantai 3" 
                    className="form-input"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi Detil Kerusakan *</label>
                  <textarea 
                    placeholder="Jelaskan secara rinci kondisi kerusakan, jumlah unit, dan dampaknya agar administrator memvalidasi dengan mudah..." 
                    className="form-textarea"
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lampiran Foto Bukti (Opsional, Maks 5MB, format JPEG/PNG)</label>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    className="form-input"
                    disabled={isSubmitting}
                    style={{ padding: '6px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'var(--color-bg-base)', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>
                  <Icons.Alert />
                  <span>
                    Setelah diajukan, laporan akan otomatis berstatus <strong>Baru</strong> dan dikirim ke Administrator untuk diperiksa kelayakannya.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setIsNewReportModalOpen(false)} disabled={isSubmitting}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Mengajukan...' : 'Ajukan Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
