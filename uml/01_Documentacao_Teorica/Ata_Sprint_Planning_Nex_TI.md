# ATA DE SPRINT PLANNING – SISTEMA NEX_TI

**Data:** 05/03/2026  
**Sprint:** 01 (MVP - Fundação)  
**Duração:** 2 semanas  
**Scrum Master:** Maciel Costa da Silva  
**Product Owner:** Maycon Douglas Inácio Silva  

---

## 🎯 Objetivo da Sprint

Estabelecer a fundação do projeto, cobrindo o cadastro de usuários, autenticação segura, e a modelagem do banco de dados (SQL Server) com persistência primária e implementação de responsividade CSS.

---

## 📝 Backlog da Sprint (Sprint Backlog)

**1. [US01] Realizar Login (3 Story Points)**
- Criação das telas iniciais e roteamento.
- Implementação de JWT.

**2. [US02] Cadastrar Usuário (5 Story Points)**
- Configuração do modelo `Usuario.cs`.
- Hashing de senha (BCrypt) para adequação à LGPD.

**3. [US15] Ajustar Acessibilidade (5 Story Points)**
- Estruturação do Desktop First com CSS Grid.
- Implementação de tags de alto contraste e atributos WAI-ARIA.

**Total de Story Points Planejados:** 13 Story Points

---

## ⚠️ Riscos e Impedimentos Identificados

1. Atraso na definição da chave secreta do JWT pode atrasar a rota de Login.
2. Responsividade Mobile pode demandar mais horas de CSS do que o estimado.

## 📌 Decisões Técnicas Tomadas

- O banco de dados relacional oficial será o SQL Server.
- A persistência local temporária (LocalStorage) será utilizada apenas para salvar o token de sessão do usuário.
