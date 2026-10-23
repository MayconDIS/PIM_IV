# Gerador do `Diagrams Nex_TI - PIM IV.asta`

O `GerarDiagramasPimIV.java` monta, pela API do Astah, o arquivo com os diagramas do
código atual do PIM IV. O `Diagrams Nex_TI.asta` (PIM III) continua como estava, como
referência.

| Diagrama | O que mostra |
|---|---|
| 1. Casos de Uso | Aluno, Tutor e Administrador (cada um herda do anterior) e o que cada perfil faz |
| 2. Classes – entidades | As classes de `sistema/apps/api/Models`, com atributos, herança e multiplicidades |
| 3. Classes – camadas da API | Endpoints → interfaces dos serviços → classes → `AppDbContext` |
| 4. Atividade | A sessão de estudo, com raias para Aluno, site/app, API e banco |

O MER e os modelos lógico e físico ficam em PlantUML (`../../04_Banco_de_Dados`): o
Astah UML não tem diagrama entidade-relacionamento (só o Astah Professional tem).

## Como gerar de novo

A API do Astah 10.1 precisa de Java 21; o próprio Astah já traz um. No PowerShell:

```powershell
$A = "C:\Program Files\astah-uml"
& "$A\jre\bin\java.exe" -cp "$A\astah-uml.jar;$A\astah-api.jar;$A\lib\*" `
  GerarDiagramasPimIV.java "..\Diagrams Nex_TI - PIM IV.asta" "..\Diagrams Nex_TI.asta"
```

O segundo arquivo é só uma base: com a licença acadêmica, a API não salva um projeto
criado do zero, mas salva um arquivo aberto. O gerador copia a base, apaga todo o
conteúdo da cópia e monta os diagramas nela. A base não é alterada.

## Imagens

A linha de comando do Astah (`astah-command -image`) para na verificação de licença.
Para gerar os PNGs, abra o `.asta` no Astah e use *Ferramentas → Exportar imagem*.
Ao abrir, vale arrastar as linhas que se cruzarem: a API posiciona as caixas, mas o
traçado das linhas fica com o Astah.
