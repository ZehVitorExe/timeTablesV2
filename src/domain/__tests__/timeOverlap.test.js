import { rangesOverlap, validateDateRange } from '../timeOverlap.js';

describe('timeOverlap domain rules', () => {
  test('detects overlapping intervals', () => {
    expect(rangesOverlap('2026-06-01T10:00:00Z', '2026-06-01T12:00:00Z', '2026-06-01T11:00:00Z', '2026-06-01T13:00:00Z')).toBe(true);
  });

  test('does not detect overlap when intervals are adjacent', () => {
    expect(rangesOverlap('2026-06-01T10:00:00Z', '2026-06-01T12:00:00Z', '2026-06-01T12:00:00Z', '2026-06-01T13:00:00Z')).toBe(false);
  });

  test('validates correct date range', () => {
    const result = validateDateRange('2026-06-01T10:00:00Z', '2026-06-01T12:00:00Z');
    expect(result.startDate).toBeInstanceOf(Date);
    expect(result.endDate).toBeInstanceOf(Date);
  });

  test('throws when end date is before or equal to start date', () => {
    expect(() => validateDateRange('2026-06-01T12:00:00Z', '2026-06-01T12:00:00Z')).toThrow('A data/hora de término deve ser posterior ao início.');
  });
});
