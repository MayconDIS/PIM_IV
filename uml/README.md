# 🎓 Nex_TI: Plataforma de Aprendizado Adaptativo com Gamificação e IA

<p align="center">
  <img src="https://img.shields.io/badge/Projeto-PIM_III-blue.svg" alt="PIM III">
  <img src="https://img.shields.io/badge/UML-Astah_10.1-orange.svg" alt="Astah">
  <img src="https://img.shields.io/badge/Documenta%C3%A7%C3%A3o-PlantUML-green.svg" alt="PlantUML">
</p>

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

  El ecosistema del proyecto **Nex_TI** para PIM III (UNIP) está estructurado en tres repositórios complementarios:
  1. 📄 **[PIM_III-Parte_Teorica](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica)**: Contiene la monografía académica y el Informe ABNT interactivo (HTML/CSS), prototipos de interfaz, cronogramas y actas teóricas.
  2. 📐 **[PIM_III-Documentacao_UML](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Documentacao_UML)**: Alberga el modelado UML completo y la fuente en Astah (`.asta`), los diagramas globales exportados (Clases, Secuencia, Casos de Uso) y la documentación detallada en Markdown del Backlog del Producto y Sprints.
  3. 💻 **[PIM_III-Parte_Pratica](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Pratica)**: La implementación funcional en código, que abarca el Frontend (HTML/CSS/JS con modo de accesibilidad y mapa neuronal interactivo), la API del Backend en C# (.NET 10 Minimal APIs) y los scripts de la base de datos (Microsoft SQL Server).
</details>

---

## 🇧🇷 Versão em Português

Bem-vindo ao repositório oficial da **Documentação UML e Arquitetura do Sistema Nex_TI**, desenvolvido como parte do Projeto Integrado Multidisciplinar (PIM III) da UNIP. 

O **Nex_TI** é um sistema educacional revolucionário que utiliza o algoritmo de Repetição Espaçada (SM-2), mecânicas de gamificação (XP e Moedas) e um Agente Especialista baseado em Inteligência Artificial para otimizar a jornada de aprendizado do aluno.

### 📌 Links Rápidos para a Banca Avaliadora

Para facilitar a navegação pelos principais artefatos do projeto:

