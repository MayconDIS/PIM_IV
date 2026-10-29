/** Atualiza apenas o prefixo visual das dicas antigas, sem alterar o conteúdo salvo. */
export function formatarDica(dica) {
  return (dica ?? '').replace(/^(?:AVA|ED) · ([1-4])º semestre · /, 'Módulo $1 · ');
}
