# Gerador do `Diagrams Nex_TI - PIM IV.asta`

O `GerarDiagramasPimIV.java` monta, pela API do Astah, o arquivo com a modelagem do PIM IV:
o PIM III melhorado. São 34 diagramas:

| Diagrama | O que mostra |
|---|---|
| 1. Casos de Uso | Os 15 casos de uso do PIM III com os mesmos nomes, mais 2 novos; os não implementados ficam «planejado» |
| 2. Classes – entidades | As classes de `sistema/apps/api/Models`, com atributos, herança e multiplicidades |
| 3. Classes – camadas da API | Endpoints → interfaces dos serviços → classes → `AppDbContext` |
| 4. Atividade | A sessão de estudo, com raias para Aluno, site/app, API e banco |
| Casos de uso/… | Para cada caso de uso implementado, um diagrama de classes e um de sequência, tirados do código |

Todo elemento (classe, interface, ator, caso de uso, pacote e diagrama) tem a explicação no
campo **Definition**. A comparação caso a caso com o PIM III está em
[`../RASTREABILIDADE_PIM3_PIM4.md`](../RASTREABILIDADE_PIM3_PIM4.md).

As imagens da pasta de cima (`*.png`) saem dos `.puml` do PlantUML. O MER e os modelos lógico
e físico ficam em `../../04_Banco_de_Dados`: o Astah UML não tem diagrama entidade-relacionamento.

## Como gerar de novo

A API do Astah 10.1 precisa de Java 21; o próprio Astah já traz um. No PowerShell, nesta pasta:

```powershell
$A = "C:\Program Files\astah-uml"
& "$A\jre\bin\java.exe" -cp "$A\astah-uml.jar;$A\astah-api.jar;$A\lib\*" `
  GerarDiagramasPimIV.java "..\Diagrams Nex_TI - PIM IV.asta"
```

Com a licença acadêmica, a API não salva um projeto criado do zero, mas salva um
arquivo aberto. Por isso o gerador abre o próprio `.asta`, apaga todo o conteúdo e
monta os diagramas de novo. Se o arquivo não existir, passe um `.asta` qualquer como
segundo argumento: ele é copiado e usado só como base, sem ser alterado.

## Imagens

A linha de comando do Astah (`astah-command -image`) para na verificação de licença.
Para exportar do Astah, abra o `.asta` e use *Ferramentas → Exportar imagem*. Vale
arrastar as linhas que se cruzarem: a API posiciona as caixas, mas o traçado fica com
o Astah.