- 📊 **[Diagramas Globais e Modelagem (.asta)](./02_Modelagem_UML)**: Diagramas globais de Classe, Sequência e Casos de Uso em alta definição (PNG), além do arquivo fonte `.asta` para ser carregado diretamente no software **Astah UML**.
- 📄 **[Documentação Teórica e Planejamento](./01_Documentacao_Teorica)**: Visão detalhada do Backlog do Produto (US01 a US15), atas de planejamento da Sprint e conceitos teóricos em Markdown e PDF.
- 💻 **[Classes C# Geradas (.cs)](./03_Codigo_Gerado)**: Esboço de arquivos de classe em C# gerados automaticamente pelo Astah a partir do modelo de classes final.

### 🏗️ Estrutura do Repositório

Organizamos este repositório focando na simplicidade, clareza e separação de conceitos:

```text
📁 PIM_III-Documentacao_UML/
├── 📁 .planning/                      # Gerenciamento ágil GSD (Roadmaps, Fases, Specs)
├── 📁 01_Documentacao_Teorica/        # Documentações teóricas e atas de planejamento em PDF/MD
├── 📁 02_Modelagem_UML/               # Modelagem fonte do Astah (.asta) e imagens globais (.png)
└── 📁 03_Codigo_Gerado/               # Esboço das classes C# exportadas do modelo de classes
```

### 📐 Padrões Arquiteturais Adotados

A nossa modelagem foi desenvolvida estritamente sobre as melhores práticas da **Engenharia de Software Orientada a Objetos**:
1. **Encapsulamento Restrito**: Todos os atributos de Entidades foram definidos como privados (`-`), sendo expostos apenas via métodos públicos (`+`).
2. **Separação de Preocupações (MVC/ECB)**: Classes de Dados (`<<Entidade>>`) não misturam lógica com Agentes de Serviço (`<<Control>>`).
3. **Padrão Astah Otimizado**: O visual dos nossos diagramas no PlantUML foram parametrizados (`skinparam`) para replicar as cores, layout em cascata e identidades visuais da ferramenta Astah (versão 10).

---

## 🇺🇸 English Version

Welcome to the official repository for **UML Documentation and System Architecture of Nex_TI**, developed as part of the Multidisciplinary Integrated Project (PIM III) at UNIP.

**Nex_TI** is a revolutionary educational system that utilizes the Spaced Repetition algorithm (SM-2), gamification mechanics (XP and Coins), and an AI-based Specialist Agent to optimize the student learning journey.

### 📌 Quick Links for the Evaluators

To facilitate navigation through the main project artifacts:

- 📊 **[Global Diagrams and Modeling (.asta)](./02_Modelagem_UML)**: High-definition global Class, Sequence, and Use Case diagrams (PNG), as well as the `.asta` source file to be loaded directly into the **Astah UML** software.
- 📄 **[Theoretical Documentation and Planning](./01_Documentacao_Teorica)**: Detailed view of the Product Backlog (US01 to US15), Sprint planning minutes, and theoretical concepts in Markdown and PDF.
- 💻 **[Generated C# Classes (.cs)](./03_Codigo_Gerado)**: Draft of C# class files automatically generated by Astah from the final class model.

### 🏗️ Repository Structure

We organized this repository focusing on simplicity, clarity, and separation of concerns:

```text
📁 PIM_III-Documentacao_UML/
├── 📁 .planning/                      # Agile GSD management (Roadmaps, Phases, Specs)
├── 📁 01_Documentacao_Teorica/        # Theoretical documentations and Sprint minutes in PDF/MD
├── 📁 02_Modelagem_UML/               # Astah source modeling (.asta) and global images (.png)
└── 📁 03_Codigo_Gerado/               # Draft of C# classes exported from the class model
```

### 📐 Adopted Architectural Patterns

Our modeling was developed strictly following **Object-Oriented Software Engineering** best practices:
1. **Strict Encapsulation**: All Entity attributes are defined as private (`-`), exposed only through public methods (`+`).
2. **Separation of Concerns (MVC/ECB)**: Data Classes (`<<Entity>>`) do not mix logic with Service Agents (`<<Control>>`).
3. **Optimized Astah Pattern**: The look of our PlantUML diagrams is parameterized (`skinparam`) to replicate the colors, cascading layout, and visual identities of the Astah tool (version 10).

---

## 🇪🇸 Versión en Español

Bienvenido al repositorio oficial de la **Documentación UML y Arquitectura del Sistema Nex_TI**, desarrollado como parte del Proyecto Integrado Multidisciplinar (PIM III) de la UNIP.

**Nex_TI** es un sistema educativo revolucionario que utiliza el algoritmo de Repetición Espaciada (SM-2), mecánicas de gamificación (XP y Monedas) y un Agente Especialista basado en Inteligencia Artificial para optimizar la jornada de aprendizaje del alumno.

### 📌 Enlaces Rápidos para el Comité Evaluador

Para facilitar la navegación por los principales artefactos del proyecto:

- 📊 **[Diagramas Globales y Modelado (.asta)](./02_Modelagem_UML)**: Diagramas globales de Clase, Secuencia y Casos de Uso en alta definición (PNG), además del archivo fuente `.asta` para ser cargado directamente en el software **Astah UML**.
- 📄 **[Documentación Teórica y Planificación](./01_Documentacao_Teorica)**: Vista detallada del Backlog del Producto (US01 a US15), actas de planificación de Sprint y conceptos teóricos en Markdown y PDF.
- 💻 **[Clases C# Generadas (.cs)](./03_Codigo_Gerado)**: Esbozo de archivos de clase en C# generados automáticamente por Astah a partir del modelo de clases final.

### 🏗️ Estructura del Repositorio

Organizamos este repositorio enfocándonos en la simplicidad, claridad y separación de conceptos:

```text
📁 PIM_III-Documentacao_UML/
├── 📁 .planning/                      # Gestión ágil GSD (Roadmaps, Fases, Specs)
├── 📁 01_Documentacao_Teorica/        # Documentaciones teóricas y actas de planificación en PDF/MD
├── 📁 02_Modelagem_UML/               # Modelado fuente de Astah (.asta) y imágenes globales (.png)
└── 📁 03_Codigo_Gerado/               # Esbozo de las clases C# exportadas del modelo de clases
```

### 📐 Patrones Arquitectónicos Adoptados

Nuestro modelado fue desarrollado estrictamente sobre las mejores prácticas de la **Ingeniería de Software Orientada a Objetos**:
1. **Encapsulamiento Estricto**: Todos los atributos de las Entidades se definieron como privados (`-`), expuestos únicamente a través de métodos públicos (`+`).
2. **Separación de Concernientes (MVC/ECB)**: Las clases de datos (`<<Entidad>>`) no mezclan lógica con Agentes de Servicio (`<<Control>>`).
3. **Patrón Astah Optimizado**: El aspecto visual de nuestros diagramas en PlantUML ha sido parametrizados (`skinparam`) para replicar los colores, el diseño en cascada y las identidades visuales de la herramienta Astah (versión 10).

---

> Desenvolvido com foco na excelência acadêmica e aplicação real no mercado de TI. / Developed with a focus on academic excellence and real IT market application. / Desarrollado con enfoque en la excelencia académica y la aplicación real en el mercado de TI. 🚀
