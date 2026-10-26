import { DISCIPLINAS_SEMESTRES_12 } from './semestres12.js';
import { DISCIPLINAS_SEMESTRES_34 } from './semestres34.js';

/** IDs antigos permanecem iguais: mudar o título não apaga respostas nem recompensas. */
const FASE_POR_DISCIPLINA = {
  '1|Lógica com Python': 'fase1',
  '1|Matemática e Estatística': 'fase2',
  '1|Infraestrutura Computacional': 'fase3',
  '1|Cibersegurança': 'fase4',
  '1|Ética, Cidadania e Sustentabilidade': 'fase5',
  '1|Direitos Humanos': 'fase26',
  '1|LGPD (Lei Geral de Proteção de Dados)': 'fase27',
  '1|Lógica com C': 'fase28',
  '1|TIC (Tecnologia da Informação e Comunicação)': 'fase29',
  '2|Análise e Projeto de Sistemas': 'fase8',
  '2|Redes de Computadores e Sistemas Distribuídos': 'fase9',
  '2|Educação Ambiental': 'fase30',
  '2|Pesquisa, Tecnologia e Inovação': 'fase31',
  '2|Engenharia de Requisitos e Processos de Software': 'fase32',
  '3|Modelagem de Banco de Dados e NoSQL': 'fase11',
  '3|Programação Orientada a Objetos I - C#': 'fase12',
  '3|Desenvolvimento Web Responsivo': 'fase13',
  '3|Machine Learning e Análise de Dados': 'fase14',
  '3|Engenharia de Software II': 'fase15',
  '3|Comunicação, Liderança e Negociação': 'fase33',
  '3|Língua Brasileira de Sinais - Libras': 'fase34',
  '3|Programação Estruturada em C': 'fase35',
  '3|UX e UI Design (Experiência e Interface do Usuário)': 'fase36',
  '4|Desenvolvimento Web com .NET': 'fase16',
  '4|Desenvolvimento Mobile': 'fase17',
  '4|Programação de Banco de Dados': 'fase18',
  '4|Cloud Computing e DevOps': 'fase19',
  '4|Empreendedorismo em TI (Tecnologia da Informação)': 'fase20',
  '4|Desenvolvimento Mobile com JavaScript (Optativa)': 'fase37',
  '4|Relações Étnico-Raciais e Afrodescendência': 'fase38',
  '4|Gerenciamento de Projetos Ágil': 'fase39',
};

export const DISCIPLINAS_ACADEMICAS = [...DISCIPLINAS_SEMESTRES_12, ...DISCIPLINAS_SEMESTRES_34]
  .map(disciplina => ({ ...disciplina, faseId: FASE_POR_DISCIPLINA[`${disciplina.semestre}|${disciplina.nome}`] }));

/** Amplia os quatro módulos; o preparatório ENADE e as cartas anteriores ficam intactos. */
export function integrarConteudoAcademico(banco, modulos) {
  for (const disciplina of DISCIPLINAS_ACADEMICAS) {
    const modulo = modulos.find(m => m.numero === disciplina.semestre);
    if (!modulo || !disciplina.faseId) throw new Error(`Disciplina sem fase: ${disciplina.nome}`);
    let fase = modulo.fases.find(f => f.id === disciplina.faseId);
    if (!fase) {
      fase = { id: disciplina.faseId, xp: modulo.fases[0].xp, moedas: 10 };
      modulo.fases.push(fase);
    }
    fase.nome = disciplina.nome;
    fase.academico = disciplina;
    const cartas = banco[fase.id] ??= [];
    for (const carta of disciplina.cartas) {
      cartas.push({
        frente: carta.frente, verso: carta.verso,
        dica: `${disciplina.origem} · ${disciplina.semestre}º semestre · ${carta.dica}`,
        origemAcademica: { disciplinaId: disciplina.id, fonteId: carta.fonteId, pagina: carta.pagina },
      });
    }
    fase.totalCards = cartas.length;
  }
  let numeroDaFase = 0;
  for (const modulo of modulos) {
    if (modulo.numero <= 4) {
      modulo.semestre = modulo.numero;
      modulo.nome = `Módulo ${modulo.numero}: ${modulo.titulo}`;
    }
    for (const fase of modulo.fases) {
      numeroDaFase += 1;
      fase.titulo = `Fase ${String(numeroDaFase).padStart(2, '0')}: ${fase.nome}`;
    }
  }
}
