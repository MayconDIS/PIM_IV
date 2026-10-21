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
| Rotas | `Endpoints/EndpointExtensions.cs` | Lê o pedido e o token, chama o serviço e devolve o status HTTP. Não acessa o banco. |
| Serviços | `AuthService`, `ProgressoService`, `GamificacaoService`, `ConteudoService` | Regras do sistema; usam `Resultado<T>` nas operações com falhas de negócio previstas e retornam dados diretamente nas demais. |
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
| `PUT /api/usuarios/stats` | Grava XP, moedas e nível | Sim |
| `GET /api/fases` · `GET /api/fases/{codigo}/flashcards` | Fases e cartas | Não |
| `POST /api/flashcards` | Cria uma carta | Sim |
| `GET /api/progresso/usuario` · `POST /api/progresso/atualizar` | Progresso do SM-2 | Sim |
| `GET /api/simulados/areas` · `GET /api/simulados/questoes` | Simulados ENADE | Não |
| `GET /api/estatisticas/resumo` | Total de cartas, de alunos e o ranking | Não |

## 4. O algoritmo SM-2

Fica em `Services/Sm2Engine.cs` (e tem 5 testes). Para cada aluno e cada carta,
a tabela `ProgressoFlashcard` guarda:

- **Repeticoes:** quantos acertos seguidos;
- **IntervaloDias:** quantos dias até a carta voltar;
- **FatorFacilidade:** começa em 2,5; o ramo de erro aplica mínimo de 1,3;
- **DataProximaRevisao:** quando a carta volta.

Nota 3 ou mais: o intervalo vai para 1 dia, depois 6, depois é multiplicado pelo
fator. Nota menor que 3: volta para 1 dia e o fator cai 0,2.

O navegador usa `packages/shared/src/sm2.js`, com regras diferentes: uma carta
nova marcada como fácil recebe 3 dias, enquanto a API recebe qualidade 5 e
agenda 1 dia. Na segunda resposta boa, o navegador multiplica o intervalo pelo
fator, enquanto a API agenda 6 dias. O mobile tem outro motor local em
`apps/react-mobile/src/services/sm2.js` e ainda não sincroniza com a API.

O painel calcula a revisão localmente e envia a resposta quando a carta tem ID
da API. Ao carregar o painel, o progresso remoto pode substituir o estado local.
Unificar esses cálculos e tratar falhas de sincronização continua pendente.

## 5. Da UML para o código

Os diagramas estão em [`../../modelagem-uml/02_Modelagem_UML`](../../modelagem-uml/02_Modelagem_UML).
O diagrama de classes do PIM III é a ideia inicial; os diagramas *Camadas* e
*Entidades* mostram o que foi implementado.

1. **Herança:** `Aluno` e `Tutor` herdam de `Usuario`. XP, moedas e nível ficam
   em `Usuario` para o login e as consultas usarem uma tabela só.
2. **SM-2 entre Aluno e Flashcard:** virou a classe `ProgressoFlashcard`, com
   chave composta (aluno + carta).
3. **`Motor_SM2` e `Gamificacao` do PIM III:** viraram `Sm2Engine` e
   `GamificacaoService`.
4. **Ainda não implementadas:** `Admin`, `Duvidas`, `Agente Especialista (IA)` e
   `Acessibilidade` como classe (a acessibilidade existe no site).

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
