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
| `GET /api/usuarios/{username}` | Perfil: XP, moedas e nível | Sim, só o dono |
| `GET /api/usuarios/{username}/stats-detalhadas` | Números do SM-2 do aluno | Sim, só o dono |
| `POST /api/progresso/concluir-fase` | Conclui uma fase: a API calcula XP e moedas pela tabela de recompensas e devolve os totais | Sim |
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

Contratos, limites e execução dos testes: [PB02 — Gestão de conta](PB02_GESTAO_CONTA.md).

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
| Fases liberadas, bônus comprados, Mapa Neural | Só no navegador (`localStorage`) |

A compra de bônus desconta moedas localmente, mas não chama a API nessa ação.
Não há fila de reenvio de respostas nem garantia de sincronização após uma
falha de rede. O backend limita incrementos de XP e moedas, mas ainda recebe
do cliente os totais calculados; não calcula a recompensa a partir de cada resposta.

## 7. Segurança

- Senha guardada com BCrypt e regras de senha forte no servidor (`PoliticaDeSenha`).
- Login e cadastro limitados a 30 tentativas por minuto por IP.
- Dados de um aluno só para o próprio aluno (o nome no token precisa bater com a rota).
- CORS só para o site e os previews do projeto; no site, CSP e HSTS (`apps/react-web/vercel.json`).
