/**
 * Motor do Mapa Neural (Obsidian View) — porte do neural-map.js do dashboard vanilla original.
 *
 * Continua sendo DOM imperativo (centenas de nós com física de mola a 60 fps
 * não ganham nada passando pelo React); a diferença é que tudo vive num
 * fechamento e `destruir()` remove os listeners globais e para a animação.
 */

const CENTRO = 2000;

export function montarMapaNeural(container, canvas, { nomeUsuario, chaveSave, ordemFases, decks, srsData, fasesDesbloqueadas }) {
  canvas.textContent = '';

  const salvo = lerSave(chaveSave);
  // Tela de toque (celular): não há "passar o mouse", então os nomes ficam à mostra (CSS) e a
  // carta tocada abre num painel fixo embaixo do mapa, fora do zoom, para dar para ler.
  const toque = window.matchMedia('(hover: none)').matches;
  // Zoom que cabe o mapa inteiro (as fases ficam até ~650px do centro): 1 no computador, menos no celular.
  const escalaInicial = () => Math.min(1, Math.max(0.3, Math.min(container.clientWidth, container.clientHeight) / 1300));
  let escala = escalaInicial();
  let panX = container.clientWidth / 2 - CENTRO * escala;
  let panY = container.clientHeight / 2 - CENTRO * escala;
  // A câmera salva só vale na mesma largura de tela: aberta no celular depois do computador (ou o
  // contrário), ela deixaria o mapa fora da tela.
  const mesmaTela = salvo.camera && Math.abs((salvo.camera.largura ?? 0) - container.clientWidth) < 100;
  if (mesmaTela) ({ scale: escala, panX, panY } = salvo.camera);

  let noArrastado = null;
  let panorama = false;
  let ultimoToqueX = 0;
  let ultimoToqueY = 0;
  let quadro = 0;
  let pinca = null; // { distancia, x, y } enquanto há dois dedos na tela

  const nos = {};
  const arestas = [];

  const atualizarCamera = () => {
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${escala})`;
  };
  atualizarCamera();

  const removerMiniCards = () => container.querySelectorAll('.mini-flashcard').forEach((el) => el.remove());

  function criarNo(dados) {
    const el = document.createElement('div');
    el.className = 'neural-node';
    Object.assign(el.style, {
      width: `${dados.size}px`,
      height: `${dados.size}px`,
      backgroundColor: dados.color,
      boxShadow: `0 0 ${dados.size * 1.5}px ${dados.color}`,
      left: `${dados.x}px`,
      top: `${dados.y}px`,
    });

    if (dados.label) {
      const rotulo = document.createElement('span');
      rotulo.className = 'label tech-font';
      rotulo.textContent = dados.label;
      el.appendChild(rotulo);
    }

    el.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      const onda = document.createElement('div');
      onda.className = 'neural-pulse';
      Object.assign(onda.style, {
        width: `${dados.size * 2}px`,
        height: `${dados.size * 2}px`,
        left: `${dados.x}px`,
        top: `${dados.y}px`,
        borderColor: dados.color,
      });
      canvas.appendChild(onda);
      setTimeout(() => onda.remove(), 800);

      noArrastado = dados;
      el.style.cursor = 'grabbing';
      container.style.cursor = 'default';
    });

    el.addEventListener(
      'touchstart',
      (e) => {
        e.stopPropagation();
        if (e.touches.length !== 1) return;
        noArrastado = dados;
        ultimoToqueX = e.touches[0].clientX;
        ultimoToqueY = e.touches[0].clientY;
        el.style.cursor = 'grabbing';
      },
      { passive: false },
    );

    if (dados.isCard) {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        removerMiniCards();
        if (toque) container.appendChild(miniFlashcard(dados, { fixo: true }));
        else canvas.appendChild(miniFlashcard(dados));
      });
    }

    canvas.appendChild(el);
    dados.el = el;
    nos[dados.id] = dados;
  }

  // --- A. nós: cérebro, fases e cartas já estudadas -----------------------
  const cx = salvo.nodes.central?.x ?? CENTRO;
  const cy = salvo.nodes.central?.y ?? CENTRO;
  criarNo({ id: 'central', x: cx, y: cy, label: `Cérebro: ${nomeUsuario}`, color: 'var(--nexti-purple)', size: 45 });

  ordemFases.forEach((faseId, i) => {
    const liberada = fasesDesbloqueadas.includes(faseId);
    let pos = salvo.nodes[faseId];
    if (!pos) {
      const angulo = (i / ordemFases.length) * Math.PI * 2;
      const distancia = Math.random() * 250 + 350;
      const x = cx + Math.cos(angulo) * distancia;
      const y = cy + Math.sin(angulo) * distancia;
      pos = { x, y, offsetX: x - cx, offsetY: y - cy };
    }

    const estudadas = liberada
      ? (decks[faseId] ?? []).filter((c) => srsData[c.frente]?.rep > 0)
      : [];

    criarNo({
      id: faseId,
      ...pos,
      label: faseId.toUpperCase(),
      color: liberada ? 'var(--nexti-cyan)' : '#30363d',
      size: liberada ? 25 + estudadas.length * 0.5 : 15,
      parentId: 'central',
    });
    arestas.push({ de: 'central', para: faseId, opacidade: liberada ? 0.3 : 0.05 });

    const visiveis = Math.min(estudadas.length, 30);
    for (let j = 0; j < visiveis; j++) {
      const id = `${faseId}_card_${j}`;
      let posCarta = salvo.nodes[id];
      if (!posCarta) {
        const angulo = (j / visiveis) * Math.PI * 2 + (Math.random() * 0.3 - 0.15);
        const distancia = Math.random() * 80 + 120;
        const x = pos.x + Math.cos(angulo) * distancia;
        const y = pos.y + Math.sin(angulo) * distancia;
        posCarta = { x, y, offsetX: x - pos.x, offsetY: y - pos.y };
      }
      criarNo({
        id,
        ...posCarta,
        label: '',
        color: Math.random() > 0.5 ? 'var(--nexti-green)' : 'var(--nexti-blue)',
        size: 10,
        isCard: true,
        cardData: estudadas[j],
        parentId: faseId,
      });
      arestas.push({ de: faseId, para: id, opacidade: 0.15 });
    }
  });

  arestas.forEach((a) => {
    const linha = document.createElement('div');
    linha.className = 'neural-edge';
    linha.style.backgroundColor = `rgba(139, 146, 165, ${a.opacidade})`;
    canvas.appendChild(linha);
    a.el = linha;
  });

  // --- B. teia, save e física ----------------------------------------------
  function recalcularTeia() {
    arestas.forEach(({ de, para, el }) => {
      const a = nos[de];
      const b = nos[para];
      if (!a || !b) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      el.style.width = `${Math.hypot(dx, dy)}px`;
      el.style.left = `${a.x}px`;
      el.style.top = `${a.y}px`;
      el.style.transform = `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`;
    });
  }
  recalcularTeia();

  function salvarEstado() {
    const estado = { camera: { scale: escala, panX, panY, largura: container.clientWidth }, nodes: {} };
    Object.values(nos).forEach((n) => {
      estado.nodes[n.id] = { x: n.x, y: n.y, offsetX: n.offsetX || 0, offsetY: n.offsetY || 0 };
    });
    try {
      localStorage.setItem(chaveSave, JSON.stringify(estado));
    } catch {
      /* mapa volta ao layout aleatório na próxima abertura */
    }
  }
  salvarEstado();

  function moverNo(no, dx, dy) {
    no.x += dx;
    no.y += dy;
    no.el.style.left = `${no.x}px`;
    no.el.style.top = `${no.y}px`;
  }

  function loopFisica() {
    let mudou = false;
    Object.values(nos).forEach((no) => {
      if (!no.parentId || no === noArrastado) return;
      const pai = nos[no.parentId];
      if (!pai) return;
      const dx = pai.x + no.offsetX - no.x;
      const dy = pai.y + no.offsetY - no.y;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        moverNo(no, dx * 0.15, dy * 0.15);
        mudou = true;
      }
    });
    if (mudou) recalcularTeia();
    quadro = requestAnimationFrame(loopFisica);
  }
  loopFisica();

  // --- C. pan, arraste e zoom ----------------------------------------------
  const onContextMenu = (e) => e.preventDefault();

  const onMouseDown = (e) => {
    if (e.target.classList.contains('neural-node')) return;
    panorama = true;
    container.style.cursor = 'grabbing';
    removerMiniCards();
  };

  const onTouchStart = (e) => {
    if (e.target.classList.contains('neural-node') || e.touches.length !== 1) return;
    panorama = true;
    ultimoToqueX = e.touches[0].clientX;
    ultimoToqueY = e.touches[0].clientY;
    removerMiniCards();
  };

  const onMouseMove = (e) => {
    if (noArrastado) {
      e.preventDefault();
      moverNo(noArrastado, e.movementX / escala, e.movementY / escala);
      recalcularTeia();
    } else if (panorama) {
      panX += e.movementX;
      panY += e.movementY;
      atualizarCamera();
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && container.contains(e.target)) {
      // Pinça: a distância entre os dedos dá o zoom e o meio deles move a câmera.
      e.preventDefault();
      const [a, b] = e.touches;
      const r = container.getBoundingClientRect();
      const distancia = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const x = (a.clientX + b.clientX) / 2 - r.left;
      const y = (a.clientY + b.clientY) / 2 - r.top;
      if (pinca) {
        panX += x - pinca.x;
        panY += y - pinca.y;
        zoomPara(escala * (distancia / pinca.distancia), x, y);
      } else {
        noArrastado = null;
        panorama = false;
        removerMiniCards();
      }
      pinca = { distancia, x, y };
      return;
    }
    if (e.touches.length !== 1 || pinca) return;
    const { clientX, clientY } = e.touches[0];
    const dx = clientX - ultimoToqueX;
    const dy = clientY - ultimoToqueY;
    ultimoToqueX = clientX;
    ultimoToqueY = clientY;

    if (noArrastado) {
      e.preventDefault();
      moverNo(noArrastado, dx / escala, dy / escala);
      recalcularTeia();
    } else if (panorama) {
      e.preventDefault();
      panX += dx;
      panY += dy;
      atualizarCamera();
    }
  };

  const onSoltar = () => {
    if (pinca) {
      pinca = null;
      salvarEstado();
    }
    if (noArrastado) {
      const pai = nos[noArrastado.parentId];
      if (pai) {
        noArrastado.offsetX = noArrastado.x - pai.x;
        noArrastado.offsetY = noArrastado.y - pai.y;
      }
      noArrastado.el.style.cursor = 'grab';
      noArrastado = null;
      salvarEstado();
    }
    if (panorama) {
      panorama = false;
      salvarEstado();
    }
    container.style.cursor = 'grab';
  };

  /** Muda o zoom mantendo parado o ponto (origemX, origemY) da tela. */
  function zoomPara(novaEscala, origemX, origemY) {
    const alvoX = (origemX - panX) / escala;
    const alvoY = (origemY - panY) / escala;
    escala = Math.min(3, Math.max(0.2, novaEscala));
    panX = origemX - alvoX * escala;
    panY = origemY - alvoY * escala;
    atualizarCamera();
  }

  function aplicarZoom(delta, origemX, origemY) {
    zoomPara(escala + delta, origemX, origemY);
    salvarEstado();
  }

  const onWheel = (e) => {
    e.preventDefault();
    const r = container.getBoundingClientRect();
    aplicarZoom(e.deltaY * -0.0015, e.clientX - r.left, e.clientY - r.top);
  };

  container.addEventListener('contextmenu', onContextMenu);
  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('touchstart', onTouchStart, { passive: false });
  container.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onSoltar);
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onSoltar);

  const zoomCentral = (delta) => {
    const r = container.getBoundingClientRect();
    aplicarZoom(delta, r.width / 2, r.height / 2);
  };

  return {
    aproximar: () => zoomCentral(0.3),
    afastar: () => zoomCentral(-0.3),
    centralizar: () => {
      escala = escalaInicial();
      panX = container.clientWidth / 2 - cx * escala;
      panY = container.clientHeight / 2 - cy * escala;
      atualizarCamera();
      salvarEstado();
    },
    destruir: () => {
      cancelAnimationFrame(quadro);
      container.removeEventListener('contextmenu', onContextMenu);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onSoltar);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onSoltar);
      canvas.textContent = '';
    },
  };
}

function lerSave(chave) {
  try {
    const salvo = JSON.parse(localStorage.getItem(chave));
    return { nodes: salvo?.nodes ?? {}, camera: salvo?.camera ?? null };
  } catch {
    return { nodes: {}, camera: null };
  }
}

/** Card flutuante com pergunta/resposta — montado com textContent (o original usava innerHTML). */
function miniFlashcard(no, { fixo = false } = {}) {
  const artigo = document.createElement('article');
  artigo.className = fixo ? 'mini-flashcard mini-flashcard-fixo' : 'mini-flashcard';
  if (!fixo) {
    artigo.style.left = `${no.x + no.size / 2 + 10}px`;
    artigo.style.top = `${no.y - 40}px`;
  }

  const titulo = document.createElement('h4');
  titulo.textContent = no.id.split('_')[0].toUpperCase();
  const cabecalho = document.createElement('div');
  cabecalho.appendChild(titulo);

  const pergunta = document.createElement('p');
  const p = document.createElement('strong');
  p.textContent = 'P:';
  pergunta.append(p, ` ${no.cardData.frente}`);

  const separador = document.createElement('hr');
  separador.style.cssText = 'border: 1px dashed #30363d; margin: 8px 0;';

  const resposta = document.createElement('p');
  resposta.style.color = 'var(--nexti-green)';
  const r = document.createElement('strong');
  r.textContent = 'R:';
  resposta.append(r, ` ${no.cardData.verso}`);

  const corpo = document.createElement('div');
  corpo.append(pergunta, separador, resposta);
  artigo.append(cabecalho, corpo);
  return artigo;
}
