<div align="center">
  <h1>Nex_TI – EdTech Learning Platform</h1>
  <p><strong>Projeto Integrado Multidisciplinar (PIM IV) — Análise e Desenvolvimento de Sistemas — UNIP</strong></p>

  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#"/>
  <img src="https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 10"/>
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white" alt="SQL Server"/>
  <img src="https://img.shields.io/badge/UML-Astah_10.1-orange?style=for-the-badge" alt="Astah"/>
</div>

---

## 📂 Estrutura

Este é o repositório único do PIM IV. As três frentes do projeto, antes separadas em
repositórios distintos, vivem aqui como pastas de primeiro nível:

```text
📁 PIM_IV/
├── 📁 sistema/        # Implementação: frontend, API C# (.NET 10) e scripts SQL Server
├── 📁 relatorio/      # Monografia ABNT interativa (HTML/CSS), protótipos, cronogramas e atas
├── 📁 modelagem-uml/  # Modelagem UML (Astah + PlantUML), diagramas exportados e backlog do produto
├── 📁 .agents/        # Skills e instruções de agentes de IA, compartilhadas pelas três frentes
├── 📁 .vscode/     # Configuração do editor para o workspace inteiro
└── 📄 .gitattributes, .gitignore, LICENSE
```

### Por frente

| Pasta | Conteúdo |
|---|---|
| [`sistema/`](sistema) | Monorepo npm: `apps/react-web`, `apps/react-mobile`, `apps/api` (.NET), `packages/`, `database/`, `tests/` |
| [`relatorio/`](relatorio) | Relatório ABNT em HTML/CSS, `examples/`, `assets/`, `design_DNA/` e documentação acadêmica |
| [`modelagem-uml/`](modelagem-uml) | `01_Documentacao_Teorica/`, `02_Modelagem_UML/` (fonte `.asta`, `.puml` e PNGs), `03_Codigo_Gerado/` |

## 🚀 Como executar o sistema

```bash
cd sistema
npm install
npm start
```

Detalhes de portas, banco de dados e API estão em [`sistema/README.md`](sistema/README.md).

## 🧬 Histórico

Este repositório foi formado a partir de três repositórios anteriores, com o histórico de
commits preservado via `git subtree`:

- `PIM_IV-Parte_Teorica` → `relatorio/` (antes `teorica/`)
- `PIM_IV-Parte_Pratica` → `sistema/` (antes `pratica/`)
- `PIM_IV-Documentacao_UML` → `modelagem-uml/` (antes `uml/`)

A pasta `modelagem-uml/` foi herdada do PIM III e serve de base para a modelagem do PIM IV. As atas de
reunião em `modelagem-uml/.planning/meetings/` são registros datados das sprints do PIM III e foram
mantidas na íntegra, sem reescrita, por serem documentos históricos.

## 🔁 Do PIM III ao PIM IV

O PIM IV é a continuação do [PIM III](https://github.com/MayconDIS/PIM_III): o mesmo produto
(Nex_TI), a mesma documentação e a mesma modelagem, evoluídos com as exigências técnicas do
PIM IV e os itens do Product Backlog definidos pelo Scrum Master. Todo o conteúdo do PIM III
está neste repositório; o front em HTML/JS puro foi portado para React e depois removido.

| Área | PIM III (herdado) | PIM IV (adicionado) |
|---|---|---|
| **Front-end** | HTML/CSS/JS puro (dashboard, login, sobre, mapa neural) | React + Vite (`sistema/apps/react-web`), conteúdo compartilhado em `packages/shared`, publicado na Vercel |
| **Mobile** | — | App React Native/Expo (`sistema/apps/react-mobile`) com estudo SM-2 |
| **API .NET** | 7 endpoints com a lógica dentro dos endpoints | 14 endpoints em camadas: Endpoints → Services → Data → Models |
| **Domínio** | Usuario, Aluno, Tutor, Fase, Flashcard, ProgressoFlashcard | + Prova, Questao, Alternativa, AreaConhecimento (simulados ENADE) |
| **Regras de negócio** | `Sm2Engine` | + `AuthService`, `ProgressoService`, `GamificacaoService`, `ConteudoService`, política de senha |
| **Banco de dados** | Script `NexTI_DB.sql` | Migrations do EF Core, seed automático e Azure SQL em produção |
| **Segurança** | BCrypt e JWT | + política de senha, checagem de senha vazada, rate limiting, dados só para o dono, CORS restrito, CSP/HSTS |
| **Acessibilidade** | Modo de acessibilidade no front | + VLibras |
| **Testes** | — | 62 testes automatizados da API (xUnit) e testes do `packages/shared` |
| **Nuvem e DevOps** | Execução local | GitHub Actions → Azure App Service, script de provisionamento e guia de deploy |
| **UML** | Caso de uso, classes (conceitual) e sequência | + atividade e classes do código implementado (Camadas e Entidades), em PlantUML |
| **Gestão ágil** | Atas e sprints do PIM III | Scrum no Kanban (Trello) com Product Backlog PB01–PB22 e Sprints 1–5 |

O que o PIM III indicou como "implementação futura" e o PIM IV entregou: módulo preparatório
(PB13, simulados ENADE) e economia virtual (PB14, disciplinas bônus pagas com moedas). O painel
gerencial do Tutor (PB15) continua no backlog.

## 📄 Licença

Distribuído sob a licença do arquivo [LICENSE](LICENSE).
