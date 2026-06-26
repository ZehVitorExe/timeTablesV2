## Autenticação e Registro

# Registrar novo usuário
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Autocomplete",
    "email": "teste@any.com",
    "password": "senha123"
  }'

# Login para obter token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@any.com",
    "password": "senha123"
  }'


## Usuários
# Listar todos os usuários (autenticado)
curl -X GET http://localhost:3001/api/auth/users \
  -H "Authorization: Bearer <TOKEN>"

# Obter usuário específico (autenticado)
curl -X GET http://localhost:3001/api/auth/users/USER_ID \
  -H "Authorization: Bearer <TOKEN>"

# Atualizar usuário (autenticado)
curl -X PUT http://localhost:3001/api/auth/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "Nome Atualizado",
    "email": "teste.atualizado@any.com"
  }'

# Deletar usuário (autenticado)
curl -X DELETE http://localhost:3001/api/auth/users/USER_ID \
  -H "Authorization: Bearer <TOKEN>"

## Eventos
# Listar todos os eventos
curl -X GET http://localhost:3001/api/events

# Obter evento específico
curl -X GET http://localhost:3001/api/events/EVENT_ID \
  -H "Authorization: Bearer <TOKEN>"

# Criar evento (autenticado)
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "Conferência Tech 2026",
    "description": "O maior evento de tecnologia e desenvolvimento de software.",
    "startDate": "2026-06-15T09:00:00.000Z",
    "endDate": "2026-06-18T18:00:00.000Z"
  }'

# Atualizar evento
curl -X PUT http://localhost:3001/api/events/EVENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "Conferência Tech 2026 Atualizada",
    "description": "Descrição atualizada do evento."
  }'

# Deletar evento
curl -X DELETE http://localhost:3001/api/events/EVENT_ID \
  -H "Authorization: Bearer <TOKEN>"



## Sessões
# Listar todas as sessões
curl -X GET http://localhost:3001/api/sessions

# Obter sessão específica
curl -X GET http://localhost:3001/api/sessions/SESSION_ID \
  -H "Authorization: Bearer <TOKEN>"

# Criar sessão (autenticado)
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "A Revolução do Prisma 7 no Backend",
    "description": "Explorando a nova arquitetura baseada em Driver Adapters e performance Wasm.",
    "startTime": "2026-10-16T14:00:00Z",
    "endTime": "2026-10-16T15:00:00Z",
    "eventId": "event-devconf-2026",
    "stageId": "stage-alpha",
    "trackId": "track-backend",
    "speakerIds": ["speaker-john"]
  }'

# Atualizar sessão
curl -X PUT http://localhost:3001/api/sessions/SESSION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "Sessão Atualizada",
    "description": "Descrição atualizada da sessão.",
    "speakerIds": ["speaker-john", "speaker-jane"]
  }'

# Deletar sessão
curl -X DELETE http://localhost:3001/api/sessions/SESSION_ID \
  -H "Authorization: Bearer <TOKEN>"

## Palestrantes
# Listar todos os palestrantes
curl -X GET http://localhost:3001/api/speakers

# Obter palestrante específico
curl -X GET http://localhost:3001/api/speakers/SPEAKER_ID \
  -H "Authorization: Bearer <TOKEN>"

# Criar palestrante (autenticado)
curl -X POST http://localhost:3001/api/speakers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "Alexandre Silva",
    "bio": "Desenvolvedor Full Stack com mais de 10 anos de experiência e entusiasta de arquitetura de software.",
    "avatar": "https://github.com/alexandre.png"
  }'

# Atualizar palestrante
curl -X PUT http://localhost:3001/api/speakers/SPEAKER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "Alexandre Silva Atualizado",
    "bio": "Bio atualizada do palestrante."
  }'

# Deletar palestrante
curl -X DELETE http://localhost:3001/api/speakers/SPEAKER_ID \
  -H "Authorization: Bearer <TOKEN>"

## Observações
# Substitua <TOKEN> pelo token retornado em /api/auth/login.
# Substitua USER_ID, EVENT_ID, SESSION_ID e SPEAKER_ID pelos IDs reais retornados pelo sistema.


