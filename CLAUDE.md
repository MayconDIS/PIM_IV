@AGENTS.md

## Para o Claude Code

- Os papéis do time estão em `.claude/agents/`. Use o `coordenador` quando um pedido mexer em mais
  de uma pasta (`sistema`, `modelagem-uml`, `relatorio`).
- Responda em português, em linguagem simples.
- Antes de dizer que terminou, rode `node scripts/verificar-sincronia.mjs` e os testes da parte que
  mudou, e conte o resultado.
