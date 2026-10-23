# Gerador do `Diagrams Nex_TI - PIM IV.asta`

O `GerarDiagramasPimIV.java` monta, pela API do Astah, o arquivo com a modelagem do PIM IV:
o PIM III melhorado. São 40 diagramas:

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

As imagens de todos os diagramas do `.asta` ficam em [`../imagens-astah`](../imagens-astah),
uma pasta por pacote (casos de uso, banco de dados, camadas, entidades). Para gerar de novo,
no PowerShell, a partir da pasta do Astah (ele procura a licença ali):

```powershell
$A = "C:\Program Files\astah-uml"; $P = "<caminho desta pasta>"
cd $A
& "$A\jre\bin\java.exe" "-Djava.library.path=lib\rlm" -cp "$A\astah-uml.jar;$A\astah-api.jar;$A\lib\*" `
  "$P\ExportarImagens.java" "$P\..\Diagrams Nex_TI - PIM IV.asta" "$P\..\imagens-astah"
```

A exportação da API só funciona com o Astah aberto, então o `ExportarImagens.java` abre a
janela do Astah, espera o projeto carregar, exporta e fecha sozinho. A linha de comando do
Astah (`astah-command -image`) não serve: ela para na verificação da licença acadêmica.
