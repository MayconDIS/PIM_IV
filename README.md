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
npm run dev   # sobe a API (porta 5000) e o site (porta 5501)
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

O PIM IV é a continuação do [PIM III](https://github.com/MayconDIS/PIM_III). É o mesmo projeto,
o Nex_TI: trouxemos tudo o que fizemos no PIM III e fomos melhorando com o que o PIM IV pede
e com o que o nosso Scrum Master colocou no backlog.

| O quê | No PIM III | No PIM IV |
|---|---|---|
| **Site** | Feito em HTML, CSS e JavaScript | Refeito em React e publicado na internet (Vercel) |
| **Celular** | Não tinha | Começamos o app, com a tela de estudo de flashcards |
| **API em C#** | 7 rotas, com todo o código junto | 14 rotas, com o código separado em camadas (cada parte cuida de uma coisa) |
| **Simulados** | Ficou para o futuro | Simulados no estilo ENADE, com questões de múltipla escolha |
| **Moedas** | Ficou para o futuro | Dá para usar as moedas para liberar disciplinas bônus |
| **Banco de dados** | Um script SQL | O banco é criado sozinho quando a API sobe, e roda na nuvem (Azure) |
| **Segurança** | Senha criptografada e login | Senha forte obrigatória, aviso de senha vazada, limite de tentativas de login e cada aluno só vê os próprios dados |
| **Acessibilidade** | Modo de acessibilidade | Também o VLibras (tradução para Libras) |
| **Testes** | Não tinha | Testes automatizados da API e das regras JavaScript |
| **Nuvem** | Rodava só no computador | A API sobe sozinha para a Azure a cada atualização no GitHub |
| **UML** | Caso de uso, classes e sequência | Também o diagrama de atividade e o diagrama de classes do código que fizemos |
| **Organização** | Atas das reuniões | Scrum no Trello, com o backlog (PB01 a PB22) e as sprints |

Ainda falta: o painel do Tutor (PB15), o login no app de celular (PB11) e os perfis de
Aluno, Tutor e Administrador (PB01).

## 📄 Licença

Distribuído sob a licença do arquivo [LICENSE](LICENSE).
