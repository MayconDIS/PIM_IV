import test from 'node:test';
import assert from 'node:assert/strict';

import { FASES, MODULOS } from '../src/content.js';
import { ORDEM_FASES, certificadoDisponivel, fasesDisponiveis, fasesLiberadasNoServidor, preservarFasesLiberadas, temAcessoCompleto } from '../src/gamificacao.js';

// Progresso como a API devolve: uma linha por carta respondida, com a fase dela.
const respondeuTudo = (faseId) => {
  const fase = FASES.find((f) => f.id === faseId);
  return Array.from({ length: fase.totalCards }, (_, i) => ({ flashcardId: `${faseId}-${i}`, codigoFase: faseId }));
};

test('aluno novo, sem nada no servidor, começa só na Fase 01', () => {
  assert.deepEqual(fasesLiberadasNoServidor(), ['fase1']);
});

test('Admin e Tutor acessam toda a trilha sem alterar liberações nem exigir diagnóstico ou nível', () => {
  for (const perfil of ['Admin', 'Tutor']) {
    const liberadas = ['fase1'];
    const disponiveis = fasesDisponiveis(liberadas, perfil);
    assert.deepEqual(disponiveis, ORDEM_FASES);
    assert.ok(disponiveis.includes('teste-mod5'));
    assert.deepEqual(liberadas, ['fase1']);
    disponiveis.pop();
    assert.deepEqual(fasesDisponiveis(liberadas, perfil), ORDEM_FASES);
  }
});

test('sem perfil Admin ou Tutor, somente o acesso obtido pelo estudo fica disponível', () => {
  for (const perfil of ['Aluno', undefined, null, '', 'admin', 'tutor', 'Administrador']) {
    assert.equal(temAcessoCompleto(perfil), false);
    assert.deepEqual(fasesDisponiveis(['fase1', 'fase2'], perfil), ['fase1', 'fase2']);
  }
  assert.equal(temAcessoCompleto('Admin'), true);
  assert.equal(temAcessoCompleto('Tutor'), true);
});

test('nível 3 (nivelamento intermediário) libera os Módulos 01 e 02, como o diagnóstico', () => {
  const liberadas = fasesLiberadasNoServidor({ nivel: 3 });
  assert.deepEqual(liberadas, ORDEM_FASES.slice(0, ORDEM_FASES.indexOf('teste-mod2') + 1));
});

test('nível 6 libera a trilha inteira', () => {
  assert.deepEqual(fasesLiberadasNoServidor({ nivel: 6 }), [...ORDEM_FASES]);
});

test('diagnóstico atual separa acesso do rank por XP e mantém as conclusões posteriores', () => {
  const diagnostico = { fasesLiberadas: ['fase1'] };
  assert.deepEqual(fasesLiberadasNoServidor({ nivel: 6, diagnostico }), ['fase1']);
  assert.deepEqual(fasesLiberadasNoServidor({ nivel: 6, diagnostico, fasesConcluidas: ['fase1'] }), ['fase1', 'fase2']);
  const ateModulo3 = ORDEM_FASES.slice(0, ORDEM_FASES.indexOf('fase11') + 1);
  assert.deepEqual(fasesLiberadasNoServidor({ nivel: 1, diagnostico: { fasesLiberadas: ateModulo3 } }), ateModulo3);
});

test('fase com todas as cartas respondidas libera a seguinte', () => {
  assert.deepEqual(fasesLiberadasNoServidor({ progresso: respondeuTudo('fase1') }), ['fase1', 'fase2']);
});

test('fase pela metade não libera a seguinte', () => {
  const metade = respondeuTudo('fase1').slice(0, 10);
  assert.deepEqual(fasesLiberadasNoServidor({ progresso: metade }), ['fase1']);
});

test('a última fase concluída libera tudo antes dela, incluindo o teste que já foi feito', () => {
  const liberadas = fasesLiberadasNoServidor({ progresso: respondeuTudo('fase7') });
  assert.deepEqual(liberadas, ORDEM_FASES.slice(0, ORDEM_FASES.indexOf('fase8') + 1));
});

test('depois da última fase do módulo: o site libera o teste; o app (sem testes) libera a fase seguinte', () => {
  const ultima = MODULOS[0].fases.at(-1).id;
  const site = fasesLiberadasNoServidor({ progresso: respondeuTudo(ultima) });
  assert.equal(site.at(-1), 'teste-mod1');
  const app = fasesLiberadasNoServidor({ progresso: respondeuTudo(ultima), pularTestes: true });
  assert.equal(app.at(-1), 'fase6');
});

test('aluno antigo mantém acesso até a fase já liberada quando entram disciplinas intermediárias', () => {
  const liberadas = preservarFasesLiberadas(['fase1', 'fase2', 'fase6']);
  assert.ok(liberadas.includes('fase6'));
  assert.ok(liberadas.includes('teste-mod1'));
  assert.equal(liberadas.at(-1), 'fase6');
  assert.ok(!liberadas.includes('fase7'));
  assert.deepEqual(preservarFasesLiberadas(['fase-inexistente']), ['fase1']);
  assert.deepEqual(preservarFasesLiberadas(null), ['fase1']);
});

test('conclusão registrada na API mantém o caminho aberto mesmo com novas cartas na disciplina', () => {
  const liberadas = fasesLiberadasNoServidor({ fasesConcluidas: ['fase1'], progresso: [] });
  assert.deepEqual(liberadas, ['fase1', 'fase2']);
  const moduloConcluido = fasesLiberadasNoServidor({ fasesConcluidas: ['teste-mod1'] });
  assert.equal(moduloConcluido.at(-1), 'fase6');
  assert.ok(!moduloConcluido.includes('fase7'));
  assert.deepEqual(fasesLiberadasNoServidor({ fasesConcluidas: ['bonus1', 'inexistente'] }), ['fase1']);
});

test('carta repetida no progresso conta uma vez só', () => {
  const repetida = [...respondeuTudo('fase1').slice(0, 19), ...respondeuTudo('fase1').slice(0, 1)];
  assert.deepEqual(fasesLiberadasNoServidor({ progresso: repetida }), ['fase1']);
});

test('o rank do painel respeita o nivelamento: nível 3 com pouco XP já é Intermediário', async () => {
  const { progressoDeNivel } = await import('../src/gamificacao.js');
  const p = progressoDeNivel(5, 3);
  assert.equal(p.rotuloRank, 'Rank: Intermediário');
  assert.equal(p.rotuloProximo, 'Próximo: Expert');
  assert.equal(p.rotuloProgresso, '5 / 300 XP (2%)');
  assert.equal(progressoDeNivel(5).rotuloRank, 'Rank: Ingressante');
  assert.equal(progressoDeNivel(150, 1).rotuloRank, 'Rank: Intermediário');
  assert.equal(progressoDeNivel(700, 6).rotuloRank, 'Rank: Mestre da Computação');
  assert.equal(progressoDeNivel(10, 6).rotuloRank, 'Rank: Expert');
});

test('só o Admin abre o certificado sem conquistá-lo; Tutor e Aluno precisam do teste do módulo 5', () => {
  assert.equal(certificadoDisponivel(false, 'Admin'), true);
  assert.equal(certificadoDisponivel(false, 'Tutor'), false);
  assert.equal(certificadoDisponivel(false, 'Aluno'), false);
  assert.equal(certificadoDisponivel(true, 'Aluno'), true);
});
