# Configurações da IA (Gemini / Antigravity) — Nex_TI

Este arquivo contém as diretrizes e instruções de contexto específicas para os assistentes de IA (como Antigravity) que trabalham neste repositório.

---

## 🚀 Contexto do Projeto
* **Nome**: Nex_TI – EdTech Learning Platform (PIM IV - UNIP).
* **Objetivo**: Plataforma educacional gamificada de estudo ativo usando repetição espaçada (Algoritmo SM-2) e visualização gráfica via Mapa Neural (Mapa Neural).

---

## 🛠️ Pilha de Tecnologia (Tech Stack)
* **Frontend**: HTML5 Semântico, CSS3 Puro (Design System Global), JavaScript Vanilla.
  - **Porta Local**: Rodar na porta `5500` (configurada via Live Server no VS Code).
  - **Conexão**: Se comunica com o backend consumindo a URL `https://localhost:5001/api/`.
* **Backend**: C# (.NET 10) utilizando **Minimal APIs** e **Entity Framework Core**.
  - **Porta Local**: `https://localhost:5001`.
* **Banco de Dados**: **Microsoft SQL Server** (esquema inicial em `database/NexTI_DB.sql`).

---

* **Estrutura Monorepo**:
  - `apps/react-web/`: Frontend Web (React 18 + Vite, Mapa Neural, SM-2) — deploy na Vercel.
  - `apps/react-mobile/`: App mobile (React Native / Expo).
  - `apps/api/`: Backend C# (.NET 10 Minimal APIs, EF Core, Azure SQL) — deploy no Azure App Service.
  - `packages/shared/`: Conteúdo canônico (cards), regras (SM-2, gamificação), CSS, áudio, confete e cliente da API.
  - `packages/design-dna/`: Design System e Tokens CSS/JSON.
  - `database/`: Scripts SQL (`NexTI_DB.sql`).
  - `docs/`: Documentação acadêmica e manuais do PIM IV.

---

## 🎯 Diretrizes de Engenharia e Código
1. **Padrão SOLID**:
   - Manter as responsabilidades de rotas (HTTP) separadas da lógica de negócios e persistência.
   - Usar `ISm2Engine` em `apps/api/Services/` para qualquer cálculo matemático do algoritmo SM-2 (SRP/DIP).
   - Manter novos endpoints mapeados de forma extensível em classes separadas (ex: `apps/api/Endpoints/EndpointExtensions.cs`), evitando inflar o `Program.cs`.
2. **Sem Placeholders**:
   - Nunca utilizar códigos ou comentários temporários (TBD, TODO, "implementar depois") em arquivos de produção.
3. **Padrão de Commits**:
   - Commitar alterações usando mensagens convencionais (*Conventional Commits*) em português (ex: `feat(api):`, `refactor(web):`, `docs(readme):`).

---

## 💬 Preferências de Comunicação com o Usuário
* **Idioma**: Sempre responder em **Português (PT-BR)**.
* **Estilo**: Manter respostas concisas, focadas e estruturadas em Markdown.
* **Rastreabilidade**: Sempre que mencionar um arquivo ou classe nas respostas, usar links markdown clicáveis usando o esquema `file://` (ex: `[Program.cs](file:///C:/.../apps/api/Program.cs)`).
