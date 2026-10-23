# Deploy — Vercel + Azure

```
Navegador ──► Vercel (apps/react-web, Vite/React)
                 │  VITE_API_URL
                 ▼
             Azure App Service F1 (apps/api, ASP.NET Core .NET 10, Linux)
                 │  ConnectionStrings:DefaultConnection (EF Core + SqlClient)
                 ▼
             Azure SQL Database (oferta gratuita, serverless)
```

A Vercel não executa .NET, por isso a API C# e o banco ficam na Azure. O front
fala só com a API; o banco não é exposto ao navegador.

**Custos:** as duas camadas são gratuitas e não expiram.
- App Service **F1**: tem cota diária de CPU, não tem "Always On" e hiberna quando
  fica sem uso.
- Azure SQL **oferta gratuita**: 100.000 vCore-segundos e 32 GB por mês. O banco
  pausa quando fica ocioso. O script já cria o banco com *AutoPause* ao atingir o
  limite, então ele nunca cobra.

A primeira requisição depois de um tempo parado pode levar ~1 min (App Service +
banco acordando). A API tenta de novo automaticamente e o front espera até 60 s
antes de indicar indisponibilidade. Uma sessão já salva pode continuar com
as cartas locais; cadastro e login exigem a API. Não há fila de reenvio
automático das respostas que falharem.

## 1. Azure (banco + API)

### Opção A — script (Azure CLI)

```powershell
az login
cd sistema/infra/azure
./provisionar.ps1 -Sufixo seunome -SenhaSql 'Uma$enhaForte123' -OrigemFront 'https://nexti.vercel.app'
```

O script cria o grupo `rg-nexti-pim-iv` (região Brazil South), o servidor e o banco
Azure SQL gratuitos, o plano F1 e o App Service. Também configura a connection
string, a chave JWT, o CORS e a credencial de publicação. No fim, ele mostra os
próximos passos.

### Opção B — portal

1. **Azure SQL Database** → Create → marque *Apply offer* (free) → *Behavior when
   free limit reached: Auto-pause*. Em *Networking*, permita **Azure services**.
2. **App Service** → Create → Linux, runtime **.NET 10**, plano **Free F1**.
3. App Service → **Environment variables**:
   - *Connection strings*: `DefaultConnection`, tipo **SQLAzure**, com a string ADO.NET
     do banco (aba *Connection strings* do banco).
   - *App settings*: `Jwt__Key` (texto aleatório com 32+ caracteres; **a API não
     sobe sem ela** fora do ambiente de desenvolvimento), `Cors__Origens`
     (`https://seu-app.vercel.app`) e `Cors__PreviewsVercel`
     (`nexti-pim-*-dev-maycon.vercel.app` — só os previews do seu projeto).
4. App Service → Configuration → General settings → **HTTPS Only: On** e **SCM
   Basic Auth Publishing Credentials: On**.

### Publicar a API

O workflow `.github/workflows/api-azure.yml` (raiz do repositório) roda os testes e
publica a cada push em `main` que mexa na API. Configure no GitHub:

| Onde | Nome | Valor |
|---|---|---|
| Variable | `AZURE_WEBAPP_NAME` | nome do App Service |
| Secret | `AZURE_WEBAPP_PUBLISH_PROFILE` | App Service → *Download publish profile* (o XML inteiro) |

No primeiro start, a API aplica a migration `InicialAzureSql` e insere as 29 fases,
os 702 flashcards e as provas oficiais do ENADE (2017 e 2021). Para testar, abra
`https://<app>.azurewebsites.net/api/status`.

## 2. Vercel (front-end)

1. Vercel → **Add New → Project** → este repositório.
2. **Root Directory:** `sistema/apps/react-web` (o `vercel.json` cuida do install no
   workspace e do build).
3. **Environment Variables:** `VITE_API_URL = https://<app>.azurewebsites.net/api`
4. Faça o deploy. Depois, confira se o domínio final está em `Cors__Origens` no App Service.

## Schema

O schema vem das migrations do EF Core (`apps/api/Data/Migrations`). A API aplica as
pendentes ao iniciar (`Database__MigrarAoIniciar=false` desliga). O SQL equivalente,
idempotente, está em `database/azure-sql/schema.sql`, que serve para revisar o schema
ou aplicá-lo manualmente. Depois de mudar um model:

```bash
cd apps/api
dotnet ef migrations add NomeDaMudanca --output-dir Data/Migrations
dotnet ef migrations script --idempotent -o ../../database/azure-sql/schema.sql
```

`database/NexTI_DB.sql` é o script T-SQL original do projeto e não é usado pela API.

## Conteúdo

`packages/shared/src/content.js` é a fonte do conteúdo: o React (web e mobile) o
importa direto. Depois de editar cards, atualize a semente da API:

```bash
npm run seed:api
```

Isso regenera `apps/api/Data/Seed/conteudo.json`, lido pelo `ConteudoSeeder`. No
próximo start, a API insere só as cartas novas e não apaga nada, então o progresso
SM-2 dos alunos é preservado. `npm run seed:api:check` falha se a semente estiver
desatualizada (útil no CI).

## Rodando local

Sem configuração, a API usa o LocalDB (`(localdb)\mssqllocaldb`, banco `NexTI_Local`),
criado e povoado sozinho no primeiro start:

```bash
npm run dev:api     # http://localhost:5000
npm run dev:react   # http://localhost:5501
```

Para apontar para o Azure SQL, defina `AZURE_SQL_CONNECTIONSTRING` antes do `dev:api`.
Lembre de liberar o seu IP no firewall do servidor SQL.

## Segurança

- **Front (Vercel):** `apps/react-web/vercel.json` envia CSP, HSTS, `nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy` e `Permissions-Policy`. A CSP só
  libera a API da Azure, o HaveIBeenPwned, o Google Fonts e o VLibras — **se a URL
  da API mudar, atualize o `connect-src`**. Não há script embutido no HTML: o
  VLibras é carregado por `src/lib/vlibras.js`.
- **API:** login/cadastro limitados a 30 tentativas por minuto por IP; política de
  senha no servidor (`Services/PoliticaDeSenha.cs`); dados de usuário só para o
  próprio dono (JWT); CORS restrito a `Cors__Origens` e aos previews do projeto.
- **Certificado:** gerado no navegador (`src/lib/certificado.js`) e impresso por um
  iframe (`src/lib/imprimir.js`) — o aluno escolhe "Salvar como PDF". O endpoint
  antigo, que executava Python no servidor, foi removido.
