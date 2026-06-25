import { validateDateRange } from '../domain/timeOverlap.js';

export async function createEvent({ repository }, { title, description, startDate, endDate, userId }) {
  if (!title || !startDate || !endDate) {
    const err = new Error('Campos obrigatórios faltando.');
    err.status = 400;
    throw err;
  }

  const { startDate: validatedStart, endDate: validatedEnd } = validateDateRange(startDate, endDate);

  const overlap = await repository.findOverlapping(validatedStart, validatedEnd);
  if (overlap) {
    const err = new Error('Já existe um evento neste horário.');
    err.status = 409;
    throw err;
  }

  const newEvent = await repository.create({
    title,
    description,
    startDate: validatedStart,
    endDate: validatedEnd,
    userId,
  });
  return newEvent;
}
