<div align="center">
  <h1>Nex_TI – EdTech Learning Platform</h1>
  <p><strong>Projeto Integrado Multidisciplinar (PIM IV) — Análise e Desenvolvimento de Sistemas — UNIP</strong></p>

  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#"/>
  <img src="https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 10"/>
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white" alt="SQL Server"/>
  <img src="https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="Azure"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/UML-Astah_10.1-orange?style=for-the-badge" alt="Astah"/>
</div>

---

## 🌐 No ar

| O quê | Onde |
|---|---|
| **Site** (computador e celular) | [nexti-pim-iv.vercel.app](https://nexti-pim-iv.vercel.app) (Vercel) |
| **API** | Azure App Service, com o banco no Azure SQL ([status](https://nexti-api-pimivwjad.azurewebsites.net/api/status)) |
| **App** | Expo, na pasta [`sistema/apps/react-mobile`](sistema/apps/react-mobile) |

No plano gratuito a API "dorme" sem uso: a primeira entrada do dia pode levar até um minuto.

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
├── 📁 .github/        # Checagens automáticas de cada pull request e publicação da API
├── 📁 .vscode/        # Configuração do editor para o workspace inteiro
├── 📄 AGENTS.md       # Regras do projeto inteiro (equipe e IAs)
└── 📄 .gitattributes, .gitignore, LICENSE
```

### Por frente

| Pasta | Conteúdo |
|---|---|
| [`sistema/`](sistema) | Monorepo npm: `apps/react-web`, `apps/react-mobile`, `apps/api` (.NET), `apps/desktop` (.NET, Windows Forms), `packages/`, `database/`, `tests/` |
| [`relatorio/`](relatorio) | Relatório ABNT em HTML/CSS, as imagens (`assets/`), `design_DNA/` e, em `docs/`, a versão em Word (`docs/word/`), a apresentação do PIM e o plano de negócios |
| [`modelagem-uml/`](modelagem-uml) | `02_Modelagem_UML/` (o `.asta` e as imagens exportadas do Astah) e `04_Banco_de_Dados/` (MER, DER e modelo físico) |

## 🚀 Como executar o sistema

```bash
cd sistema
npm install
npm run dev   # sobe a API (porta 5000) e o site (porta 5501)
```

Detalhes de portas, banco de dados e API estão em [`sistema/README.md`](sistema/README.md).

O conteúdo reúne **43 fases e 1198 cartas**, incluindo **31 disciplinas de AVA e ED**
dos quatro semestres. Os resumos e 496 novas cartas ampliam os quatro módulos do curso;
o módulo 5 mantém o preparatório ENADE. As referências indicam o material e a página
ou slide consultado. O menu **Trilha** organiza essa consulta por módulo (Módulo 1 a 4).

O **Refazer Diagnóstico** avalia os quatro módulos com 20 perguntas e recomenda
por onde continuar. O resultado fica na conta e preserva o progresso anterior;
o diagnóstico não concede XP, moedas ou conclusão de disciplinas. Os perfis Admin e Tutor acessam
todos os módulos e disciplinas diretamente no site e no app, sem diagnóstico
ou pré-requisitos, além dos bônus do site; o Admin também abre o certificado, só para conferir.
Esse acesso não cria progresso nem recompensas.

O login vale 24 horas. Quando vence, o site volta à tela de entrada com um aviso, e o progresso
guardado no navegador continua lá.

São **453 testes automáticos**: 271 da API, 125 do pacote compartilhado (site e app), 26 do app e
31 do programa desktop. Como cada parte é testada: [`sistema/docs/TESTES.md`](sistema/docs/TESTES.md).

## 🎤 Apresentação do PIM IV

| Pasta | O que tem |
|---|---|
| [`relatorio/docs/apresentacao`](relatorio/docs/apresentacao) | Os 36 slides da avaliação (começo, meio e fim; as oito disciplinas, cada uma com um exemplo real, e o plano de negócios), o roteiro de quem fala o quê e o PDF |
| [`relatorio/docs/pesquisa`](relatorio/docs/pesquisa) | O questionário da pesquisa (Google Forms), com dados quantitativos (nota SUS, preço, recomendação) e qualitativos (respostas abertas), o script que cria o formulário e o que analisa as respostas |
| [`relatorio/docs/linkedin`](relatorio/docs/linkedin) | A publicação no LinkedIn para divulgar a pesquisa: texto do post, carrossel em PDF e imagens com as telas do sistema |
| [`relatorio/docs/plano de negocios`](relatorio/docs/plano%20de%20negocios) | A apresentação do plano de negócios da Nex_TI Educacional (21 slides) e o [`PLANO_DE_NEGOCIOS.md`](relatorio/docs/plano%20de%20negocios/PLANO_DE_NEGOCIOS.md), com premissas, contas e fontes |

Os slides abrem no navegador, com modo apresentação próprio (botão **Apresentar** ou **P**,
setas, **F** para tela cheia e **N** para a fala e o tempo de cada slide). O plano de negócios é
uma simulação: hoje o Nex_TI roda em planos gratuitos (custo R$ 0), e os valores pagos são uma
estimativa para quando ele crescer.

## 🎤 Apresentação de P.A. em .NET (atividade à parte)

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

Ele confere se os números dos documentos (README, manuais, relatório e slides) batem com o
código, se os diagramas do relatório são os do Astah e se o PIM III só aparece nas melhorias. O GitHub roda a mesma checagem em todo pull request.

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
| **API em C#** | 7 rotas, com todo o código junto | 27 rotas, separadas em camadas (rotas → serviços → banco), cada serviço com sua interface |
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
