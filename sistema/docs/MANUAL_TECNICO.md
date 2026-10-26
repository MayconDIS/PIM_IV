# ⚙️ Manual Técnico — Nex_TI

Como o sistema está organizado por dentro. Para rodar, veja o
[Manual de Execução](MANUAL_DE_EXECUCAO.md).

## 1. As partes do sistema

| Parte | Tecnologia | Pasta |
|---|---|---|
| Site | React + Vite | `apps/react-web` |
| App de celular | React Native (Expo) | `apps/react-mobile` |
| Código compartilhado | JavaScript (cartas, SM-2, cliente da API, CSS) | `packages/shared` |
| API | C# .NET 10, Minimal APIs, Entity Framework Core | `apps/api` |
| Banco | SQL Server (LocalDB no PC, Azure SQL na nuvem) | `database` |

## 2. A API em camadas

```text
Endpoints (HTTP)  →  Services (regras)  →  Data (EF Core)  →  Models (classes)
```

| Camada | Arquivos | O que faz |
|---|---|---|
| Rotas | `Endpoints/EndpointExtensions.cs`, `ContaEndpoints.cs` | Lê o pedido e o token, chama o serviço e devolve o status HTTP. Não acessa o banco. |
| Serviços | `AuthService`, `ProgressoService`, `GamificacaoService`, `ConteudoService`, `AdminService`, `ContaService` | Regras do sistema; usam `Resultado<T>` nas operações com falhas de negócio previstas e retornam dados diretamente nas demais. |
| Apoio | `Sm2Engine`, `PoliticaDeSenha`, `PoliticaDeCors`, seeders | Algoritmo SM-2, regras de senha, CORS e carga inicial do banco. |
| Dados | `Data/AppDbContext.cs` | As tabelas e as relações. |
| Modelos | `Models/` | `Usuario`, `Aluno`, `Tutor`, `Fase`, `Flashcard`, `ProgressoFlashcard`, `Questao`… |

Cada serviço tem uma interface (`IAuthService`, `ISm2Engine`…) e é ligado à sua
classe no `Program.cs` (injeção de dependência). Assim as rotas dependem da
interface, não da classe.

## 3. Rotas da API

| Rota | O que faz | Precisa de login? |
|---|---|---|
| `GET /api/status` | A API está no ar? | Não |
| `POST /api/auth/register` · `POST /api/auth/login` | Cadastro e login (devolve o JWT) | Não |
| `GET /api/usuarios/{username}` | Perfil: XP, moedas, nível e `fasesConcluidas` (`string[]` com códigos de fases) | Sim, só o dono |
| `GET /api/usuarios/{username}/stats-detalhadas` | Números do SM-2 do aluno | Sim, só o dono |
| `POST /api/progresso/concluir-fase` | Conclui uma fase: a API paga XP e moedas pela tabela de recompensas só na primeira conclusão (grava em `fases_concluidas`) e devolve o prêmio pago e os totais | Sim |
| `POST /api/usuarios/bonus/{id}/comprar` | Compra um bônus: a API confere o saldo e desconta as moedas | Sim |
| `PUT /api/usuarios/stats` | Grava XP, moedas e nível (usado só quando a rota de concluir fase falha, e pelo diagnóstico) | Sim |
| `GET /api/fases` · `GET /api/fases/{codigo}/flashcards` | Fases e cartas | Não |
| `POST /api/flashcards` | Cria uma carta | Sim |
| `PUT /api/flashcards/{id}` · `DELETE /api/flashcards/{id}` | Edita ou exclui uma carta | Tutor ou Admin |
| `GET /api/tutor/alunos` | Painel do Tutor: XP e números do SM-2 de cada aluno | Tutor ou Admin |
| `GET /api/admin/usuarios` · `PUT /api/admin/usuarios/{id}/perfil` | Lista os usuários e define o perfil | Admin |
| `GET /api/progresso/usuario` · `POST /api/progresso/atualizar` | Progresso do SM-2 | Sim |
| `GET /api/simulados/areas` · `GET /api/simulados/questoes` | Simulados ENADE | Não |
| `GET /api/estatisticas/resumo` | Total de cartas, de alunos e o ranking | Não |
| `GET /api/conta/` · `GET /api/conta/dados` | Cadastro próprio e exportação do progresso/histórico | Sim, só o titular |
| `PUT /api/conta/email` · `PUT /api/conta/senha` | Altera e-mail ou senha | Sim + senha atual |
| `POST /api/conta/excluir` | Exclui a própria conta e dados dependentes | Sim + senha atual |

### 3.1 Gestão da própria conta (PB02)

