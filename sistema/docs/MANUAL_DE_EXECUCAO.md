# ▶️ Manual de Execução — Nex_TI

Como rodar o Nex_TI no seu computador.

## 1. O que precisa estar instalado

| Programa | Para quê |
|---|---|
| [.NET 10 SDK](https://dotnet.microsoft.com/download) | Rodar a API em C# |
| [Node.js](https://nodejs.org) 22 ou mais novo | Rodar o site |
| SQL Server LocalDB (vem com o Visual Studio) | O banco de dados local |
| Python 3, disponível pelo comando `python` | Necessário para `npm run dev`; dispensável ao iniciar cada app separadamente |

## 2. Rodar tudo de uma vez

Na pasta `sistema/`:

```bash
npm install
npm run dev
```

O `start.py` sobe a API em http://localhost:5000 e o site em
http://localhost:5501, e abre o navegador. Para parar: `Ctrl+C`.

## 3. Rodar cada parte separada

```bash
npm run dev:api      # API em http://localhost:5000
npm run dev:react    # site em http://localhost:5501
npm run dev:mobile   # app de celular (Expo)
```

### Com Docker (sem instalar .NET, Node nem SQL Server)

Com o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado:

```bash
cd sistema
docker compose up --build
```

Sobem três contêineres: o **SQL Server**, a **API** (que cria o banco e carrega o
conteúdo sozinha) e o **site** servido pelo Nginx.

| O quê | Endereço |
|---|---|
| Site | http://localhost:8080 |
| API | http://localhost:5000/api/status |
| Banco | `localhost,1433`, usuário `sa` |

As senhas do `docker-compose.yml` servem só para rodar no próprio computador. Para
trocar, crie um `.env` na pasta `sistema` com `MSSQL_SA_PASSWORD` e `JWT_KEY`.
`docker compose down` para tudo; `docker compose down -v` também apaga o banco.

A cada PR, o GitHub Actions (`.github/workflows/docker.yml`) monta as imagens, sobe
os três contêineres e testa a API e o site.

## 4. Banco de dados

Não precisa criar nada. Quando a API sobe, ela:

1. cria o banco `NexTI_Local` no LocalDB (`(localdb)\mssqllocaldb`), se ainda não existir;
2. aplica as migrations (as tabelas);
3. carrega as 26 fases, as 620 cartas e os simulados ENADE.

Esse é o comportamento padrão, sem outra conexão configurada e com
`Database:MigrarAoIniciar` habilitado. Para usar outro SQL Server, defina
`ConnectionStrings__DefaultConnection`. A variável `AZURE_SQL_CONNECTIONSTRING`,
quando presente, tem precedência. Não grave credenciais de produção em arquivos
versionados. O LocalDB é específico do Windows; em outros sistemas, configure
uma instância SQL Server acessível.

## 5. Testes

```bash
npm test             # confere a estrutura do projeto e roda os testes da API
npm run test:shared  # testes do packages/shared (SM-2 do navegador, senha)
```

## 6. Se algo der errado

| Problema | Solução |
|---|---|
| "Porta 5000 já está em uso" | A API já está rodando em outro terminal. Feche-o ou use a que está aberta. |
| O site abre, mas não sincroniza o progresso | Confira a API e a sessão. Uma sessão já salva pode estudar com cartas locais; cadastro e login exigem a API. Falhas de envio não são reenviadas automaticamente. |
| O comando `python` não funciona | Instale/configure o Python 3 ou inicie a API e o site separadamente, como na seção 3. |
| Erro de conexão com o banco | Confira se o LocalDB está instalado: `sqllocaldb info` deve listar `MSSQLLocalDB`. |
| Depois de mover ou renomear a pasta, o site não compila | Rode `npm install` de novo (o npm guarda o caminho antigo dos pacotes do projeto). |
