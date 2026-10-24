# Modelagem do Nex_TI (PIM IV)

<p align="center">
  <img src="https://img.shields.io/badge/Projeto-PIM_IV-blue.svg" alt="PIM IV">
  <img src="https://img.shields.io/badge/UML-Astah_10.1-orange.svg" alt="Astah">
</p>

A UML e o banco de dados do Nex_TI, feitos a partir do código do sistema (`../sistema`).

## O que tem aqui

| Pasta | O que tem |
|---|---|
| [`02_Modelagem_UML/`](02_Modelagem_UML) | O arquivo do Astah (`Diagrams Nex_TI - PIM IV.asta`) com 37 diagramas, as imagens de todos eles em [`imagens-astah/`](02_Modelagem_UML/imagens-astah) e, soltas na pasta, as principais: casos de uso, classes (entidades e camadas), atividade e sequência |
| [`02_Modelagem_UML/gerador-astah/`](02_Modelagem_UML/gerador-astah) | O programa que monta o `.asta` pela API do Astah e o que exporta as imagens |
| [`04_Banco_de_Dados/`](04_Banco_de_Dados) | MER, DER (modelo lógico) e modelo físico do SQL Server, exportados do Astah, e a lista de procedures e triggers |

## Os diagramas

- **Casos de uso:** os 15 casos de uso por perfil (Usuário → Aluno → Tutor → Administrador).
- **Para cada caso de uso:** um diagrama de classes e um de sequência, tirados do código.
- **Classes:** as entidades da API e as camadas (rotas → interfaces → serviços → banco).
- **Atividade:** a sessão de estudo com flashcards, com raias para o aluno, o site ou app, a API e o banco.
- **Banco de dados:** MER (modelo conceitual), DER (modelo lógico) e modelo físico do SQL Server.

Todo elemento do `.asta` tem a explicação no campo **Definition** do Astah.

## Em relação ao PIM III

A modelagem do PIM III fica no repositório dele
([MayconDIS/PIM_III](https://github.com/MayconDIS/PIM_III)). O que mudou está no
[README principal](../README.md#-melhorias-em-relação-ao-pim-iii).