Os endpoints de conta obtêm o ID exclusivamente do JWT e enviam `Cache-Control:
no-store`. A exportação usa DTOs explícitos sem hashes de senha ou tokens. Inclui
cadastro, progresso e histórico de revisões do titular; o site acrescenta os dados
locais desta conta no navegador. O único Admin não pode excluir sua conta. A
contagem e a exclusão usam transação serializável, também aplicada à alteração
administrativa de perfis para preservar essa regra em concorrência.

Cada requisição autenticada confere a existência do usuário e uma assinatura HMAC
da credencial atual, armazenada como claim `credencial`. Trocar a senha invalida
tokens anteriores; excluir a conta invalida todos os seus tokens. O papel é
recarregado do banco, portanto rebaixamentos não aguardam o JWT expirar.
**Após implantar esta versão, sessões emitidas antes do PB02 precisam de novo
login.** Não há nova migration: são usados o hash e as tabelas existentes.

| Operação | Rota |
|---|---|
| Consultar | `GET /api/conta/` |
| Alterar e-mail | `PUT /api/conta/email` com `{ email, senhaAtual }` |
| Alterar senha | `PUT /api/conta/senha` com `{ senhaAtual, novaSenha }` |
| Exportar | `GET /api/conta/dados` |
| Excluir | `POST /api/conta/excluir` com `{ senhaAtual }` |

Senha errada, e-mail inválido ou repetido e excluir o último Admin retornam 400; sessão
inválida, 401; troca de senha e exclusão, 204. As escritas usam o mesmo limite de
tentativas do login. Não há confirmação do novo e-mail nem recuperação de senha, e o
app de celular ainda não tem a tela de conta.

Os testes com SQL Server LocalDB (só no Windows) são opcionais: criam bancos
descartáveis `NexTI_ContaTest_<guid>`, cobrem exportação, exclusão em cascata,
exclusões de Admins ao mesmo tempo e chamadas HTTP de verdade, e apagam os bancos no fim.

```powershell
$env:NEXTI_TEST_LOCALDB = '1'
dotnet test tests/NexTI_API.Tests/NexTI_API.Tests.csproj
Remove-Item Env:NEXTI_TEST_LOCALDB
```

## 4. O algoritmo SM-2

É o SM-2 no estilo do Anki, com os quatro botões da tela. A mesma regra está em
dois lugares: `packages/shared/src/sm2.js` (site e app) e `Services/Sm2Engine.cs`
(API). Os dois são testados com os **mesmos casos**
(`packages/shared/tests/sm2-casos.json`): se um dia as regras divergirem, os
testes do JavaScript e do C# quebram juntos. Assim, a data que a API grava é a
mesma que o aluno viu no botão.

Para cada aluno e cada carta, a tabela `ProgressoFlashcard` guarda as repetições,
o intervalo em dias, o fator de facilidade (começa em 2,5 e nunca fica abaixo de
1,3) e a data da próxima revisão.

| Botão (nota enviada) | Carta nova | Carta já estudada | Fator |
|---|---|---|---|
| Errei (1) | 1 dia | volta para 1 dia e recomeça | −0,2 |
| Difícil (3) | 1 dia | intervalo × 1,2, somando pelo menos 1 dia | −0,15 |
| Bom (4) | 1 dia | intervalo × fator | igual |
| Fácil (5) | 3 dias | intervalo × fator × 1,3 | +0,15 |

O intervalo para em **36.500 dias** (100 anos, o mesmo teto do Anki): sem ele, uma carta
respondida "Fácil" umas 12 vezes passava do ano 9999 e a API não conseguia gravar a data.
A rota recusa nota fora de 0 a 5 (400) e carta que não existe (404); duas primeiras respostas
da mesma carta ao mesmo tempo gravam um registro só. Os três casos foram achados pelos testes
de caixa branca e de carga (ver [`TESTES.md`](TESTES.md)).

O site calcula na hora para mostrar a previsão em cada botão e envia a nota para
`POST /api/progresso/atualizar` quando a carta tem ID da API. O app usa a mesma
regra e, ao sincronizar, adota o agendamento devolvido pela API. Sem internet, o
app guarda as respostas numa fila no aparelho
(`apps/react-mobile/src/services/sincronizacao.js`); o site ainda não tem essa fila.

## 5. Da UML para o código

Os diagramas estão em [`../../modelagem-uml/02_Modelagem_UML`](../../modelagem-uml/02_Modelagem_UML).
Todos saem do código atual e estão no `Diagrams Nex_TI - PIM IV.asta` (Astah): casos de
uso, classes (*Camadas* e *Entidades*), atividade, um diagrama de classes e um de sequência
para cada caso de uso, MER, DER (modelo lógico) e modelo físico. As imagens estão em
`imagens-astah/`; as principais também ficam soltas na pasta e em `04_Banco_de_Dados`.

