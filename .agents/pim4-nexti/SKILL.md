---
name: pim4-nexti
description: >
  Gera, expande ou edita seções do documento acadêmico HTML do PIM IV – Nex_TI
  (UNIP, ADS, 4º semestre). Use esta skill sempre que o usuário pedir para adicionar
  uma nova página, nova seção, corrigir texto, inserir código SQL/C#, inserir diagrama,
  adicionar tabela ou qualquer conteúdo ao relatório HTML do PIM IV / Nex_TI.
  Aplique também quando o usuário mencionar: "PIM", "Nex_TI", "relatório ABNT",
  "adicionar seção", "nova página", "atualizar o documento", "inserir diagrama UML",
  "inserir código", "UNIP", "folha A4 HTML" ou contexto equivalente.
---

# Skill: PIM IV – Nex_TI (Geração de Documento HTML ABNT)

## Visão Geral

Este skill ensina Claude a gerar ou editar **páginas e seções** do documento HTML
`index.html` do PIM IV – Nex_TI, respeitando todas as convenções visuais, semânticas
e de norma ABNT já estabelecidas no arquivo.

---

## Regras Absolutas (nunca viole)

1. **Cada página é um `<section class="page">`** — nunca use `<div>` como substituto.
2. **Numeração de página**: `<span class="num-pagina">N</span>` no topo de cada section,
   imediatamente após a abertura da tag.
3. **Parágrafo de texto corrido**: use `<p class="paragrafo">` com recuo de 1,5 cm
   (já definido via CSS). Nunca use `<p>` simples para o corpo do texto principal.
4. **Nenhum negrito para destacar texto novo ou alterado.** Negrito (`<strong>`) só é
   permitido em: nomes de tabelas no Dicionário de Dados, referências bibliográficas e
   títulos de figuras/quadros.
5. **Texto contínuo e orgânico** — proibido usar listas com marcadores (`<ul>/<li>`) no
   corpo do desenvolvimento, salvo quando o conteúdo for genuinamente enumerativo (ex.:
   relações do DER, listas de requisitos em formato de tabela).
6. **Títulos**: todos os `<h2>` são `UPPERCASE` (o CSS já aplica, mas o texto fonte
   também deve estar em maiúsculas). `<h3>` e `<h4>` usam capitalização normal.
   Todos os headings são `12pt bold` — não altere o tamanho via `style`.
7. **Fonte universal**: Arial 12pt. Não introduza outras fontes.
8. **Norma ABNT**: citações no corpo no formato `(AUTOR, ANO)`, referências no final
   em ordem alfabética, imagens com `legenda-topo` acima e `legenda-fonte` abaixo.
9. **Idioma**: português brasileiro, exceto o Abstract que é em inglês.
10. **IDs de âncora**: cada seção numerada recebe `id="sec-X"` ou `id="sec-X-Y"` no
    heading, para o sumário funcionar.
11. **Ausência de Dados Emulados**: Todos os trechos textuais e lógicas geradas devem frisar a integração real. O front-end consome a API C# ASP.NET Core e realiza a persistência no banco SQL Server, eliminando localStorages para dados dinâmicos do aluno.

---

## Estrutura do Arquivo `index.html`

```
<body>
  <!-- Páginas pré-conteúdo (sem num-pagina visível) -->
  <section class="page" aria-label="Capa do Trabalho"> … </section>
  <section class="page" aria-label="Folha de Rosto"> … </section>
  <section class="page" aria-label="Resumo"> … </section>
  <section class="page" aria-label="Abstract"> … </section>
  <section class="page" aria-label="Página do Sumário"> … </section>

  <!-- Conteúdo principal (com num-pagina) -->
  <main role="main">
    <section class="page">
      <span class="num-pagina">6</span>
      <h2 id="sec-1">1 INTRODUÇÃO</h2>
      …
    </section>
    … demais seções …
  </main>
</body>
```

---

## Blocos Reutilizáveis

