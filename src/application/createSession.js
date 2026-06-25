import { validateDateRange } from '../domain/timeOverlap.js';

export async function createSession({ repository }, { title, description, startTime, endTime, eventId, stageId, trackId, speakerIds }) {
  if (!title || !startTime || !endTime || !eventId || !stageId) {
    const err = new Error('Campos obrigatórios faltando.');
    err.status = 400;
    throw err;
  }

  const { startDate: validatedStart, endDate: validatedEnd } = validateDateRange(startTime, endTime);

  const stageConflict = await repository.findStageOverlap(stageId, validatedStart, validatedEnd);
  if (stageConflict) {
    const err = new Error('Este palco já tem uma sessão neste horário.');
    err.status = 409;
    throw err;
  }

  if (speakerIds && speakerIds.length > 0) {
    const speakerConflict = await repository.findSpeakerOverlap(speakerIds, validatedStart, validatedEnd);
    if (speakerConflict) {
      const err = new Error('Um ou mais palestrantes estão ocupados neste horário.');
      err.status = 409;
      throw err;
    }
  }

  const newSession = await repository.create({
    title,
    description,
    startTime: validatedStart,
    endTime: validatedEnd,
    eventId,
    stageId,
    trackId,
    speakerIds,
  });
  return newSession;
}
