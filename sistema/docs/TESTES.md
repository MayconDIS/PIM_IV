# Programa de testes do Nex_TI

Este documento diz **o que cada tipo de teste responde**, **o que ele não responde** e o que cada
um encontrou. Medido em **25/10/2026**, no Windows 11 com .NET 10 e Node 24.

---

## O placar

| Suíte | Casos | Comando (na pasta `sistema/`) |
| :--- | ---: | :--- |
| API: unitários e integração | 186 | `npm test` |
| API: **caixa preta** (regras de negócio pelas rotas) | 23 | idem (`CaixaPreta/`) |
| API: **caixa branca** (caminhos do código) | 20 | idem (`CaixaBranca/`) |
| API: concorrência (achado da carga) | 2 | idem (`Carga/`) |
| **API, total** | **231** | `npm test` (4 deles só com `NEXTI_TEST_LOCALDB=1`) |
| Pacote compartilhado (inclui **carga** e assistente local) | 84 | `npm run test:shared` |
| App de celular | 16 | `npm run test:mobile` |
| Nex_TI Desktop | 28 | `npm run test:desktop` |
| **Total automatizado** | **359** | |
| **Carga da API** (requisições reais) | 6 cenários | `node tests/carga/carga-api.mjs` com a API no ar |
| **Auditoria do código** (código morto, ARIA, depuração) | 5 checagens | `node scripts/auditoria-codigo.mjs` |
| **Usabilidade** (7 tarefas, computador e celular, e 5 do menu no celular) | 19 execuções | roteiro na seção 6 |

### Cobertura do código de produção

Os 7 testes do assistente local foram acrescentados em 26/10/2026: conferem fontes literais,
variações de escrita, orientações da plataforma, assuntos fora da base, limite da pergunta,
ausência de gabaritos isolados e independência entre consultas. Os percentuais abaixo foram
medidos antes dessa inclusão.

Só os arquivos do projeto (sem migrations e sem código gerado pelo .NET).

| | Antes | Depois |
| :--- | ---: | ---: |
| API, linhas | 66,4% | **95,6%** |
| API, ramos | 81,1% | **90,9%** |
| Pacote compartilhado, linhas | 97,0% | 97,0% |
| Desktop, linhas | 91,8% | 92,0% |

A API subiu porque a camada de **rotas** não tinha teste nenhum: os testes HTTP de antes subiam a API
num processo separado, que a cobertura não enxerga. Os testes novos usam o `WebApplicationFactory`,
que sobe a API inteira (rotas, JWT, perfis, limite de login e serviços) dentro do teste, trocando só
o banco por um em memória.

---

## 1. Unitário

**Responde:** esta função, sozinha, dá o resultado certo?

Já existia: SM-2, tabela de recompensas, política de senha, serviços com banco em memória, CORS,
sessão. Os três SM-2 (site/app, API e desktop) passam pelos **mesmos 12 casos**
(`packages/shared/tests/sm2-casos.json`), então não podem divergir.

Depois do teste de usabilidade do menu (seção 6), entrou `fasesConcluidas`
(`packages/shared/tests/fases-concluidas.test.js`): fase concluída é a que tem todas as cartas
respondidas, a mesma regra do servidor; fase só liberada pelo diagnóstico não conta.

**Não responde:** se as peças funcionam juntas, nem se a rota certa chama a função certa.

---

## 2. Caixa preta — `tests/NexTI_API.Tests/CaixaPreta/`

**Responde:** o sistema faz o que foi **prometido**?

Os 23 casos saíram das **regras de negócio do relatório** (seção 2.2.2), não do código, e cada um
cita a regra que verifica. Só entram pela porta da frente: as rotas HTTP, com login de verdade.

| Regra | O que se confere |
| :--- | :--- |
| RN01 Recompensa só no servidor | 5 XP e 10 moedas só na 1ª conclusão; teste de módulo só paga com o corte (70%; ENADE 80%); fase inexistente não paga |
| RN02 Perfis | Aluno cria carta mas não edita/exclui; Tutor modera; painéis só para o perfil certo; só o Admin muda perfil; sem login, 401; aluno não lê dados de outro |
| RN03 Moedas | bônus custa 50 e é recusado sem saldo |
| RN04 Trilha | fases na ordem; a fase concluída fica no servidor (outro aparelho vê) |
| RN05 Progresso não volta | XP e nível não descem; salto de mais de 200 XP é recusado |
| RN06 Sempre um Admin | o último Admin não perde o perfil nem exclui a conta |
| RN07 Senha segura | curta, com o nickname ou longa demais é recusada; guardada com BCrypt; senha errada dá 401 |

