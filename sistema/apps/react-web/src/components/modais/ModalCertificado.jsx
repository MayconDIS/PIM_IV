import React, { useMemo } from 'react';
import { useEstudo } from '../../context/EstudoContext';
import { dadosDoCertificado, gerarCertificadoHtml } from '../../lib/certificado';
import { imprimirDocumento } from '../../lib/imprimir';
import { Modal } from '../ui/Modal';

export function ModalCertificado() {
  const { modal, fecharModal, nomeUsuario, toast, som, confete } = useEstudo();
  const aberto = modal === 'modalCertificado';
  const { dataPorExtenso, codigo } = useMemo(() => dadosDoCertificado(nomeUsuario), [nomeUsuario, aberto]);

  // Gerado no navegador: o diálogo de impressão oferece "Salvar como PDF".
  const imprimir = () => {
    imprimirDocumento(gerarCertificadoHtml({ nome: nomeUsuario, dataPorExtenso, codigo }), {
      aoFalhar: () => {
        som('playError');
        toast('error', 'Impressão bloqueada', 'O navegador não abriu o diálogo de impressão. Tente novamente.');
      },
    });
    som('playLevelUp');
    confete('celebrate');
    toast('info', 'Certificado pronto', 'No diálogo, escolha "Salvar como PDF" para guardar o arquivo.');
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
          <button className="btn-action btn-gold tech-font flex-align-center" onClick={imprimir}>
            <span className="material-symbols-outlined control-icon-spacing" aria-hidden="true">picture_as_pdf</span> IMPRIMIR / SALVAR_PDF()
          </button>
          <button className="btn-action btn-right tech-font flex-align-center" onClick={fecharModal}>
            <span className="material-symbols-outlined control-icon-spacing" aria-hidden="true">close</span> FECHAR()
          </button>
        </div>
      </div>
    </Modal>
  );
}
