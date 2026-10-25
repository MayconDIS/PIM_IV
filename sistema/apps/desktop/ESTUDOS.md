# 📚 Estudos: a apresentação de P.A. em .NET

Guia para entender **o que o professor pede**, **o que fizemos** e **como explicar** cada parte na
apresentação de **27/10/2026**. Leia junto com os slides (`docs/apresentacao`) e o roteiro
(`docs/apresentacao/ROTEIRO_DO_PALESTRANTE.md`).

---

## 1. O que a atividade pede

A atividade *9 – Apresentação em GRUPO disciplina P.A. em DotNet* pede um projeto que mostre, **em
escala pequena, como construir uma aplicação desktop organizada**. O professor vai olhar quatro
coisas:

| Critério | Em uma frase | Onde está no nosso programa |
|---|---|---|
| **Orientação a objetos** | O código é feito de classes que guardam dados e regras juntos | `src/NexTI.Desktop.Dominio/Entidades` |
| **Arquitetura em camadas** | Cada parte cuida de uma coisa (tela, regra, banco) | As 4 pastas de `src/` |
| **Modularização** | Cada camada é um módulo separado, que pode ser trocado ou testado sozinho | Os 4 projetos `.csproj` |
| **Quatro diagramas UML** | Caso de uso, classe, sequência e atividade | `docs/diagramas` |

E três regras da apresentação:

1. **Todos do DevTime apresentam** (cerca de 2 minutos cada).
2. **O GitHub faz parte**: vamos mostrar o repositório, o Pull Request e os testes rodando.
3. **10 minutos** no total.

> **Por que um programa só para isso?** O Nex_TI de verdade (site, app e API) é grande demais para
> 10 minutos e não é desktop. Por isso fizemos o **Nex_TI Desktop**: pequeno, com o mesmo assunto
> (flashcards e SM-2), mas pensado para mostrar com clareza os quatro critérios.

---

## 2. O programa em 30 segundos

O aluno abre o programa, digita um **nickname**, vê a **trilha de 25 fases** (582 cartas sobre TI) e
estuda: vê a pergunta, mostra a resposta e escolhe **Errei, Difícil, Bom ou Fácil**. O **SM-2**
decide quando cada carta volta. Ao acertar todas as cartas da fase, ganha **XP e moedas** (só na
primeira vez) e libera a próxima fase. Tudo fica num banco **SQLite** no computador, sem internet.

- **Tecnologia:** C#, .NET 10, Windows Forms (telas), EF Core (acesso ao banco) e SQLite (banco num arquivo).
- **Testes:** 28 testes automáticos com xUnit.

---

## 3. Orientação a objetos (POO)

POO é organizar o programa em **objetos**: cada um tem **dados** (atributos) e **comportamentos**
(métodos). Os quatro pilares, com o nosso código:

### Herança: "é um"

Uma classe filha recebe tudo o que a classe mãe tem.

```csharp
public abstract class Usuario : Entidade { ... }   // Nickname, DataCriacao
public class Aluno : Usuario { ... }               // Aluno É UM Usuario, e ainda tem Xp e Moedas
```

📄 `src/NexTI.Desktop.Dominio/Entidades/Usuario.cs` e `Aluno.cs`

### Abstração e polimorfismo: "cada um responde do seu jeito"

`Usuario` é **abstrata**: não dá para criar "só um usuário". Ela obriga cada filha a dizer o próprio
perfil. Quem chama `usuario.Perfil` não precisa saber qual é a classe; cada uma responde a sua
(isso é **polimorfismo**).

```csharp
public abstract string Perfil { get; }        // em Usuario: só a "promessa"
public override string Perfil => "Aluno";     // em Aluno: a resposta
```

### Encapsulamento: "ninguém mexe direto"

O dado fica protegido e só muda por um método que conhece a regra. No Aluno, ninguém de fora
consegue escrever `aluno.Xp = 1000`:

```csharp
public int Xp { get; private set; }           // ler pode; mudar, só de dentro da classe

public bool ReceberPremio(string codigoFase, Premio premio)
{
    if (JaConcluiu(codigoFase)) return false;  // regra: o prêmio sai uma vez só
    ...
    Xp += premio.Xp;
}
```

