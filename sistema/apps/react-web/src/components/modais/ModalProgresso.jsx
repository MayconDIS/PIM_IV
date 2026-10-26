import React, { useRef } from 'react';
import { MODULOS, fasesConcluidas } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { exportarMetadadosDoConteudo, restaurarDecksDoBackup } from '../../context/estudo/apoio.js';
import { baixarArquivo } from '../../lib/arquivos';
import { Modal } from '../ui/Modal';

/** Métricas do SM-2 com as mesmas regras de `mostrarProgresso` (só cartas já respondidas contam). */
function calcularMetricas(srsData, decks) {
  const agora = Date.now();
  let maduras = 0;
  let aprendendo = 0;
  let devidas = 0;
  let somaFacilidade = 0;
  let comSrs = 0;

  Object.values(srsData).forEach((srs) => {
    if (!srs || !(srs.rep > 0)) return;
    comSrs += 1;
    somaFacilidade += srs.ease || 2.5;
    if ((srs.interval || 0) >= 21) maduras += 1;
    else aprendendo += 1;
    if (srs.next && srs.next <= agora) devidas += 1;
  });

  return {
    totalCartas: Object.values(decks).reduce((s, cartas) => s + (cartas?.length ?? 0), 0),
    maduras,
    aprendendo,
    devidas,
    facilidadeMedia: comSrs ? (somaFacilidade / comSrs).toFixed(2) : '2.50',
    retencao: comSrs ? Math.round((maduras / comSrs) * 100) : 0,
  };
}

const limparCsv = (texto) => (texto || '').replace(/;/g, ',').replace(/\n/g, ' ');
const umaLinha = (texto) => (texto || '').replace(/\s*\n\s*/g, ' ').trim();

