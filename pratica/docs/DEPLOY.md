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
antes de cair para o modo offline (localStorage).

## 1. Azure (banco + API)

### Opção A — script (Azure CLI)

```powershell
az login
cd pratica/infra/azure
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
   - *App settings*: `Jwt__Key` (texto aleatório longo), `Cors__Origens`
     (`https://seu-app.vercel.app`) e `Cors__PermitirPreviewsVercel` = `true`.
4. App Service → Configuration → General settings → **SCM Basic Auth Publishing
   Credentials: On**.

### Publicar a API

O workflow `.github/workflows/api-azure.yml` (raiz do repositório) roda os testes e
publica a cada push em `main` que mexa na API. Configure no GitHub:

| Onde | Nome | Valor |
|---|---|---|
| Variable | `AZURE_WEBAPP_NAME` | nome do App Service |
| Secret | `AZURE_WEBAPP_PUBLISH_PROFILE` | App Service → *Download publish profile* (o XML inteiro) |

No primeiro start, a API aplica a migration `InicialAzureSql` e insere as 26 fases,
os 620 flashcards e o simulado ENADE. Para testar, abra
`https://<app>.azurewebsites.net/api/status`.

## 2. Vercel (front-end)

1. Vercel → **Add New → Project** → este repositório.
2. **Root Directory:** `pratica/apps/react-web` (o `vercel.json` cuida do install no
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

## Conteúdo sincronizado

`apps/web` é a fonte do conteúdo. Depois de editar cards, rode:

```bash
npm run sync:content
```

Isso regenera `packages/shared` (usado pelo React) **e**
`apps/api/Data/Seed/conteudo.json` (usado pelo `ConteudoSeeder` da API). No próximo
start, a API insere só as cartas novas e não apaga nada, então o progresso SM-2
dos alunos é preservado. `npm run sync:content:check` falha se algo estiver
desatualizado (útil no CI).

## Rodando local

Sem configuração, a API usa o LocalDB (`(localdb)\mssqllocaldb`, banco `NexTI_Local`),
criado e povoado sozinho no primeiro start:

```bash
npm run dev:api     # http://localhost:5000
npm run dev:react   # http://localhost:5501
```

Para apontar para o Azure SQL, defina `AZURE_SQL_CONNECTIONSTRING` antes do `dev:api`.
Lembre de liberar o seu IP no firewall do servidor SQL.

## Pendência conhecida

O endpoint `/api/certificado/pdf` chama um script Python (`Certificados/gerar_certificado.py`,
que usa `fpdf2`). A imagem .NET do App Service não garante Python. Se faltar, o
botão **BAIXAR_PDF()** mostra erro, mas **IMPRIMIR()** (impressão do navegador para
PDF) continua funcionando.
