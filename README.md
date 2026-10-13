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
├── 📁 teorica/     # Monografia ABNT interativa (HTML/CSS), protótipos, cronogramas e atas
├── 📁 pratica/     # Implementação: frontend, API C# (.NET 10) e scripts SQL Server
├── 📁 uml/         # Modelagem UML (Astah), diagramas exportados e backlog do produto
├── 📁 .agents/     # Skills e instruções de agentes de IA, compartilhadas pelas três frentes
├── 📁 .vscode/     # Configuração do editor para o workspace inteiro
└── 📄 .gitattributes, .gitignore, LICENSE
```

### Por frente

| Pasta | Conteúdo |
|---|---|
| [`teorica/`](teorica) | Relatório ABNT em HTML/CSS, `examples/`, `assets/`, `design_DNA/` e documentação acadêmica |
| [`pratica/`](pratica) | Monorepo npm: `apps/react-web`, `apps/react-mobile`, `apps/api` (.NET), `packages/`, `database/`, `tests/` |
| [`uml/`](uml) | `01_Documentacao_Teorica/`, `02_Modelagem_UML/` (fonte `.asta` + PNGs), `03_Codigo_Gerado/` |

## 🚀 Como executar a parte prática

```bash
cd pratica
npm install
npm start
```

Detalhes de portas, banco de dados e API estão em [`pratica/README.md`](pratica/README.md).

## 🧬 Histórico

Este repositório foi formado a partir de três repositórios anteriores, com o histórico de
commits preservado via `git subtree`:

- `PIM_IV-Parte_Teorica` → `teorica/`
- `PIM_IV-Parte_Pratica` → `pratica/`
- `PIM_IV-Documentacao_UML` → `uml/`

A pasta `uml/` foi herdada do PIM III e serve de base para a modelagem do PIM IV. As atas de
reunião em `uml/.planning/meetings/` são registros datados das sprints do PIM III e foram
mantidas na íntegra, sem reescrita, por serem documentos históricos.

## 📄 Licença

Distribuído sob a licença do arquivo [LICENSE](LICENSE).
