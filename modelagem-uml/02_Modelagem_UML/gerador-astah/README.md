# Gerador do `Diagrams Nex_TI - PIM IV.asta`

O `GerarDiagramasPimIV.java` monta, pela API do Astah, o arquivo com a modelagem do PIM IV:
o PIM III melhorado. São 38 diagramas:

| Diagrama | O que mostra |
|---|---|
| 1. Casos de Uso | Os 15 casos de uso do PIM III com os mesmos nomes, mais 2 novos; os não implementados ficam «planejado» |
| 2. Classes – entidades | As classes de `sistema/apps/api/Models`, com atributos, herança e multiplicidades |
| 3. Classes – camadas da API | Endpoints → interfaces dos serviços → classes → `AppDbContext` |
| 4. Atividade | A sessão de estudo, com raias para Aluno, site/app, API e banco |
| 5. MER | Entidades e relacionamentos do negócio, com cardinalidade |
| 6. DER | As tabelas do SQL Server com tipos, PK, FK e cardinalidade |
| Casos de uso/… | Para **cada um dos 17 casos de uso**, um diagrama de classes e um de sequência. Os 15 implementados saem do código; os 2 «planejado» mostram o que o PIM III previa |

Todo elemento de todo diagrama tem a explicação no campo **Definition**: classes, atributos,
operações, casos de uso, atores, linhas de vida, mensagens, ações, fluxos, relações e os próprios
diagramas (925 elementos, conferidos um a um).

Nos diagramas de classes (incluindo MER e DER) as caixas não se sobrepõem e as linhas são em
ângulo reto (retas ou em L), escolhidas para não passar por cima de outras caixas. Em cada caso
de uso as classes ficam em camadas, de cima para baixo: tela → API → serviço → entidade. A comparação caso a caso com o PIM III está em
[`../RASTREABILIDADE_PIM3_PIM4.md`](../RASTREABILIDADE_PIM3_PIM4.md).

As imagens da pasta de cima (`*.png`) saem dos `.puml` do PlantUML. O Astah UML não tem o
diagrama entidade-relacionamento próprio (só o Astah Professional), então o MER e o DER aqui são
diagramas de classes com «entidade» e «tabela». As imagens em notação de Chen (MER) e pé de
galinha (DER), e os modelos lógico e físico, ficam em `../../04_Banco_de_Dados`.

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
