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
| XP, moedas e nível | ✅ | Calculados na API (`POST /api/progresso/concluir-fase`), com a mesma tabela do site; o site e o app mostram o prêmio na hora e ficam com os totais do servidor |
| Desbloqueio de fases e compra de bônus | ✅ | Fases liberadas no navegador; a compra de bônus é conferida e descontada na API (`POST /api/usuarios/bonus/{id}/comprar`) |
| Mapa Neural | ✅ | Só no navegador |
| Certificado | ✅ | Gerado no navegador e impresso como PDF |
| App de celular | ✅ | Login, fases e estudo pela API; sem internet, as respostas esperam numa fila no aparelho |
| Perfis e painel do Tutor/Admin | ✅ | Perfil no banco e no JWT; Tutor vê os alunos e edita/exclui cartas; Admin também define perfis |

Cadastro e login exigem a API. Com uma sessão já salva no navegador, o painel
pode usar as cartas locais de `packages/shared` quando a API está indisponível.
Não existe uma fila para reenviar automaticamente respostas que falharam.
O cálculo da revisão (SM-2) é o mesmo no site, no app e na API, testado com os mesmos casos.

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