Outro exemplo: o construtor de `Usuario` recusa nickname com menos de 3 ou mais de 20 letras.

### Interface: "um contrato"

A interface diz **o que** precisa ser feito; a classe diz **como**. A `Revisao` usa o contrato
`IAgendadorDeRevisao` e não sabe que por trás está o SM-2. Se um dia trocarmos o algoritmo, a
`Revisao` não muda.

```csharp
public interface IAgendadorDeRevisao { Agendamento Calcular(Agendamento atual, Resposta resposta); }
public class AgendadorSm2 : IAgendadorDeRevisao { ... }
```

📄 `src/NexTI.Desktop.Dominio/Regras/Regras.cs` e `AgendadorSm2.cs`

### Composição: "é dono de"

O Aluno **é dono** das fases que concluiu (`FaseConcluida`); a Fase **é dona** das cartas. Se o dono
some, as partes somem junto. No diagrama de classes é o **losango cheio**.

---

## 4. Arquitetura em camadas

Dividir o programa em camadas é separar **quem mostra**, **quem decide** e **quem guarda**. O livro
da disciplina chama isso de **separação de responsabilidades** (PERES, 2026, Unidade I).

| Camada | Cuida de | Exemplos |
|---|---|---|
| **Apresentação** | As telas: mostrar e receber cliques | `TelaEntrada`, `TelaPrincipal`, `TelaEstudo` |
| **Aplicação** | Os casos de uso: o que o aluno pode fazer | `ServicoDeAlunos`, `ServicoDeEstudo`, `SessaoDeEstudo` |
| **Domínio** | As regras e os conceitos do negócio | `Aluno`, `Fase`, `Revisao`, `AgendadorSm2` |
| **Infraestrutura** | Guardar e buscar no banco | `ContextoNexTI`, `RepositorioDeFases` |

**A regra de ouro:** cada camada só usa a de baixo, e o **Domínio não depende de ninguém**.

```text
Apresentação ──► Aplicação ──► Domínio ◄── Infraestrutura
```

**Exemplo para falar na apresentação:** quando o aluno clica em "Bom", a **tela** chama o
`ServicoDeEstudo` (**Aplicação**). O serviço usa a regra do SM-2 (**Domínio**) e pede para gravar.
Quem grava no SQLite é a **Infraestrutura**. A tela não sabe que existe banco, e o serviço não sabe
que é SQLite.

**Como a Aplicação grava sem conhecer o banco?** Pelas **interfaces** dos repositórios, que ficam no
Domínio (`IRepositorioDeFases`, `IUnidadeDeTrabalho`). A Infraestrutura implementa essas interfaces.
Quem junta tudo é o `Program.cs`: ele cria os objetos de verdade e entrega aos serviços pelo
construtor. Isso se chama **injeção de dependência**, outro assunto da Unidade I do livro.

**Por que vale a pena?**

- Dá para **testar** as regras sem abrir tela nenhuma (os 28 testes fazem isso).
- Dá para **trocar o banco** sem mexer nas regras (nos testes, o banco é um SQLite em memória).
- Fica fácil **achar** onde está cada coisa.

---

## 5. Modularização

Modularizar é dividir o sistema em **módulos independentes**. Aqui, cada camada é um **projeto
`.csproj` separado**, e as referências só apontam para baixo:

| Projeto | Referencia |
|---|---|
| `NexTI.Desktop.Apresentacao` | Aplicação e Infraestrutura (só para o `Program.cs` montar os objetos) |
| `NexTI.Desktop.Aplicacao` | Domínio |
| `NexTI.Desktop.Infraestrutura` | Domínio (e os pacotes do EF Core com SQLite) |
| `NexTI.Desktop.Dominio` | **nenhum** |
| `NexTI.Desktop.Testes` | Domínio, Aplicação e Infraestrutura |

**A diferença entre camada e módulo:** camada é a **ideia** (separar tela, regra e banco); módulo é
**como garantimos** a ideia. Como o Domínio é um projeto que não referencia nenhum outro, **o
compilador não deixa** uma regra usar uma tela ou o banco por engano.

---

## 6. Os quatro diagramas UML

Todos foram feitos no **Astah** (arquivo `docs/diagramas/Diagrams Nex_TI Desktop - PA DotNet.asta`),
e cada elemento tem a explicação no campo *Definition*. As imagens estão em `docs/diagramas`.

