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

export type ActiveRole = keyof typeof ROLE_SESSION_MAP;
