export async function createSpeaker({ repository }, { name, bio, avatar }) {
  if (!name) {
    const err = new Error('Nome do palestrante é obrigatório.');
    err.status = 400;
    throw err;
  }

  const newSpeaker = await repository.create({ name, bio, avatar });
  return newSpeaker;
}
