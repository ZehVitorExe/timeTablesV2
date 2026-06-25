import { createSpeaker } from '../createSpeaker.js';
import { jest } from '@jest/globals';

describe('createSpeaker', () => {
  test('cria palestrante quando válido', async () => {
    const mockRepo = { create: jest.fn().mockResolvedValue({ id: '1', name: 'Alex' }) };

    const result = await createSpeaker({ repository: mockRepo }, { name: 'Alex', bio: 'Bio', avatar: 'url' });

    expect(mockRepo.create).toHaveBeenCalledWith({ name: 'Alex', bio: 'Bio', avatar: 'url' });
    expect(result).toEqual({ id: '1', name: 'Alex' });
  });

  test('lança 400 quando nome ausente', async () => {
    const mockRepo = { create: jest.fn() };

    await expect(createSpeaker({ repository: mockRepo }, { name: '', bio: 'x' })).rejects.toThrow('Nome do palestrante é obrigatório.');
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
