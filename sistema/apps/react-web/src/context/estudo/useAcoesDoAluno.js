import { ApiService } from '@nexti/shared';
import { confete, som } from './apoio.js';
import { concluirDiagnosticoLocal, reenviarDiagnostico } from '../../lib/diagnosticoLocal';

/** Ações fora da fase aberta: loja de bônus, certificado, nivelamento, criar carta, apagar dados e sair. */
export function useAcoesDoAluno({ nomeUsuario, userKey, progresso, ui, sessao }) {
  const { toast, confirmar, abrirModal } = ui;

  const abrirBonus = async (bonus) => {
    if (progresso.acessoCompleto || progresso.bonusDesbloqueados.includes(bonus.id)) {
      sessao.carregarAula(bonus.id, bonus.nome);
      return;
    }

    const ok = await confirmar(
      'Comprar bônus',
      `Deseja desbloquear a disciplina bônus "${bonus.nome}" por ${bonus.custoMoedas} moedas?\n\nSaldo atual: ${progresso.moedas} moedas.`,
    );
    if (!ok) return;

    if (progresso.moedas < bonus.custoMoedas) {
      som('playError');
      toast('error', 'Saldo Insuficiente', `Você tem ${progresso.moedas} moedas, mas o bônus custa ${bonus.custoMoedas}.`);
      return;
    }

    if (progresso.apiOnlineRef.current) {
      // Online, quem confere o saldo e desconta é o servidor.
      try {
        const r = await ApiService.comprarBonus(bonus.id);
        progresso.setMoedas(r.moedas);
      } catch (erro) {
        som('playError');
        toast('error', 'Compra não concluída', erro.message);
        return;
      }
    } else {
      progresso.setMoedas((m) => m - bonus.custoMoedas);
    }
    progresso.setBonusDesbloqueados((atual) => [...atual, bonus.id]);
    som('playUnlock');
    toast('success', 'Acesso Concedido', `Disciplina "${bonus.nome}" desbloqueada com sucesso!`);
    sessao.carregarAula(bonus.id, bonus.nome, { ignorarBloqueio: true });
  };

  const abrirCertificado = () => {
    if (!progresso.certificadoLiberado) {
      som('playError');
      toast('warning', 'Certificado Bloqueado', 'Conclua o Teste do Módulo 05 (ENADE) com pelo menos 80% de aproveitamento para liberar o certificado.');
      return;
    }
    som('playUnlock');
    abrirModal('modalCertificado');
  };

  const aplicarDiagnostico = (resultado) => {
    try { localStorage.setItem(`${userKey}nivelado`, 'true'); } catch { /* o resultado continua nesta sessão */ }
    progresso.setDiagnostico(resultado);
    progresso.setFasesDesbloqueadas(atual => [...new Set([...atual, ...resultado.fasesLiberadas])]);
    return resultado;
  };
  const concluirDiagnostico = async (respostas) => {
    const resultado = await concluirDiagnosticoLocal({ userKey, respostas,
      anteriores: progresso.fasesDesbloqueadas, online: progresso.apiOnlineRef.current,
      temConta: Boolean(localStorage.getItem('quest_jwt_token')) });
    aplicarDiagnostico(resultado);
    som('playLevelUp');
    confete('burst', 60);
    return resultado;
  };

  const sincronizarDiagnostico = async (emMemoria) => {
    const resultado = emMemoria?.sincronizacao === 'sessao'
      ? await concluirDiagnosticoLocal({ userKey,
        respostas: emMemoria.revisoes.map(r => ({ perguntaId: r.perguntaId, alternativa: r.respondida })),
        anteriores: progresso.fasesDesbloqueadas, online: true, temConta: Boolean(localStorage.getItem('quest_jwt_token')) })
      : await reenviarDiagnostico(userKey);
    return resultado ? aplicarDiagnostico(resultado) : progresso.diagnostico;
  };

  const criarCarta = ({ faseId, frente, verso, dica }) => {
    const fase = String(faseId || '').trim().toLowerCase();
    const f = frente.trim();
    const v = verso.trim();
    const d = dica.trim();

    if (!fase || !f || !v) {
      som('playError');
      toast('warning', 'Campos Obrigatórios', 'Por favor, preencha Frente e Verso da carta.');
      return false;
    }

    progresso.setDecks((atual) => ({ ...atual, [fase]: [...(atual[fase] ?? []), { frente: f, verso: v, dica: d }] }));
    if (progresso.apiOnlineRef.current) {
      ApiService.criarFlashcard(fase, f, v, d).catch(() => {
        /* fica salvo localmente, como no vanilla */
      });
    }

    som('playUnlock');
    toast('success', 'Carta salva', 'A carta nova já está na fase que você escolheu.');
    return true;
  };

  const resetarProgresso = async () => {
    const ok = await confirmar(
      'Limpar dados do navegador',
      // Só o localStorage é limpo: o que está na conta (servidor) volta ao recarregar.
      `Conta: ${nomeUsuario}\n\nIsso limpa o que está guardado neste navegador: XP, moedas, fases liberadas, revisões, avatar e o desenho do mapa. O que está salvo na sua conta volta quando a página recarregar.\n\nPara apagar a conta de verdade, use Minha conta → Excluir conta.\n\nLimpar agora?`,
    );
    if (!ok) return;
    ['xp', 'coins', 'nivelado', 'desbloqueadas', 'bonus_unlocked', 'decks', 'rank', 'srs', 'map_state',
      'avatar_custom', 'certificado_unlocked', 'active_state', 'diagnostico', 'diagnostico_pendente', 'diagnostico_rascunho']
      .forEach((sufixo) => localStorage.removeItem(userKey + sufixo));
    window.location.reload();
  };

  const deslogar = async () => {
    const ok = await confirmar('Encerrar Sessão', 'Deseja encerrar a sessão atual e retornar à tela de autenticação?');
    if (!ok) return;
    ['quest_user_name', 'quest_jwt_token', 'quest_user_id', 'quest_user_perfil'].forEach((chave) => localStorage.removeItem(chave));
    window.location.reload();
  };

  return { abrirBonus, abrirCertificado, concluirDiagnostico, sincronizarDiagnostico, criarCarta, resetarProgresso, deslogar };
}
