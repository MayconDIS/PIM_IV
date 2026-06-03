<div align="center">
  <img src="assets/branding/Logo UNIP.png" alt="Logo UNIP" width="150"/>
  <h1>Nex_TI – EdTech Learning Platform</h1>
  <p><strong>Projeto Integrado Multidisciplinar (PIM III) - Análise e Desenvolvimento de Sistemas</strong></p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" />
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white" />
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
</div>

<br>

*Read in: [English](#english-version) | [Português](#versao-em-portugues) | [Español](#version-en-espanol)*

---

## 🔗 Ecossistema do Projeto (PIM III) / Project Ecosystem / Ecosistema del Proyecto

<details open>
  <summary>🇧🇷 <b>Português</b></summary>

  O ecossistema do projeto **Nex_TI** desenvolvido para o PIM III (UNIP) é estruturado em três repositórios complementares:
  1. 📄 **[PIM_III-Parte_Teorica](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica)**: Contém a monografia acadêmica e o Relatório ABNT interativo (HTML/CSS), protótipos de interface, cronogramas e atas teóricas.
  2. 📐 **[PIM_III-Documentacao_UML](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Documentacao_UML)**: Abriga a modelagem UML completa e fonte no Astah (`.asta`), os diagramas globais exportados (Classes, Sequência, Casos de Uso) e a documentação detalhada em Markdown do Backlog do Produto e Sprints.
  3. 💻 **[PIM_III-Parte_Pratica](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Pratica)**: A implementação funcional em código, englobando o Frontend (HTML/CSS/JS com modo de acessibilidade e o mapa neural interativo), a API do Backend em C# (.NET 10 Minimal APIs) e os scripts do banco de dados (Microsoft SQL Server).
</details>

<details>
  <summary>🇺🇸 <b>English</b></summary>

  The **Nex_TI** project ecosystem for PIM III (UNIP) is structured into three complementary repositories:
  1. 📄 **[PIM_III-Parte_Teorica](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica)**: Contains the academic monograph and the interactive ABNT Report (HTML/CSS), interface prototypes, schedules, and theoretical minutes.
  2. 📐 **[PIM_III-Documentacao_UML](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Documentacao_UML)**: Hosts the complete UML modeling and Astah source (`.asta`), global exported diagrams (Class, Sequence, Use Case), and detailed Markdown documentation of Product and Sprint Backlogs.
  3. 💻 **[PIM_III-Parte_Pratica](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Pratica)**: The functional code implementation, encompassing the Frontend (HTML/CSS/JS with accessibility mode and interactive neural map), the Backend C# API (.NET 10 Minimal APIs), and database scripts (Microsoft SQL Server).
</details>

<details>
  <summary>🇪🇸 <b>Español</b></summary>

  El ecosistema del proyecto **Nex_TI** para PIM III (UNIP) está estructurado en tres repositorios complementarios:
  1. 📄 **[PIM_III-Parte_Teorica](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica)**: Contiene la monografía académica y el Informe ABNT interactivo (HTML/CSS), prototipos de interfaz, cronogramas y actas teóricas.
  2. 📐 **[PIM_III-Documentacao_UML](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Documentacao_UML)**: Alberga el modelado UML completo y la fuente en Astah (`.asta`), los diagramas globales exportados (Clases, Secuencia, Casos de Uso) y la documentación detallada en Markdown del Backlog del Producto y Sprints.
  3. 💻 **[PIM_III-Parte_Pratica](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Pratica)**: La implementación funcional en código, que abarca el Frontend (HTML/CSS/JS con modo de accesibilidad y mapa neuronal interactivo), la API del Backend en C# (.NET 10 Minimal APIs) y los scripts de la base de datos (Microsoft SQL Server).
</details>

---

## 🇧🇷 Versão em Português


### 📖 Sobre o Projeto
A **Nex_TI** é a especificação técnica e arquitetural de uma plataforma web focada em avaliação e apoio à aprendizagem. O projeto foi desenvolvido para resolver a "curva de esquecimento" em treinamentos acadêmicos e corporativos.
Para isso, a plataforma integra:
- **Estudo Ativo & Repetição Espaçada:** Implementação matemática do algoritmo SM-2 para calcular os intervalos ideais de revisão.
- **Gamificação:** Distribuição de Pontos de Experiência (XP) e Moedas Virtuais para engajar o usuário.
- **Acessibilidade Universal:** Foco total em semântica W3C e leitores de tela via WAI-ARIA.

Este repositório abriga a **fase teórica e documental** do sistema (PIM III), incluindo protótipos visuais, diagramas UML, mapeamento relacional (DER) e a arquitetura POO base que será implementada no semestre seguinte.

### 🚀 Tecnologias e Arquitetura

O projeto foi construído seguindo as melhores práticas de Clean Code e Separação de Responsabilidades:

* **Frontend Documental:** Desenvolvido em HTML5 estritamente semântico (`<main>`, `<article>`, `<nav>`) e responsivo via CSS Puro (Flexbox e Grid), sem uso de bibliotecas externas.
* **Backend Projetado:** Arquitetura Orientada a Objetos (POO) em `C# (.NET 10)` abstraindo as regras de negócio de Alunos, Tutores e Administradores.
* **Banco de Dados:** SGBD `SQL Server` estruturado em conformidade com a LGPD.
* **Gestão e Design:** Ciclo de vida ágil com Scrum/Kanban e prototipagem de alta fidelidade no Figma.

### 📂 Estrutura do Repositório

```text
📦 PIM_III-Parte_Teorica
 ┣ 📂 .planning/      # Inteligência do projeto, roadmap e arquitetura (GSD Framework)
 ┣ 📂 assets/         # Recursos visuais organizados (branding, diagramas, protótipos, kanban)
 ┣ 📜 index.html      # O documento raiz (Relatório Acadêmico ABNT interativo)
 ┣ 📜 style.css       # Folha de estilo global e clean code do projeto
 ┗ 📜 README.md       # Este documento
```

### 👥 Equipe de Desenvolvimento
Projeto acadêmico desenvolvido pelos alunos da UNIP - São José dos Campos (Turma 2026 / Diurno):
- **Gabriel Alves Moreira** (H67HJI4)
- **Maciel Costa da Silva** (R280985)
- **Maycon Douglas Inácio Silva** (H719CD3)
- **Miguel Angel Fernandez Ortiz** (H7858F9)
- **Rafael Mesquita** (H6722I0)

---

## 🇺🇸 English Version

### 📖 About the Project
**Nex_TI** is the technical and architectural specification for a web-based assessment and learning support platform. The project was designed to solve the "forgetting curve" in academic and corporate training. 
To achieve this, the platform integrates:
- **Active Study & Spaced Repetition:** Mathematical implementation of the SM-2 algorithm to calculate optimal review intervals.
- **Gamification:** Distribution of Experience Points (XP) and Virtual Coins to boost user engagement.
- **Universal Accessibility:** Strict adherence to W3C semantics and screen readers via WAI-ARIA.

This repository hosts the **theoretical and documentary phase** of the system (PIM III), including visual prototypes, UML diagrams, relational database mapping (ERD), and the core OOP architecture scheduled for full implementation in the following semester.

### 🚀 Technologies and Architecture

The project was built adhering to Clean Code and Separation of Concerns best practices:

* **Documentary Frontend:** Developed in strictly semantic HTML5 (`<main>`, `<article>`, `<nav>`) and fully responsive via Vanilla CSS (Flexbox and Grid Layout).
* **Planned Backend:** Object-Oriented Architecture (OOP) in `C# (.NET 10)` abstracting business rules for Students, Tutors, and Administrators.
* **Database:** `SQL Server` RDBMS structured in compliance with data protection laws (LGPD).
* **Management & Design:** Agile lifecycle using Scrum/Kanban and high-fidelity prototyping via Figma.

### 📂 Repository Structure

```text
📦 PIM_III-Parte_Teorica
 ┣ 📂 .planning/      # Project intelligence, roadmap, and architecture (GSD Framework)
 ┣ 📂 assets/         # Organized visual resources (branding, diagrams, prototypes, kanban)
 ┣ 📜 index.html      # The core document (Interactive Academic Report - ABNT standard)
 ┣ 📜 style.css       # Global stylesheet and project clean code
 ┗ 📜 README.md       # This file
```

### 👥 Development Team
Academic project developed by students from UNIP - São José dos Campos (Class of 2026 / Daytime):
- **Gabriel Alves Moreira** (H67HJI4)
- **Maciel Costa da Silva** (R280985)
- **Maycon Douglas Inácio Silva** (H719CD3)
- **Miguel Angel Fernandez Ortiz** (H7858F9)
- **Rafael Mesquita** (H6722I0)

---

## 🇪🇸 Versión en Español

### 📖 Sobre el Proyecto
**Nex_TI** es la especificación técnica y estructural de una plataforma web centrada en la evaluación y el apoyo al aprendizaje. El proyecto fue desarrollado para resolver la "curva del olvido" en capacitaciones académicas y corporativas.

Para lograr esto, la plataforma integra:
- **Estudio Activo y Repetición Espaciada:** Implementación matemática del algoritmo SM-2 para calcular los intervalos óptimos de revisión.
- **Gamificación:** Distribución de Puntos de Experiencia (XP) y Monedas Virtuales para involucrar al usuario.
- **Accesibilidad Universal:** Enfoque total en semántica W3C y lectores de pantalla a través de WAI-ARIA.

Este repositorio alberga la **fase teórica y documental** del sistema (PIM III), que incluye prototipos visuales, diagramas UML, mapeo relacional (DER) y la arquitectura POO base que se implementará en el próximo semestre.

### 🚀 Tecnologías y Arquitectura

El proyecto fue construido siguiendo las mejores prácticas de Clean Code y Separación de Responsabilidades:

* **Frontend Documental:** Desarrollado en HTML5 estrictamente semántico (`<main>`, `<article>`, `<nav>`) y adaptable a través de CSS Puro (Flexbox y Grid), sin el uso de librerías externas.
* **Backend Diseñado:** Arquitectura Orientada a Objetos (POO) en `C# (.NET 10)` que abstrae las reglas de negocio de Alumnos, Tutores y Administradores.
* **Base de Datos:** SGBD `SQL Server` estructurado en conformidad con la LGPD (Ley General de Protección de Datos).
* **Gestión y Diseño:** Ciclo de vida ágil con Scrum/Kanban y prototipado de alta fidelidad en Figma.

### 📂 Estructura del Repositorio

```text
📦 PIM_III-Parte_Teorica
 ┣ 📂 .planning/      # Inteligencia del proyecto, hoja de ruta y arquitectura (GSD Framework)
 ┣ 📂 assets/         # Recursos visuales organizados (marca, diagramas, prototipos, kanban)
 ┣ 📜 index.html      # El documento raíz (Informe Académico ABNT interactivo)
 ┣ 📜 style.css       # Hoja de estilo global y código limpio del proyecto
 ┗ 📜 README.md       # Este archivo
```

### 👥 Equipo de Desarrollo
Proyecto académico desarrollado por los estudiantes de la UNIP - São José dos Campos (Clase de 2026 / Diurno):
- **Gabriel Alves Moreira** (H67HJI4)
- **Maciel Costa da Silva** (R280985)
- **Maycon Douglas Inácio Silva** (H719CD3)
- **Miguel Angel Fernandez Ortiz** (H7858F9)
- **Rafael Mesquita** (H6722I0)
