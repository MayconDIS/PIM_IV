import React from 'react';
import { useEstudo } from '../../context/EstudoContext';

/**
 * Barra de navegação no rodapé da tela, só no celular (mesmo padrão do CasalFlow).
 * No computador estas ações ficam no cabeçalho e no menu; no celular o cabeçalho não
 * tem espaço para elas, e o polegar alcança melhor o rodapé.
 */
const ITENS = [
  { id: null, rotulo: 'Fases', icone: 'home' },
  { id: 'modalProgresso', rotulo: 'Estatísticas', icone: 'monitoring' },
  { id: 'modalCriacao', rotulo: 'Criar carta', icone: 'add_box' },
  { id: 'modalMapaMental', rotulo: 'Mapa', icone: 'hub' },
  { id: 'modalConta', rotulo: 'Conta', icone: 'manage_accounts' },
];

export function NavegacaoCelular() {
  const { modal, abrirModal, fecharModal } = useEstudo();

  const irPara = (id) => {
    if (id) {
      abrirModal(id);
      return;
    }
    // "Fases": fecha o que estiver aberto e volta ao topo da lista (tocar de novo também sobe).
    if (modal) fecharModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="nav-celular" aria-label="Navegação principal">
      {ITENS.map((item) => {
        const ativo = item.id === null ? !modal : modal === item.id;
        return (
          <button
            key={item.rotulo}
            type="button"
            className={`nav-celular-item${ativo ? ' ativo' : ''}`}
            aria-current={ativo ? 'page' : undefined}
            onClick={() => irPara(item.id)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{item.icone}</span>
            <span>{item.rotulo}</span>
          </button>
        );
      })}
    </nav>
  );
}
