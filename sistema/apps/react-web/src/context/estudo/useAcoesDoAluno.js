import { ApiService, resultadoDoDiagnostico } from '@nexti/shared';
import { confete, som } from './apoio.js';

/** Ações fora da fase aberta: loja de bônus, certificado, nivelamento, criar carta, apagar dados e sair. */
export function useAcoesDoAluno({ nomeUsuario, userKey, progresso, ui, sessao }) {
  const { toast, confirmar, abrirModal } = ui;

  const abrirBonus = async (bonus) => {
    if (progresso.bonusDesbloqueados.includes(bonus.id)) {
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

  const concluirDiagnostico = (acertos) => {
    const resultado = resultadoDoDiagnostico(acertos);
    localStorage.setItem(`${userKey}nivelado`, 'true');
    // Soma ao que já estava liberado: refazer o nivelamento não tranca fases já abertas.
    progresso.setFasesDesbloqueadas((atual) => [...new Set([...atual, ...resultado.fases])]);
    progresso.definirRank(resultado.rotuloRank);

    if (progresso.apiOnlineRef.current) {
      ApiService.updateUserStats(progresso.xp, progresso.moedas, resultado.nivel).catch(() => {});
    }

    som('playLevelUp');
    confete('burst', 60);
    return resultado;
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
    toast('success', 'Flashcard Salvo', 'Novo dado registrado com sucesso na disciplina!');
    return true;
  };

  const resetarProgresso = async () => {
    const ok = await confirmar(
      'Formatação de Save Data',
      `Usuário logado: ${nomeUsuario}\n\nIsso apagará permanentemente TODO o seu histórico de XP, Moedas, Árvore de Permissões e progresso SM-2.\n\nTem certeza que deseja formatar os dados?`,
    );
    if (!ok) return;
    ['xp', 'coins', 'nivelado', 'desbloqueadas', 'bonus_unlocked', 'decks', 'rank', 'srs', 'map_state',
      'avatar_custom', 'certificado_unlocked', 'active_state']
      .forEach((sufixo) => localStorage.removeItem(userKey + sufixo));
    window.location.reload();
  };

  const deslogar = async () => {
    const ok = await confirmar('Encerrar Sessão', 'Deseja encerrar a sessão atual e retornar à tela de autenticação?');
    if (!ok) return;
    ['quest_user_name', 'quest_jwt_token', 'quest_user_id', 'quest_user_perfil'].forEach((chave) => localStorage.removeItem(chave));
    window.location.reload();
  };

  return { abrirBonus, abrirCertificado, concluirDiagnostico, criarCarta, resetarProgresso, deslogar };
}
