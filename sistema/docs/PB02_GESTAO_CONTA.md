# PB02 — Gestão da própria conta

Implementação sobre `feat/area-admin`, na branch `feat/gestao-usuario`.
O menu Web oferece **Minha conta** para qualquer perfil autenticado.

| Operação | Contrato |
|---|---|
| Consultar | `GET /api/conta/` |
| Alterar e-mail | `PUT /api/conta/email` com `{ email, senhaAtual }` |
| Alterar senha | `PUT /api/conta/senha` com `{ senhaAtual, novaSenha }` |
| Exportar | `GET /api/conta/dados` |
| Excluir | `POST /api/conta/excluir` com `{ senhaAtual }` |

O ID vem do token; não existe parâmetro para escolher outro usuário. Operações
de escrita compartilham o limitador de tentativas de autenticação. Senha incorreta,
e-mail inválido/duplicado e tentativa de excluir o último Admin retornam 400;
sessão inválida retorna 401. Troca de senha e exclusão bem-sucedidas retornam 204.

## Segurança e dados

- Reutiliza a política de senha do cadastro e BCrypt. O JWT passa a incluir um
  HMAC do hash da credencial, sem expor o hash. A validação consulta o banco em
  cada requisição autenticada; conta removida ou credencial diferente revogam o
  acesso. Tokens anteriores à implantação também exigem novo login.
- Perfis são obtidos do banco durante a validação, para não conservar permissões
  antigas até a expiração do token.
- Exportação inclui apenas campos explicitamente selecionados, progresso e
  histórico do titular. O Web acrescenta uma lista explícita de chaves locais,
  evitando credenciais e outras contas com nickname semelhante.
- Exclusão e alteração de perfil usam isolamento serializável para preservar
  ao menos um Admin. FKs existentes removem progresso e histórico em cascata.
- Cartas não têm vínculo de autoria no modelo atual: conteúdo compartilhado
  permanece. Cópias locais em outros dispositivos e backups não são apagados
  remotamente. O JSON não representa uma política completa de portabilidade
  ou retenção; não há alegação de conformidade legal integral.
- Não há confirmação de posse do novo e-mail nem recuperação de senha nesta
  entrega. Não há tela de gestão de conta no aplicativo Expo.

## Verificação

Na pasta `sistema`:

```powershell
dotnet test tests/NexTI_API.Tests/NexTI_API.Tests.csproj
npm run test:shared
npm run build:react
```

Os testes SQL/HTTP são opt-in e precisam de Windows com SQL Server LocalDB:

```powershell
$env:NEXTI_TEST_LOCALDB = '1'
dotnet test tests/NexTI_API.Tests/NexTI_API.Tests.csproj
Remove-Item Env:NEXTI_TEST_LOCALDB
```

Eles criam bancos descartáveis `NexTI_ContaTest_<guid>`, aplicam as migrations
e removem esses bancos ao terminar. Não usam a conexão de produção. Cobrem
exportação do histórico gerado pelo trigger, exclusão em cascata, exclusões
concorrentes de Admins e chamadas HTTP contra a API real, incluindo revogação.
Os testes normais cobrem senha, e-mail, isolamento de dados e limpeza local.

Antes da publicação: revisar junto ao PR da área administrativa e comunicar
a necessidade de novo login aos usuários. Esta implementação não faz merge
de outros PRs, não publica a aplicação nem promove contas reais a Admin.
