import { describe, it, expect } from 'vitest';
import { toStatusLabel, toPriorityLabel, formatTimestamp } from './utils';

describe('toStatusLabel', () => {
  it('should convert status correctly', () => {
    expect(toStatusLabel('baru')).toBe('Baru');
    expect(toStatusLabel('diperiksa')).toBe('Diperiksa');
    expect(toStatusLabel('ditolak')).toBe('Ditolak');
    expect(toStatusLabel('ditugaskan')).toBe('Ditugaskan');
    expect(toStatusLabel('diterima')).toBe('Diterima');
    expect(toStatusLabel('sedang_dikerjakan')).toBe('Sedang Dikerjakan');
    expect(toStatusLabel('selesai_dikerjakan')).toBe('Selesai Dikerjakan');
    expect(toStatusLabel('ditutup')).toBe('Ditutup');
    expect(toStatusLabel('dibuka_kembali')).toBe('Dibuka Kembali');
  });

  it('should return original value for unknown status', () => {
    expect(toStatusLabel('unknown')).toBe('unknown');
  });
});

describe('toPriorityLabel', () => {
  it('should convert priority correctly', () => {
    expect(toPriorityLabel('low')).toBe('Rendah');
    expect(toPriorityLabel('medium')).toBe('Sedang');
    expect(toPriorityLabel('high')).toBe('Tinggi');
    expect(toPriorityLabel('urgent')).toBe('Mendesak');
  });

  it('should return original value for unknown priority', () => {
    expect(toPriorityLabel('unknown')).toBe('unknown');
  });
});

describe('formatTimestamp', () => {
  it('should return dash for empty string', () => {
    expect(formatTimestamp('')).toBe('-');
  });

  it('should format valid date string', () => {
    const result = formatTimestamp('2026-07-03T10:30:00');
    expect(result).toContain('2026');
    expect(result).toContain('Jul');
  });

  it('should return original string for invalid date', () => {
    expect(formatTimestamp('invalid')).toBe('Invalid Date');
  });
});
