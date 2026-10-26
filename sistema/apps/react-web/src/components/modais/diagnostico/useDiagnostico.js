import { useEffect, useRef, useState } from 'react';
import { PERGUNTAS_DIAGNOSTICO, selecionarPerguntasDiagnostico, resultadoDoDiagnostico, VERSAO_DIAGNOSTICO } from '@nexti/shared';
import { guardarDiagnosticoLocal, lerDiagnosticoLocal } from '../../../lib/diagnosticoLocal';

function lerRascunho(userKey) {
  const salvo = lerDiagnosticoLocal(userKey, 'diagnostico_rascunho');
  try {
    if (salvo?.versao !== VERSAO_DIAGNOSTICO) return null;
    const perguntas = salvo.ids.map(id => PERGUNTAS_DIAGNOSTICO.find(p => p.id === id));
    const respostas = salvo.respostas;
    if (!Array.isArray(respostas) || respostas.length >= perguntas.length
      || respostas.some((r, i) => r.perguntaId !== perguntas[i]?.id)) return null;
    resultadoDoDiagnostico(perguntas.map((p, i) => respostas[i] ?? { perguntaId: p.id, alternativa: null }));
    return { perguntas, respostas };
  } catch { return null; }
}

export function useDiagnostico({ userKey, concluirDiagnostico, som }) {
  const [rascunho] = useState(() => lerRascunho(userKey));
  const [perguntas, setPerguntas] = useState(rascunho?.perguntas ?? []);
  const [respostas, setRespostas] = useState(rascunho?.respostas ?? []);
  const [tela, setTela] = useState('intro');
  const [selecionada, setSelecionada] = useState(undefined);
  const [resultado, setResultado] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [rascunhoSalvo, setRascunhoSalvo] = useState(true);
  const bloqueado = useRef(false);
  const titulo = useRef(null);
  useEffect(() => {
    bloqueado.current = false;
    titulo.current?.focus({ preventScroll: true });
    titulo.current?.closest('.modal-body')?.scrollTo(0, 0);
  }, [respostas.length, tela]);

  const iniciar = (continuar = false) => {
    const lista = continuar && perguntas.length ? perguntas : selecionarPerguntasDiagnostico();
    const anteriores = continuar ? respostas : [];
    setPerguntas(lista); setRespostas(anteriores); setSelecionada(undefined); setErro(''); setTela('perguntas');
    setRascunhoSalvo(guardarDiagnosticoLocal(userKey, { versao: VERSAO_DIAGNOSTICO, ids: lista.map(p => p.id), respostas: anteriores }, 'diagnostico_rascunho'));
  };
  const confirmar = async () => {
    if (selecionada === undefined || bloqueado.current) return;
    bloqueado.current = true; som('playClick');
    const novas = [...respostas, { perguntaId: perguntas[respostas.length].id, alternativa: selecionada }];
    if (novas.length < perguntas.length) {
      setRascunhoSalvo(guardarDiagnosticoLocal(userKey, { versao: VERSAO_DIAGNOSTICO, ids: perguntas.map(p => p.id), respostas: novas }, 'diagnostico_rascunho'));
      setSelecionada(undefined); setRespostas(novas);
    } else {
      setSalvando(true); setErro('');
      try { setResultado(await concluirDiagnostico(novas)); setTela('resultado'); }
      catch (e) { setErro(e.message); }
      finally { setSalvando(false); bloqueado.current = false; }
    }
  };
  return { perguntas, respostas, tela, setTela, selecionada, setSelecionada, resultado, setResultado,
    salvando, erro, rascunhoSalvo, titulo, iniciar, confirmar };
}
