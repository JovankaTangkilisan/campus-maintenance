export const CATEGORIES = [
  'AC & Pendingin Ruangan',
  'Jaringan & Internet',
  'Alat Presentasi/Proyektor',
  'Furnitur/Mebel',
  'Alat Laboratorium',
  'Kebersihan & Sanitasi',
  'Kelistrikan & Penerangan',
  'Lain-lain'
];

export const TECHNICIANS = [
  { name: 'Budi Santoso', specialty: 'AC & Kelistrikan' },
  { name: 'Andi Wijaya', specialty: 'Furnitur & Sipil' },
  { name: 'Joko Susilo', specialty: 'IT & Jaringan' },
  { name: 'Slamet Riyadi', specialty: 'Kebersihan & Mekanikal' }
];

export const ROLE_SESSION_MAP = {
  pelapor: { actorId: 'pelapor-1', actorName: 'Fajar Ramadhan (Asisten Lab)', actorRole: 'Pelapor' },
  admin: { actorId: 'admin-1', actorName: 'Administrator', actorRole: 'Administrator' },
  teknisi: { actorId: 'teknisi-1', actorName: 'Budi Santoso', actorRole: 'Teknisi' },
  manajer: { actorId: 'manajer-1', actorName: 'Facility Manager', actorRole: 'Manajer Fasilitas' }
} as const;

export const NAME_TO_TECHNICIAN_ID: Record<string, string> = {
  'Budi Santoso': 'teknisi-1',
  'Andi Wijaya': 'teknisi-2',
  'Joko Susilo': 'teknisi-3',
  'Slamet Riyadi': 'teknisi-4'
};

export const ACTOR_ID_TO_NAME: Record<string, string> = {
  'pelapor-1': 'Fajar Ramadhan (Asisten Lab)',
  'pelapor-2': 'Dr. Hermawan (Dosen)',
  'pelapor-3': 'Siti Aminah (Mahasiswa)',
  'pelapor-4': 'Rian Hidayat (Mahasiswa)',
  'pelapor-5': 'Lutfi Hakim (Staf Tata Usaha)',
  'admin-1': 'Administrator',
  'teknisi-1': 'Budi Santoso',
  'teknisi-2': 'Andi Wijaya',
  'teknisi-3': 'Joko Susilo',
  'teknisi-4': 'Slamet Riyadi',
  'manajer-1': 'Facility Manager'
};

export type ActiveRole = keyof typeof ROLE_SESSION_MAP;
