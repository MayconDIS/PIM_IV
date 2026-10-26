import { ApiService, resultadoDoDiagnostico, VERSAO_DIAGNOSTICO } from '@nexti/shared';
import { preservarFasesLiberadas } from '@nexti/shared/gamificacao';

// Envios da mesma conta são sequenciais. A tentativa mais nova também prevalece na memória.
const estadosPorArmazenamento = new WeakMap();
let sequencia = 0;

export function lerDiagnosticoLocal(userKey, sufixo = 'diagnostico', storage = localStorage) {
  try { return JSON.parse(storage.getItem(userKey + sufixo) || 'null'); } catch { return null; }
}

export function guardarDiagnosticoLocal(userKey, valor, sufixo = 'diagnostico', storage = localStorage) {
  try {
    if (valor === null) storage.removeItem(userKey + sufixo);
    else storage.setItem(userKey + sufixo, JSON.stringify(valor));
    return true;
  } catch { return false; }
}

function estadoDaConta(userKey, storage) {
  let contas = estadosPorArmazenamento.get(storage);
  if (!contas) { contas = new Map(); estadosPorArmazenamento.set(storage, contas); }
  if (!contas.has(userKey)) contas.set(userKey, { fila: Promise.resolve(), pendente: null, resultado: null, persistido: false });
  return contas.get(userKey);
}

function enfileirar(estado, tarefa) {
  const envio = estado.fila.then(tarefa, tarefa);
  estado.fila = envio.catch(() => {});
  return envio;
}

function aindaAtual(userKey, storage, estado, pendente) {
  if (estado.pendente !== pendente) return false;
  // Uma outra aba também pode substituir a tentativa persistida enquanto a requisição viaja.
  return !estado.persistido || JSON.stringify(lerDiagnosticoLocal(userKey, 'diagnostico_pendente', storage)) === JSON.stringify(pendente);
}

function resultadoAtual(userKey, storage, estado) {
  const disco = lerDiagnosticoLocal(userKey, 'diagnostico_pendente', storage);
  if (estado.persistido && disco && disco.tentativaId !== estado.pendente?.tentativaId) {
    return lerDiagnosticoLocal(userKey, 'diagnostico', storage) ?? estado.resultado;
  }
  return estado.resultado ?? lerDiagnosticoLocal(userKey, 'diagnostico', storage);
}

async function enviarTentativa(userKey, storage, estado, pendente, enviar) {
  return enfileirar(estado, async () => {
    if (!aindaAtual(userKey, storage, estado, pendente)) return resultadoAtual(userKey, storage, estado);
    let remoto;
    try { remoto = await enviar(pendente.respostas); }
    catch (erro) {
      if (!aindaAtual(userKey, storage, estado, pendente)) return resultadoAtual(userKey, storage, estado);
      throw erro;
    }
    if (!aindaAtual(userKey, storage, estado, pendente)) return resultadoAtual(userKey, storage, estado);
    const confirmado = { ...remoto, tentativaId: pendente.tentativaId, sincronizacao: 'salvo' };
    estado.resultado = confirmado;
    guardarDiagnosticoLocal(userKey, confirmado, 'diagnostico', storage);
    guardarDiagnosticoLocal(userKey, null, 'diagnostico_pendente', storage);
    estado.pendente = null;
    return confirmado;
  });
}

/** Guarda antes de enviar: uma falha de rede não perde as respostas do aluno. */
export async function concluirDiagnosticoLocal({ userKey, respostas, anteriores = [], temConta, online,
  enviar = ApiService.salvarDiagnostico, storage = localStorage }) {
  const calculado = resultadoDoDiagnostico(respostas);
  const estado = estadoDaConta(userKey, storage);
  const tentativaId = `${Date.now()}-${++sequencia}-${Math.random().toString(36).slice(2)}`;
  const resultado = { ...calculado, tentativaId, realizadoEm: new Date().toISOString(),
    fasesLiberadas: preservarFasesLiberadas([...anteriores, ...calculado.fases]),
    sincronizacao: temConta ? 'pendente' : 'local' };
  const pendente = temConta ? { tentativaId, versao: VERSAO_DIAGNOSTICO, respostas: structuredClone(respostas) } : null;
  estado.resultado = resultado;
  estado.pendente = pendente;
  const salvo = guardarDiagnosticoLocal(userKey, resultado, 'diagnostico', storage);
  estado.persistido = guardarDiagnosticoLocal(userKey, pendente, 'diagnostico_pendente', storage);
  if (!salvo || (temConta && !estado.persistido)) resultado.sincronizacao = 'sessao';
  guardarDiagnosticoLocal(userKey, resultado, 'diagnostico', storage);
  // O rascunho concluído é removido antes da rede. A resposta não pode apagar um rascunho novo.
  guardarDiagnosticoLocal(userKey, null, 'diagnostico_rascunho', storage);
  if (temConta && online) {
    try { return await enviarTentativa(userKey, storage, estado, pendente, enviar); }
    catch (erro) {
      if (!aindaAtual(userKey, storage, estado, pendente)) return resultadoAtual(userKey, storage, estado);
      resultado.aviso = erro.message;
      guardarDiagnosticoLocal(userKey, resultado, 'diagnostico', storage);
    }
  }
  return resultado;
}

/** Reenvia somente esta conta; mantém respostas em memória se a cota local estiver cheia. */
export async function reenviarDiagnostico(userKey, enviar = ApiService.salvarDiagnostico, storage = localStorage) {
  const estado = estadoDaConta(userKey, storage);
  const disco = lerDiagnosticoLocal(userKey, 'diagnostico_pendente', storage);
  if (!estado.pendente || (estado.persistido && disco && disco.tentativaId !== estado.pendente.tentativaId)) {
    estado.pendente = disco;
    estado.persistido = Boolean(disco);
    estado.resultado = lerDiagnosticoLocal(userKey, 'diagnostico', storage) ?? estado.resultado;
  }
  const pendente = estado.pendente;
  if (!pendente) return null;
  if (pendente.versao !== VERSAO_DIAGNOSTICO) throw new Error('Refaça o diagnóstico para usar a versão atual.');
  resultadoDoDiagnostico(pendente.respostas);
  return enviarTentativa(userKey, storage, estado, pendente, enviar);
}