### Parágrafo de texto (uso mais comum)
```html
<p class="paragrafo">Texto justificado com recuo automático de 1,5 cm. Citação no
corpo: (AUTOR, ANO). Continue o parágrafo normalmente.</p>
```

### Diagrama / Figura
```html
<div class="diagrama-container">
    <p class="legenda-topo">Figura N – Título da Figura</p>
    <img src="nome-do-arquivo.png" alt="Descrição acessível" class="diagrama-img"
         style="max-height: Xcm;"
         onerror="this.src='https://placehold.co/800x600/E8EAED/5F6368?text=Figura+N'">
    <p class="legenda-fonte">Fonte: Criado pelos autores, 2026.</p>
</div>
```

### Bloco de código (SQL, C#, JavaScript)
```html
<div class="code-box" aria-label="Descrição do código">
    <pre><code>Quadro N – Título do Quadro (Linguagem)

-- código aqui
</code></pre>
</div>
<p class="legenda-fonte" style="text-align: left; margin-top:-0.5cm; margin-bottom: 0;">Fonte: Criado pelos autores, 2026.</p>
```

### Tabela genérica (com cabeçalho)
```html
<table>
    <tr>
        <th>Coluna 1</th>
        <th>Coluna 2</th>
    </tr>
    <tr>
        <td>Dado</td>
        <td>Dado</td>
    </tr>
</table>
```

### Tabela de Dicionário de Dados (padrão do projeto)
```html
<table>
    <tr>
        <th style="width:25%">Tabela</th>
        <th style="width:40%">Atributos</th>
        <th style="width:35%">Descrição</th>
    </tr>
    <tr>
        <td><strong>tb_nome</strong></td>
        <td><u>id_pk (PK)</u>, fk_ref (FK), campo_1, campo_2</td>
        <td>Descrição funcional da tabela.</td>
    </tr>
</table>
```

### Wrapper de Tabelas (Prevenir Quebras Órfãs)
```html
<div class="tabela-wrapper">
    <p class="legenda-tabela">Tabela N – Título da Tabela</p>
    <table>
        <tr>
            <th>Cabeçalho 1</th>
            <th>Cabeçalho 2</th>
        </tr>
        <tr>
            <td>Dado 1</td>
            <td>Dado 2</td>
        </tr>
    </table>
</div>
```

### Visualizador Modal Lightbox (Markup do Body)
```html
<!-- Inserir imediatamente antes de </body> -->
<div id="image-lightbox" class="lightbox" role="dialog" aria-hidden="true" aria-label="Visualizador de Imagem">
    <button class="lightbox-close" id="lightbox-close" aria-label="Fechar visualizador">&times;</button>
    <div class="lightbox-content">
        <img id="lightbox-img" src="" alt="Imagem ampliada do diagrama">
        <p id="lightbox-caption" class="lightbox-caption"></p>
    </div>
</div>
```


### Item do Sumário (ao adicionar nova seção)
```html
<a href="#sec-X" class="sumario-link">
  <div class="sumario-item" role="menuitem">
    <span class="sumario-titulo">X TÍTULO DA SEÇÃO</span>
    <span class="sumario-pontos"></span>
    <span class="sumario-pagina">NN</span>
  </div>
</a>
<!-- Subseção nível 1: adicionar class="sumario-recuo-1" ao sumario-titulo -->
<!-- Subseção nível 2: adicionar class="sumario-recuo-2" ao sumario-titulo -->
```

---

## Informações Fixas do Projeto

| Campo | Valor |
|---|---|
| Instituição | UNIP – Universidade Paulista |
| Curso | ADS – Análise e Desenvolvimento de Sistemas |
| Disciplina | PIM IV |
| Projeto | Nex_TI |
| Cidade | São José dos Campos – SP |
| Entrega | Novembro / 2026 |
| Grupo | 02 \| Período: Diurno |

