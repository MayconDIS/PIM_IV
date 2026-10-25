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
├── 📁 relatorio/      # Relatório ABNT (HTML/CSS) e a versão em Word
├── 📁 modelagem-uml/  # UML no Astah e banco de dados (MER, DER e modelo físico)
├── 📁 .agents/        # Skills de IA (uma pasta só, usada pelas três frentes)
├── 📁 .claude/agents/ # O time de agentes (coordenador, dev, modelagem, relatório, revisão)
├── 📁 scripts/        # verificar-sincronia.mjs: confere se as três partes estão alinhadas
├── 📄 AGENTS.md       # Regras do projeto inteiro (equipe e IAs)
├── 📁 .vscode/     # Configuração do editor para o workspace inteiro
└── 📄 .gitattributes, .gitignore, LICENSE
```

### Por frente

| Pasta | Conteúdo |
|---|---|
| [`sistema/`](sistema) | Monorepo npm: `apps/react-web`, `apps/react-mobile`, `apps/api` (.NET), `apps/desktop` (.NET, Windows Forms), `packages/`, `database/`, `tests/` |
| [`relatorio/`](relatorio) | Relatório ABNT em HTML/CSS, `assets/` e `design_DNA/` |
| [`modelagem-uml/`](modelagem-uml) | `02_Modelagem_UML/` (o `.asta` e as imagens exportadas do Astah) e `04_Banco_de_Dados/` (MER, DER e modelo físico) |

## 🚀 Como executar o sistema

```bash
cd sistema
npm install
npm run dev   # sobe a API (porta 5000) e o site (porta 5501)
```

Detalhes de portas, banco de dados e API estão em [`sistema/README.md`](sistema/README.md).

## 🎤 Apresentação de P.A. em .NET (27/10)

O programa desktop da atividade, os slides, o roteiro e o guia de como abrir cada parte no
Antigravity estão em [`sistema/apps/desktop`](sistema/apps/desktop#como-abrir-cada-parte-no-antigravity).
No editor, `Ctrl+Shift+P` → **Tasks: Run Task** traz os atalhos prontos (abrir o programa, os
testes, os slides, o Astah e o GitHub).

## 🤝 Como a equipe trabalha

As regras do projeto inteiro estão em [`AGENTS.md`](AGENTS.md): de onde vem cada informação
(código → modelagem no Astah → relatório, Word e slides), o que atualizar quando algo muda, os
comandos e o time de agentes (`coordenador`, `dev-sistema`, `modelador-astah`, `redator-relatorio`
e `revisor-sincronia`). Vale para as pessoas e para qualquer IA usada no projeto.

Antes de abrir um pull request, rode:

```bash
node scripts/verificar-sincronia.mjs
```

Ele confere se os números dos documentos batem com o código, se os diagramas do relatório são os
do Astah e se o PIM III só aparece nas melhorias. O GitHub roda a mesma checagem em todo pull request.

## 🧬 Histórico

Este repositório foi formado a partir de três repositórios anteriores, com o histórico de
commits preservado via `git subtree`:

- `PIM_IV-Parte_Teorica` → `relatorio/` (antes `teorica/`)
- `PIM_IV-Parte_Pratica` → `sistema/` (antes `pratica/`)
- `PIM_IV-Documentacao_UML` → `modelagem-uml/` (antes `uml/`)

A documentação do PIM III (atas, backlog, PDFs e diagramas) fica no repositório dele,
[MayconDIS/PIM_III](https://github.com/MayconDIS/PIM_III). Aqui fica só o PIM IV.

## 📈 Melhorias em relação ao PIM III

O Nex_TI começou no PIM III ([MayconDIS/PIM_III](https://github.com/MayconDIS/PIM_III)).
No PIM IV ele virou um sistema completo, publicado na nuvem. O que mudou:

| O quê | No PIM III | No PIM IV |
|---|---|---|
| **Site** | HTML, CSS e JavaScript | React, publicado na internet (Vercel) |
| **Celular** | Não tinha | App (Expo) com login, estudo das fases e fila para estudar sem internet |
| **API em C#** | 7 rotas, com todo o código junto | 26 rotas, separadas em camadas (rotas → serviços → banco), cada serviço com sua interface |
| **Repetição espaçada (SM-2)** | Só no navegador | Uma regra só no site, no app e na API, conferida pelos mesmos casos de teste |
| **XP e moedas** | Calculados no navegador | Calculados no servidor, com a mesma tabela do site; moedas compram disciplinas bônus |
| **Simulados ENADE** | Ficou para o futuro | Provas oficiais do ENADE ADS 2017 e 2021, com o gabarito do INEP |
| **Perfis** | Só o aluno | Aluno, Tutor e Administrador, com painel do Tutor e área do Administrador |
| **Banco de dados** | Um script SQL | Criado pela API ao subir, na Azure, com triggers, views, funções e procedures |
| **Segurança** | Senha criptografada e login | Senha forte, aviso de senha vazada, limite de tentativas, token JWT e cada aluno só vê os próprios dados |
| **LGPD** | Não tinha | O usuário vê, exporta, corrige e exclui os próprios dados |
| **Acessibilidade** | Modo de acessibilidade | Também o VLibras (tradução para Libras) |
| **Testes** | Não tinha | Testes automatizados da API, das regras JavaScript e do app |
| **Nuvem** | Rodava só no computador | API na Azure com publicação automática, monitoramento (Application Insights) e Docker |
| **UML** | Casos de uso, classes e sequência | Para cada caso de uso, classes e sequência tirados do código; atividade, MER e DER |
| **Organização** | Atas das reuniões | Scrum no Trello, com o backlog (PB01 a PB22) e as sprints |

## 📄 Licença

Distribuído sob a licença do arquivo [LICENSE](LICENSE).
