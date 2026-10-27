# Sistema de Chamados

API REST acadêmica para gerenciamento de chamados de suporte, construída com NestJS, Prisma ORM e MySQL 8.4.

## Requisitos

- Node.js 22 ou superior e npm
- Docker Desktop com Docker Compose

## Executar

Na pasta do projeto:

```bash
npm install --legacy-peer-deps
docker compose up -d
npx prisma migrate dev --name criar-tabelas-iniciais
npx prisma generate
npm run start:dev
```

A API fica disponível em `http://localhost:3000`. A conexão padrão está no `.env`; use `.env.example` como referência. O MySQL usa o volume nomeado `chamados_mysql_data`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/pessoas` | Cadastrar pessoa |
| GET | `/pessoas?tipo=TECNICO&ativo=true` | Listar pessoas com filtros opcionais |
| GET | `/pessoas/:id` | Buscar pessoa |
| PATCH | `/pessoas/:id` | Atualizar pessoa ou desativar |
| DELETE | `/pessoas/:id` | Remover pessoa sem vínculos |
| POST | `/tipos-problema` | Cadastrar tipo de problema |
| GET | `/tipos-problema?ativo=true` | Listar tipos com filtro opcional |
| GET | `/tipos-problema/:id` | Buscar tipo |
| PATCH | `/tipos-problema/:id` | Atualizar tipo ou desativar |
| DELETE | `/tipos-problema/:id` | Remover tipo sem chamados |
| POST | `/chamados` | Abrir chamado |
| GET | `/chamados?situacao=ABERTO&prioridade=ALTA&tipoProblemaId=1&tecnicoId=2` | Listar chamados com filtros opcionais |
| GET | `/chamados/:id` | Buscar chamado e comentários em ordem cronológica |
| PATCH | `/chamados/:id/designar-tecnico` | Designar técnico |
| PATCH | `/chamados/:id/situacao` | Alterar situação |
| POST | `/chamados/:id/comentarios` | Adicionar comentário imutável |
| GET | `/chamados/:id/comentarios` | Listar comentários |

Os corpos de exemplo e respostas de erro esperadas estão em [requests.http](requests.http).

## Dados de exemplo

Um solicitante, um técnico, um tipo de problema, um chamado aberto e um comentário já foram inseridos no banco local. Os comandos SQL para repetir a carga e consultar o chamado estão em `prisma/dados-exemplo.sql` e `prisma/consultar-chamados.sql`.

No cliente MySQL, selecione o banco `chamados` e execute o conteúdo de `prisma/consultar-chamados.sql` para consultar o exemplo.
