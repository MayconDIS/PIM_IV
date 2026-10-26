# Gerador do `Diagrams Nex_TI - PIM IV.asta`

O `GerarDiagramasPimIV.java` monta, pela API do Astah, o arquivo com a modelagem do Nex_TI.
São 39 diagramas:

| Diagrama | O que mostra |
|---|---|
| 1. Casos de Uso | Os 16 casos de uso do Nex_TI, por perfil |
| 2. Classes – entidades | As classes de `sistema/apps/api/Models`, com atributos, herança e multiplicidades |
| 3. Classes – camadas da API | Endpoints → interfaces dos serviços → classes → `AppDbContext` |
| 4. Atividade | A sessão de estudo, com raias para Aluno, site/app, API e banco |
| 5. MER | Entidades e relacionamentos do negócio, com cardinalidade |
| 6. DER – modelo lógico | As tabelas com colunas, PK, FK e cardinalidade, com tipos genéricos |
| 7. Modelo físico | As mesmas tabelas com os tipos do SQL Server |
| Casos de uso/… | Para **cada um dos 16 casos de uso**, um diagrama de classes e um de sequência, tirados do código |

Todo elemento de todo diagrama tem a explicação no campo **Definition**: classes, atributos,
operações, casos de uso, atores, linhas de vida, mensagens, ações, fluxos, relações e os próprios
diagramas (todos conferidos um a um).

Nos diagramas de classes (incluindo MER e DER) as caixas não se sobrepõem e as linhas são em
ângulo reto (retas ou em L), escolhidas para não passar por cima de outras caixas. Em cada caso
de uso as classes ficam em camadas, de cima para baixo: tela → API → serviço → entidade.
No assistente local, a sequência é tela → busca no navegador → material canônico, sem API.

Todos os diagramas do projeto saem daqui. As imagens principais da pasta de cima e as de
`../../04_Banco_de_Dados` são cópias das exportadas para `../imagens-astah`. O Astah UML não tem
diagrama entidade-relacionamento próprio, então o MER, o DER e o modelo físico são diagramas de
classes com «entidade» e «tabela».

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

## Nex_TI Desktop (apresentação de P.A. em .NET)

O `GerarDiagramasDesktop.java` monta o `Diagrams Nex_TI Desktop - PA DotNet.asta`, que fica com o
programa, em [`sistema/apps/desktop/docs/diagramas`](../../../sistema/apps/desktop/docs/diagramas), com os quatro
diagramas pedidos na apresentação de P.A. em .NET, tirados do programa em
[`sistema/apps/desktop`](../../../sistema/apps/desktop):

| Diagrama | O que mostra |
|---|---|
| 1. Casos de Uso | Entrar com nickname, ver painel e trilha, estudar fase («include» responder carta, «extend» concluir fase) |
| 2. Classes – camadas | Telas → serviços → interfaces do domínio ← implementações com EF Core e SQLite |
| 3. Classes – domínio | Herança (Aluno é um Usuario), composição, associações com multiplicidade e a interface do SM-2 |
| 4. Sequência | O aluno responde a última carta e conclui a fase |
| 5. Atividade | A sessão de estudo inteira, com uma raia para o aluno e uma para cada camada |

Gera e exporta do mesmo jeito (na primeira vez, passe um `.asta` qualquer como base):

```powershell
$A = "C:\Program Files\astah-uml"
& "$A\jre\bin\java.exe" -cp "$A\astah-uml.jar;$A\astah-api.jar;$A\lib\*" `
  GerarDiagramasDesktop.java "..\..\..\sistema\apps\desktop\docs\diagramas\Diagrams Nex_TI Desktop - PA DotNet.asta"
```

Exporte com o `ExportarImagens.java` para `sistema/apps/desktop/docs/diagramas/exportadas-astah`; as
cópias com nomes curtos, usadas no README e nos slides, ficam na própria `docs/diagramas`.
