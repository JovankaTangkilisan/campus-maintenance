import type { Report, ReportListItem } from './types';
import { ROLE_SESSION_MAP } from './constants';

export function getSessionForRole(role: keyof typeof ROLE_SESSION_MAP) {
  return ROLE_SESSION_MAP[role];
}

export function toStatusLabel(status: string) {
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

export function toPriorityLabel(priority: string) {
  const normalized = priority.toLowerCase();
  const priorityMap: Record<string, string> = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    urgent: 'Mendesak'
  };

  return priorityMap[normalized] || priority;
}

export function normalizeLocalReport(report: Report): ReportListItem {
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

export function normalizeApiReport(report: any): ReportListItem {
  return {
    reportCode: report.report_code || `CM-${report.id}`,
    title: report.issue_type || report.title || 'Tanpa judul',
    location: report.location || '-',
    category: report.category || '',
    priority: report.priority ? toPriorityLabel(report.priority) : '',
    status: toStatusLabel(report.status || ''),
    createdAt: report.created_at || '',
    createdBy: report.created_by || '',
    assignedTechnicianId: report.assigned_technician_id ?? null
  };
}

export function getCurrentTimestamp(): string {
  return new Date().toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatTimestamp(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}