**Achado:** o relatório dizia que o teste de módulo paga 25 XP com 70%, mas o do módulo 5 (ENADE) paga
**50 XP com 80%**. O texto da RN01 foi corrigido.

### Verificação por mutação

Teste que não reprova código quebrado é decoração. Cada grupo foi conferido estragando o código:

| Mutação | Reprovou? |
| :--- | :--- |
| Salto máximo de XP de 200 para 300 | ✅ 1 caso |
| Aluno passa a poder moderar cartas | ✅ 2 casos |
| Rota de aluno sem conferir o dono | ✅ 1 caso |

---

## 3. Caixa branca — `tests/NexTI_API.Tests/CaixaBranca/`

**Responde:** todos os caminhos que o código **tem** foram percorridos?

Escritos com o relatório de cobertura na mão: cada validação pelos dois lados (nickname, e-mail,
senha vazia, credenciais em branco), as rotas de progresso, a troca de e-mail e senha (com a sessão
antiga revogada), os simulados, a normalização do código da fase (" FASE1 ") e a carga inicial que
continua quando uma etapa falha.

**Achado (defeito corrigido):** ao registrar uma resposta, a API **não conferia a nota nem a carta**.
Uma nota 99 virava "Fácil" e -5 virava "Errei"; uma carta inexistente estourava a chave estrangeira no
SQL Server e devolvia **erro 500**. Agora: nota fora de 0 a 5 → 400, carta inexistente → 404. Os testes
foram escritos antes da correção e falhavam (4 de 20).

---

## 4. Carga

**Responde:** quanto o sistema aguenta antes de ficar lento ou falhar?

### 4.1 API — `tests/carga/carga-api.mjs`

2.000 requisições por cenário, 50 em paralelo, na API local em Release com SQL Server (LocalDB):

| Cenário | req/s | p50 | p95 | p99 | Resultado |
| :--- | ---: | ---: | ---: | ---: | :--- |
| `GET /api/status` | 6.426 | 5,7 ms | 14,8 ms | 24,7 ms | 2.000 × 200 |
| `GET /api/fases` | 4.164 | 10,0 ms | 24,6 ms | 44,7 ms | 2.000 × 200 |
| `GET /api/fases/fase1/flashcards` | 5.460 | 8,9 ms | 13,0 ms | 17,6 ms | 2.000 × 200 |
| `GET /api/simulados/questoes` | 1.920 | 24,6 ms | 38,1 ms | 59,9 ms | 2.000 × 200 |
| `POST /api/progresso/atualizar` (grava) | 2.272 | 15,8 ms | 25,5 ms | 232 ms | 2.000 × 200 |
| `POST /api/auth/login`, rajada de 60 | — | — | — | — | 28 × 401 e **32 × 429** (o limite segurou) |

**Achados (dois defeitos, corrigidos).** Na primeira rodada, **640 das 2.000 gravações deram 500**:

1. **O intervalo do SM-2 não tinha teto.** A mesma carta respondida "Fácil" ~12 vezes passava do ano
   9999 e o C# não conseguia somar a data (`ArgumentOutOfRangeException`). Agora o intervalo para em
   **36.500 dias** (100 anos, o teto do Anki) nos três SM-2, com um caso compartilhado novo
   ("Fácil 20 vezes").
2. **Duas primeiras respostas da mesma carta ao mesmo tempo** (clique duplo, fila do app reenviando)
   tentavam criar o mesmo registro e a segunda batia na chave primária. Agora a segunda aplica a
   resposta sobre o registro que a primeira criou. Preso em teste com 30 respostas simultâneas no SQL
   Server (`Carga/ConcorrenciaTests.cs`), que falha sem a correção.

Depois das correções: **0 falhas**.

**Não responde:** como a API se sai na Azure (plano gratuito, banco que "dorme"). Lá o número é outro;
aqui o objetivo é achar gargalo e defeito no código.

