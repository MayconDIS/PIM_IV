/**
 * Cliente da API do Nex_TI para o app. As mesmas rotas que o site usa.
 *
 * Erros:
 * - ErroDeRede: sem internet ou API fora do ar (a resposta pode ir para a fila);
 * - ErroDaApi: a API respondeu com erro; `status` 401 = sessão expirada.
 */

export class ErroDeRede extends Error {}

export class ErroDaApi extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

export function criarApi({ baseUrl, obterToken = () => null, fetchFn = globalThis.fetch }) {
  async function requisicao(metodo, rota, corpo) {
    const token = await obterToken();
    let resposta;
    try {
      resposta = await fetchFn(`${baseUrl}${rota}`, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
      });
    } catch {
      throw new ErroDeRede('Sem conexão com o servidor. Confira a internet e tente de novo.');
    }

    const texto = await resposta.text();
    let dados = null;
    try {
      dados = texto ? JSON.parse(texto) : null;
    } catch {
      // página de erro do servidor (HTML): fica só o status
    }
    if (!resposta.ok) {
      const padrao = resposta.status === 401 ? 'Sessão expirada. Entre de novo.'
        : resposta.status === 429 ? 'Muitas tentativas seguidas. Aguarde um minuto.'
        : `Erro ${resposta.status} no servidor.`;
      throw new ErroDaApi(resposta.status, dados?.message || padrao);
    }
    return dados;
  }

  return {
    async entrar(usuarioOuEmail, senha) {
      try {
        return await requisicao('POST', '/auth/login', { username: usuarioOuEmail, password: senha });
      } catch (erro) {
        if (erro instanceof ErroDaApi && erro.status === 401) throw new ErroDaApi(401, 'Usuário ou senha incorretos.');
        throw erro;
      }
    },
    cadastrar: (username, email, senha) => requisicao('POST', '/auth/register', { username, email, password: senha }),
    perfil: (username) => requisicao('GET', `/usuarios/${encodeURIComponent(username)}`),
    estatisticas: (username) => requisicao('GET', `/usuarios/${encodeURIComponent(username)}/stats-detalhadas`),
    flashcards: (codigoFase) => requisicao('GET', `/fases/${encodeURIComponent(codigoFase)}/flashcards`),
    progresso: () => requisicao('GET', '/progresso/usuario'),
    registrarResposta: (flashcardId, qualidade) =>
      requisicao('POST', '/progresso/atualizar', { usuarioId: 0, flashcardId, qualidade }),
    atualizarStats: (xp, moedas, nivel) => requisicao('PUT', '/usuarios/stats', { xp, moedas, nivel }),
    concluirFase: (faseId, acertos = 0, total = 0) => requisicao('POST', '/progresso/concluir-fase', { faseId, acertos, total }),
  };
}
