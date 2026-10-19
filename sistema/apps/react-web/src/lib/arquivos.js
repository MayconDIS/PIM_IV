/** Dispara o download de um conteúdo gerado no navegador (porte de `baixarArquivo`). */
export function baixarArquivo(conteudo, nomeArquivo, tipoMime) {
  const blob = conteudo instanceof Blob ? conteudo : new Blob([conteudo], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 200);
}