### 4.2 Algoritmos do navegador e do celular — `packages/shared/tests/carga.test.js`

Hoje são 702 cartas. Os testes usam 50.000 e 100.000 (70 a 140 vezes o real). Duas checagens, como
no CasalFlow: a **forma da curva** (dobrar a entrada não pode mais que ~dobrar o tempo) e um **teto**
com ~10x de folga sobre o medido.

| Função | Medido | Teto |
| :--- | ---: | ---: |
| `montarDeckDaFase`, 100.000 cartas | 9 ms | 100 ms |
| `fasesLiberadasNoServidor`, 100.000 registros | 4 ms | 50 ms |
| `aplicarResposta` (SM-2), 1.000.000 de respostas | 83 ms | 1 s |
| Uma fase aberta com o conteúdo real | 0,1 ms | 16 ms (um quadro de tela) |

**Mutação:** trocar a busca direta do progresso por uma busca em lista (quadrática) fez o teste
reprovar.

---

## 5. Auditoria do código — `scripts/auditoria-codigo.mjs`

Arquivos que ninguém importa, funções exportadas sem uso, `console.log`/`debugger`/`TODO`, código
comentado, tamanho e acessibilidade nos `.jsx`. Resultado e decisões em [`AUDITORIA.md`](AUDITORIA.md).

---

## 6. Usabilidade

**Responde:** um aluno consegue fazer as tarefas principais, no computador e no celular?

Roteiro executado pela interface (formulário, botões e busca, sem atalhos internos) no Chrome, em
1280 px e em 360 px. Uma tarefa só conta se o resultado aparece na tela.

| Tarefa | Computador | Celular |
| :--- | :---: | :---: |
| T1 Entrar pelo formulário | ✅ 1,0 s | ✅ 0,9 s |
| T2 Buscar uma disciplina ("banco") | ✅ | ✅ |
| T3 Clicar numa fase trancada e entender o motivo | ✅ | ✅ |
| T4 Abrir a fase 1 e responder 3 cartas | ✅ 4,1 s | ✅ 4,1 s |
| T5 Ver as estatísticas | ✅ | ✅ |
| T6 Criar uma carta | ✅ | ✅ |
| T7 Ligar o alto contraste | ✅ | ✅ |

No celular, cada item do menu do cabeçalho (☰) também foi aberto, conferindo que a informação bate
com o que o aluno fez, que o título da janela não cobre o conteúdo e que a barra do rodapé continua
à mostra (escondê-la deixava uma faixa preta no espaço reservado para ela):

| Tarefa (celular, depois de responder 3 cartas da fase 1) | Resultado |
| :--- | :---: |
| M1 Minhas Estatísticas: todos os módulos em 0% (0/5), pois nenhuma fase foi concluída | ✅ |
| M2 Mapa Neural: o botão da câmera fica abaixo do título | ✅ |
| M3 Minha conta: mostra o usuário certo | ✅ |
| M4 Refazer Diagnóstico: abre o teste | ✅ |
| M5 Ao fechar a janela, o painel volta com a barra do rodapé | ✅ |

Na primeira rodada, M1 e M2 falharam. As estatísticas contavam as fases **liberadas** como
concluídas (depois do diagnóstico, o Mod 01 e o Mod 02 apareciam em 100% com 5 XP), e o título de
todas as janelas cobria o começo do conteúdo (a regra do cabeçalho fixo da página pegava também o
`<header>` das janelas). Os dois foram corrigidos, e os ícones passaram a ter `aria-hidden` para o
leitor de tela não ler o nome deles ("arrow_back Voltar ao App").

Erros no console: nenhum. A avaliação pelas 10 heurísticas de Nielsen está em
[`AUDITORIA.md`](AUDITORIA.md#heuristicas-de-nielsen).

**Não responde:** o que uma pessoa de verdade sente usando. O teste com alunos reais (pensar em voz
alta, com cronômetro) continua sendo da equipe.

---

## O que ainda depende da equipe

- Testar o app num celular de verdade (Expo Go) e o site num iPhone.
- Teste de usabilidade com alunos reais.
- Carga na Azure, se for preciso saber o limite do plano gratuito.
