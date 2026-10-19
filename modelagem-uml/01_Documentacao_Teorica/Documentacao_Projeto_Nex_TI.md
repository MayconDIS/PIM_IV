# DOCUMENTAÇÃO DO PROJETO NEX_TI
**Versão:** 2.0 (Alinhamento 2026)

## 1. Visão do Produto
O Nex_TI é uma plataforma educacional interativa focada em estudantes da área de Tecnologia da Informação. O sistema utiliza a técnica de repetição espaçada (Algoritmo SM-2) e elementos de gamificação para maximizar a retenção de conteúdo teórico, preparando alunos para exames como o ENADE de forma dinâmica e moderna.

## 2. Público Alvo (Persona UX)
Jovens universitários e recém-formados no ensino médio (18-20 anos) com perfil independente, que precisam de nivelamento e familiarização introdutória com as disciplinas pesadas dos cursos de TI (C#, SQL, Arquitetura).

## 3. Arquitetura Técnica

A aplicação foi desenvolvida focando no princípio "Desktop First", com interfaces responsivas nativas em HTML5, CSS Grid e Flexbox.

- **Backend:** C# (.NET 10), garantindo tipagem forte e aderência aos 4 pilares da Orientação a Objetos.
- **Banco de Dados:** Microsoft SQL Server, utilizando tabelas relacionais com integridade ACID (Atomicidade, Consistência, Isolamento e Durabilidade).
- **Segurança:** Senhas protegidas via algoritmos de Hashing (BCrypt), respeitando os princípios de privacidade e minimização da LGPD.

## 4. Estrutura de Casos de Uso

O sistema está fragmentado em 15 Casos de Uso independentes, mapeando as interações dos 3 Atores principais:

- **Aluno:** Estuda flashcards, resolve simulados e ganha XP.
- **Tutor:** Cria trilhas, gerencia baralhos e monitora o desempenho geral.
- **Administrador:** Gerencia os privilégios de acesso do sistema.
