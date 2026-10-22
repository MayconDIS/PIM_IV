// Lista explícita evita apagar/exportar outra conta cujo nickname tenha o mesmo prefixo.
const SUFIXOS = ['xp', 'coins', 'nivelado', 'desbloqueadas', 'bonus_unlocked', 'decks', 'rank',
  'srs', 'map_state', 'avatar_custom', 'certificado_unlocked', 'active_state'];

export function dadosLocaisDaConta(username, storage = localStorage) {
  return Object.fromEntries(SUFIXOS.map((s) => [s, storage.getItem(`quest_${username}_${s}`)])
    .filter(([, valor]) => valor !== null));
}

export function encerrarSessaoDaConta(username, excluir = false, storage = localStorage) {
  if (excluir) SUFIXOS.forEach((s) => storage.removeItem(`quest_${username}_${s}`));
  ['quest_user_name', 'quest_user_id', 'quest_user_perfil', 'quest_jwt_token'].forEach((s) => storage.removeItem(s));
}

export function baixarDadosDaConta(dados, username) {
  const documento = { ...dados, dadosLocaisDesteNavegador: dadosLocaisDaConta(username) };
  const url = URL.createObjectURL(new Blob([JSON.stringify(documento, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nex-ti-minha-conta.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