**Equipe (Alunos):**
| Nome | RA | E-mail |
|---|---|---|
| Gabriel Alves Moreira | H67HJI4 | gabriel.moreira52@aluno.unip.br |
| Maciel Costa da Silva | R280985 | maciel.silva18@aluno.unip.br |
| Maycon Douglas Inácio Silva | H719CD3 | maycon.silva87@aluno.unip.br |
| Miguel Angel Fernandez Ortiz | H7858F9 | miguel.ortiz1@aluno.unip.br |
| Rafael Mesquita | H6722I0 | rafael.mesquita2@aluno.unip.br |

---

## Tecnologias do Projeto (contexto para geração de conteúdo)

- **Site**: React 18 + Vite (HTML semântico, CSS responsivo, ARIA, VLibras), publicado na Vercel; o Mapa Neural é um grafo com física de molas.
- **App**: React Native (Expo), com fila para estudar sem internet.
- **API**: C# (.NET 10), Minimal APIs em camadas (rotas → serviços → `AppDbContext`), EF Core, JWT, `Sm2Engine` para a revisão espaçada; publicada no Azure.
- **Pacote compartilhado** (`packages/shared`): fases e cartas, SM-2 e XP/moedas, usados pelo site e pelo app.
- **Banco**: SQL Server / Azure SQL. Tabelas (em `sistema/database/NexTI_DB.sql`): usuarios, fases, flashcards,
  progresso_flashcards, fases_concluidas, tb_historico_revisoes, cartas_moderadas, tb_areas_conhecimento,
  tb_provas, tb_questoes, tb_alternativas e tb_prova_questao.
- **Metodologia e qualidade**: Scrum + Kanban (Trello), ISO/IEC 25010, LGPD; testes unitários, caixa preta,
  caixa branca, carga e usabilidade (seção 2.8.2).
- O Nex_TI Desktop (`sistema/apps/desktop`) é de outra atividade (P.A. em .NET) e não entra no relatório.

Números (rotas, fases, cartas, testes) nunca vêm desta lista: tire do código.

---

## Seções do documento (referência)

Páginas de 25/10/2026. Elas mudam: confira no `index.html` (em `relatorio/docs/Relatorio_PIM_IV_Nex_TI`) e rode `python atualizar-sumario.py`
depois de incluir ou tirar página.

| ID | Título | Página |
|---|---|---|
| sec-1 | 1 INTRODUÇÃO | 7 |
| sec-1-1 | 1.1 Objetivo geral | 7 |
| sec-1-2 | 1.2 Objetivos específicos | 7 |
| sec-1-3 | 1.3 Método e delimitação | 7 |
| sec-1-4 | 1.4 Melhorias em relação ao PIM III | 8 |
| sec-1-5 | 1.5 Base teórica das disciplinas | 9 |
| sec-2 | 2 DESENVOLVIMENTO | 10 |
| sec-2-1 | 2.1 Etapa 1 – Caracterização da organização | 10 |
| sec-2-2 | 2.2 Etapa 2 – Planejamento da solução tecnológica | 11 |
| sec-2-3 | 2.3 Etapa 3 – Responsabilidade social e diversidade | 15 |
| sec-2-4 | 2.4 Etapa 4 – Desenvolvimento da solução Web | 16 |
| sec-2-5 | 2.5 Etapa 5 – Desenvolvimento da solução Mobile | 18 |
| sec-2-6 | 2.6 Etapa 6 – Arquitetura de Software | 19 |
| sec-2-7 | 2.7 Etapa 7 – Projeto do Banco de Dados | 25 |
| sec-2-8 | 2.8 Etapa 8 – Infraestrutura em Nuvem e DevOps | 31 |
| sec-2-9 | 2.9 Etapa 9 – Gerenciamento Ágil do Projeto | 34 |
| sec-3 | 3 CONCLUSÃO | 40 |
| sec-ref | REFERÊNCIAS | 41 |

