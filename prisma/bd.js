import { createPool } from 'mariadb';

// 1. Criamos a conexão direta com o MySQL usando os dados validados pelo seu log
const urlString = process.env.DATABASE_URL || '';
const match = urlString.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

if (!match) {
  console.error('❌ Erro: Formato inválido na variável DATABASE_URL.');
  process.exit(1);
}

const [, user, password, host, port, database] = match;

const pool = createPool({
  host: host,
  port: parseInt(port),
  user: user,
  password: decodeURIComponent(password),
  database: database,
  connectionLimit: 1
});

async function main() {
  console.log('🔄 Limpando o banco de dados via SQL nativo...');
  
  // Desativa chaves estrangeiras temporariamente para limpar sem erros de vínculo
  await pool.query('SET FOREIGN_KEY_CHECKS = 0;');
  await pool.query('TRUNCATE TABLE SpeakerSession;');
  await pool.query('TRUNCATE TABLE Session;');
  await pool.query('TRUNCATE TABLE Speaker;');
  await pool.query('TRUNCATE TABLE Track;');
  await pool.query('TRUNCATE TABLE Stage;');
  await pool.query('TRUNCATE TABLE Event;');
  await pool.query('SET FOREIGN_KEY_CHECKS = 1;');

  console.log('🌱 Criando o evento principal...');
  const eventId = 'event-devconf-2026';
  await pool.query(
    'INSERT INTO Event (id, title, description, startDate, endDate, createdAt) VALUES (?, ?, ?, ?, ?, NOW());',
    [eventId, 'DevConference 2026', 'O maior evento de desenvolvimento de software.', '2026-10-15 09:00:00', '2026-10-17 18:00:00']
  );

  console.log('🌱 Criando os palcos (Stages)...');
  const stageAlphaId = 'stage-alpha';
  const stageBetaId = 'stage-beta';
  await pool.query('INSERT INTO Stage (id, name, capacity, eventId) VALUES (?, ?, ?, ?);', [stageAlphaId, 'Auditório Alpha', 300, eventId]);
  await pool.query('INSERT INTO Stage (id, name, capacity, eventId) VALUES (?, ?, ?, ?);', [stageBetaId, 'Sala Beta (Workshops)', 50, eventId]);

  console.log('🌱 Criando as trilhas (Tracks)...');
  const trackBackendId = 'track-backend';
  await pool.query('INSERT INTO Track (id, name, color, eventId) VALUES (?, ?, ?, ?);', [trackBackendId, 'Backend & Infra', '#3182ce', eventId]);

  console.log('🌱 Criando os palestrantes (Speakers)...');
  const speakerJohnId = 'speaker-john';
  await pool.query(
    'INSERT INTO Speaker (id, name, bio, avatar) VALUES (?, ?, ?, ?);',
    [speakerJohnId, 'John Doe', 'Engenheiro de Software Principal.', 'https://unsplash.com']
  );

  console.log('🌱 Criando as sessões (Cronograma)...');
  const sessionId = 'session-arquitetura';
  await pool.query(
    'INSERT INTO Session (id, title, description, startTime, endTime, eventId, stageId, trackId) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    [sessionId, 'Arquitetura de APIs de Alta Performance', 'Como estruturar backends escaláveis usando Node.js.', '2026-10-15 10:00:00', '2026-10-15 11:00:00', eventId, stageAlphaId, trackBackendId]
  );

  // Cria o vínculo N:N na tabela intermediária
  await pool.query('INSERT INTO SpeakerSession (speakerId, sessionId) VALUES (?, ?);', [speakerJohnId, sessionId]);

  console.log('✨ Banco de dados populado com sucesso pelo driver nativo!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
