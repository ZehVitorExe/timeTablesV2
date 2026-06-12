export async function createSession({ repository }, { title, description, startTime, endTime, eventId, stageId, trackId, speakerIds }) {
  if (!title || !startTime || !endTime || !eventId || !stageId) {
    const err = new Error('Campos obrigatórios ausentes.');
    err.status = 400;
    throw err;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  if (start >= end) {
    const err = new Error('O horário de término deve ser após o início.');
    err.status = 400;
    throw err;
  }

  const stageConflict = await repository.findStageOverlap(stageId, startTime, endTime);
  if (stageConflict) {
    const err = new Error('Este palco já possui uma sessão agendada neste horário.');
    err.status = 409;
    throw err;
  }

  if (speakerIds && speakerIds.length > 0) {
    const speakerConflict = await repository.findSpeakerOverlap(speakerIds, startTime, endTime);
    if (speakerConflict) {
      const err = new Error('Um ou mais palestrantes já estão alocados neste horário.');
      err.status = 409;
      throw err;
    }
  }

  const newSession = await repository.create({ title, description, startTime, endTime, eventId, stageId, trackId, speakerIds });
  return newSession;
}
