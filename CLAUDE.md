@AGENTS.md
@sistema/AGENTS.md
@modelagem-uml/AGENTS.md
@relatorio/AGENTS.md

## Para o Claude Code

As regras ficam nos `AGENTS.md` (o da raiz e o de cada pasta, importados acima). O Codex lê os
mesmos arquivos, então regra nova vai no `AGENTS.md` e as duas IAs passam a ver a mesma coisa.

- Os papéis do time estão em `.claude/agents/`. Use o `coordenador` quando um pedido mexer em mais
  de uma pasta (`sistema`, `modelagem-uml`, `relatorio`).
- Antes de dizer que terminou, rode `node scripts/verificar-sincronia.mjs` e os testes da parte que
  mudou, e conte o resultado.
