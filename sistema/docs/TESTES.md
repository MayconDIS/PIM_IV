# Programa de testes do Nex_TI

Este documento diz **o que cada tipo de teste responde**, **o que ele não responde** e o que cada
um encontrou. Placar atualizado em **26/10/2026**, no Windows 11 com .NET 10 e Node 24.
As medições de cobertura, carga e usabilidade anteriores permanecem identificadas nas seções abaixo.

---

## O placar

| Suíte | Casos | Comando (na pasta `sistema/`) |
| :--- | ---: | :--- |
| API: unitários e integração | 221 | `npm test` |
| API: **caixa preta** (regras de negócio pelas rotas) | 28 | idem (`CaixaPreta/`) |
| API: **caixa branca** (caminhos do código) | 20 | idem (`CaixaBranca/`) |
| API: concorrência (achado da carga) | 2 | idem (`Carga/`) |
| **API, total** | **271** | `npm test` (5 deles só com `NEXTI_TEST_LOCALDB=1`) |
| Pacote compartilhado (inclui **carga**, assistente local, sessão vencida e link da pesquisa) | 125 | `npm run test:shared` |
| App de celular | 26 | `npm run test:mobile` |
| Nex_TI Desktop | 31 | `npm run test:desktop` |
| **Total automatizado** | **453** | |
| **Carga da API** (requisições reais) | 6 cenários | `node tests/carga/carga-api.mjs` com a API no ar |
| **Auditoria do código** (código morto, ARIA, depuração) | 5 checagens | `node scripts/auditoria-codigo.mjs` |
| **Usabilidade** (7 tarefas, computador e celular, e 5 do menu no celular) | 19 execuções | roteiro na seção 6 |

Em 26/10/2026, as execuções complementares no mesmo código somaram **445 casos
aprovados, sem falhas**. Em 30/10/2026, entraram 4 testes da sessão vencida
(`packages/shared/tests/sessao.test.js`), 2 do certificado (Admin em `fases-liberadas.test.js` e impressão em
`certificado.test.js`), 1 da correção de texto das cartas (`BancoDeDadosTests.cs`) e 1 do link da pesquisa (`pesquisa.test.js`); o total passou a **453**: API 271, pacote
compartilhado 125, Mobile 26 e desktop 31.
A execução inicial aprovou 440 e ignorou os cinco opcionais. Depois, esses cinco
foram executados com `NEXTI_TEST_LOCALDB=1` e filtro específico: **5 aprovados, zero
falhas e zero ignorados**, usando bancos locais descartáveis. O comando padrão sem
essa variável continua ignorando os cinco; o total consolidado inclui as duas execuções.

O build Web e a interface em 320 px, 390 px e 1440 px passaram. A auditoria registrou
zero problemas e 13 avisos de tamanho de arquivo. As medições anteriores de carga
não foram refeitas. A [evidência dos testes complementares](evidencias/testes-complementares-2026-10-26.json)
registra o código testado, os cinco casos de SQL Server e os cenários do diagnóstico.

### Diagnóstico dos quatro módulos

A avaliação seleciona 20 perguntas (cinco por módulo) de um banco canônico de 34.
Os testes conferem cobertura das disciplinas, IDs e alternativas válidos, ausência
de repetições, limites do corte de quatro acertos, todas certas, todas erradas e
base fraca que não pode ser compensada por acertos avançados. API e JavaScript
usam a mesma semente. Também se verifica que refazer não reduz acessos, XP ou rank,
não paga recompensas e que o resultado acompanha o perfil e a exportação da conta.

No site publicado, uma conta temporária concluiu o diagnóstico em navegador com
largura de 1440 px: retomou o rascunho em 3/20 após atualizar e terminou com 15/20,
recomendação do Mod_02 e 11 acessos liberados. Em outra sessão, com largura de
390 px, recuperou o resultado, refez a avaliação com 20/20, recebeu o Mod_05 e abriu
a recomendação antes e depois de recarregar. Ao refazer com 0/20 no computador,
recebeu o Mod_01 sem perder os acessos anteriores. Também passaram o layout em
320 px e a exportação dos dados, sem gerar XP, moedas ou conclusões.

A conta temporária foi excluída e seu login passou a responder 401. A conta de aluno
usada na conferência permaneceu com o mesmo estado antes e depois. Esses cenários
validam o **site responsivo em navegador**, não o Expo em aparelho físico. O uso real
do aplicativo pelo Expo Go continua pendente; o Nex_TI Desktop não oferece diagnóstico.

O roteiro de interface também inclui seleção e confirmação, **Não sei**, cancelamento,
revisão das respostas, indicação de envio pendente e texto ampliado. A execução
complementar descrita acima não substitui as demais verificações do roteiro.

### Acesso direto do Admin e do Tutor

Os testes verificam acesso a todas as fases pelo perfil, preservação do progresso
original e retorno às restrições ao trocar de perfil. A API devolve o perfil atual e
não desconta moedas do Admin nem do Tutor ao receber uma compra de bônus válida; bônus inexistente
continua recusado. O app recupera promoções e rebaixamentos na sincronização, sem
gravar o acesso administrativo como conquista. O Aluno mantém as regras anteriores; o Tutor continua sem poder gerenciar perfis.

### Conteúdo acadêmico e continuidade

Os testes de AVA e ED conferem as 31 disciplinas nos quatro módulos existentes,
resumos, fontes e páginas, contagens, ausência de perguntas duplicadas e consulta
conceitual pelo Nexor. A integração também verifica o acréscimo de cartas ao cache
sem substituir a revisão SM-2 ou recuperar exclusões da moderação, a preservação
dos códigos antigos e a ordem das fases. A consulta do perfil devolve as conclusões
para o Web e o Expo recuperarem a continuidade da trilha.

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

Os 28 casos saíram das **regras de negócio do relatório** (seção 2.2.2), não do código, e cada um
cita a regra que verifica. Só entram pela porta da frente: as rotas HTTP, com login de verdade.

| Regra | O que se confere |
| :--- | :--- |
| RN01 Recompensa só no servidor | 5 XP e 10 moedas só na 1ª conclusão; teste de módulo só paga com o corte (70%; ENADE 80%); fase inexistente não paga |
| RN02 Perfis | Aluno cria carta mas não edita/exclui; Tutor modera; painéis só para o perfil certo; só o Admin muda perfil; sem login, 401; aluno não lê dados de outro |
| RN03 Moedas | bônus custa 50 e é recusado sem saldo para Aluno; Admin e Tutor mantêm o saldo |
| RN04 Trilha | fases na ordem; conclusões devolvidas no perfil; resumos não liberam fases; conteúdo novo preserva os códigos e a revisão existente |
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

Hoje são 1198 cartas. Os testes usam 50.000 e 100.000 (cerca de 42 a 83 vezes o real). Duas checagens, como
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
