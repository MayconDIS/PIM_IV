// ==========================================
// SERVIÇO DE INTEGRAÇÃO COM A API (FETCH) — Nex_TI
// ==========================================

const API_CANDIDATE_URLS = [
    'http://localhost:5000/api',
    'https://localhost:5001/api',
    'http://127.0.0.1:5000/api',
    'https://127.0.0.1:5001/api'
];

let activeApiBaseUrl = 'http://localhost:5000/api';

const ApiService = {
    getBaseUrl: () => activeApiBaseUrl,

    // 1. Verifica se a API está online e detecta a porta ativa
    checkStatus: async () => {
        for (const candidate of API_CANDIDATE_URLS) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1200);
                const response = await fetch(`${candidate}/status`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (response.ok) {
                    activeApiBaseUrl = candidate;
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
        try {
            const response = await fetch(`${activeApiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Credenciais inválidas");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro no login:", error);
            throw error;
        }
    },

    // 3. Autenticação: Registro
    register: async (username, email, password) => {
        try {
            const response = await fetch(`${activeApiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Erro ao registrar usuário.");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro no registro:", error);
            throw error;
        }
    },

    // 4. Busca o Usuário no Banco de Dados
    getUsuario: async (username) => {
        try {
            const response = await fetch(`${activeApiBaseUrl}/usuarios/${encodeURIComponent(username)}`);
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
            const response = await fetch(`${activeApiBaseUrl}/usuarios/${encodeURIComponent(username)}/stats-detalhadas`);
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
            const response = await fetch(`${activeApiBaseUrl}/fases`);
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar fases:", error);
            return [];
        }
    },

    // 6. Busca os Flashcards de uma Fase específica
    getFlashcardsPorFase: async (codigoFase) => {
        try {
            const response = await fetch(`${activeApiBaseUrl}/fases/${encodeURIComponent(codigoFase)}/flashcards`);
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
            const response = await fetch(`${activeApiBaseUrl}/flashcards`, {
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
            const response = await fetch(`${activeApiBaseUrl}/progresso/usuario`, {
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
            const response = await fetch(`${activeApiBaseUrl}/progresso/atualizar`, {
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
            const response = await fetch(`${activeApiBaseUrl}/usuarios/stats`, {
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
            const response = await fetch(`${activeApiBaseUrl}/simulados/questoes`);
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar questões de simulado:", error);
            return [];
        }
    },

    // 12. Resumo de estatísticas globais
    getEstatisticasResumo: async () => {
        try {
            const response = await fetch(`${activeApiBaseUrl}/estatisticas/resumo`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar resumo de estatísticas:", error);
            return null;
        }
    },

    // 13. Download do Certificado em PDF
    baixarCertificadoPDF: async (nome, data, codigo) => {
        const url = `${activeApiBaseUrl}/certificado/pdf?nome=${encodeURIComponent(nome)}&data=${encodeURIComponent(data)}&codigo=${encodeURIComponent(codigo)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao gerar certificado PDF no servidor.");
        return await response.blob();
    }
};

window.ApiService = ApiService;
