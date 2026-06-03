# Fase 3: Sincronização do Ecossistema Nex_TI (Três Repositórios)

Esta fase teve como objetivo sincronizar as atas de reuniões Scrum, o Product Backlog e delimitar o escopo semestral nos três repositórios do projeto **Nex_TI** (Teórico, Prático e UML).

---

## 📋 Plano de Implementação

O plano focou na consistência das informações e no alinhamento das datas de encontros para a banca examinadora do PIM III:
1. **Atas Scrum (Reuniões 1 a 10)**: Unificar as atas Scrum registradas na pasta `.planning/meetings/` em todos os repositórios, incluindo os registros de encontros aos domingos.
2. **Sincronização de Backlog em UML**: Copiar as atas de planejamento e backlog do produto corrigidos para a pasta `01_Documentacao_Teorica/` de UML, removendo os arquivos PDF desatualizados.
3. **Delimitação de Escopo nos Manuais**: Inserir notas explícitas para a banca examinadora especificando que módulos como simulados ENADE e loja avançada de moedas estão em desenvolvimento para o 4º Semestre.
4. **Persistência Limpa no Git**: Confirmar as atualizações nos repositórios locais através de commits convencionais em português.

---

## 🛠️ Tasks Executadas

- [x] Atualizar o [ROADMAP.md](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/.planning/ROADMAP.md) no repositório teórico
- [x] Criar a documentação de fase em [phase_03.md](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/.planning/phases/phase_03.md)
- [x] Criar e ajustar as atas Scrum [reuniao_09.md](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/.planning/meetings/reuniao_09.md) e [reuniao_10.md](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/.planning/meetings/reuniao_10.md)
- [x] Copiar as atas de reuniões Scrum (1 a 10) para o repositório prático em `PIM_III-Parte_Pratica/.planning/meetings/`
- [x] Copiar as atas de reuniões Scrum (1 a 10) para o repositório UML em `PIM_III-Documentacao_UML/.planning/meetings/`
- [x] Ajustar as dimensões das imagens (max-height de 4.5cm na impressão) e quebras de página flexíveis (height: auto) no [style.css](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/style.css) com regras avoid
- [x] Commitar as alterações e novas atas no repositório `PIM_III-Documentacao_UML`
- [x] Commitar as novas atas e manuais no repositório `PIM_III-Parte_Pratica`
- [x] Commitar as alterações no repositório `PIM_III-Parte_Teorica`
- [x] Validar que todos os repositórios estejam com a working tree limpa

---

## 🚀 Walkthrough de Desenvolvimento

### 1. Sincronização Física das Atas Scrum
Copiamos a pasta `.planning/meetings/` (com os 10 diários de reuniões) do repositório Teórico para os repositórios Prático e UML. Isso inclui as atas de encontros aos domingos (Reuniões 9 e 10), que documentam a escrita de manuais de extensão e a refatoração baseada em SOLID no C#.

### 2. Sincronização de Backlog e Limpeza em UML
No repositório UML, removemos os PDFs antigos da pasta `01_Documentacao_Teorica/` por conterem dados e datas conflitantes. Em substituição, copiamos os markdowns revisados de backlog do produto, atas de planejamento e documentação do projeto.

### 3. Delimitação de Escopo Semestral
Para evitar que a banca examinadora do PIM III cobre funcionalidades que não pertencem a este semestre, inserimos avisos claros no [README.md](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Pratica/README.md) e no [MANUAL_TECNICO.md](file:///C:/Users/mayco/Documents/GitHub/PIM_III-Parte_Pratica/MANUAL_TECNICO.md) do projeto prático. Explicamos que a modelagem relacional de simulados (tabelas e chaves estrangeiras) e as entidades C# foram criadas para manter a conformidade conceitual UML do PIM III, mas que as lógicas funcionais e as telas de simulados estão marcadas como em desenvolvimento, sendo o escopo de entrega do próximo semestre (4º Semestre).

### 4. Commits Convencionais
Consolidamos as mudanças em cada repositório local através de commits convencionais em português:
- **UML**: `docs(planning): atualiza ata Scrum 10 com delimitacao de escopo`
- **Prático**: `docs(planning): atualiza readme, manual tecnico e ata Scrum 10 delimitando escopo semestral`
- **Teórico**: `docs(planning): atualiza ata Scrum 10 e phase_03 com notas de escopo semestral`

---

## 🧪 Validação dos Resultados

- **Uniformidade de Dados**: As datas de trabalho nas capas (`Julho / 2026`), lista de integrantes (Gabriel, Maciel, Maycon, Miguel e Rafael) e estimativas de Story Points do Backlog coincidem 100% em todas as instâncias do projeto.
- **Rastreabilidade de Encontros**: Todas as pastas `.planning/meetings/` contêm os exatos 10 arquivos das reuniões Scrum.
- **Resguardo de Escopo**: Os manuais práticos e técnicos possuem agora seções formais que delimitam claramente quais recursos pertencem ao MVP do 3º Semestre e quais são escopos futuros do 4º Semestre.
- **Git Status Limpo**: Executamos `git status` nos três repositórios, confirmando que não existem pendências ou arquivos untracked no ambiente.