### Caso de uso: o que o usuário faz (`1-casos-de-uso.png`)

- **Boneco** = ator (o Aluno). **Elipse** = caso de uso (algo que ele faz). **Retângulo** = o sistema.
- Nossos casos: *Entrar com nickname*, *Ver painel e trilha*, *Estudar fase*, *Responder carta* e
  *Concluir fase*.
- **«include»**: sempre acontece junto. Estudar uma fase **sempre** inclui responder cartas.
- **«extend»**: acontece **só às vezes**. Concluir a fase só acontece quando a última carta é acertada.

### Classes: a estrutura do código (`2-classes-camadas.png` e `3-classes-dominio.png`)

- Cada **caixa** é uma classe: nome em cima, atributos no meio e métodos embaixo. Nome em
  *itálico* = classe abstrata; «interface» = interface.
- **Triângulo vazio com linha cheia** = herança (Aluno → Usuario).
- **Triângulo vazio com linha tracejada** = implementa a interface (AgendadorSm2 → IAgendadorDeRevisao).
- **Losango cheio** = composição (o Aluno é dono das FaseConcluida).
- **Seta tracejada aberta "usa"** = dependência (o serviço usa o repositório).
- **Números nas pontas** = multiplicidade: `1` e `0..*` querem dizer "um aluno tem zero ou muitas revisões".
- Temos dois: o de **camadas** (como o programa está dividido) e o do **domínio** (as entidades).

### Sequência: a ordem das mensagens (`4-sequencia.png`)

- Cada coluna é um **participante** (a tela, o serviço, a sessão, o SM-2...). O tempo corre **de cima
  para baixo**.
- **Seta cheia** = chamada de método. **Seta tracejada** = resposta. **Retângulo fino na linha** =
  o objeto está trabalhando (ativação).
- Nosso caso: o aluno responde a **última carta** → `Responder` → a sessão tira a carta da fila → o
  SM-2 calcula a próxima data → grava → `ConcluirFase` → o Aluno recebe o prêmio → grava → a tela
  mostra o resultado.

### Atividade: o passo a passo (`5-atividade.png`)

- **Bolinha preta** = início. **Bolinha com borda** = fim. **Retângulo arredondado** = ação.
  **Losango** = decisão (com a condição entre colchetes, como `[liberada]`).
- **Raias** (colunas) = quem faz cada passo: o Aluno e cada camada do programa.
- Nossas decisões: a fase está liberada? Ainda há cartas? É a primeira vez que conclui a fase?

> **Diferença rápida:** o **caso de uso** diz *o que* o usuário faz; a **atividade** diz *em que
> ordem* os passos acontecem; a **sequência** diz *quais objetos conversam* e em que ordem; o de
> **classes** diz *como o código é organizado*.

---

## 7. A ligação com a disciplina (livro-texto)

O livro da disciplina (PERES, 2026) ensina desenvolvimento web com .NET usando um exemplo chamado
**PetMatch**. O nosso programa é desktop, mas usa as mesmas ideias de .NET:

| Livro | O que ensina | Onde usamos |
|---|---|---|
| Unidade I | Separação de responsabilidades e injeção de dependência | As camadas e o `Program.cs`, que entrega as dependências pelo construtor |
| Unidade II | **EF Core com SQLite**: modelagem, `DbContext`, migrations, seed e `SaveChanges` | `ContextoNexTI` (o DbContext), a migration `Inicial`, o `SemeadorDeConteudo` (seed) e a `UnidadeDeTrabalho` (que chama `SaveChanges`) |
| Unidades III e IV | Front-end com React, login, observabilidade e publicação na nuvem | Não entram no desktop. Estão no Nex_TI web, que é o PIM, não esta atividade |

**Conceitos de banco que podem perguntar:**

- **EF Core:** biblioteca que transforma classes C# em tabelas, para não precisar escrever SQL na mão.
- **DbContext:** a classe que representa o banco; cada `DbSet` vira uma tabela. A nossa é a `ContextoNexTI`.
- **Migration:** o "histórico" das mudanças no banco. A `Inicial` cria as 5 tabelas (Fases,
  Flashcards, Usuarios, Revisoes e FasesConcluidas). O programa aplica as migrations sozinho ao abrir.
