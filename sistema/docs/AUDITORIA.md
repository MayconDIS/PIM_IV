# Auditoria de qualidade do Nex_TI

Feita em **25/10/2026** sobre o código de `sistema/` (API, site, app, pacote compartilhado e desktop).
Cada pilar diz o que foi conferido, **como** (para dar para repetir), o que apareceu e o que foi feito.
Os testes estão em [`TESTES.md`](TESTES.md).

| Pilar | Situação |
| :--- | :--- |
| Responsividade | ✅ nenhuma tela passa da largura em 360, 390, 768, 1024 e 1280 px |
| Acessibilidade (ARIA, teclado, foco) | ✅ corrigido: fases sem teclado, janelas sem `role="dialog"`, foco invisível, busca sem rótulo |
| HTML semântico | ✅ corrigido: trilha, janelas, avisos e rodapé deixaram de ser `div` genéricas |
| 10 heurísticas de Nielsen | ✅ 1 defeito (mensagem que prometia o que não fazia) e 3 textos com jargão corrigidos |
| Clean Code | ⚠️ ok, com 11 funções/arquivos longos registrados como dívida técnica |
| Orientação a objetos | ✅ API e desktop em camadas com interfaces |
| Código sem uso e resíduos | ✅ nenhum arquivo, export ou membro privado sem uso; nada de build ou lixo versionado |
| Análise do compilador (C#) | ✅ 2 regras de cultura corrigidas; o resto é estilo, aceito |

---

## 1. Responsividade

**Como:** Chrome sem janela, com toque simulado, percorrendo login, cadastro, painel, menu, estudo,
as janelas e a página Sobre em 360, 390, 768, 1024 e 1280 px. Mede o que passa da largura, os alvos
de toque menores que 44 px e os textos cortados.

**Resultado:** nenhuma rolagem lateral em nenhuma largura. No celular (até 800 px) há a barra de
navegação embaixo, campos com 16 px (sem o zoom do iPhone) e alvos de 44 px (PRs #30 a #32).
No computador, os botões A-, A+ e contraste têm 32 px, acima do mínimo de 24 px da WCAG 2.5.8.

---

## 2. Acessibilidade

**Como:** (1) varredura estática dos `.jsx` em `scripts/auditoria-codigo.mjs`; (2) no navegador:
nome acessível de tudo que é clicável, `alt` das imagens, rótulo dos campos, idioma, marcos
(`header`, `main`, `nav`), papel e foco das janelas; (3) **teclado de verdade**: Tab e Enter enviados
pelo Chrome, lendo o contorno de foco de cada parada.

| Achado | Correção |
| :--- | :--- |
| As **fases da trilha não recebiam foco**: quem usa só o teclado não abria fase nenhuma | Cada fase virou um `<button>` (Tab, Enter e Espaço sem código extra), com `aria-expanded` e "(trancada)" no nome |
| A carta, o logo e o avatar eram `div` clicáveis, sem teclado | `role`, `tabIndex` e `ativarComTeclado` (Enter e Espaço), uma função só em `lib/acessibilidade.js` |
| **Foco invisível** no fundo escuro | `:focus-visible` ciano de 2 px para todos os controles |
| As **janelas não tinham `role="dialog"`**: o leitor de tela não anunciava a janela | `Modal` virou `<section role="dialog" aria-modal aria-labelledby>`; o foco entra ao abrir e volta para quem abriu ao fechar |
| Campo de busca só com o texto de exemplo | `aria-label="Buscar disciplina (atalho: /)"` |
| Barra de XP sem significado para o leitor de tela | `role="progressbar"` com valor e texto |
| Avisos (toasts) sem prioridade | erro com `role="alert"` (anunciado na hora), os outros `role="status"` |
| Ícones lidos como palavras ("monitoring", "close") | `aria-hidden="true"` nos ícones; botões com `aria-label` |
| App de celular: 3 botões sem `accessibilityRole` | papel de botão; fases trancadas com `accessibilityState` |

**Resultado no navegador, depois:** 0 controles sem nome, 0 imagens sem `alt`, 0 campos sem rótulo,
`lang="pt-BR"` e título em todas as páginas; janelas anunciadas pelo título e foco devolvido ao botão
do menu.

---

## 3. HTML semântico

Diretriz: usar a tag que diz o que a coisa é, e `div` só para agrupar visualmente.

| Antes | Depois |
| :--- | :--- |
| Trilha: `div`s soltas em fila | `<nav>` > `<section aria-labelledby>` por módulo > `<h2>` > `<ul>` > `<li>` > `<button>` |
| Caixa de busca: `div` | `<form role="search">` |
| Janela: `div` > `div` | `<section role="dialog">` > `<header>` > `<h2>` |
| Aviso: `div` > `div` | `<section aria-label="Avisos">` > `<article>` > `<strong>` e `<p>` |
| Rodapé: colunas em `div` | `<nav aria-label>` por coluna, redes sociais num `<nav>`, direitos em `<small>` |

O visual não mudou (conferido em foto, no computador e no celular). O efeito de esconder o resto da
trilha com uma fase aberta passou a usar `:has()`, porque o "depois" agora está em outra lista. No
caminho saiu uma regra de CSS que nunca valia (`.left-panel .dia-header:first-child`).

---

## 4. As 10 heurísticas de Nielsen {#heuristicas-de-nielsen}

Avaliadas com as telas do roteiro de usabilidade (TESTES.md, seção 6).

| # | Heurística | Evidência no Nex_TI | Achado e correção |
| :-- | :--- | :--- | :--- |
| 1 | Visibilidade do estado do sistema | contador "Item 4/20", barra de XP, "Servidor: conectado", avisos depois de cada ação, item ativo na barra do celular | **Defeito:** a confirmação de "Formatar Sistema" dizia que apagaria **permanentemente** todo o histórico, mas só limpava o navegador (o que está na conta volta ao recarregar). Agora a ação se chama **"Limpar dados do navegador"** e explica isso, apontando para "Minha conta → Excluir conta" |
| 2 | Correspondência com o mundo real | textos em português simples (PR #28), botões Errei/Difícil/Bom/Fácil | "Formatar Sistema", "Logout", "Formatação de Save Data" e "Novo dado registrado" trocados por "Limpar dados do navegador", "Sair" e "Carta salva" |
| 3 | Controle e liberdade | Esc e X fecham as janelas, voltar ao topo, confirmação antes de limpar ou sair | ok |
| 4 | Consistência e padrões | mesmos ícones e cores no site e no celular; botões de verdade em todo lugar | "Logout" era o único item em inglês (corrigido) |
| 5 | Prevenção de erros | regras da senha ao vivo, "Excluir conta" só depois de marcar a caixa, fase trancada não abre, nota fora de 0–5 recusada na API | ok |
| 6 | Reconhecer em vez de lembrar | previsão do intervalo em cada botão ("3d", "<10m"), dica na carta, rótulo embaixo dos ícones no celular | ok |
| 7 | Flexibilidade e eficiência | atalhos `/` (busca), Espaço (virar), 1–4 (responder), Esc (fechar) | ok |
| 8 | Estética e minimalismo | no celular o cabeçalho tem só marca, som e menu | ok |
| 9 | Ajudar a reconhecer e corrigir erros | mensagens dizem o que fazer ("Conclua as fases e os testes anteriores para liberar esta") | ok; a API passou a dizer "Carta não encontrada" em vez de erro 500 |
| 10 | Ajuda e documentação | página Sobre com perguntas frequentes, manual prático | a pergunta "Como recomeço?" foi reescrita junto com a heurística 1 |

**Observação, sem correção agora:** no celular os avisos aparecem no topo, por cima do cabeçalho,
por cerca de 4 segundos. Não escondem nada que o aluno precise naquele instante; fica anotado.

---

## 5. Clean Code

**Conferido:** nomes em português claros e consistentes; uma responsabilidade por arquivo; nenhum
`console.log`, `debugger`, `TODO` ou código comentado (varredura); comentários explicam o porquê.

**Corrigido nesta auditoria:**
- comentário do limite de login fora do lugar no `Program.cs` (estava colado no bloco do monitoramento);
- duas implementações de "devolver o foco" (no `Modal` e no `ModalConta`) brigando entre si: ficou um dono só;
- a mesma lógica de "Enter/Espaço ativa" repetida: virou `ativarComTeclado`;
- espaços sobrando no fim das linhas do `dashboard.css`.

**Dívida técnica registrada** (a varredura avisa, não reprova). São componentes e hooks com mais de 120
linhas; quebrar agora mexeria no site inteiro na véspera da entrega, com risco de regressão:

| Arquivo | Linhas | Como dividir depois |
| :--- | ---: | :--- |
| `lib/mapaNeural.js` (`montarMapaNeural`) | 367 | separar física, câmera e eventos de toque |
| `context/estudo/useSessaoDeEstudo.js` | 262 | separar a conclusão da fase (prêmio) da fila de cartas |
| `pages/LoginPage.jsx` | 229 | formulário de login e de cadastro em componentes próprios |
| `modais/ModalProgresso.jsx` | 219 | um componente por bloco de estatísticas |
| `packages/shared/src/audio.js` (`AudioEngine`) | 176 | um efeito sonoro por função |
| `Trilhas.jsx`, `Topo.jsx`, `PainelEstudo.jsx`, `ModalConta.jsx`, `sincronizacao.js` | 129–156 | extrair o item da fase, o menu e os formulários |

---

## 6. Orientação a objetos

- **API:** rotas → interfaces de serviço (`IAuthService`, `IProgressoService`, …) → serviços → `AppDbContext`.
  Herança `Aluno`/`Tutor` : `Usuario`; `Resultado<T>` para falhas sem exceção; o SM-2 atrás de
  `ISm2Engine`; a carga inicial em etapas `IEtapaSeed` (padrão Composite).
- **Desktop:** quatro projetos em camadas, `Usuario` abstrata, encapsulamento de XP e moedas,
  `IAgendadorDeRevisao` (ver `apps/desktop/ESTUDOS.md`).

---

## 7. Código sem uso e resíduos

- **JavaScript:** nenhum arquivo que ninguém importa, nenhum export do `@nexti/shared` sem uso
  (a varredura segue também os imports pelo nome do pacote, `@nexti/shared/audio`).
- **C#:** a análise do compilador (`AnalysisLevel=latest-recommended`) não apontou membro privado,
  variável ou campo sem uso.
- **Repositório:** nada de `bin/`, `obj/`, `dist/`, `node_modules`, logs, `.bak` ou cópias versionado.

---

## 8. Análise do compilador (C#)

| Regra | Onde | Decisão |
| :--- | :--- | :--- |
| CA1304/CA1311 `ToLower()` sem cultura | `ContaService`, `ConteudoService` | **Corrigido** (`ToLowerInvariant`): num Windows em turco, "I" viraria "ı" |
| CA1869 `JsonSerializerOptions` novo a cada leitura | desktop | **Corrigido** (uma instância reaproveitada) |
| CA1852 telas que podem ser `sealed` | desktop | **Corrigido** |
| CA1000 estático em tipo genérico | `Resultado<T>.Ok/Erro` | Aceito: é a fábrica do padrão Result |
| CA1707 `_` em nomes | métodos de teste | Aceito: convenção dos testes do projeto |
| CA1305 `ToString()` sem cultura | números na tela do desktop | Aceito: são números inteiros mostrados ao aluno |

---

## Como repetir

```bash
cd sistema
node scripts/auditoria-codigo.mjs                 # varredura do JS/JSX
npm test && npm run test:shared && npm run test:mobile && npm run test:desktop
node tests/carga/carga-api.mjs                    # com a API no ar (npm run dev:api)
dotnet build apps/api/NexTI_API.csproj -p:AnalysisLevel=latest-recommended   # análise do C#
```
