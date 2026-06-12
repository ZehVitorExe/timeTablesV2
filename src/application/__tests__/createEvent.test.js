import { createEvent } from '../createEvent.js';
import { jest } from '@jest/globals';

describe('createEvent use-case', () => {
  test('creates event when no overlap', async () => {
    const mockRepo = {
      findOverlapping: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: '1', title: 'X' }),
    };

    const result = await createEvent({ repository: mockRepo }, { title: 'X', startDate: '2026-01-01T10:00:00Z', endDate: '2026-01-01T12:00:00Z' });

    expect(mockRepo.findOverlapping).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalled();
    expect(result).toEqual({ id: '1', title: 'X' });
  });

  test('throws 409 when overlap found', async () => {
    const mockRepo = {
      findOverlapping: jest.fn().mockResolvedValue({ id: 'existing' }),
      create: jest.fn(),
    };

    await expect(
      createEvent({ repository: mockRepo }, { title: 'X', startDate: '2026-01-01T10:00:00Z', endDate: '2026-01-01T12:00:00Z' })
    ).rejects.toThrow('Já existe um evento nesse período.');

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
