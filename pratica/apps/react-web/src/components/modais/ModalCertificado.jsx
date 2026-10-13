import React, { useMemo, useState } from 'react';
import { ApiService } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { baixarArquivo } from '../../lib/arquivos';
import { Modal } from '../ui/Modal';

/** Código de autenticidade determinístico por aluno + data (mesmo hash de `tentarAbrirCertificado`). */
function dadosDoCertificado(nomeAluno) {
  const hoje = new Date();
  const dataNumerica = hoje.toLocaleDateString('pt-BR');
  const dataPorExtenso = hoje.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

  let hash = 0;
  const base = `${nomeAluno}${dataNumerica}NexTI_Academy_Enade_PIMIV`;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return { dataPorExtenso, codigo: `NEX-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${dataNumerica.replace(/\//g, '')}` };
}

export function ModalCertificado() {
  const { modal, fecharModal, nomeUsuario, toast, som, confete } = useEstudo();
  const aberto = modal === 'modalCertificado';
  const [gerando, setGerando] = useState(false);
  const { dataPorExtenso, codigo } = useMemo(() => dadosDoCertificado(nomeUsuario), [nomeUsuario, aberto]);

  const baixarPdf = async () => {
    setGerando(true);
    try {
      const blob = await ApiService.baixarCertificadoPDF(nomeUsuario, dataPorExtenso, codigo);
      baixarArquivo(blob, `Certificado_${nomeUsuario.replace(/\s+/g, '_')}.pdf`);
      som('playLevelUp');
      confete('celebrate');
      toast('success', 'Download Concluído', 'Certificado digital premium baixado com sucesso!');
    } catch {
      som('playError');
      toast('error', 'Erro no Download', 'Não foi possível baixar o PDF. Certifique-se de que o backend (.NET 10) está rodando.');
    } finally {
      setGerando(false);
    }
  };

  return (
    <Modal
      aberto={aberto}
      escuro
      classeConteudo="modal-certificado"
      classeCabecalho="modal-header-gold"
      classeTitulo="text-gold"
      icone="workspace_premium"
      titulo="Certificado de Conclusão"
      onFechar={fecharModal}
    >
      <div className="modal-body modal-body-certificado">
        <div className="certificado-container" id="certificado-area">
          <div className="certificado-border-outer">
            <div className="certificado-border-inner">
              <div className="certificado-header">
                <div className="certificado-logo tech-font">
                  <span className="brand-text-dark">Nex_</span>
                  <span className="tech-text-dark">TI</span>
                </div>
                <div className="certificado-subtitle">EdTech Learning Platform</div>
              </div>
              <div className="certificado-title">Certificado</div>
              <div className="certificado-text-label">Certificamos que</div>
              <div className="certificado-student-name">{nomeUsuario}</div>
              <div className="certificado-text-desc">
                concluiu com êxito a trilha de aprendizado de estudo ativo na plataforma
                <div className="certificado-course-title">NEX_TI — EDTECH LEARNING PLATFORM == 20 HORAS</div>
                com duração total de 20 horas, realizando todas as atividades e avaliações necessárias, com aproveitamento
                superior a 80% no Simulado ENADE final.
              </div>
              <div className="certificado-date">A conclusão foi registrada em <span>{dataPorExtenso}</span>.</div>
              <div className="certificado-code">Código do Certificado: <strong>{codigo}</strong></div>
              <div className="certificado-footer-note">
                *Certificado válido, amparado pela Lei nº 9.394 de Diretrizes e Bases da Educação Nacional
                <br />
                Nex_TI Academy EdTech – PIM IV UNIP
              </div>
              <div className="certificado-signatures">
                <div className="signature-box">
                  <div className="signature-line">
                    <svg className="signature-svg" viewBox="0 0 200 60" width="180" height="50">
                      <path d="M 20 45 Q 60 15 100 40 T 160 25 T 180 35" fill="none" stroke="#00e6e6" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 50 35 Q 90 55 130 30" fill="none" stroke="#00e6e6" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="signature-role">Diretoria Nex_TI Academy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="certificado-actions">
          <button className="btn-action btn-gold tech-font flex-align-center" onClick={() => window.print()}>
            <span className="material-symbols-outlined control-icon-spacing">print</span> IMPRIMIR()
          </button>
          <button className="btn-action btn-gold tech-font flex-align-center" onClick={baixarPdf} disabled={gerando}>
            <span className="material-symbols-outlined control-icon-spacing">{gerando ? 'sync' : 'download'}</span>
            {gerando ? ' GERANDO...' : ' BAIXAR_PDF()'}
          </button>
          <button className="btn-action btn-right tech-font flex-align-center" onClick={fecharModal}>
            <span className="material-symbols-outlined control-icon-spacing">close</span> FECHAR()
          </button>
        </div>
      </div>
    </Modal>
  );
}