- **Seed (semente):** os dados iniciais. O nosso coloca as fases e as cartas do Nex_TI.
- **SQLite:** um banco que é só um arquivo, sem servidor. O nosso fica em `%LOCALAPPDATA%\NexTI.Desktop`.

---

## 8. Glossário rápido

| Termo | Em palavras simples |
|---|---|
| Classe | O "molde" de um objeto (ex.: `Aluno`) |
| Objeto | Uma coisa criada a partir do molde (ex.: o aluno "maycon") |
| Atributo / propriedade | Um dado do objeto (ex.: `Xp`) |
| Método | Algo que o objeto faz (ex.: `ReceberPremio`) |
| Construtor | O método que cria o objeto e confere se os dados são válidos |
| `private set` | Pode ler de fora, mas só a própria classe muda |
| `abstract` | Classe que não pode ser criada sozinha, só pelas filhas |
| Interface | Um contrato: diz o que fazer, não como |
| Repositório | Classe que busca e guarda um tipo de dado no banco |
| Unidade de trabalho | Grava de uma vez tudo o que mudou |
| Teste automático | Código que confere se outro código faz o certo |
| Pull Request | Pedido para juntar uma mudança à versão principal, com revisão e testes |
| GitHub Actions | Robô do GitHub que roda os testes a cada Pull Request |

---

## 9. Perguntas que o professor pode fazer

| Pergunta | Resposta curta |
|---|---|
| Onde está a herança? | `Aluno : Usuario`, em `Dominio/Entidades`. |
| Onde está o polimorfismo? | `Perfil` é abstrato em `Usuario` e cada filha responde o seu. |
| Onde está o encapsulamento? | `Xp` e `Moedas` têm `private set`; só `ReceberPremio` muda, e uma vez por fase. |
| Para que serve a interface? | Para a `Revisao` não depender do SM-2: dá para trocar o algoritmo sem mudar a `Revisao`. |
| Por que camadas? | Cada parte cuida de uma coisa: dá para testar as regras sem tela e trocar o banco sem mexer nelas. |
| Qual a diferença entre camada e módulo? | Camada é a separação por responsabilidade; módulo é o projeto `.csproj` que garante essa separação. |
| Por que o Domínio não depende de ninguém? | Porque ali estão as regras do negócio; elas não podem quebrar se a tela ou o banco mudarem. |
| Quem liga as camadas? | O `Program.cs`, que cria os repositórios e entrega aos serviços pelo construtor (injeção de dependência). |
| O que é «include» e «extend»? | Include acontece sempre (estudar inclui responder); extend só às vezes (concluir, quando acaba). |
| O que é uma migration? | O histórico das mudanças no banco; a `Inicial` cria as tabelas. |
| Como sabem que funciona? | 28 testes automáticos, rodados no GitHub a cada Pull Request. |
| Por que SQLite? | O banco é um arquivo no computador, sem servidor; é o que o livro usa no PetMatch. |

---

## 10. Checklist para o ensaio

- [ ] Cada um sabe os próprios slides e o tempo (veja o roteiro).
- [ ] O Maycon testou a demonstração no Antigravity: `Ctrl+Shift+P` → **Tasks: Run Task** →
      **Desktop: começar do zero** e depois **Desktop: abrir o programa**.
- [ ] O PDF dos slides abre em tela cheia.
- [ ] A aba do GitHub está aberta no Pull Request #33 e na aba **Actions**.
- [ ] Ensaio cronometrado: até 10 minutos.
- [ ] Enviar no AVA até **26/10, 23:59**.

---

## Onde está cada coisa

| O quê | Caminho (dentro de `sistema/apps/desktop`) |
|---|---|
| Slides, PDF e roteiro | `docs/apresentacao/` |
| Diagramas (imagens e `.asta`) | `docs/diagramas/` |
| Fotos das telas | `docs/telas/` |
| Código, uma pasta por camada | `src/` |
| Testes | `tests/NexTI.Desktop.Testes/` |
| Como rodar e abrir no Antigravity | `README.md` |

## Referência

PERES, Tarcísio de Souza. *Desenvolvimento web com .NET*. São Paulo: Editora Sol, 2026.
