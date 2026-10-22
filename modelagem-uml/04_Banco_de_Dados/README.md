# Banco de Dados do Nex_TI (Etapa 7)

O que o Manual do PIM IV pede na Etapa 7 e onde está cada coisa.

| Pedido | Onde está |
|---|---|
| MER | [`MER Nex_TI.png`](MER%20Nex_TI.png) (notação de Chen) |
| Modelo lógico | [`Modelo Logico Nex_TI.png`](Modelo%20Logico%20Nex_TI.png) |
| Modelo físico | [`Modelo Fisico Nex_TI.png`](Modelo%20Fisico%20Nex_TI.png) |
| Procedures e triggers | No script e na migration `ObjetosDoBanco` (lista abaixo) |
| Script completo | [`sistema/database/NexTI_DB.sql`](../../sistema/database/NexTI_DB.sql): estrutura, objetos e todos os dados |

O banco que a API usa é o mesmo do script: quando a API sobe, ela aplica as
migrations (`sistema/apps/api/Data/Migrations`) e cria tudo isso sozinha.

## Objetos do banco

| Tipo | Nome | O que faz |
|---|---|---|
| Trigger | `tg_progresso_historico` | Toda resposta do aluno a uma carta vira uma linha em `tb_historico_revisoes`. |
| Trigger | `tg_usuarios_protege_gamificacao` | Impede que XP ou nível diminuam, mesmo num `UPDATE` feito fora da API. |
| Função | `fn_nivel_por_xp(@xp)` | O nível pelo XP, com a mesma regra do site: 100 → 3, 300 → 6. |
| Função | `fn_cartas_devidas(@usuario_id, @data)` | As cartas que o aluno precisa revisar até a data. |
| View | `vw_ranking_alunos` | Ranking dos alunos por XP. |
| View | `vw_desempenho_por_fase` | Por fase: total de cartas, alunos estudando e facilidade média. |
| Procedure | `sp_ranking_alunos @top` | Os N primeiros do ranking. |
| Procedure | `sp_estatisticas_aluno @username` | Os mesmos números da rota `/stats-detalhadas`. |
| Procedure | `sp_cadastrar_flashcard` | Cadastra uma carta com as regras do sistema (fase precisa existir, frente e verso obrigatórios). |
| Procedure | `sp_historico_revisoes @username` | As últimas revisões do aluno. |

## Para testar no SQL Server

```sql
USE NexTI_DB;
EXEC sp_ranking_alunos 5;
EXEC sp_estatisticas_aluno 'seu_usuario';
SELECT dbo.fn_nivel_por_xp(150);                 -- 3
SELECT * FROM vw_desempenho_por_fase;
EXEC sp_cadastrar_flashcard 'fase1', N'Pergunta', N'Resposta';
EXEC sp_cadastrar_flashcard 'nao_existe', N'a', N'b';   -- erro 50004: fase não encontrada
UPDATE usuarios SET xp = 0 WHERE username = 'seu_usuario'; -- erro 50001: o trigger bloqueia
```
