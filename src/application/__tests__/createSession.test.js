import { createSession } from '../createSession.js';
import { jest } from '@jest/globals';

describe('createSession use-case', () => {
  test('creates session when no conflicts', async () => {
    const mockRepo = {
      findStageOverlap: jest.fn().mockResolvedValue(null),
      findSpeakerOverlap: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 's1', title: 'Sessão' }),
    };

    const result = await createSession({ repository: mockRepo }, {
      title: 'Sessão',
      startTime: '2026-01-01T10:00:00Z',
      endTime: '2026-01-01T11:00:00Z',
      eventId: 'e1',
      stageId: 'st1',
      speakerIds: ['sp1'],
    });

    expect(mockRepo.findStageOverlap).toHaveBeenCalled();
    expect(mockRepo.findSpeakerOverlap).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 's1', title: 'Sessão' });
  });

  test('throws 409 when stage conflict', async () => {
    const mockRepo = {
      findStageOverlap: jest.fn().mockResolvedValue({ id: 'existing' }),
      findSpeakerOverlap: jest.fn(),
      create: jest.fn(),
    };

    await expect(createSession({ repository: mockRepo }, {
      title: 'X',
      startTime: '2026-01-01T10:00:00Z',
      endTime: '2026-01-01T11:00:00Z',
      eventId: 'e1',
      stageId: 'st1',
    })).rejects.toThrow('Este palco já possui uma sessão agendada neste horário.');

    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  test('throws 409 when speaker conflict', async () => {
    const mockRepo = {
      findStageOverlap: jest.fn().mockResolvedValue(null),
      findSpeakerOverlap: jest.fn().mockResolvedValue({ id: 'conflict' }),
      create: jest.fn(),
    };

    await expect(createSession({ repository: mockRepo }, {
      title: 'X',
      startTime: '2026-01-01T10:00:00Z',
      endTime: '2026-01-01T11:00:00Z',
      eventId: 'e1',
      stageId: 'st1',
      speakerIds: ['sp1']
    })).rejects.toThrow('Um ou mais palestrantes já estão alocados neste horário.');

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
