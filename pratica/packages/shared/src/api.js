/**
 * Cliente HTTP da API C# do Nex_TI. A URL vem de globalThis.NEXTI_API_URL
 * (definida pelo app a partir de VITE_API_URL) ou de localhost.
 */

// ==========================================
// SERVIÇO DE INTEGRAÇÃO COM A API (FETCH) — Nex_TI
// ==========================================

const API_CANDIDATE_URLS = [
    'http://localhost:5000/api',
    'https://localhost:5001/api',
    'http://127.0.0.1:5000/api',
    'https://127.0.0.1:5001/api'
];

// Em produção a página define window.NEXTI_API_URL (ex.: https://nexti-api.azurewebsites.net/api).
// Lido sob demanda para valer mesmo quando definido depois do carregamento deste arquivo.
function apiConfigurada() {
    const url = typeof globalThis !== 'undefined' ? globalThis.NEXTI_API_URL : null;
    return url ? String(url).replace(/\/+$/, '') : null;
}

let apiDetectada = null;
const baseAtual = () => apiDetectada || apiConfigurada() || 'http://localhost:5000/api';

// POST de login/cadastro. Falha de rede vira uma frase que a tela pode mostrar
// (o "Failed to fetch" do navegador não diz nada a quem está tentando entrar).
async function requisicaoDeAutenticacao(rota, corpo) {
    try {
        return await fetch(`${baseAtual()}/auth/${rota}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(corpo)
        });
    } catch (erro) {
        console.error(`[auth] ${rota}: servidor inacessível`, { motivo: erro?.message });
        throw new Error('Servidor indisponível. Tente de novo em instantes — ele pode estar acordando.');
    }
}

function mensagemDeErroDeAutenticacao(status, mensagemDoServidor, padrao) {
    if (status === 429) return 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.';
    if (status === 401) return 'Usuário ou senha incorretos.';
    return mensagemDoServidor || padrao;
}

const ApiService = {
    getBaseUrl: () => baseAtual(),

    // 1. Verifica se a API está online e detecta a porta ativa
    checkStatus: async () => {
        const configurada = apiConfigurada();
        const candidatas = configurada ? [configurada] : API_CANDIDATE_URLS;
        // planos gratuitos (App Service F1 + Azure SQL serverless) podem levar ~1 min para acordar
        const limiteMs = configurada ? 60000 : 1200;
        for (const candidate of candidatas) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), limiteMs);
                const response = await fetch(`${candidate}/status`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (response.ok) {
                    apiDetectada = candidate;
                    return true;
                }
            } catch (e) {
                // Tenta próxima URL candidata
            }
        }
        return false;
    },

    // 2. Autenticação: Login
    login: async (username, password) => {
        const response = await requisicaoDeAutenticacao('login', { username, password });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(mensagemDeErroDeAutenticacao(response.status, errData.message, 'Usuário ou senha incorretos.'));
        }
        return await response.json();
    },

    // 3. Autenticação: Registro
    register: async (username, email, password) => {
        const response = await requisicaoDeAutenticacao('register', { username, email, password });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(mensagemDeErroDeAutenticacao(response.status, data.message, 'Não foi possível criar a conta.'));
        }
        return await response.json();
    },

    // 4. Busca o Usuário no Banco de Dados
    getUsuario: async (username) => {
        try {
            const response = await fetch(`${baseAtual()}/usuarios/${encodeURIComponent(username)}`);
            if (!response.ok) throw new Error("Usuário não encontrado");
            return await response.json();
        } catch (error) {
            console.error("Erro ao consultar usuário:", error);
            return null;
        }
    },

    // 4.1 Busca estatísticas detalhadas do usuário
    getEstatisticasDetalhadas: async (username) => {
        try {
            const response = await fetch(`${baseAtual()}/usuarios/${encodeURIComponent(username)}/stats-detalhadas`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar estatísticas detalhadas:", error);
            return null;
        }
    },

    // 5. Busca todas as Fases cadastradas
    getFases: async () => {
        try {
            const response = await fetch(`${baseAtual()}/fases`);
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar fases:", error);
            return [];
        }
    },

    // 6. Busca os Flashcards de uma Fase específica
    getFlashcardsPorFase: async (codigoFase) => {
        try {
            const response = await fetch(`${baseAtual()}/fases/${encodeURIComponent(codigoFase)}/flashcards`);
            if (!response.ok) throw new Error("Flashcards não encontrados");
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar flashcards da fase:", error);
            return [];
        }
    },

    // 7. Cria um novo flashcard no servidor
    criarFlashcard: async (codigoFase, frente, verso, dica) => {
        const token = localStorage.getItem('quest_jwt_token');
        try {
            const response = await fetch(`${baseAtual()}/flashcards`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ codigoFase, frente, verso, dica })
            });
            if (!response.ok) throw new Error("Erro ao salvar flashcard no servidor.");
            return await response.json();
        } catch (error) {
            console.error("Erro ao criar flashcard via API:", error);
            throw error;
        }
    },

    // 8. Busca o progresso SM-2 completo do usuário
    getProgressoUsuario: async () => {
        const token = localStorage.getItem('quest_jwt_token');
        if (!token) return [];
        try {
            const response = await fetch(`${baseAtual()}/progresso/usuario`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar progresso do usuário:", error);
            return [];
        }
    },

    // 9. Atualiza o progresso SM-2 no servidor
    atualizarProgresso: async (usuarioId, flashcardId, qualidade) => {
        const token = localStorage.getItem('quest_jwt_token');
        try {
            const response = await fetch(`${baseAtual()}/progresso/atualizar`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ usuarioId, flashcardId, qualidade })
            });
            if (!response.ok) throw new Error("Sessão expirada ou erro no servidor");
            return await response.json();
        } catch (error) {
            console.error("Erro ao atualizar progresso:", error);
            throw error;
        }
    },

    // 10. Atualiza estatísticas do usuário (XP, Moedas, Nível)
    updateUserStats: async (xp, moedas, nivel) => {
        const token = localStorage.getItem('quest_jwt_token');
        try {
            const response = await fetch(`${baseAtual()}/usuarios/stats`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ xp, moedas, nivel })
            });
            if (!response.ok) throw new Error("Erro ao atualizar estatísticas no servidor");
            return await response.json();
        } catch (error) {
            console.error("Erro ao atualizar estatísticas:", error);
            throw error;
        }
    },

    // 11. Busca todas as questões de simulados ENADE (UML)
    getSimuladoQuestoes: async () => {
        try {
            const response = await fetch(`${baseAtual()}/simulados/questoes`);
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar questões de simulado:", error);
            return [];
        }
    },

    // 12. Resumo de estatísticas globais
    getEstatisticasResumo: async () => {
        try {
            const response = await fetch(`${baseAtual()}/estatisticas/resumo`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar resumo de estatísticas:", error);
            return null;
        }
    },

    // 13. Download do Certificado em PDF
    baixarCertificadoPDF: async (nome, data, codigo) => {
        const url = `${baseAtual()}/certificado/pdf?nome=${encodeURIComponent(nome)}&data=${encodeURIComponent(data)}&codigo=${encodeURIComponent(codigo)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao gerar certificado PDF no servidor.");
        return await response.blob();
    }
};

if (typeof window !== 'undefined') window.ApiService = ApiService;

export { ApiService };
export default ApiService;
