import { createSpeaker } from '../createSpeaker.js';
import { jest } from '@jest/globals';

describe('createSpeaker use-case', () => {
  test('creates speaker when valid', async () => {
    const mockRepo = { create: jest.fn().mockResolvedValue({ id: '1', name: 'Alex' }) };

    const result = await createSpeaker({ repository: mockRepo }, { name: 'Alex', bio: 'Bio', avatar: 'url' });

    expect(mockRepo.create).toHaveBeenCalledWith({ name: 'Alex', bio: 'Bio', avatar: 'url' });
    expect(result).toEqual({ id: '1', name: 'Alex' });
  });

  test('throws 400 when name missing', async () => {
    const mockRepo = { create: jest.fn() };

    await expect(createSpeaker({ repository: mockRepo }, { name: '', bio: 'x' })).rejects.toThrow('O nome do palestrante é obrigatório.');
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