1. **Herança:** `Aluno` e `Tutor` herdam de `Usuario`. XP, moedas e nível ficam
   em `Usuario` para o login e as consultas usarem uma tabela só.
2. **SM-2 entre Aluno e Flashcard:** virou a classe `ProgressoFlashcard`, com
   chave composta (aluno + carta).
3. **SM-2 e gamificação:** ficam em `Sm2Engine` e `GamificacaoService`, com a
   mesma regra do `sm2.js` e do `gamificacao.js` do site.
4. **Perfis do caso de uso (Aluno, Tutor, Admin):** viraram o campo `Perfil` de `Usuario`,
   enviado no JWT; as rotas de Tutor e Admin conferem esse perfil.
5. **Acessibilidade:** fica só no site (zoom, alto contraste e VLibras), sem
   classe na API.

## 6. O que fica salvo onde

| Dado | Onde |
|---|---|
| Cadastro e hash de senha | Banco (pela API) |
| JWT e identificação da sessão web | `localStorage` do navegador |
| XP, moedas, nível | No navegador e no banco, nas atualizações enviadas pelo cliente |
| Progresso do SM-2 | No navegador; enviado ao banco para cartas com ID quando a API está disponível |
| Fases concluídas | Banco, retornadas em `GET /api/usuarios/{username}` para recuperar a continuidade da trilha |
| Fases liberadas, bônus comprados, Mapa Neural | Estado local no navegador (`localStorage`); conclusões da API também participam da liberação |
| Conversa do Nexor, assistente do Nex_TI | Só na memória da tela; não vai para o servidor nem para `localStorage` |

A compra de bônus usa a API para conferir e descontar o saldo. A conclusão de fase
paga o prêmio no servidor uma única vez. O Web não tem fila de reenvio de respostas
que falham; o Expo mantém essa fila. A rota de atualização de totais permanece como
reserva para falhas e para o diagnóstico.

### 6.1 Conteúdo de AVA e ED

O catálogo em `packages/shared/src/academico` reúne 31 disciplinas dos quatro semestres,
com resumos, tópicos, referências relativas ao acervo e 496 cartas autorais. Cada carta
indica sua fonte e página física do PDF ou slide do PPTX. Os arquivos originais não
são publicados com a aplicação. A integração amplia os quatro módulos existentes e
preserva o módulo 5, ENADE, além das três disciplinas complementares do módulo 2.
O conteúdo final tem 39 fases regulares e quatro bônus, com 1198 cartas.

Os códigos antigos das fases continuam iguais; apenas a sequência visível dos títulos
é reorganizada. O cache recebe cartas novas sem substituir seu estado de revisão SM-2
e sem recuperar cartas removidas pela moderação. A lista `fasesConcluidas` do perfil
ajuda a manter o acesso às fases seguintes quando o aluno troca de aparelho.

No Web, `ModalTrilha` abre pelo menu, abaixo de Mapa Neural, com os seletores
Módulo 1 a 4, resumo, fontes e acesso ao estudo conforme a liberação da fase. O painel e
o Expo também exibem resumos por disciplina. Esse catálogo é local, sem nova rota
ou tabela; a API continua com 26 rotas e as mesmas autorizações.

## 7. Segurança

- Senha guardada com BCrypt e regras de senha forte no servidor (`PoliticaDeSenha`).
- Login e cadastro limitados a 30 tentativas por minuto por IP.
- Dados de um aluno só para o próprio aluno (o nome no token precisa bater com a rota).
- CORS só para o site e os previews do projeto; no site, CSP e HSTS (`apps/react-web/vercel.json`).

## 8. Nexor, assistente do Nex_TI no site

O assistente oferece uma conversa de consulta à base local no React Web, no
computador e no navegador do celular. Recebe perguntas de até 400 caracteres e
busca correspondências nas cartas conceituais canônicas (incluindo o guia do
ENADE) e nas orientações de uso incluídas no código. Cartas com `opcoes` ficam
fora do índice: um gabarito isolado não serve como explicação. Mostra as fontes
encontradas e avisa quando não há correspondência
suficiente. Não usa IA generativa, serviço externo ou pesquisa na internet.

A busca roda no navegador, sem nova rota da API ou tabela no banco. Não lê dados
da conta ou do progresso, nem usa cartas particulares da sessão como fonte.
Mensagens ficam no estado da tela e podem ser limpas; recarregar ou sair encerra
a conversa. Depois de carregados os materiais do site, a consulta local não
precisa de conexão. O aplicativo Expo e o programa Windows não têm essa interface.