---|---|---|
| sec-1 | 1 INTRODUÇÃO | 6 |
| sec-1-1 | 1.1 Objetivo Geral | 6 |
| sec-1-2 | 1.2 Objetivos Específicos | 6 |
| sec-1-3 | 1.3 Contextualização do Projeto | 7 |
| sec-2 | 2 DESENVOLVIMENTO | 7 |
| sec-2-1 | 2.1 Etapa 1 – Definição e caracterização do negócio fictício | 7 |
| sec-2-1-1 | 2.1.1 Regras de Negócio | 8 |
| sec-2-2 | 2.2 Etapa 2 – Engenharia de Software Ágil Aplicada | 9 |
| sec-2-2-1 | 2.2.1 Requisitos Funcionais e Não Funcionais | 9 |
| sec-2-2-2 | 2.2.2 Product Backlog e Épicos | 11 |
| sec-2-2-3 | 2.2.3 Gestão Visual e Quadro Kanban | 11 |
| sec-2-3 | 2.3 Etapa 3 – Modelagem de Banco de Dados e NoSQL | 13 |
| sec-2-4 | 2.4 Etapa 4 – Desenvolvimento do sistema com POO (C#) | 17 |
| sec-2-5 | 2.5 Etapa 5 – Desenvolvimento Web Responsivo | 20 |
| sec-2-6 | 2.6 Etapa 6 – UX e UI Design | 21 |
| sec-2-7 | 2.7 Etapa 7 – Machine Learning e Análise de Dados | 23 |
| sec-2-8 | 2.8 Etapa 8 – Comunicação e LIBRAS | 23 |
| sec-2-9 | 2.9 Etapa 9 – Integração e avaliação final (PIM IV) | 23 |
| sec-3 | 3 CONCLUSÃO | 27 |
| sec-ref | REFERÊNCIAS | 28 |

---

## Workflow para Geração de Novo Conteúdo

1. **Identifique** qual seção/página está sendo adicionada ou modificada.
2. **Respeite a sequência de páginas** — verifique o número da última página e continue.
3. **Escreva o HTML bruto** da(s) `<section class="page">` completa(s).
4. **Se o conteúdo for novo**, adicione o item correspondente ao `<nav class="sumario-container">`.
5. **Entregue apenas o trecho HTML** a ser inserido/substituído, não o arquivo inteiro
   (a menos que o usuário peça o arquivo completo).
6. **Valide**: a página tem `num-pagina`? Os parágrafos usam `.paragrafo`?
   Nenhum `<strong>` foi usado para destacar novidade? O texto é corrido e orgânico?
7. **Feche o ciclo**: `python atualizar-sumario.py` em `relatorio/docs/Relatorio_PIM_IV_Nex_TI` (páginas e sumário), confira que nenhuma página
   passa de 29,7 cm, gere o Word (`relatorio/docs/Relatorio_PIM_IV_Nex_TI`: `npm run gerar`) e rode
   `node scripts/verificar-sincronia.mjs` na raiz.

---

## Referências Bibliográficas do Projeto (para citações)

A lista completa e atual está na seção REFERÊNCIAS do `index.html`; use as entradas de lá, com a
mesma grafia. Cada etapa cita o livro-texto da sua disciplina (quadro da seção 1.5):

- ARANTES (2026a, 2026b…) — Gerenciamento de projetos ágil (apostilas)
- ARAÚJO NETO (2026) — Empreendedorismo em TI
- BOZOLAN (2025) — Desenvolvimento mobile com JavaScript
- MARTINS (2026) — Programação de banco de dados: SQL Server/T-SQL
- MONTEIRO (2026) — Desenvolvimento mobile
- PERES (2026) — Desenvolvimento web com .NET
- REIS (2026) — Cloud computing e DevOps
- TOLEDO-PLAÇA (2023) — Relações étnico-raciais e afrodescendência

Outras usadas no texto: ANKI, BRASIL (LGPD), ELMASRI; NAVATHE, FOWLER, INEP (ENADE), ISO/IEC 25010,
KRUG, PRESSMAN; MAXIM, SCHWABER; SUTHERLAND, SOFTEX, SOMMERVILLE, UNIVERSIDADE PAULISTA (Manual
PIM IV) e o repositório da equipe. As do PIM III só aparecem na seção 1.4 e nas referências.
