<!-- markdownlint-disable MD033 MD041 -->
<div align="center">
  <img src="../relatorio/assets/branding/Logo%20UNIP.png" alt="Logo UNIP" width="150"/>
  <h1>Nex_TI — Sistema</h1>
  <p><strong>PIM IV · Análise e Desenvolvimento de Sistemas · UNIP</strong></p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#"/>
  <img src="https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 10"/>
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white" alt="SQL Server"/>
</div>

---

O código do Nex_TI: o site, o app de celular, a API em C# e o banco de dados.
A monografia está em [`../relatorio`](../relatorio) e os diagramas em
[`../modelagem-uml`](../modelagem-uml).

## O que é

Um app para estudar TI com flashcards. O algoritmo **SM-2** decide quando cada
carta volta (errou, volta amanhã; acertou, demora mais). São 26 fases e 620
cartas, com simulados no estilo ENADE, XP, moedas e acessibilidade (alto
contraste e VLibras).

## O que funciona hoje

| Parte | Situação | Onde fica salvo |
|---|---|---|
| Cadastro e login | ✅ | API (JWT) e SQL Server |
| Estudo com flashcards e SM-2 | ✅ | No navegador; respostas de cartas com ID são enviadas a `POST /api/progresso/atualizar` quando a API está disponível |
| Simulados ENADE | ✅ | Cartas por fase vêm da API; os testes de módulo são montados com o conteúdo local |
| XP, moedas e nível | ✅ | No navegador e na API (`PUT /api/usuarios/stats`), que limita incrementos por atualização |
| Desbloqueio de fases e compra de bônus | ⚠️ | Acesso liberado no navegador; a compra não envia imediatamente o saldo à API |
| Mapa Neural | ✅ | Só no navegador |
| Certificado | ✅ | Gerado no navegador e impresso como PDF |
| App de celular | ⚠️ | Tela de estudo pronta; ainda não faz login nem fala com a API |
| Perfis de Tutor e Admin | ❌ | No backlog (PB01 e PB15) |

Cadastro e login exigem a API. Com uma sessão já salva no navegador, o painel
pode usar as cartas locais de `packages/shared` quando a API está indisponível.
Não existe uma fila para reenviar automaticamente respostas que falharam.
Os cálculos de revisão do navegador e da API ainda diferem; veja o manual técnico.

## Como rodar

```bash
npm install
npm run dev        # sobe a API (porta 5000) e o site (porta 5501)
npm test           # confere a estrutura e roda os testes da API
npm run test:shared # testa as regras JavaScript compartilhadas
```

O passo a passo, com o banco de dados, está em
[`docs/MANUAL_DE_EXECUCAO.md`](docs/MANUAL_DE_EXECUCAO.md). Como publicar na
Azure e na Vercel: [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Pastas

```text
sistema/
├── apps/
│   ├── api/            API em C# (.NET 10): Endpoints → Services → Data → Models
│   ├── react-web/      O site (React + Vite)
│   └── react-mobile/   O app de celular (Expo)
├── packages/
│   ├── shared/         Cartas, SM-2 do navegador, cliente da API e CSS do site
│   └── design-dna/     Cores e fontes do Nex_TI
├── database/           Script SQL Server e esquema do Azure SQL
├── tests/              Testes da API (xUnit)
├── infra/azure/        Script que cria a infraestrutura na Azure
├── scripts/            Gera a semente da API e confere a estrutura
├── docs/               Manuais, deploy e a apresentação de P.A. em .NET
└── start.py            Sobe a API e o site juntos
```

## Como a API está organizada

Cada camada cuida de uma coisa:

| Camada | Pasta | O que faz |
|---|---|---|
| Rotas | `apps/api/Endpoints` | Recebe o pedido e devolve a resposta |
| Serviços | `apps/api/Services` | As regras: login, SM-2, XP, conteúdo |
| Dados | `apps/api/Data` | Fala com o banco (Entity Framework Core) |
| Modelos | `apps/api/Models` | As classes: Usuario, Aluno, Tutor, Flashcard… |

Os diagramas de classes dessas camadas estão em
[`../modelagem-uml/02_Modelagem_UML`](../modelagem-uml/02_Modelagem_UML).

## Equipe DevTime

UNIP São José dos Campos · Turma 2026

- Gabriel Alves Moreira (H67HJI4)
- Maciel Costa da Silva (R280985)
- Maycon Douglas Inácio Silva (H719CD3)
- Miguel Angel Fernandez Ortiz (H7858F9)
- Rafael Mesquita (H6722I0)
