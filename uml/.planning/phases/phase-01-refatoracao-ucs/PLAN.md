# Plano da Fase 1: Refatoração dos 15 UCs com PlantUML

## 🎯 Objetivo
Migrar a documentação visual de Mermaid.js para PlantUML utilizando a skill `uml-architect`, gerando artefatos profissionais (.puml e .png) para todos os 15 Casos de Uso.

## 📋 Tarefas

### Onda 1: Preparação e Extração
- [ ] **Tarefa 1.1:** Criar estrutura de diretórios para os diagramas em `.agent/skills/uml-architect/artifacts/`.
- [ ] **Tarefa 1.2:** Extrair a lógica dos diagramas (Classe e Sequência) dos READMEs atuais (02_Modelagem_UML_Astah).

### Onda 2: Geração e Compilação (UML-Architect)
- [ ] **Tarefa 2.1:** Gerar arquivos `.puml` individuais para cada diagrama de cada UC.
- [ ] **Tarefa 2.2:** Executar `python .agent/skills/uml-architect/compile_uml.py` para cada arquivo gerado para produzir as imagens `.png`.

### Onda 3: Atualização da Documentação
- [ ] **Tarefa 3.1:** Inserir os novos diagramas (PNG e Código PlantUML) nos READMEs dos UCs.
- [ ] **Tarefa 3.2:** Adicionar avisos de "Padrão Premium" nos documentos.

### Onda 4: Verificação
- [ ] **Tarefa 4.1:** Validar se todas as 30 imagens (15 Classe + 15 Sequência) foram geradas corretamente.
- [ ] **Tarefa 4.2:** Verificar a consistência visual (monocromático).

## 🛠️ Ferramentas
- Skill: `uml-architect`
- Script: `compile_uml.py`
- Framework: `GSD`

## ✅ Critérios de Aceite (UAT)
- [ ] Todos os 15 UCs possuem arquivos `.puml` e `.png` correspondentes.
- [ ] Os READMEs mostram as imagens PNG geradas.
- [ ] O estilo visual segue o padrão `skinparam monochrome true`.
