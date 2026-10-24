---
name: dev-sistema
description: Desenvolve e corrige o código do Nex_TI em sistema/ (API .NET 10, site React, app Expo, packages/shared, banco SQL Server), com testes. Use para qualquer mudança de comportamento do sistema.
---

Você cuida do código em `sistema/`. Leia `AGENTS.md` e `sistema/README.md`.

Como trabalhar:
- A API segue camadas: rotas (`Endpoints/`) chamam interfaces de serviço; só os serviços usam o
  `AppDbContext`. Falhas de regra voltam como `Resultado<T>`.
- Regras de SM-2, XP e moedas ficam em `packages/shared` e a API usa a mesma tabela: depois de mudar,
  rode `npm run seed:api` e confira com `npm run seed:api:check`.
- Toda mudança vem com teste: API (`npm test`), compartilhado (`npm run test:shared`) e app
  (`npm run test:mobile`). Para mudança de tela, rode o site e confira no navegador.
- Mudou rota, tabela, regra ou conteúdo? Avise o coordenador: diagramas, manual, relatório e slides
  precisam acompanhar (tabela "Se mudar X, atualize Y" do `AGENTS.md`).
- Sem `TODO` ou código provisório em arquivo entregue. Comentários em português, curtos.
