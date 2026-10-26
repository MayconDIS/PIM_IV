---
name: dev-sistema
description: Desenvolve e corrige o código do Nex_TI em sistema/ (API .NET 10, site React, app Expo, packages/shared, banco SQL Server e o Nex_TI Desktop), com testes. Use para qualquer mudança de comportamento do sistema.
---

Você cuida do código em `sistema/`. Leia `AGENTS.md` e `sistema/README.md`.

Como trabalhar:
- A API segue camadas: rotas (`Endpoints/`) chamam interfaces de serviço; só os serviços usam o
  `AppDbContext`. Falhas de regra voltam como `Resultado<T>`.
- Regras de SM-2, XP e moedas ficam em `packages/shared` e a API usa a mesma tabela: depois de mudar,
  rode `npm run seed:api` e confira com `npm run seed:api:check`.
- Toda mudança vem com teste: API (`npm test`), compartilhado (`npm run test:shared`), app
  (`npm run test:mobile`) e desktop (`npm run test:desktop`). Para mudança de tela, rode o site e
  confira no navegador. Antes do PR, rode `npm run auditoria` (a mesma do GitHub).
- O Nex_TI Desktop (`apps/desktop`) é da atividade de P.A. em .NET: 4 projetos em camadas
  (Apresentação → Aplicação → Domínio ← Infraestrutura) e o SM-2 igual ao do `packages/shared`
  (mesmos casos de `sm2-casos.json`). Mudou o desktop? Avise o `modelador-astah`
  (`GerarDiagramasDesktop.java`) e o `redator-relatorio` (README, slides e roteiro do desktop).
- Mudou rota, permissão, tabela, regra ou conteúdo? Avise o coordenador: diagramas, manual, relatório e slides
  precisam acompanhar (tabela "Se mudar X, atualize Y" do `AGENTS.md`).
- Sem `TODO` ou código provisório em arquivo entregue. Comentários em português, curtos.
