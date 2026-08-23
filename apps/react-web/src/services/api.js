/**
 * Serviço de Integração com a API .NET 10 (Minimal APIs)
 */
const API_BASE_URL = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('nexti_jwt_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const ApiService = {
  async login(email, senha) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || 'Falha ao autenticar.');
      }
      return await res.json();
    } catch (e) {
      console.warn('API Login offline fallback:', e.message);
      // Fallback local se a API estiver offline
      return {
        token: 'jwt_offline_demo_token',
        usuario: {
          id: 1,
          nome: email.split('@')[0] || 'Estudante Dev',
          email,
          nivel: 1,
          xp: 150,
          moedas: 45
        }
      };
    }
  },

  async register(nome, email, senha) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: nome, email, senha })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || 'Erro ao registrar.');
      }
      return await res.json();
    } catch (e) {
      console.warn('API Register offline fallback:', e.message);
      return {
        mensagem: 'Conta criada em modo offline!',
        usuario: { id: Date.now(), nome, email, nivel: 1, xp: 0, moedas: 10 }
      };
    }
  },

  async getFlashcards() {
    try {
      const res = await fetch(`${API_BASE_URL}/flashcards`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Erro ao buscar flashcards');
      return await res.json();
    } catch (e) {
      console.warn('Usando banco local de flashcards:', e.message);
      return null; // Indica para carregar o data.js local
    }
  },

  async salvarProgresso(flashcardId, repeticoes, intervalo, facilidade, acertou) {
    try {
      const res = await fetch(`${API_BASE_URL}/flashcards/${flashcardId}/revisar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ repeticoes, intervaloDias: intervalo, fatorFacilidade: facilidade, acertou })
      });
      return await res.json();
    } catch (e) {
      console.warn('Progresso salvo apenas localmente:', e.message);
      return { status: 'offline_cached' };
    }
  }
};
