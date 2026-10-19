# Fase 1: Correção de Cadastro, Login e Criação Automática do Banco

Esta fase contemplou a correção dos fluxos de autenticação (cadastro e login) no frontend e backend, o ajuste das portas locais de desenvolvimento e a implementação da criação física automática do banco de dados SQL Server usando o Entity Framework Core no PIM IV.

---

## 📋 Plano de Implementação: Conectividade e Criação do Banco

Este plano visou a resolução de barreiras de conectividade e usabilidade no ecossistema Nex_TI:
* **Criação Automática do Banco e Tabelas**: Configurar o backend C# para instanciar e estruturar a base de dados `NexTI_DB` de forma autônoma na inicialização, mitigando a dependência de rodar scripts manuais no SSMS em ambientes de avaliação.
* **Flexibilização de Autenticação**: Permitir que o login do usuário seja efetuado de forma intercambiável tanto pelo username quanto pelo e-mail, alinhando a validação no backend ao comportamento visual das páginas do frontend.
* **Sincronização de Dependências**: Garantir que as tags do script `api.js` estejam devidamente incluídas nos cabeçalhos HTML do fluxo de login e dashboard do frontend, possibilitando o consumo correto do `ApiService` e a persistência do Token JWT.
* **Padronização de Portas Locais**: Ajustar as portas de escuta do servidor no backend para coincidir com a URL consumida pelo frontend (`https://localhost:5001/api`).

---

## 🛠️ Tasks Executadas

- [x] Adicionar `db.Database.EnsureCreated()` no [Program.cs](file:///c:/Users/mayco/Documents/GitHub/PIM_IV-Parte_Pratica/backend/Program.cs) para criação automática do banco e do esquema relacional
- [x] Ajustar a string de conexão no [appsettings.json](file:///c:/Users/mayco/Documents/GitHub/PIM_IV-Parte_Pratica/backend/appsettings.json) para usar a instância LocalDB `(localdb)\mssqllocaldb` ativa
- [x] Ajustar o endpoint `/api/auth/login` em [EndpointExtensions.cs](file:///c:/Users/mayco/Documents/GitHub/PIM_IV-Parte_Pratica/backend/Endpoints/EndpointExtensions.cs) para validação flexível (username ou e-mail)
- [x] Corrigir no [auth.js](file:///c:/Users/mayco/Documents/GitHub/PIM_IV-Parte_Pratica/assets/js/auth.js) a leitura dos inputs e fluxo de login automático gravando JWT no LocalStorage
- [x] Atualizar as portas de escuta locais para `5000` (HTTP) e `5001` (HTTPS) no [launchSettings.json](file:///c:/Users/mayco/Documents/GitHub/PIM_IV-Parte_Pratica/backend/Properties/launchSettings.json)
- [x] Incluir a tag de script `api.js` no HTML de login ([login.html](file:///c:/Users/mayco/Documents/GitHub/PIM_IV-Parte_Pratica/pages/login/login.html)) e do dashboard ([index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_IV-Parte_Pratica/pages/dashboard/index.html))
- [x] Validar compilação com `dotnet build` e testar a inicialização do Kestrel localmente

---

## 🚀 Walkthrough: Conectividade e Criação de Banco (Nex_TI)

Concluímos com sucesso as integrações e correções críticas que asseguram a inicialização limpa do banco de dados e a conectividade ponta a ponta.

### O que foi Desenvolvido

1. **Criação Autônoma da Base Relacional**:
   * O Entity Framework Core agora valida a existência do banco e gera todas as tabelas e índices automaticamente via `db.Database.EnsureCreated()` ao iniciar a aplicação.
   * A string de conexão local foi migrada para o LocalDB padrão `Server=(localdb)\\mssqllocaldb`, garantindo compatibilidade imediata com a máquina do desenvolvedor.
2. **Correção de Dependência no Frontend**:
   * Adicionada a tag `<script src="../../assets/js/api.js"></script>` no topo do script de autenticação nos arquivos HTML correspondentes. Isso resolveu o ReferenceError que interrompia a execução do JavaScript e impedia o processamento do formulário de cadastro.
3. **Consistência do Fluxo de Login**:
   * O cadastro no frontend agora capta e envia os dados do usuário corretamente e realiza o login automático em seguida.
   * O backend decodifica o login flexível (aceitando e-mail ou username) e gera o token JWT para armazenamento local, permitindo que a sessão do usuário seja autorizada no dashboard de forma transparente.

### Validação dos Resultados
* **Build de Sucesso**: O backend foi compilado com 0 erros e avisos.
* **Banco Local Populado**: A instância LocalDB gerou fisicamente a base `NexTI_DB` com as constraints de integridade e FKs da tabela `Progresso_Flashcards`.
* **Alinhamento do Servidor**: O backend ouve na porta correta HTTPS `5001`, atendendo exatamente à stack técnica fixada.
