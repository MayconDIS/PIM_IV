# sistema/ — o código do Nex_TI

Leia primeiro o [`AGENTS.md`](../AGENTS.md) da raiz: as regras do projeto inteiro estão lá.
Aqui fica só o que é específico do código.

## O que tem aqui

| Pasta | O quê |
|---|---|
| `apps/api/` | API em .NET 10 (Minimal APIs, EF Core, SQL Server / Azure SQL), porta **5000** |
| `apps/react-web/` | Site em React 18 + Vite, porta **5501**, publicado na Vercel |
| `apps/react-mobile/` | App em React Native (Expo), com fila para estudar sem internet |
| `apps/desktop/` | Nex_TI Desktop (Windows Forms + EF Core/SQLite), feito para a apresentação de P.A. em .NET: 4 projetos em camadas, testes e, em `docs/apresentacao`, os slides e o roteiro |
| `packages/shared/` | Conteúdo (fases e cartas), regras de SM-2 e de XP/moedas e o cliente da API, usados pelo site e pelo app |
| `database/` | `NexTI_DB.sql`, o script completo do banco |
| `tests/` | Testes da API (xUnit) |
| `docs/` | Manuais (técnico com as rotas, de execução, prático do usuário e de deploy) |

## Regras do código

- A API é em camadas: as rotas (`apps/api/Endpoints/`) só chamam interfaces de serviço; só os
  serviços usam o `AppDbContext`. O SM-2 fica no `Sm2Engine` e o prêmio de cada fase na
  `TabelaDeRecompensas`, as duas com a mesma regra do `packages/shared`.
- Mudou regra ou conteúdo em `packages/shared`? Rode `npm run seed:api` e `npm run seed:api:check`.
- Toda mudança vem com teste: `npm test` (API), `npm run test:shared`, `npm run test:mobile` e `npm run test:desktop`.
- Mudou rota, tabela ou regra? Os diagramas (Astah), o manual, o relatório e os slides também
  mudam: veja a tabela "Se mudar X, atualize Y" no `AGENTS.md`.