export function ModalProgresso() {
  const {
    modal, fecharModal, nomeUsuario, userKey, xp, moedas, rank, srsData, decks,
    fasesDesbloqueadas, bonusDesbloqueados, toast, confirmar, som,
  } = useEstudo();
  const inputRef = useRef(null);
  const aberto = modal === 'modalProgresso';
  if (!aberto) return null;

  const m = calcularMetricas(srsData, decks);
  // Concluída é a fase com todas as cartas respondidas; liberada (pelo diagnóstico, por exemplo) não conta.
  const concluidas = fasesConcluidas(decks, srsData);
  const progressoDoModulo = (modulo) => {
    const feitas = modulo.fases.filter((f) => concluidas.includes(f.id)).length;
    return { feitas, pct: Math.round((feitas / modulo.fases.length) * 100) };
  };

  const exportarJson = () => {
    const backup = {
      versao: 1,
      aplicacao: 'Nex_TI',
      exportedAt: new Date().toISOString(),
      usuario: nomeUsuario,
      xp,
      coins: moedas,
      rank,
      fasesDesbloqueadas,
      bonusDesbloqueados,
      srsData,
      decks,
      migracaoConteudo: exportarMetadadosDoConteudo(`${userKey}decks`),
      mapState: JSON.parse(localStorage.getItem(`${userKey}map_state`) || '{}'),
    };
    const carimbo = new Date().toISOString().slice(0, 10);
    baixarArquivo(JSON.stringify(backup, null, 2), `NexTI_Backup_${nomeUsuario}_${carimbo}.json`, 'application/json;charset=utf-8;');
    som('playUnlock');
    toast('success', 'Backup Exportado', 'Backup completo do estudante (.JSON) baixado com sucesso!');
  };

  const importarJson = async (e) => {
    const arquivo = e.target.files?.[0];
    e.target.value = '';
    if (!arquivo) return;

    try {
      const dados = JSON.parse(await arquivo.text());
      if (!dados || dados.aplicacao !== 'Nex_TI' || !dados.versao) {
        som('playError');
        toast('error', 'Arquivo Inválido', 'O arquivo selecionado não é um backup válido do Nex_TI.');
        return;
      }

      const ok = await confirmar(
        'Restaurar Backup',
        `Deseja restaurar os dados de "${dados.usuario || 'Usuário'}" (${dados.xp || 0} XP, ${dados.coins || 0} moedas)?\n\nO progresso deste navegador será trocado pelo do arquivo de backup.`,
      );
      if (!ok) return;

      const gravar = (sufixo, valor) => localStorage.setItem(userKey + sufixo, typeof valor === 'string' ? valor : JSON.stringify(valor));
      if (dados.xp !== undefined) gravar('xp', String(dados.xp));
      if (dados.coins !== undefined) gravar('coins', String(dados.coins));
      if (dados.rank) gravar('rank', dados.rank);
      if (dados.fasesDesbloqueadas) gravar('desbloqueadas', dados.fasesDesbloqueadas);
      if (dados.bonusDesbloqueados) gravar('bonus_unlocked', dados.bonusDesbloqueados);
      if (dados.srsData) gravar('srs', dados.srsData);
      if (dados.decks) restaurarDecksDoBackup(`${userKey}decks`, dados.decks, dados.migracaoConteudo);
      if (dados.mapState) gravar('map_state', dados.mapState);
      gravar('nivelado', 'true');
      localStorage.removeItem(`${userKey}active_state`);

      som('playLevelUp');
      toast('success', 'Restauração Concluída', 'Seus dados e progresso foram restaurados com sucesso!');
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      som('playError');
      toast('error', 'Erro na Restauração', 'Falha ao processar o arquivo JSON de backup.');
    }
  };

  const exportarCsv = () => {
    const linhas = ['Disciplina;Frente (Pergunta);Verso (Resposta);Dica;Repeticoes;Intervalo (Dias);Facilidade;Proxima Revisao'];
    Object.entries(decks).forEach(([fase, cartas]) => {
      if (!Array.isArray(cartas)) return;
      cartas.forEach((c) => {
        const srs = srsData[c.frente] || { rep: 0, interval: 0, ease: 2.5, next: 0 };
        const proxima = srs.next ? new Date(srs.next).toLocaleDateString('pt-BR') : 'Não agendado';
        linhas.push(`${fase.toUpperCase()};${limparCsv(c.frente)};${limparCsv(c.verso)};${limparCsv(c.dica)};${srs.rep};${srs.interval};${srs.ease};${proxima}`);
      });
    });
    const carimbo = new Date().toISOString().slice(0, 10);
    baixarArquivo(`\uFEFF${linhas.join('\r\n')}`, `NexTI_Relatorio_Flashcards_${carimbo}.csv`, 'text/csv;charset=utf-8;');
    som('playUnlock');
    toast('success', 'Planilha Excel Baixada', 'Relatório formatado com UTF-8 BOM e compatível com Excel baixado com sucesso!');
  };

  const exportarTxt = () => {
    const agora = new Date();
    const linha = '='.repeat(64);
    const partes = [
      linha,
      'NEX_TI — RELATÓRIO DE ESTUDOS',
      linha,
      `Aluno: ${nomeUsuario}`,
      `Gerado em: ${agora.toLocaleString('pt-BR')}`,
      `${rank}`,
      '',
      'RESUMO',
      `  Nível acadêmico ....... ${xp} XP`,
      `  Moedas Dev ............ ${moedas}`,
      `  Cards no sistema ...... ${m.totalCartas}`,
      `  Taxa de retenção ...... ${m.retencao}%`,
      '',
      'MOTOR ANKI (SM-2)',
      `  Maduras (retidas) ..... ${m.maduras}`,
      `  Em aprendizado ........ ${m.aprendendo}`,
      `  Devidas hoje .......... ${m.devidas}`,
      `  Facilidade média ...... ${m.facilidadeMedia}`,
      '',
      'PROGRESSO DOS MÓDULOS',
      ...MODULOS.map((modulo) => {
        const { feitas, pct } = progressoDoModulo(modulo);
        return `  ${modulo.nome.padEnd(32, '.')} ${String(pct).padStart(3)}% (${feitas}/${modulo.fases.length} fases concluídas)`;
      }),
      '',
      linha,
      'FLASHCARDS',
      linha,
    ];

    Object.entries(decks).forEach(([fase, cartas]) => {
      if (!Array.isArray(cartas) || !cartas.length) return;
      partes.push('', `[ ${fase.toUpperCase()} ] — ${cartas.length} carta(s)`);
      cartas.forEach((c, i) => {
        const srs = srsData[c.frente];
        const agenda = srs?.next
          ? `revisão em ${new Date(srs.next).toLocaleDateString('pt-BR')} · ${srs.rep} rep · intervalo ${srs.interval}d · facilidade ${Number(srs.ease).toFixed(2)}`
          : 'ainda não estudada';
        partes.push(
          `  ${i + 1}. P: ${umaLinha(c.frente)}`,
          `     R: ${umaLinha(c.verso)}`,
          ...(c.dica ? [`     Dica: ${umaLinha(c.dica)}`] : []),
          `     SM-2: ${agenda}`,
        );
      });
    });

    const carimbo = agora.toISOString().slice(0, 10);
    baixarArquivo(`\uFEFF${partes.join('\r\n')}\r\n`, `NexTI_Relatorio_${nomeUsuario}_${carimbo}.txt`, 'text/plain;charset=utf-8;');
    som('playUnlock');
    toast('success', 'Relatório .TXT Baixado', 'Relatório de estudos em texto simples baixado com sucesso!');
  };

  const cartao = (rotulo, valor, { destaque, cor } = {}) => (
    <div className={`stats-analytics-card${destaque ? ` highlight-${destaque}` : ''}`}>
      <span className="stats-card-label">{rotulo}</span>
      <span className="stats-card-value tech-font" style={cor ? { color: cor } : undefined}>{valor}</span>
    </div>
  );

  const secao = (icone, titulo) => (
    <div className="stats-section-title tech-font">
      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }} aria-hidden="true">{icone}</span>
      {titulo}
    </div>
  );

  return (
    <Modal aberto classeConteudo="modal-progresso" icone="monitoring" titulo="Seu Histórico Acadêmico" onFechar={fecharModal}>
      <div className="modal-body">
        <div className="stats-analytics-container">
          <div className="stats-grid-analytics">
            {cartao('Nível Acadêmico', `${xp} XP`, { destaque: 'cyan' })}
            {cartao('Moedas Dev', `🪙 ${moedas}`, { destaque: 'gold' })}
            {cartao('Cards no Sistema', m.totalCartas, { destaque: 'green' })}
            {cartao('Taxa de Retenção', `${m.retencao}%`, { destaque: 'purple' })}
          </div>

          {secao('psychology', 'Métricas do Motor Anki (SM-2)')}
          <div className="stats-grid-analytics">
            {cartao('Maduras (Retidas)', m.maduras, { cor: 'var(--nexti-green)' })}
            {cartao('Em Aprendizado', m.aprendendo, { cor: 'var(--nexti-blue)' })}
            {cartao('Devidas Hoje', m.devidas, { cor: '#ffd700' })}
            {cartao('Facilidade Média', m.facilidadeMedia, { cor: 'var(--nexti-purple)' })}
          </div>

          {secao('account_tree', 'Progresso das Trilhas e Módulos')}
          <div className="module-progress-list">
            {MODULOS.map((modulo) => {
              const { feitas, pct } = progressoDoModulo(modulo);
              return (
                <div className="module-stat-row" key={modulo.id}>
                  <div className="module-stat-header">
                    <span>{modulo.nome}</span>
                    <span className="tech-font" aria-label={`${feitas} de ${modulo.fases.length} fases concluídas`}>{pct}% ({feitas}/{modulo.fases.length})</span>
                  </div>
                  <div className="module-stat-bar-track">
                    <div className="module-stat-bar-fill" style={{ width: `${pct}%`, backgroundColor: modulo.cor }} />
                  </div>
                </div>
              );
            })}
          </div>

          {secao('cloud_sync', 'Gerenciamento de Dados & Backup')}
          <div className="backup-actions-grid tech-font">
            <button className="btn-backup-action" onClick={exportarJson}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }} aria-hidden="true">download</span> Backup .JSON
            </button>
            <button className="btn-backup-action" onClick={() => inputRef.current?.click()}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }} aria-hidden="true">upload</span> Restaurar .JSON
            </button>
            <input ref={inputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importarJson} />
            <button className="btn-backup-action" onClick={exportarCsv}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }} aria-hidden="true">table_view</span> Excel (.CSV)
            </button>
            <button className="btn-backup-action" onClick={exportarTxt}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }} aria-hidden="true">description</span> Relatório (.TXT)
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
