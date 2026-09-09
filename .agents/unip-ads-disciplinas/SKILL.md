---
name: unip-ads-disciplinas
description: >
  Contém a base conceitual, ementas, bibliografia e conexões interdisciplinares das
  disciplinas do 4º semestre de Análise e Desenvolvimento de Sistemas (UNIP). Use esta
  skill como referência teórica sempre que for instruído a fundamentar o código ou
  seções de relatórios (PIM IV) com base nas matérias do curso.
---

# Skill: Disciplinas de ADS (UNIP – 4º Semestre)

Esta skill consolida a base teórica e os eixos conceituais extraídos da ementa oficial do 4º semestre de ADS da UNIP, servindo de guia para garantir a aderência do projeto e do relatório do PIM IV às disciplinas vigentes.

---

## 1. Programação Web Avançada (APIs RESTful C#)

*   **Eixos Conceituais:**
    *   **Arquitetura RESTful**: Desenvolvimento de Web Services sem estado (stateless), usando verbos HTTP (GET, POST, PUT, DELETE) e retornos padronizados em JSON.
    *   **Minimal APIs & ASP.NET Core**: Configuração enxuta e de alta performance em C# (.NET 10), desacoplando rotas de endpoints.
    *   **Persistência com Entity Framework Core**: Mapeamento Objeto-Relacional (ORM) para comunicação assíncrona com o banco.
    *   **Segurança (JWT Token & CORS)**: Proteção de endpoints sensíveis contra acessos não autorizados por meio de tokens JWT e políticas de CORS.
*   **Referências**: Roger Pressman (*Engenharia de Software*), Martin Fowler (*Patterns of Enterprise Application Architecture*).

---

## 2. Programação para Dispositivos Móveis

*   **Eixos Conceituais:**
    *   **Layouts Adaptativos e Mobile-First**: Interfaces que escalam de forma fluida de telas desktop a dispositivos portáteis.
    *   **Ciclo de Vida de Aplicação**: Gerenciamento de estado, carregamento assíncrono de dados e economia de recursos computacionais.
    *   **Consumo de APIs no Mobile**: Realização de requisições assíncronas assíncronas (promises, fetch) com tratamento de latência de rede.
*   **Referências**: Reto Meier (*Professional Android Application Development*).

---

## 3. Gerenciamento e Programação de Banco de Dados

*   **Eixos Conceituais:**
    *   **Modelagem Relacional Física**: Definição de chaves primárias (PK), chaves estrangeiras (FK), restrições (constraints) e índices no Microsoft SQL Server.
    *   **Relacionamentos N:N**: Resolução lógica de relações muitos-para-muitos por meio de tabelas associativas e junções indexadas (joins).
    *   **Integridade Referencial**: Garantia de integridade física dos dados através de restrições transacionais nas tabelas.
*   **Referências**: Elmasri & Navathe (*Sistemas de Banco de Dados*, 6ª ed.).

---

## 4. Engenharia de Software III (Qualidade e Testes)

*   **Eixos Conceituais:**
    *   **Qualidade de Produto (ISO/IEC 25010)**: Avaliação de usabilidade, eficiência de desempenho, compatibilidade, segurança e confiabilidade do software.
    *   **Qualidade de Processo (MPS.BR / CMMI)**: Melhores práticas em processos de software e gerenciamento visual via Scrum e Kanban.
    *   **Garantia de Qualidade (V&V)**: Execução de testes funcionais (caixa-preta) e validação dos critérios de aceitação (UAT).
*   **Referências**: Ian Sommerville (*Engenharia de Software*, 10ª ed.), Softex (*MPS.BR Guia Geral*).

---

## 5. Tópicos Especiais de Tecnologia (Inteligência Artificial & SM-2)

*   **Eixos Conceituais:**
    *   **Algoritmos Adaptativos**: Sistemas baseados em respostas do usuário para otimização de fluxos.
    *   **Algoritmo SuperMemo-2 (SM-2)**: Cálculo matemático do fator de facilidade (EF), intervalo de repetição (I) e número de repetições (Rep) com base no feedback do usuário na escala de 0 a 5.
    *   **Análise de Dados de Estudo**: Mapeamento do engajamento e progresso do estudante por meio de gráficos de dispersão e teias neurais (Obsidian View).
*   **Referências**: Piotr Wozniak (criador do SM-2).

---

## 6. Comunicação e Acessibilidade (LIBRAS)

*   **Eixos Conceituais:**
    *   **Acessibilidade Universal**: Conformidade com as diretrizes W3C/WCAG e WAI-ARIA (Alto Contraste, navegação por teclado e redimensionamento de fontes).
    *   **LIBRAS (Língua Brasileira de Sinais)**: Inclusão de recursos visuais de apoio, mitigação de barreiras de comunicação para deficientes auditivos e conformidade com a legislação brasileira de inclusão.
*   **Referências**: Lei de Inclusão nº 13.146/2015.

---

## 🔗 Conexões Interdisciplinares para o PIM IV

*   **Banco de Dados + APIs C# (.NET 10)**: A persistência do Simulado ENADE e dos Flashcards no SQL Server é consumida de forma direta e em tempo real pelo backend C# via Entity Framework Core, entregando dados estruturados ao frontend.
*   **UX/UI + Acessibilidade + LIBRAS**: A interface responsiva em HTML/CSS Puro traduz as Heurísticas de Nielsen e a acessibilidade digital (Alto Contraste e Zoom) de forma inclusiva para acessibilidade universal.
*   **Engenharia de Software + Metodologias Ágeis**: A entrega contínua do MVP foi gerenciada por sprints e avaliada sob os critérios da norma de qualidade ISO/IEC 25010.
*   **Tópicos Especiais + Repetição Espaçada**: O motor SM-2 opera no cálculo do agendamento dos cards e gera métricas de progresso exibidas de forma interativa na teia do Mapa Neural.
