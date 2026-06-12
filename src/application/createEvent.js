export async function createEvent({ repository }, { title, description, startDate, endDate, userId }) {
  if (!title || !startDate || !endDate) {
    const err = new Error('Campos obrigatórios ausentes.');
    err.status = 400;
    throw err;
  }

  const overlap = await repository.findOverlapping(startDate, endDate);
  if (overlap) {
    const err = new Error('Já existe um evento nesse período.');
    err.status = 409;
    throw err;
  }

  const newEvent = await repository.create({ title, description, startDate, endDate, userId });
  return newEvent;
}
