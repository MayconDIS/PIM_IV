# 🎤 Roteiro do Palestrante — Apresentação do PIM IV (Nex_TI)

A apresentação mostra o Nex_TI seguindo as nove etapas do Manual do PIM IV, na mesma ordem do
relatório. Os números e as imagens são os do relatório (`relatorio/index.html` e `relatorio/assets`).
A fala curta de cada slide também está dentro dos slides: no modo apresentação, aperte **N**.

## Informações gerais

| Item | Detalhe |
|---|---|
| **O quê** | Apresentação do PIM IV para a avaliação (24/11 a 03/12/2026) |
| **Duração** | 15 minutos, cerca de 3 por pessoa, mais as perguntas. Se a banca der outro tempo, ajuste a coluna "Tempo" abaixo |
| **Slides** | `slides.html` no navegador (botão **Apresentar** ou tecla **P**) ou o PDF `Nex_TI - Apresentacao PIM IV.pdf` em tela cheia |
| **Ter aberto** | Os slides, o site (https://nexti-pim-iv.vercel.app) já logado numa conta de teste, e o GitHub (https://github.com/MayconDIS/PIM_IV) |
| **Antes de começar** | Abra o site uns 2 minutos antes: no plano gratuito a API "dorme" e a primeira requisição pode levar até um minuto |

### Teclas no modo apresentação

| Tecla | O que faz |
|---|---|
| **→**, **Espaço**, **Enter** ou clique na metade direita | Próximo slide |
| **←** ou clique na metade esquerda | Slide anterior |
| **F** | Tela cheia |
| **N** | Mostra a fala do slide, o tempo e o número do slide |
| **T** | Zera o tempo |
| **Esc** | Sai do modo apresentação |

### Equipe e divisão

| Integrante | RA | Slides | Tempo |
|---|---|---|---|
| Maciel Costa da Silva | R280985 | 1–3 · Capa, problema e a solução em números | 00:00 – 02:30 |
| Gabriel Alves Moreira | H67HJI4 | 4–6 · Etapas 1, 2 e 3 | 02:30 – 05:30 |
| Maycon Douglas Inácio Silva | H719CD3 | 7–10 · Etapas 4 e 5 (site, estudo, área administrativa e app) | 05:30 – 08:30 |
| Miguel Angel Fernandez Ortiz | H7858F9 | 11–13 · Etapas 6 e 7 (arquitetura, casos de uso e banco) | 08:30 – 11:00 |
| Rafael Mesquita | H6722I0 | 14–17 · Etapa 8, qualidade, Etapa 9 e conclusão | 11:00 – 14:00 |
| Maycon e todos | — | 18 · Demonstração e perguntas | 14:00 – 15:00 |

---

## ⏱️ Slide a slide

### 1 — Capa (00:00 – 00:20) · Maciel
> *"Somos a equipe do Nex_TI: Gabriel, Maciel, Maycon, Miguel e Rafael. Vamos mostrar a plataforma que fizemos no PIM IV, seguindo as nove etapas do manual, e no fim o sistema funcionando."*

### 2 — O problema (00:20 – 01:30) · Maciel
- Três problemas de quem começa em TI: muitos termos novos, estudo pouco sistemático e falta de acompanhamento.
- A persona: jovem de 18 a 20 anos, recém-saído do ensino médio.
- **Importante:** são hipóteses. O projeto ainda não foi usado por alunos reais.

### 3 — A solução em números (01:30 – 02:30) · Maciel
- 43 fases e 1198 cartas, com 31 disciplinas de AVA e ED dos quatro semestres.
- Um site, um app e uma API com o mesmo banco; 27 rotas, 16 casos de uso e 445 testes.
- **Passar a vez:** *"O Gabriel mostra como pensamos a empresa e o planejamento."*

### 4 — Etapa 1: organização (02:30 – 03:30) · Gabriel
- A Nex_TI Educacional é uma EdTech **fictícia**: atende estudantes (B2C) e instituições (B2B).
- Quatro funções: produto e parcerias, curadoria pedagógica, desenvolvimento e operação, atendimento e inclusão.
- Disciplina: Empreendedorismo em TI.

### 5 — Etapa 2: planejamento (03:30 – 04:30) · Gabriel
- 8 regras de negócio, 14 requisitos funcionais e 6 não funcionais.
- Dar dois exemplos: RN01 (XP e moedas calculados pela API, só na primeira conclusão) e RN05 (o progresso nunca diminui).
- Cada requisito se liga a um item do backlog no Trello, e cada item ao pull request que o entregou.

### 6 — Etapa 3: diversidade e inclusão (04:30 – 05:30) · Gabriel
- Separar o que **já está no sistema** (VLibras, alto contraste, zoom, teclado, leitor de tela, app sem internet) do que é **proposta** (revisão de conteúdo, canal de relato, orientação de LGPD).
- Disciplina: Relações étnico-raciais e afrodescendência.
- **Passar a vez:** *"O Maycon mostra o site."*

### 7 — Etapa 4: o site (05:30 – 06:15) · Maycon
- O site em React conversa com a API .NET 10; login com JWT e limite de tentativas.
- As rotas chamam serviços, e só os serviços falam com o banco.
- Disciplina: Desenvolvimento Web com .NET.

### 8 — Estudo e revisão espaçada (06:15 – 07:00) · Maycon
- Os quatro botões do SM-2: Errei volta amanhã; Difícil, Bom e Fácil afastam a revisão.
- A mesma regra está no site, no app e na API, conferida pelos mesmos casos de teste.
- XP e moedas: quem calcula é o servidor.

### 9 — Área administrativa, Trilha e Nexor (07:00 – 07:45) · Maycon
- A estrutura administrativa vale ponto na Etapa 4: o Tutor acompanha os alunos e modera as cartas; o Administrador também define perfis.
- A Trilha organiza as 31 disciplinas por módulo; o Nexor responde com os materiais da própria plataforma, sem serviço externo.

### 10 — Etapa 5: o app (07:45 – 08:30) · Maycon
- Os quatro itens que valem ponto: telas e navegação, autenticação (token no cofre do aparelho), sincronização (fila sem internet) e integração (as mesmas rotas do site).
- Disciplina: Desenvolvimento Mobile.
- **Passar a vez:** *"O Miguel mostra a arquitetura."*

### 11 — Etapa 6: arquitetura (08:30 – 09:20) · Miguel
- Rotas → serviços → banco: cada camada só conhece a de baixo.
- Por isso dá para testar um serviço sem a tela e trocar o banco sem mexer nas regras.
- Disciplina: Programação Aplicada em .NET.

### 12 — Casos de uso (09:20 – 10:10) · Miguel
- 16 casos de uso; os perfis herdam: Usuário → Aluno → Tutor → Administrador.
- Os diagramas saem de um gerador do Astah que lê o código, então não ficam diferentes do sistema.

### 13 — Etapa 7: banco de dados (10:10 – 11:00) · Miguel
- Do MER ao modelo físico; mostrar o DER.
- Triggers: o histórico de revisões e a proteção do XP. Procedures: ranking, estatísticas e cadastro de carta.
- Disciplina: Programação de Banco de Dados.
- **Passar a vez:** *"O Rafael mostra a nuvem, os testes e a gestão."*

### 14 — Etapa 8: nuvem e DevOps (11:00 – 11:50) · Rafael
- O caminho do pedido: navegador → Vercel → Azure App Service → Azure SQL.
- Os três itens exigidos: contêineres, CI/CD e monitoramento.
- Disciplina: Cloud Computing e DevOps.

### 15 — Testes e qualidade (11:50 – 12:40) · Rafael
- 445 testes aprovados; destacar que eles **acharam defeitos reais** (o teto do SM-2, a nota sem validação, as estatísticas erradas), todos corrigidos com teste novo.

### 16 — Etapa 9: gestão ágil (12:40 – 13:20) · Rafael
- Scrum com Kanban no Trello, cinco sprints; cada cartão leva o link do pull request.
- Disciplina: Gerenciamento de Projetos Ágil.

### 17 — Conclusão (13:20 – 14:00) · Rafael
- Ser honesto: a parte técnica foi comprovada; o efeito no aprendizado, a inclusão e a viabilidade econômica ainda precisam ser medidos num piloto.
- **Passar a vez:** *"O Maycon mostra o sistema funcionando."*

### 18 — Demonstração e perguntas (14:00 – 15:00) · Maycon e todos
- **Ao vivo (1 minuto):** entrar no site → abrir a Fase 1 → responder duas cartas → abrir Minhas Estatísticas.
- Se a internet falhar, seguir com as telas dos slides 7 a 10.

---

## ❓ Perguntas prováveis

| Pergunta | Quem responde | Resposta curta |
|---|---|---|
| Por que o XP é calculado no servidor? | Maycon | Se fosse no navegador, qualquer um mudaria o próprio XP. A API calcula pela tabela de recompensas, e o banco ainda impede que o XP diminua. |
| Como o app funciona sem internet? | Maycon | A resposta fica numa fila no aparelho e é enviada na próxima sincronização; o servidor recalcula o SM-2. |
| Por que separar a API em camadas? | Miguel | Cada parte cuida de uma coisa: dá para testar a regra sem a tela e trocar o banco sem mexer nas regras. |
| Os diagramas foram feitos à mão? | Miguel | Não: um gerador monta o arquivo do Astah a partir do código, com a explicação de cada elemento. |
| Para que servem as triggers? | Miguel | Uma grava o histórico de cada revisão; a outra impede que XP ou nível diminuam, mesmo por fora da API. |
| Quanto custa manter no ar? | Rafael | Tudo está em camadas gratuitas (Vercel, App Service F1 e Azure SQL serverless); por isso a primeira requisição pode demorar. |
| Como sabem que funciona? | Rafael | 445 testes rodam a cada pull request, e um script confere se o relatório e os slides batem com o código. |
| A plataforma melhora o aprendizado? | Rafael | Ainda não dá para afirmar: falta um piloto com alunos reais, medindo o desempenho antes e depois. |
