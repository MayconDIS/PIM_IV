# Do PIM III ao PIM IV: o que cada caso de uso virou

O PIM IV é o PIM III melhorado. Os 15 casos de uso do PIM III continuam com os mesmos
nomes; a diferença é que agora cada um está ligado ao código. No
`Diagrams Nex_TI - PIM IV.asta`, cada caso de uso tem um diagrama de classes e um de
sequência, e todo elemento tem a explicação no campo *Definition*.

| Caso de uso | No PIM III (modelo) | No PIM IV (código) |
|---|---|---|
| Cadastrar Novo Usuário | `ControladorAutenticacao.Registrar(Dados)` | `AuthService.CadastrarAsync` (`POST /api/auth/register`), senha forte no navegador e na API, aviso de senha vazada e BCrypt |
| Realizar Login | `Login(email, senha)` e `ValidarCredenciais()` | `AuthService.EntrarAsync` (`POST /api/auth/login`), token JWT de 24 h com o perfil e limite de 30 tentativas por minuto |
| Estudar Flashcards | `Motor_SM2.aplicarSM2()` | `ProgressoService` + `Sm2Engine` (`POST /api/progresso/atualizar`), histórico gravado por trigger |
| Atribuir XP e Moedas | `Gamificacao` creditava XP(5) e COINS(10) | `gamificacao.js` calcula o prêmio; `GamificacaoService` aceita no máximo +200 e a trigger impede XP e nível de diminuir |
| Desbloquear Fases e Módulos | o Tutor liberava as fases | liberação automática ao concluir a fase anterior (`proximaFase`) e compra de bônus com moedas |
| Realizar Teste de Nivelamento | `Simulado.definirFaseInicial(nota)` | `diagnostico.js`: 10 perguntas definem a fase inicial e o nível |
| Realizar Simulado ENADE | `Simulado` com `Temporizador` | testes de módulo e as provas oficiais de 2017 e 2021 com gabarito do INEP; sem limite de tempo |
| Visualizar Painel de Desempenho | `Painel_Visual.renderizar()` | Minhas Estatísticas com os números do SM-2 (`GET /api/usuarios/{username}/stats-detalhadas`, só o dono) |
| Acompanhar Desempenho dos Usuários | `Painel_Visual.obterMetricas()` | painel do Tutor (`GET /api/tutor/alunos`, só Tutor e Admin) |
| Gerenciar Conteúdo das Cartas | o Tutor criava módulos novos | o Tutor edita e exclui cartas (`PUT`/`DELETE /api/flashcards/{id}`); os módulos são fixos |
| Criar Flashcards | `Editor` recebia pergunta e resposta | `POST /api/flashcards`: a carta entra no deck na hora e fica salva no banco |
| Gerenciar Perfis e Acessos | `GerenciadorAcesso.alterarPapel(id, papel)` | `AdminService.DefinirPerfilAsync`; perfil no banco com CHECK, conferido pela API |
| Ajustar Acessibilidade | `PainelConfiguracao.salvar()` | zoom e alto contraste salvos no navegador, mais o VLibras |
| Consultar Agente Especialista (IA) | previsto | **«planejado»**: ainda não implementado |
| Escalar Dúvida para Tutor | previsto | **«planejado»**: ainda não implementado |
| Gerenciar Minha Conta | — | **novo**: ver e exportar os dados, trocar e-mail e senha, excluir a conta (`/api/conta`) |
| Estudar sem Internet (app) | — | **novo**: o app guarda a resposta numa fila e envia quando a internet volta |

## Diagramas desta pasta

| Diagrama | PlantUML (`.puml` + `.png`) | Astah (`.asta`) |
|---|---|---|
| Casos de uso (os 17 acima) | ✅ | ✅ |
| Classes – entidades | ✅ | ✅ |
| Classes – camadas da API | ✅ | ✅ |
| Atividade – sessão de estudo | ✅ | ✅ |
| Sequência – responder uma carta | ✅ | ✅ (em Estudar Flashcards) |
| Classes e sequência de cada caso de uso | — | ✅ 15 pares |

Os arquivos do PIM III saíram desta pasta e continuam no histórico do git.
