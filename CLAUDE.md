@GEMINI.md
@sistema/GEMINI.md
@modelagem-uml/GEMINI.md
@relatorio/GEMINI.md

## Para o Claude Code

O Claude lê os mesmos arquivos do Gemini: o `GEMINI.md` da raiz e o de cada pasta (importados
acima), que por sua vez importam o `AGENTS.md` de cada lugar. Mudou uma regra? Mude o `AGENTS.md`;
o Claude e o Gemini passam a ver a mesma coisa.

- Os papéis do time estão em `.claude/agents/`. Use o `coordenador` quando um pedido mexer em mais
  de uma pasta (`sistema`, `modelagem-uml`, `relatorio`).
- Antes de dizer que terminou, rode `node scripts/verificar-sincronia.mjs` e os testes da parte que
  mudou, e conte o resultado.
