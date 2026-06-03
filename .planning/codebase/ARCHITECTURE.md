---
mapped_date: "2026-04-30"
---
*Read in: [English](#english-version) | [Português](#versao-em-portugues)*

---
## English Version

# Architecture

### Design Patterns
- **Object-Oriented Programming (OOP)**: The C# backend is modeled with inheritance (e.g., `Admin`, `Tutor`, `Aluno` deriving from `Usuario`) and composition (e.g., `Aluno` has `XP`, `Moedas`, `Simulado`).
- **Relational Database**: Modeled via Entity-Relationship Diagram with SQL Server.

### Data Flow
- Users interact via the responsive web interface.
- LocalStorage is currently used for immediate MVP persistence.
- Future roadmap involves a backend in Node.js/C# and SQL Server in the cloud with JWT authentication.

---
## Versão em Português

# Arquitetura

### Padrões de Projeto (Design Patterns)
- **Programação Orientada a Objetos (POO)**: O backend em C# é modelado com herança (ex: `Admin`, `Tutor`, `Aluno` derivando de `Usuario`) e composição (ex: `Aluno` possui `XP`, `Moedas`, `Simulado`).
- **Banco de Dados Relacional**: Modelado via Diagrama Entidade-Relacionamento (DER) para SQL Server.

### Fluxo de Dados
- Os usuários interagem através da interface web responsiva.
- O LocalStorage é atualmente utilizado para persistência imediata no MVP.
- O planejamento futuro envolve um backend robusto (Node.js/C#) e banco SQL Server em nuvem com autenticação JWT.
