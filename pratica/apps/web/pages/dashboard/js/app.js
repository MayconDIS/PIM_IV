if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
// js/app.js

// ==========================================
// 1. INICIALIZAÇÃO E BANCO DE DADOS
// ==========================================
let apiOnline = false;
const nomeSalvo = localStorage.getItem('quest_user_name') || 'Desenvolvedor';

// Sanitização contra XSS (MED-01): escapa HTML antes de usar em innerHTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// SISTEMA DE TOAST E DIÁLOGOS TECNOLÓGICOS
// ==========================================
function mostrarToast(tipo, titulo, mensagem) {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.log(`[${tipo.toUpperCase()}] ${titulo}: ${mensagem}`);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${tipo}`;

    let icone = 'info';
    if (tipo === 'success') icone = 'check_circle';
    else if (tipo === 'error') icone = 'error';
    else if (tipo === 'warning') icone = 'warning';

    toast.innerHTML = `
        <span class="material-symbols-outlined toast-icon" style="font-size: 1.3rem;">${icone}</span>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(titulo)}</div>
            <div class="toast-message">${escapeHtml(mensagem)}</div>
        </div>
        <button class="toast-close" title="Fechar">
            <span class="material-symbols-outlined" style="font-size: 1.1rem;">close</span>
        </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
        toast.classList.add('toast-leaving');
        setTimeout(() => toast.remove(), 300);
    };

    if (closeBtn) closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 4500);

    container.appendChild(toast);
}

function confirmarCyberDialog(titulo, mensagem) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('cyber-dialog-overlay');
        const titleEl = document.getElementById('cyber-dialog-title');
        const descEl = document.getElementById('cyber-dialog-desc');
        const btnCancel = document.getElementById('cyber-dialog-btn-cancel');
        const btnConfirm = document.getElementById('cyber-dialog-btn-confirm');

        if (!overlay || !titleEl || !descEl || !btnCancel || !btnConfirm) {
            resolve(confirm(`${titulo}\n\n${mensagem}`));
            return;
        }

        titleEl.innerHTML = `<span class="material-symbols-outlined text-cyan">terminal</span> ${escapeHtml(titulo)}`;
        descEl.innerText = mensagem;

        overlay.classList.add('show');

        const cleanup = () => {
            overlay.classList.remove('show');
            btnCancel.removeEventListener('click', onCancel);
            btnConfirm.removeEventListener('click', onConfirm);
        };

        const onCancel = () => {
            cleanup();
            resolve(false);
        };

        const onConfirm = () => {
            cleanup();
            resolve(true);
        };

        btnCancel.addEventListener('click', onCancel);
        btnConfirm.addEventListener('click', onConfirm);
    });
}

const headerUserName = document.getElementById('header-user-name') || document.getElementById('header-user-name-title');
if (headerUserName) headerUserName.innerText = nomeSalvo;

const menuUserName = document.getElementById('menu-user-name');
if (menuUserName) menuUserName.innerText = nomeSalvo;

// ==========================================
// FRASES MOTIVACIONAIS DE ESTUDO ATIVO
// ==========================================
const frasesMotivacionais = [
    "Bora programar, {name}! O próximo commit será de sucesso!",
    "Foco total nos estudos, {name}! Você evolui a cada fase.",
    "A persistência é o segredo do código perfeito, {name}!",
    "{name}, cada flashcard resolvido é um passo rumo ao topo!",
    "Compilando conhecimento... continue assim, {name}!",
    "Não pare até orgulhar o seu console, {name}!",
    "Café na caneca e foco nos estudos, {name}!",
    "{name}, os bugs de hoje são os aprendizados de amanhã!",
    "O algoritmo SM-2 está calibrando suas conexões neurais, {name}!",
    "Sua árvore de habilidades está crescendo, {name}!",
    "Executando processo de aprendizagem... Vai com tudo, {name}!",
    "Estudo ativo gera resultados exponenciais. Força, {name}!"
];

function inicializarFraseMotivacional(username) {
    const elMotivation = document.getElementById('header-motivation');
    if (!elMotivation) return;
    
    let nomeExibido = username;
    if (username === 'Desenvolvedor') nomeExibido = 'Dev';
    
    const idxRand = Math.floor(Math.random() * frasesMotivacionais.length);
    const nomeSeguro = escapeHtml(nomeExibido);
    const fraseSelecionada = frasesMotivacionais[idxRand].replace('{name}', `<span class="username-highlight">${nomeSeguro}</span>`);
    
    elMotivation.innerHTML = `<img src="../../assets/img/terminal-icon.png" class="motivation-icon" alt="Terminal"> <span>${fraseSelecionada}</span>`;
}

inicializarFraseMotivacional(nomeSalvo);

const userKey = `quest_${nomeSalvo}_`;

let rankSalvo = localStorage.getItem(userKey + 'rank') || 'Rank: Pendente';
document.getElementById('menu-user-level').innerText = rankSalvo;

function toggleAudio() {
    if (window.AudioEngine) {
        const isMuted = AudioEngine.toggleMute();
        atualizarIconeAudio(isMuted);
        if (!isMuted) AudioEngine.playClick();
    }
}

function atualizarIconeAudio(isMuted) {
    const icon = document.getElementById('audio-icon');
    const btn = document.getElementById('btn-audio-toggle');
    if (icon) {
        icon.innerText = isMuted ? 'volume_off' : 'volume_up';
    }
    if (btn) {
        btn.classList.toggle('muted', isMuted);
    }
}

function atualizarBarraNivel(xp) {
    const currentRankLabel = document.getElementById('current-rank-label');
    const nextRankLabel = document.getElementById('next-rank-label');
    const percentLabel = document.getElementById('xp-progress-percent');
    const fillEl = document.getElementById('xp-progress-fill');
    if (!fillEl) return;

    let currentRank = 'Ingressante';
    let nextRank = 'Intermediário';
    let minXP = 0;
    let targetXP = 100;

    if (xp >= 600) {
        currentRank = 'Mestre da Computação';
        nextRank = 'Nível Máximo';
        minXP = 600;
        targetXP = 600;
    } else if (xp >= 300) {
        currentRank = 'Expert';
        nextRank = 'Mestre da Computação';
        minXP = 300;
        targetXP = 600;
    } else if (xp >= 100) {
        currentRank = 'Intermediário';
        nextRank = 'Expert';
        minXP = 100;
        targetXP = 300;
    }

    let percent = targetXP === minXP ? 100 : Math.min(100, Math.max(0, Math.round(((xp - minXP) / (targetXP - minXP)) * 100)));
    
    if (currentRankLabel) currentRankLabel.innerText = `Rank: ${currentRank}`;
    if (nextRankLabel) nextRankLabel.innerText = nextRank === 'Nível Máximo' ? '⭐ NÍVEL MÁXIMO' : `Próximo: ${nextRank}`;
    if (percentLabel) {
        percentLabel.innerText = targetXP === minXP ? `${xp} XP (100%)` : `${xp} / ${targetXP} XP (${percent}%)`;
    }
    fillEl.style.width = `${percent}%`;
}

async function inicializarApi() {
    apiOnline = await ApiService.checkStatus();
    if (apiOnline) {
        console.log("Integração API: Conectado ao servidor.");
        const username = localStorage.getItem('quest_user_name');
        if (username && username !== 'Desenvolvedor' && username !== 'Admin') {
            const dataUser = await ApiService.getUsuario(username);
            if (dataUser) {
                xpTotal = dataUser.xp;
                coinsTotal = dataUser.moedas;
                let nivel = dataUser.nivel;
                let nomeRank = `Rank: Nível ${nivel}`;
                if (nivel === 1) nomeRank = "Rank: Ingressante";
                else if (nivel >= 2 && nivel <= 5) nomeRank = "Rank: Intermediário";
                else if (nivel > 5) nomeRank = "Rank: Expert";
                
                localStorage.setItem(userKey + 'xp', xpTotal);
                localStorage.setItem(userKey + 'coins', coinsTotal);
                localStorage.setItem(userKey + 'rank', nomeRank);
                
                document.getElementById('menu-user-level').innerText = nomeRank;
                document.getElementById('xp-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">military_tech</span> ${xpTotal} XP`;
                document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;
            }

            // Sincroniza progresso de repetição espaçada do banco de dados (SQL Server / Azure SQL)
            try {
                const progressoRemoto = await ApiService.getProgressoUsuario();
                if (progressoRemoto && progressoRemoto.length > 0) {
                    progressoRemoto.forEach(p => {
                        if (p.frente) {
                            srsData[p.frente] = {
                                rep: p.repeticoes,
                                interval: p.intervaloDias,
                                ease: p.fatorFacilidade,
                                next: new Date(p.dataProximaRevisao).getTime()
                            };
                        }
                    });
                    localStorage.setItem(userKey + 'srs', JSON.stringify(srsData));
                }
            } catch (errSync) {
                console.error("Erro ao sincronizar progresso remoto de flashcards:", errSync);
            }
        }
    } else {
        console.log("Integração API: Servidor offline. Utilizando modo offline (localStorage).");
    }
    atualizarBarraNivel(xpTotal);
}

let xpTotal = parseInt(localStorage.getItem(userKey + 'xp')) || 0;
let coinsTotal = parseInt(localStorage.getItem(userKey + 'coins')) || 0;

document.getElementById('xp-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">military_tech</span> ${xpTotal} XP`;
document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;

let meusDecks = JSON.parse(localStorage.getItem(userKey + 'decks'));

// Verifica integridade dos dados (versão + encoding limpo)
let dadosCorretos = meusDecks && meusDecks.fase22 && meusDecks.fase22.length >= 50;
if (dadosCorretos) {
    let amostra = JSON.stringify(meusDecks.fase1 || []) + JSON.stringify(meusDecks.fase2 || []);
    if (amostra.includes('\u00C3') || amostra.includes('Ã§') || amostra.includes('Ã£') || amostra.includes('Ã©')) {
        dadosCorretos = false;
    }
}
if (!dadosCorretos) {
    meusDecks = JSON.parse(JSON.stringify(bancoDeDados));
    localStorage.setItem(userKey + 'decks', JSON.stringify(meusDecks));
}

// Banco de dados de Repetição Espaçada (Algoritmo SM-2)
let srsData = JSON.parse(localStorage.getItem(userKey + 'srs')) || {};

// ==========================================
// 2. SISTEMA DE DESBLOQUEIO E BÔNUS
// ==========================================
const ordemFases = [
    'fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'teste-mod1',
    'fase6', 'fase7', 'fase8', 'fase9', 'fase10', 'teste-mod2',
    'fase11', 'fase12', 'fase13', 'fase14', 'fase15', 'teste-mod3',
    'fase16', 'fase17', 'fase18', 'fase19', 'fase20', 'teste-mod4',
    'fase21', 'fase22', 'teste-mod5'
];

let fasesDesbloqueadas = JSON.parse(localStorage.getItem(userKey + 'desbloqueadas')) || ['fase1'];
let bonusDesbloqueados = JSON.parse(localStorage.getItem(userKey + 'bonus_unlocked')) || [];
let opcoesOriginaisNovaFase = [];

function atualizarFasesVisuais() {
    ordemFases.forEach(fase => {
        const elementoFase = document.getElementById('menu-' + fase);
        if (!elementoFase) return;

        if (fasesDesbloqueadas.includes(fase)) {
            elementoFase.classList.remove('aula-locked-item');
            const icon = elementoFase.querySelector('.icon-status');
            if (icon && icon.innerText === 'lock') icon.innerText = 'check_circle';
        } else {
            elementoFase.classList.add('aula-locked-item');
            const icon = elementoFase.querySelector('.icon-status');
            if (icon) icon.innerText = 'lock';
        }
    });

    const certUnlocked = localStorage.getItem(userKey + 'certificado_unlocked') === 'true';
    const menuCertificado = document.getElementById('menu-certificado');
    if (menuCertificado) {
        if (certUnlocked) {
            menuCertificado.classList.remove('aula-locked-item');
            const icon = menuCertificado.querySelector('.icon-status');
            if (icon) icon.innerText = 'verified';
        } else {
            menuCertificado.classList.add('aula-locked-item');
            const icon = menuCertificado.querySelector('.icon-status');
            if (icon) icon.innerText = 'lock';
        }
    }
    
    const listaBonus = ['bonus1', 'bonus2', 'bonus3', 'bonus4'];
    listaBonus.forEach(bonusId => {
        const item = document.getElementById('menu-' + bonusId);
        const icon = document.getElementById('icon-' + bonusId);
        const price = document.getElementById('price-' + bonusId);
        
        if (item && bonusDesbloqueados.includes(bonusId)) {
            if (icon) icon.innerText = 'check_circle';
            if (price) {
                price.innerHTML = '<span class="material-symbols-outlined" style="font-size: 1rem;">toll</span> Liberado';
                price.style.borderColor = 'var(--nexti-green)';
                price.style.background = 'rgba(0, 255, 136, 0.05)';
                price.style.color = 'var(--nexti-green)';
            }
        }
    });
}

function filtrarAulas(termo) {
    termo = (termo || '').toLowerCase().trim();
    const items = document.querySelectorAll('.aula-item');
    const headers = document.querySelectorAll('.dia-header');

    items.forEach(item => {
        const title = item.innerText.toLowerCase();
        const matches = !termo || title.includes(termo);
        item.style.display = matches ? 'flex' : 'none';
    });

    headers.forEach(h => {
        if (!termo) {
            h.style.display = 'flex';
        }
    });
}

async function tentarAbrirBonus(bonusId, custo, nomeAula, elementoClicado) {
    if (bonusDesbloqueados.includes(bonusId)) {
        if (!fasesDesbloqueadas.includes(bonusId)) fasesDesbloqueadas.push(bonusId);
        carregarAula(bonusId, nomeAula, elementoClicado);
        return;
    }
    
    const confirmar = await confirmarCyberDialog(
        "Transação de Loja",
        `Deseja desbloquear a disciplina bônus "${nomeAula}" por ${custo} Coins?\n\nSaldo atual: ${coinsTotal} Coins.`
    );
    
    if (confirmar) {
        if (coinsTotal >= custo) {
            coinsTotal -= custo;
            bonusDesbloqueados.push(bonusId);
            localStorage.setItem(userKey + 'coins', coinsTotal);
            localStorage.setItem(userKey + 'bonus_unlocked', JSON.stringify(bonusDesbloqueados));
            document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;
            atualizarFasesVisuais();
            if (window.AudioEngine) AudioEngine.playUnlock();
            mostrarToast("success", "Acesso Concedido", `Disciplina "${nomeAula}" desbloqueada com sucesso!`);
            if (!fasesDesbloqueadas.includes(bonusId)) fasesDesbloqueadas.push(bonusId);
            carregarAula(bonusId, nomeAula, elementoClicado);
        } else {
            if (window.AudioEngine) AudioEngine.playError();
            mostrarToast("error", "Saldo Insuficiente", `Você possui ${coinsTotal} Coins, mas são necessários ${custo} Coins.`);
        }
    }
}

// ==========================================
// 3. SISTEMA DE NIVELAMENTO ENADE
// ==========================================
const quizPerguntas = [
    { p: "1. Python: O que é um Dicionário?", r: ["Uma lista de palavras.", "Estrutura baseada em 'Chave: Valor'.", "Um laço de repetição."], certa: 1 },
    { p: "2. Segurança: O que é Phishing?", r: ["Ataque via e-mail falso.", "Firewall físico.", "Um tipo de vírus de pendrive."], certa: 0 },
    { p: "3. Dados: Qual a principal diferença de uma Fila para uma Pilha?", r: ["Fila é LIFO, Pilha é FIFO.", "Fila é FIFO (Primeiro a entrar, primeiro a sair).", "Pilhas são maiores."], certa: 1 },
    { p: "4. Redes: Para que serve o HTTPS?", r: ["Limpar o cache.", "Conectar o banco de dados.", "Navegação web segura com criptografia."], certa: 2 },
    { p: "5. Banco de Dados: O que é a Chave Estrangeira (FK)?", r: ["Senha do admin.", "Vínculo de referência com a Chave Primária de outra tabela.", "Arquivo JSON."], certa: 1 },
    { p: "6. POO (C#): O que é Polimorfismo?", r: ["Múltiplas formas de um método.", "Esconder código.", "Limpar memória."], certa: 0 },
    { p: "7. UX/UI: O que significa 'Mobile First'?", r: ["Criar o app apenas para Android.", "Desenhar focando primeiro na tela do celular.", "Obrigar login."], certa: 1 },
    { p: "8. Frameworks: O que é um ORM (ex: Entity Framework)?", r: ["Mapeia dados relacionais para objetos da programação.", "Deleta vírus.", "Uma linguagem front-end."], certa: 0 },
    { p: "9. Nuvem: O que faz o Docker?", r: ["Acelerar o WiFi.", "Empacotar sistemas em contêineres isolados.", "Conecta impressoras."], certa: 1 },
    { p: "10. Mobile: O que é o SDK?", r: ["Software Development Kit (Kit de ferramentas para criar apps).", "Um banco de dados.", "Cabo USB."], certa: 0 }
];

let questaoAtualNivelamento = 0;
let acertosNivelamento = 0;
let acertosTesteModulo = 0;

function verificarNivelamento() {
    const jaNivelou = localStorage.getItem(userKey + 'nivelado');
    if (!jaNivelou) document.getElementById('modalNivelamento').classList.add('show');
    else atualizarFasesVisuais(); 
}

function refazerDiagnostico() {
    questaoAtualNivelamento = 0;
    acertosNivelamento = 0;
    document.getElementById('nivelamento-body').innerHTML = `
        <p style="color: #c5c6c7; font-size: 1.1rem; margin-bottom: 20px;">
            Iniciando protocolo de avaliação. Para calibrarmos sua árvore de habilidades, responda às 10 questões técnicas abaixo.
        </p>
        <button class="btn-action btn-right tech-font flex-align-center" style="width: 100%; padding: 15px; justify-content: center;" onclick="iniciarQuizNivelamento()">
            <span class="material-symbols-outlined" style="margin-right:5px;">play_arrow</span> START_SCAN()
        </button>
    `;
    abrirModal('modalNivelamento');
}

function iniciarQuizNivelamento() { renderizarPerguntaNivelamento(); }

function renderizarPerguntaNivelamento() {
    const body = document.getElementById('nivelamento-body');
    const perguntaObj = quizPerguntas[questaoAtualNivelamento];
    let htmlRespostas = perguntaObj.r.map((resposta, index) => 
        `<button class="btn-action tech-font" style="width: 100%; margin-bottom: 10px; text-align: left;" onclick="responderNivelamento(${index})">${resposta}</button>`
    ).join('');
    
    body.innerHTML = `
        <h3 style="color: var(--nexti-cyan); margin-bottom: 15px;">Avaliação Acadêmica ${questaoAtualNivelamento + 1}/10</h3>
        <p style="color: #fff; font-size: 1.1rem; margin-bottom: 25px;">${perguntaObj.p}</p>
        ${htmlRespostas}
    `;
}

function responderNivelamento(indiceResposta) {
    if (window.AudioEngine) AudioEngine.playClick();
    if (indiceResposta === quizPerguntas[questaoAtualNivelamento].certa) acertosNivelamento++;
    questaoAtualNivelamento++;
    if (questaoAtualNivelamento < quizPerguntas.length) renderizarPerguntaNivelamento(); 
    else finalizarNivelamento(); 
}

function finalizarNivelamento() {
    let nivelMsg = "";
    let nomeRank = "";
    let nivelId = 1;
    
    if (acertosNivelamento <= 3) {
        nivelMsg = `Você pontuou ${acertosNivelamento}/10. <br><br><b>Status: Ingressante.</b> Vamos focar na base do Módulo 01!`;
        fasesDesbloqueadas = ['fase1'];
        nomeRank = "Rank: Ingressante";
        nivelId = 1;
    } else if (acertosNivelamento >= 4 && acertosNivelamento <= 7) {
        nivelMsg = `Você pontuou ${acertosNivelamento}/10. <br><br><b>Status: Intermediário.</b> Os Módulos 01 e 02 estão abertos!`;
        fasesDesbloqueadas = ['fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'teste-mod1', 'fase6', 'fase7', 'fase8', 'fase9', 'fase10', 'teste-mod2'];
        nomeRank = "Rank: Intermediário";
        nivelId = 3;
    } else {
        nivelMsg = `Você pontuou ${acertosNivelamento}/10. <br><br><b>Status: Expert Universitário.</b> Todas as 22 disciplinas regulares estão abertas!`;
        fasesDesbloqueadas = [...ordemFases]; 
        nomeRank = "Rank: Expert";
        nivelId = 6;
    }

    localStorage.setItem(userKey + 'nivelado', 'true');
    localStorage.setItem(userKey + 'desbloqueadas', JSON.stringify(fasesDesbloqueadas));
    localStorage.setItem(userKey + 'xp', xpTotal);
    localStorage.setItem(userKey + 'coins', coinsTotal);
    localStorage.setItem(userKey + 'rank', nomeRank);
    
    document.getElementById('menu-user-level').innerText = nomeRank;
    document.getElementById('xp-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">military_tech</span> ${xpTotal} XP`;
    document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;

    if (apiOnline) {
        ApiService.updateUserStats(xpTotal, coinsTotal, nivelId)
            .catch(err => console.error("Erro ao sincronizar estatísticas iniciais da API:", err));
    }

    atualizarBarraNivel(xpTotal);
    if (window.AudioEngine) AudioEngine.playLevelUp();
    if (window.ConfettiEngine) ConfettiEngine.burst(60);

    document.getElementById('nivelamento-body').innerHTML = `
        <h3 style="color: var(--nexti-green); margin-bottom: 15px;">Avaliação Concluída!</h3>
        <p style="color: #c5c6c7; margin-bottom: 25px;">${nivelMsg}</p>
        <button class="btn-action btn-right tech-font flex-align-center" style="width: 100%; justify-content: center;" onclick="fecharModal('modalNivelamento'); atualizarFasesVisuais();">Entrar no Terminal</button>
    `;
}

// ==========================================
// 4. MOTOR DE REPETIÇÃO ESPAÇADA (SM-2) E ENADE
// ==========================================
let deckAtual = [];
let deckRevisao = []; 
let indiceCarta = 0;
let faseAtualId = ''; 

function formatarIntervalo(dias) {
    let d = Math.round(dias);
    if (d < 1) return "<10m";
    if (d === 1) return "1d";
    if (d < 30) return d + "d";
    if (d < 365) return Math.round(d / 30) + "m";
    return Math.round(d / 365) + "a";
}

function gerarBotoesRepeticao(idCarta) {
    let dataSrs = srsData[idCarta] || { rep: 0, interval: 0, ease: 2.5 };
    let tAgain = "<1m", tHard = "<6m", tGood = "<10m", tEasy = "3d";

    if (dataSrs.rep > 0) {
        tHard = formatarIntervalo(Math.max(1, dataSrs.interval * 1.2));
        tGood = formatarIntervalo(Math.max(1, dataSrs.interval * dataSrs.ease));
        tEasy = formatarIntervalo(Math.max(1, dataSrs.interval * dataSrs.ease * 1.3));
    }

    return `
        <div class="anki-container">
            <button class="anki-btn" onclick="processarResposta('again')">
                <span class="anki-time">${tAgain}</span>
                <span class="anki-label" style="color: #ff5555;">De novo</span>
            </button>
            <button class="anki-btn" onclick="processarResposta('hard')">
                <span class="anki-time">${tHard}</span>
                <span class="anki-label" style="color: #ffaa00;">Difícil</span>
            </button>
            <button class="anki-btn" onclick="processarResposta('good')">
                <span class="anki-time">${tGood}</span>
                <span class="anki-label" style="color: #00ff88;">Bom</span>
            </button>
            <button class="anki-btn" onclick="processarResposta('easy')">
                <span class="anki-time">${tEasy}</span>
                <span class="anki-label" style="color: #00e6e6;">Fácil</span>
            </button>
        </div>
    `;
}

async function carregarAula(faseId, nomeAula, elementoClicado) {
    if (!fasesDesbloqueadas.includes(faseId)) {
        if (window.AudioEngine) AudioEngine.playError();
        mostrarToast("warning", "Acesso Bloqueado", "Conclua as disciplinas e testes anteriores para desbloquear!");
        return;
    }

    if (faseId.startsWith('teste-mod')) {
        acertosTesteModulo = 0;
    }

    const rightPanel = document.getElementById('right-panel');
    const leftPanel = document.querySelector('.left-panel'); 

    // Fechar fase se já estiver aberta
    if (elementoClicado.classList.contains('active-lesson')) {
        elementoClicado.classList.remove('active-lesson');
        leftPanel.classList.remove('focus-mode'); 
        
        // Retorna o scroll com o ajuste fino de 2.2px para cima
        const headerFixHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 80;
        const y = elementoClicado.getBoundingClientRect().top + window.pageYOffset - headerFixHeight - 2.2;
        window.scrollTo({ top: y, behavior: 'smooth' });

        setTimeout(() => { leftPanel.classList.remove('fade-out-others'); }, 50);
        document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));
        rightPanel.classList.remove('active'); 
        setTimeout(() => { rightPanel.style.display = 'none'; }, 1000); 
        
        localStorage.removeItem(userKey + 'active_state');
        return; 
    }

    // Abrir Fase
    document.querySelectorAll('.aula-item').forEach(el => el.classList.remove('active-lesson'));
    elementoClicado.classList.add('active-lesson');
    leftPanel.classList.add('fade-out-others');
    document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));
    
    let prev = elementoClicado.previousElementSibling;
    while(prev) {
        if(prev.classList.contains('dia-header')) { prev.classList.add('active-header'); break; }
        prev = prev.previousElementSibling;
    }

    document.getElementById('botoes-jogo').style.display = 'flex';
    document.getElementById('botao-proxima').style.display = 'none';

    localStorage.setItem(userKey + 'active_state', JSON.stringify({ type: 'aula', id: faseId, title: nomeAula }));
    faseAtualId = faseId;
    let cartasDaFase = [];
    if (faseId.startsWith('teste-mod')) {
        let numMod = parseInt(faseId.replace('teste-mod', ''));
        let fasesDoModulo = [];
        if (numMod === 1) fasesDoModulo = ['fase1', 'fase2', 'fase3', 'fase4', 'fase5'];
        else if (numMod === 2) fasesDoModulo = ['fase6', 'fase7', 'fase8', 'fase9', 'fase10'];
        else if (numMod === 3) fasesDoModulo = ['fase11', 'fase12', 'fase13', 'fase14', 'fase15'];
        else if (numMod === 4) fasesDoModulo = ['fase16', 'fase17', 'fase18', 'fase19', 'fase20'];
        else if (numMod === 5) fasesDoModulo = ['fase21', 'fase22'];

        let todosCards = [];
        fasesDoModulo.forEach(fId => {
            todosCards = todosCards.concat(meusDecks[fId] || []);
        });

        let totalDesejado = Math.min(20, todosCards.length);
        let selecionados = [];
        let copiaCards = [...todosCards];
        for (let i = 0; i < totalDesejado; i++) {
            let idxRand = Math.floor(Math.random() * copiaCards.length);
            selecionados.push(copiaCards.splice(idxRand, 1)[0]);
        }

        cartasDaFase = selecionados.map(card => {
            let respostaCorreta = card.verso;
            let outrosVersos = todosCards
                .filter(c => c.verso !== respostaCorreta)
                .map(c => c.verso);
            
            outrosVersos = [...new Set(outrosVersos)];

            let distratores = [];
            for (let i = 0; i < 3; i++) {
                if (outrosVersos.length === 0) break;
                let idxRand = Math.floor(Math.random() * outrosVersos.length);
                distratores.push(outrosVersos.splice(idxRand, 1)[0]);
            }

            let alternativas = [respostaCorreta, ...distratores];

            for (let i = alternativas.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [alternativas[i], alternativas[j]] = [alternativas[j], alternativas[i]];
            }

            let corretaIdx = alternativas.indexOf(respostaCorreta);
            let letras = ["A", "B", "C", "D"];
            let opcoesFormatadas = alternativas.map((alt, idx) => `${letras[idx]}) ${alt}`);

            return {
                id: card.id || Math.floor(Math.random() * 100000),
                frente: card.frente,
                verso: card.verso,
                dica: card.dica,
                opcoes: opcoesFormatadas,
                correta: corretaIdx
            };
        });
    } else if (apiOnline) {
        try {
            const responseCards = await ApiService.getFlashcardsPorFase(faseId);
            if (responseCards && responseCards.length > 0) {
                cartasDaFase = responseCards.map(c => {
                    let cardObj = {
                        id: c.id,
                        frente: c.frente,
                        verso: c.verso,
                        dica: c.dica
                    };
                    if (c.opcoes) {
                        cardObj.opcoes = Array.isArray(c.opcoes) ? c.opcoes : String(c.opcoes).split(';');
                        cardObj.correta = c.correta;
                    }
                    return cardObj;
                });
            } else {
                cartasDaFase = [...(meusDecks[faseId] || [])];
            }
        } catch (e) {
            console.error("Erro ao buscar flashcards da API, usando local:", e);
            cartasDaFase = [...(meusDecks[faseId] || [])];
        }
    } else {
        cartasDaFase = [...(meusDecks[faseId] || [])];
    }
    let agora = new Date().getTime();

    // Priorização SM-2: Novas/Devidas primeiro, Revisadas depois (deck completo)
    if (faseId.startsWith('teste-mod')) {
        deckAtual = [...cartasDaFase];
    } else {
        let cartasNovasOuDevidas = [];
        let cartasRevisadas = [];

        cartasDaFase.forEach(carta => {
            let infoProgresso = srsData[carta.frente];
            if (!infoProgresso || infoProgresso.next <= agora) {
                cartasNovasOuDevidas.push(carta);
            } else {
                cartasRevisadas.push(carta);
            }
        });

        // Embaralha cada grupo separadamente
        for (let i = cartasNovasOuDevidas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cartasNovasOuDevidas[i], cartasNovasOuDevidas[j]] = [cartasNovasOuDevidas[j], cartasNovasOuDevidas[i]];
        }
        for (let i = cartasRevisadas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cartasRevisadas[i], cartasRevisadas[j]] = [cartasRevisadas[j], cartasRevisadas[i]];
        }

        // Novas/Devidas primeiro, revisadas ao final — deck completo
        deckAtual = [...cartasNovasOuDevidas, ...cartasRevisadas];
    }

    if (deckAtual.length === 0) {
        elementoClicado.classList.remove('active-lesson');
        leftPanel.classList.remove('focus-mode'); 
        leftPanel.classList.remove('fade-out-others');
        document.querySelectorAll('.dia-header').forEach(el => el.classList.remove('active-header'));
        
        rightPanel.classList.remove('active'); 
        setTimeout(() => { rightPanel.style.display = 'none'; }, 1000); 
        localStorage.removeItem(userKey + 'active_state');
        return;
    }

    // Shuffle para testes de módulo
    if (faseId.startsWith('teste-mod')) {
        for (let i = deckAtual.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deckAtual[i], deckAtual[j]] = [deckAtual[j], deckAtual[i]];
        }
    }

    document.getElementById('titulo-aula').innerHTML = `Processando: <span style="color: var(--nexti-cyan)">${nomeAula}</span>`;
    elementoClicado.after(rightPanel);
    rightPanel.style.display = 'block';
    
    setTimeout(() => { rightPanel.classList.add('active'); }, 50);

    // ===============================================
    // LÓGICA BLINDADA DE SCROLL (Ajuste fino Sub-pixel 2.2px)
    // ===============================================
    setTimeout(() => {
        if (elementoClicado.classList.contains('active-lesson')) {
            leftPanel.classList.add('focus-mode');

            setTimeout(() => {
                const headerObj = document.querySelector('header');
                const headerFixHeight = headerObj ? headerObj.offsetHeight : 80;
                
                const targetBox = elementoClicado;
                const elementTop = targetBox.getBoundingClientRect().top;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                
                // Aplicado o ajuste exato de 6px que pediu
                const targetPosition = scrollY + elementTop - headerFixHeight - 6;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }, 100); 
        }
    }, 700); 

    deckRevisao = []; 
    indiceCarta = 0;
    
    mostrarCartaAtual();
}

function mostrarCartaAtual() {
    const cardInner = document.getElementById('meuCard');
    cardInner.classList.remove('flipped'); 

    const carta = deckAtual[indiceCarta];
    if (!carta) return; 

    const frenteEl = document.getElementById('texto-frente');
    const versoEl = document.getElementById('texto-verso');
    const isEnade = carta.opcoes;

    if (isEnade) {
        frenteEl.style.textAlign = 'left';
        versoEl.style.textAlign = 'left';
        
        let htmlOpcoes = carta.opcoes.map((op, idx) => 
            `<button class="btn-opcao" onclick="event.stopPropagation(); verificarEnade(${idx}, ${carta.correta})">${op}</button>`
        ).join('');

        frenteEl.innerHTML = `
            <div style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">${carta.frente}</div>
            <div class="opcoes-container">${htmlOpcoes}</div>
        `;
        
        versoEl.innerHTML = `
            <div style="font-size: 0.95rem; color: #8b92a5; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #30363d; width: 100%; text-align: left; line-height: 1.5;">
                <strong style="color: var(--nexti-cyan);">Relembrando a Questão:</strong><br><br>${carta.frente}
            </div>
            <div style="font-size: 1.1rem; text-align: left; line-height: 1.6; color: #fff;">
                ${carta.verso.replace(/\n/g, '<br>')}
            </div>
        `;
        
        document.getElementById('dica-frente').innerText = "Selecione a alternativa correta abaixo";
        document.getElementById('dica-verso').innerText = carta.dica || ""; 
        document.getElementById('botoes-jogo').style.display = 'none';
    } else {
        frenteEl.style.fontSize = '1.5rem';
        frenteEl.style.textAlign = 'center';
        
        frenteEl.innerHTML = carta.frente;
        versoEl.innerHTML = `
            <div style="font-size: 0.95rem; color: #8b92a5; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #30363d; width: 100%; text-align: center;">
                <strong style="color: var(--nexti-cyan);">Pergunta Original:</strong><br><br>${carta.frente}
            </div>
            <div style="font-size: 1.3rem; text-align: center; color: #fff; font-weight: 500;">
                ${carta.verso.replace(/\n/g, '<br>')}
            </div>
        `;

        document.getElementById('dica-frente').innerText = "Aperte [ESPAÇO] para debugar";
        document.getElementById('dica-verso').innerText = carta.dica || ""; 
        
        document.getElementById('botoes-jogo').innerHTML = `
            <button class="btn-mostrar tech-font" onclick="virarCarta()">MOSTRAR RESPOSTA</button>
        `;
        document.getElementById('botoes-jogo').style.display = 'flex';
    }
    document.getElementById('contador-cartas').innerText = `Item ${indiceCarta + 1}/${deckAtual.length}`;
}

function virarCarta() {
    const isEnade = deckAtual[indiceCarta] && deckAtual[indiceCarta].opcoes;

    if (isEnade) {
        const botoesVisiveis = document.getElementById('botoes-jogo').style.display === 'flex';
        if (!botoesVisiveis) return;
    }

    if (deckAtual.length > 0 && indiceCarta < deckAtual.length) {
        const card = document.getElementById('meuCard');
        card.classList.toggle('flipped');
        
        if (window.AudioEngine) AudioEngine.playFlip();

        if (!isEnade && card.classList.contains('flipped')) {
            document.getElementById('botoes-jogo').innerHTML = gerarBotoesRepeticao(deckAtual[indiceCarta].frente);
        } else if (!isEnade && !card.classList.contains('flipped')) {
            document.getElementById('botoes-jogo').innerHTML = `<button class="btn-mostrar tech-font" onclick="virarCarta()">MOSTRAR RESPOSTA</button>`;
        }
    }
}

document.addEventListener('keydown', function(e) {
    const isEditingInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

    // Atalho Esc para fechar qualquer modal ou cyber dialog
    if (e.key === 'Escape') {
        const dialogOverlay = document.getElementById('cyber-dialog-overlay');
        if (dialogOverlay && dialogOverlay.classList.contains('show')) {
            const btnCancel = document.getElementById('cyber-dialog-btn-cancel');
            if (btnCancel) btnCancel.click();
            return;
        }
        document.querySelectorAll('.modal-overlay.show').forEach(modal => {
            modal.classList.remove('show');
            localStorage.removeItem(userKey + 'active_state');
        });
        const menu = document.getElementById('dropdownMenu');
        if (menu) menu.classList.remove('show');
        return;
    }

    // Atalho "/" para focar rapidamente na busca de disciplinas
    if (e.key === '/' && !isEditingInput) {
        e.preventDefault();
        const searchInput = document.getElementById('filtro-aulas');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
        return;
    }

    const isPlaying = document.getElementById('right-panel').classList.contains('active');
    if (!isPlaying || isEditingInput) return;

    const isEnade = deckAtual[indiceCarta] && deckAtual[indiceCarta].opcoes;
    if (isEnade) return; 

    const card = document.getElementById('meuCard');
    const isFlipped = card?.classList.contains('flipped');

    if (e.code === 'Space') {
        e.preventDefault();
        if (!isFlipped) virarCarta();
        else processarResposta('good'); 
    } else if (isFlipped) {
        if (e.key === '1') processarResposta('again');
        if (e.key === '2') processarResposta('hard');
        if (e.key === '3') processarResposta('good');
        if (e.key === '4') processarResposta('easy');
    }
});

function soltarEstrelas(botaoElement) {
    for (let i = 0; i < 8; i++) {
        let star = document.createElement('div');
        star.innerText = '⭐';
        star.className = 'star-anim';
        star.style.left = (Math.random() * 80 + 10) + '%'; 
        star.style.animationDelay = (Math.random() * 0.3) + 's';
        botaoElement.appendChild(star);
        setTimeout(() => star.remove(), 1000);
    }
}

function verificarEnade(escolhida, correta) {
    const botoes = document.querySelectorAll('.btn-opcao');
    botoes.forEach(b => b.disabled = true);

    const isTesteMod = faseAtualId.startsWith('teste-mod');

    if (escolhida === correta) {
        if (window.AudioEngine) AudioEngine.playCorrect();
        botoes[escolhida].classList.add('opcao-correta');
        soltarEstrelas(botoes[escolhida]);
        if (isTesteMod) {
            acertosTesteModulo++;
        }
        
        setTimeout(() => {
            document.getElementById('meuCard').classList.add('flipped');
            if (isTesteMod) {
                document.getElementById('botoes-jogo').innerHTML = `
                    <div class="anki-container">
                        <button class="anki-btn" onclick="processarResposta('proxima-teste')">
                            <span class="anki-label" style="color: #00ff88;">Continuar Teste</span>
                        </button>
                    </div>
                `;
            } else {
                document.getElementById('botoes-jogo').innerHTML = gerarBotoesRepeticao(deckAtual[indiceCarta].frente);
            }
            document.getElementById('botoes-jogo').style.display = 'flex';
        }, 2200);

    } else {
        if (window.AudioEngine) AudioEngine.playError();
        botoes[escolhida].classList.add('opcao-errada');
        botoes[correta].classList.add('opcao-correta'); 
        
        setTimeout(() => {
            document.getElementById('meuCard').classList.add('flipped');
            if (isTesteMod) {
                document.getElementById('botoes-jogo').innerHTML = `
                    <div class="anki-container">
                        <button class="anki-btn" onclick="processarResposta('proxima-teste')">
                            <span class="anki-label" style="color: #ffaa00;">Continuar Teste</span>
                        </button>
                    </div>
                `;
            } else {
                document.getElementById('botoes-jogo').innerHTML = `
                    <div class="anki-container">
                        <button class="anki-btn" style="border-color: #ff5555;" onclick="processarResposta('again')">
                            <span class="anki-time"><1m</span>
                            <span class="anki-label" style="color: #ff5555;">Errou (Repetir Hoje)</span>
                        </button>
                    </div>
                `;
            }
            document.getElementById('botoes-jogo').style.display = 'flex';
        }, 2200);
    }
}

function processarResposta(resultado) {
    if (deckAtual.length === 0 || indiceCarta >= deckAtual.length) return;
    
    let cartaAtual = deckAtual[indiceCarta];
    let idCarta = cartaAtual.frente; 
    let dataSrs = srsData[idCarta] || { rep: 0, interval: 0, ease: 2.5, next: 0 };
    let agora = new Date().getTime();

    if (resultado === 'proxima-teste') {
        if (window.AudioEngine) AudioEngine.playClick();
    } else if (resultado === 'again' || resultado === 'errei') {
        if (window.AudioEngine) AudioEngine.playError();
        deckRevisao.push(cartaAtual); 
        dataSrs.rep = 0;
        dataSrs.interval = 1;
        dataSrs.ease = Math.max(1.3, dataSrs.ease - 0.2); 
    } else if (resultado === 'hard') {
        if (window.AudioEngine) AudioEngine.playClick();
        dataSrs.interval = Math.max(1, Math.round(dataSrs.interval * 1.2));
        dataSrs.ease = Math.max(1.3, dataSrs.ease - 0.15);
        dataSrs.rep++;
    } else if (resultado === 'good' || resultado === 'acertei') {
        if (window.AudioEngine) AudioEngine.playCorrect();
        if (dataSrs.rep === 0) dataSrs.interval = 1;
        else dataSrs.interval = Math.max(1, Math.round(dataSrs.interval * dataSrs.ease));
        dataSrs.rep++;
    } else if (resultado === 'easy') {
        if (window.AudioEngine) AudioEngine.playUnlock();
        if (dataSrs.rep === 0) dataSrs.interval = 3;
        else dataSrs.interval = Math.max(1, Math.round(dataSrs.interval * dataSrs.ease * 1.3));
        dataSrs.ease += 0.15; 
        dataSrs.rep++;
    }

    if (!faseAtualId.startsWith('teste-mod')) {
        dataSrs.next = agora + (dataSrs.interval * 86400000); 
        srsData[idCarta] = dataSrs;
        localStorage.setItem(userKey + 'srs', JSON.stringify(srsData));
        
        if (apiOnline) {
            const usuarioId = parseInt(localStorage.getItem('quest_user_id')) || 0;
            const flashcardId = cartaAtual.id;
            let qualidadeNum = 4;
            if (resultado === 'again' || resultado === 'errei') qualidadeNum = 1;
            else if (resultado === 'hard') qualidadeNum = 3;
            else if (resultado === 'good' || resultado === 'acertei') qualidadeNum = 4;
            else if (resultado === 'easy') qualidadeNum = 5;

            if (usuarioId && flashcardId) {
                ApiService.atualizarProgresso(usuarioId, flashcardId, qualidadeNum)
                    .catch(err => console.error("Erro ao sincronizar progresso com a API:", err));
            }
        }
    }
    
    indiceCarta++;
    document.getElementById('meuCard').classList.remove('flipped');
    
    setTimeout(() => {
        if (indiceCarta >= deckAtual.length) {
            if (faseAtualId.startsWith('teste-mod')) {
                finalizarTesteModulo();
            } else if (deckRevisao.length > 0) {
                deckAtual = [...deckRevisao]; 
                deckRevisao = []; 
                indiceCarta = 0;
                mostrarCartaAtual();
                document.getElementById('dica-frente').innerText = "🔄 Reprocessando os erros de hoje...";
            } else {
                finalizarDeck();
            }
        } else {
            mostrarCartaAtual();
        }
    }, 300); 
}

function finalizarDeck() {
    if (window.AudioEngine) AudioEngine.playLevelUp();
    if (window.ConfettiEngine) ConfettiEngine.burst(50);
    document.getElementById('texto-frente').innerText = "Rotina Concluída 🎉";
    document.getElementById('texto-verso').innerText = "Código executado com sucesso!";
    document.getElementById('dica-verso').innerText = "Recolha seu XP e Coins abaixo.";
    document.getElementById('contador-cartas').innerText = "Status: Finalizado";
    document.getElementById('botoes-jogo').style.display = 'none';
    document.getElementById('botao-proxima').style.display = 'flex';
}

function finalizarTesteModulo() {
    let porcentagem = Math.round((acertosTesteModulo / deckAtual.length) * 100);
    const isMod5 = faseAtualId === 'teste-mod5';
    let corte = isMod5 ? 80 : 70;
    let passou = porcentagem >= corte;

    if (passou) {
        if (window.AudioEngine) AudioEngine.playLevelUp();
        if (window.ConfettiEngine) ConfettiEngine.celebrate();
        if (isMod5) {
            document.getElementById('texto-frente').innerText = "Curso Concluído! 📜🎉";
            document.getElementById('texto-verso').innerText = `Aproveitamento: ${porcentagem}% (${acertosTesteModulo}/${deckAtual.length} acertos).\n\nVocê desbloqueou o Certificado de Conclusão Oficial!`;
            document.getElementById('dica-verso').innerText = "Parabéns! Recolha seu XP e verifique seu Certificado no menu lateral.";
        } else {
            document.getElementById('texto-frente').innerText = "Teste Aprovado! 🎉";
            document.getElementById('texto-verso').innerText = `Aproveitamento: ${porcentagem}% (${acertosTesteModulo}/${deckAtual.length} acertos).\n\nCódigo executado com sucesso!`;
            document.getElementById('dica-verso').innerText = "Recolha seu XP abaixo.";
        }
    } else {
        if (window.AudioEngine) AudioEngine.playError();
        document.getElementById('texto-frente').innerText = "Teste Reprovado ❌";
        document.getElementById('texto-verso').innerText = `Aproveitamento: ${porcentagem}% (${acertosTesteModulo}/${deckAtual.length} acertos).\n\nVocê precisa de pelo menos ${corte}% de acertos para passar.`;
        document.getElementById('dica-verso').innerText = "Estude mais o módulo e tente novamente.";
    }
    
    document.getElementById('contador-cartas').innerText = `Resultado: ${porcentagem}%`;
    document.getElementById('botoes-jogo').style.display = 'none';
    document.getElementById('botao-proxima').style.display = 'flex';
}

function irParaProximaAula() {
    let xpGanho = 0;
    let coinsGanho = 0;

    const isTesteMod = faseAtualId.startsWith('teste-mod');
    let testePassou = true;

    if (isTesteMod) {
        let porcentagem = Math.round((acertosTesteModulo / deckAtual.length) * 100);
        const isMod5 = faseAtualId === 'teste-mod5';
        let corte = isMod5 ? 80 : 70;
        testePassou = porcentagem >= corte;
        if (testePassou) {
            xpGanho = isMod5 ? 50 : 25;
            coinsGanho = 0;
        }
    } else if (faseAtualId.startsWith('fase')) {
        let numFase = parseInt(faseAtualId.replace('fase', ''));
        if (!isNaN(numFase)) {
            if (numFase >= 1 && numFase <= 5)        { xpGanho = 5;  coinsGanho = 10; } 
            else if (numFase >= 6 && numFase <= 10)  { xpGanho = 10; coinsGanho = 10; } 
            else if (numFase >= 11 && numFase <= 15) { xpGanho = 15; coinsGanho = 10; } 
            else if (numFase >= 16 && numFase <= 20) { xpGanho = 20; coinsGanho = 10; } 
            else if (numFase >= 21 && numFase <= 22) { xpGanho = 30; coinsGanho = 70; } 
        }
    } else if (faseAtualId.startsWith('bonus')) {
        xpGanho = 25; coinsGanho = 15;
    }

    if (isTesteMod && !testePassou) {
        const isMod5 = faseAtualId === 'teste-mod5';
        let corte = isMod5 ? 80 : 70;
        if (window.AudioEngine) AudioEngine.playError();
        mostrarToast(
            "error",
            "Acesso Negado",
            `Aproveitamento de ${Math.round((acertosTesteModulo / deckAtual.length) * 100)}% (mínimo: ${corte}%). Estude o módulo e tente novamente!`
        );
        document.getElementById('menu-' + faseAtualId).click(); 
        return;
    }

    xpTotal += xpGanho;
    coinsTotal += coinsGanho;
    
    localStorage.setItem(userKey + 'xp', xpTotal);
    localStorage.setItem(userKey + 'coins', coinsTotal);
    
    document.getElementById('xp-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">military_tech</span> ${xpTotal} XP`;
    document.getElementById('coin-display').innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.2rem;">toll</span> ${coinsTotal}`;

    let nivelAtual = 1;
    let rankAtual = localStorage.getItem(userKey + 'rank') || 'Rank: Ingressante';
    if (rankAtual.includes("Expert")) {
        nivelAtual = 6;
    } else if (rankAtual.includes("Intermediário")) {
        nivelAtual = 3;
    } else {
        nivelAtual = 1;
    }
    
    if (xpTotal >= 300) {
        nivelAtual = Math.max(nivelAtual, 6);
        localStorage.setItem(userKey + 'rank', "Rank: Expert");
        document.getElementById('menu-user-level').innerText = "Rank: Expert";
    } else if (xpTotal >= 100) {
        nivelAtual = Math.max(nivelAtual, 3);
        localStorage.setItem(userKey + 'rank', "Rank: Intermediário");
        document.getElementById('menu-user-level').innerText = "Rank: Intermediário";
    }

    if (apiOnline) {
        ApiService.updateUserStats(xpTotal, coinsTotal, nivelAtual)
            .catch(err => console.error("Erro ao sincronizar estatísticas com a API:", err));
    }

    atualizarBarraNivel(xpTotal);

    const indexAtual = ordemFases.indexOf(faseAtualId);
    
    if (isTesteMod) {
        let porcentagem = Math.round((acertosTesteModulo / deckAtual.length) * 100);
        if (indexAtual >= 0 && indexAtual < ordemFases.length - 1) {
            const proximaFase = ordemFases[indexAtual + 1];
            if (!fasesDesbloqueadas.includes(proximaFase)) {
                fasesDesbloqueadas.push(proximaFase);
                localStorage.setItem(userKey + 'desbloqueadas', JSON.stringify(fasesDesbloqueadas));
                atualizarFasesVisuais(); 
                if (window.AudioEngine) AudioEngine.playLevelUp();
                if (window.ConfettiEngine) ConfettiEngine.burst(50);
                mostrarToast("success", "Novo Acesso Concedido", `Teste concluído com ${porcentagem}%! (+${xpGanho} XP)`);
            } else {
                mostrarToast("success", "Teste Revisitado", `Aproveitamento: ${porcentagem}% (+${xpGanho} XP)`);
            }
        } else if (faseAtualId === 'teste-mod5') {
            localStorage.setItem(userKey + 'certificado_unlocked', 'true');
            atualizarFasesVisuais(); 
            if (window.AudioEngine) AudioEngine.playLevelUp();
            if (window.ConfettiEngine) ConfettiEngine.celebrate();
            mostrarToast("success", "Certificado Desbloqueado! 📜", `Parabéns! Aproveitamento de ${porcentagem}% no ENADE! (+${xpGanho} XP)`);
        }
    } else if (indexAtual >= 0 && indexAtual < ordemFases.length - 1) {
        const proximaFase = ordemFases[indexAtual + 1];
        if (!fasesDesbloqueadas.includes(proximaFase)) {
            fasesDesbloqueadas.push(proximaFase);
            localStorage.setItem(userKey + 'desbloqueadas', JSON.stringify(fasesDesbloqueadas));
            atualizarFasesVisuais(); 
            if (window.AudioEngine) AudioEngine.playLevelUp();
            mostrarToast("success", "Missão Concluída! 🔓", `Novo nível liberado! (+${xpGanho} XP, +${coinsGanho} Coins)`);
        } else {
            mostrarToast("info", "Revisão Concluída", `Revisão finalizada (+${xpGanho} XP, +${coinsGanho} Coins)`);
        }
    } else if (indexAtual === ordemFases.length - 1) {
        mostrarToast("success", "ENADE Concluído", `Missão finalizada! (+${xpGanho} XP, +${coinsGanho} Coins)`);
    } else if (faseAtualId.startsWith('bonus')) {
        mostrarToast("success", "Bônus Concluído", `Conhecimento extra rendeu +${xpGanho} XP e +${coinsGanho} Coins!`);
    }

    document.getElementById('menu-' + faseAtualId).click(); 
}

// ==========================================
// 5. MODAIS E CONFIGURAÇÕES
// ==========================================
function toggleMenu() { document.getElementById('dropdownMenu').classList.toggle('show'); }

document.addEventListener('click', function(event) {
    const menu = document.getElementById('dropdownMenu');
    const btn = document.querySelector('.hamburger-btn');
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) { 
        menu.classList.remove('show'); 
    }
});

function atualizarOpcoesSelectCriacao() {
    const selectFase = document.getElementById('nova-fase');
    if (!selectFase) return;

    if (opcoesOriginaisNovaFase.length === 0) {
        opcoesOriginaisNovaFase = Array.from(selectFase.options).map(opt => ({
            value: opt.value,
            text: opt.text
        }));

        // Comportamento dinâmico para simular dropdown flutuante limitado a 10 opções
        selectFase.addEventListener('focus', function() {
            if (this.options.length > 10) {
                this.size = 10;
                this.classList.add('select-aberto');
            }
        });
        selectFase.addEventListener('blur', function() {
            this.size = 1;
            this.classList.remove('select-aberto');
        });
        selectFase.addEventListener('change', function() {
            this.blur();
        });
        selectFase.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
    }

    selectFase.innerHTML = '';

    opcoesOriginaisNovaFase.forEach(opt => {
        if (fasesDesbloqueadas.includes(opt.value)) {
            const novaOpt = document.createElement('option');
            novaOpt.value = opt.value;
            novaOpt.text = opt.text;
            selectFase.appendChild(novaOpt);
        }
    });

    if (faseAtualId && fasesDesbloqueadas.includes(faseAtualId)) {
        selectFase.value = faseAtualId;
    } else if (selectFase.options.length > 0) {
        selectFase.selectedIndex = selectFase.options.length - 1;
    }
}

function abrirModal(idModal) {
    if (idModal === 'modalCriacao') {
        atualizarOpcoesSelectCriacao();
    }

    document.getElementById(idModal).classList.add('show');
    const menu = document.getElementById('dropdownMenu');
    if (menu) menu.classList.remove('show'); 
    localStorage.setItem(userKey + 'active_state', JSON.stringify({ type: 'modal', id: idModal }));
}

function fecharModal(idModal) { 
    document.getElementById(idModal).classList.remove('show'); 
    const state = JSON.parse(localStorage.getItem(userKey + 'active_state'));
    if (state && state.type === 'modal' && state.id === idModal) {
        localStorage.removeItem(userKey + 'active_state');
    }
}

function salvarFlashcard() {
    const fase = document.getElementById('nova-fase').value.trim().toLowerCase();
    const frente = document.getElementById('nova-frente').value.trim();
    const verso = document.getElementById('nova-verso').value.trim();
    const dica = document.getElementById('nova-dica').value.trim();

    if (!fase || !frente || !verso) { 
        if (window.AudioEngine) AudioEngine.playError();
        mostrarToast("warning", "Campos Obrigatórios", "Por favor, preencha Frente e Verso da carta.");
        return; 
    }

    if (!meusDecks[fase]) meusDecks[fase] = [];
    meusDecks[fase].push({ frente, verso, dica });
    
    localStorage.setItem(userKey + 'decks', JSON.stringify(meusDecks));

    // Sincroniza com a API se estiver online
    if (apiOnline) {
        ApiService.criarFlashcard(fase, frente, verso, dica)
            .then(() => console.log("Flashcard persistido no banco de dados com sucesso!"))
            .catch(err => console.warn("Flashcard salvo localmente (offline fallback):", err));
    }

    document.getElementById('nova-frente').value = '';
    document.getElementById('nova-verso').value = '';
    document.getElementById('nova-dica').value = '';
    fecharModal('modalCriacao');

    if (window.AudioEngine) AudioEngine.playUnlock();
    mostrarToast("success", "Flashcard Salvo", "Novo dado registrado com sucesso na disciplina!");
}

function mostrarProgresso() {
    let totalCartas = 0;
    for (const cartas of Object.values(meusDecks)) { totalCartas += cartas.length; }
    
    let cartasMaduras = 0;
    let cartasEmAprendizado = 0;
    let cartasDevidasHoje = 0;
    let agora = new Date().getTime();
    let somaFacilidade = 0;
    let totalComSRS = 0;

    for (const [frente, srs] of Object.entries(srsData)) {
        if (srs && srs.rep > 0) {
            totalComSRS++;
            somaFacilidade += (srs.ease || 2.5);
            if ((srs.interval || 0) >= 21) {
                cartasMaduras++;
            } else {
                cartasEmAprendizado++;
            }
            if (srs.next && srs.next <= agora) {
                cartasDevidasHoje++;
            }
        }
    }

    let facilidadeMedia = totalComSRS > 0 ? (somaFacilidade / totalComSRS).toFixed(2) : '2.50';
    let taxaRetencao = totalComSRS > 0 ? Math.round((cartasMaduras / totalComSRS) * 100) : 0;

    const modulos = [
        { nome: "Mod 01: Fundamentos", fases: ['fase1', 'fase2', 'fase3', 'fase4', 'fase5'], cor: 'var(--nexti-cyan)' },
        { nome: "Mod 02: Engenharia", fases: ['fase6', 'fase7', 'fase8', 'fase9', 'fase10'], cor: 'var(--nexti-green)' },
        { nome: "Mod 03: Desenvolvimento", fases: ['fase11', 'fase12', 'fase13', 'fase14', 'fase15'], cor: '#ffd700' },
        { nome: "Mod 04: Tecnologias Avançadas", fases: ['fase16', 'fase17', 'fase18', 'fase19', 'fase20'], cor: 'var(--nexti-purple)' },
        { nome: "Mod 05: Preparatório ENADE", fases: ['fase21', 'fase22'], cor: '#ff4500' }
    ];

    let htmlModulos = modulos.map(m => {
        let concluidas = m.fases.filter(f => fasesDesbloqueadas.includes(f)).length;
        let pct = Math.round((concluidas / m.fases.length) * 100);
        return `
            <div class="module-stat-row">
                <div class="module-stat-header">
                    <span>${m.nome}</span>
                    <span class="tech-font">${pct}% (${concluidas}/${m.fases.length})</span>
                </div>
                <div class="module-stat-bar-track">
                    <div class="module-stat-bar-fill" style="width: ${pct}%; background-color: ${m.cor};"></div>
                </div>
            </div>
        `;
    }).join('');

    const conteudo = `
        <div class="stats-analytics-container">
            <div class="stats-grid-analytics">
                <div class="stats-analytics-card highlight-cyan">
                    <span class="stats-card-label">Nível Acadêmico</span>
                    <span class="stats-card-value tech-font">${xpTotal} XP</span>
                </div>
                <div class="stats-analytics-card highlight-gold">
                    <span class="stats-card-label">Moedas Dev</span>
                    <span class="stats-card-value tech-font">🪙 ${coinsTotal}</span>
                </div>
                <div class="stats-analytics-card highlight-green">
                    <span class="stats-card-label">Cards no Sistema</span>
                    <span class="stats-card-value tech-font">${totalCartas}</span>
                </div>
                <div class="stats-analytics-card highlight-purple">
                    <span class="stats-card-label">Taxa de Retenção</span>
                    <span class="stats-card-value tech-font">${taxaRetencao}%</span>
                </div>
            </div>

            <div class="stats-section-title tech-font">
                <span class="material-symbols-outlined" style="font-size: 1.1rem;">psychology</span>
                Métricas do Motor Anki (SM-2)
            </div>
            <div class="stats-grid-analytics">
                <div class="stats-analytics-card">
                    <span class="stats-card-label">Maduras (Retidas)</span>
                    <span class="stats-card-value tech-font" style="color: var(--nexti-green);">${cartasMaduras}</span>
                </div>
                <div class="stats-analytics-card">
                    <span class="stats-card-label">Em Aprendizado</span>
                    <span class="stats-card-value tech-font" style="color: var(--nexti-blue);">${cartasEmAprendizado}</span>
                </div>
                <div class="stats-analytics-card">
                    <span class="stats-card-label">Devidas Hoje</span>
                    <span class="stats-card-value tech-font" style="color: #ffd700;">${cartasDevidasHoje}</span>
                </div>
                <div class="stats-analytics-card">
                    <span class="stats-card-label">Facilidade Média</span>
                    <span class="stats-card-value tech-font" style="color: var(--nexti-purple);">${facilidadeMedia}</span>
                </div>
            </div>

            <div class="stats-section-title tech-font">
                <span class="material-symbols-outlined" style="font-size: 1.1rem;">account_tree</span>
                Progresso das Trilhas e Módulos
            </div>
            <div class="module-progress-list">
                ${htmlModulos}
            </div>

            <div class="stats-section-title tech-font">
                <span class="material-symbols-outlined" style="font-size: 1.1rem;">cloud_sync</span>
                Gerenciamento de Dados & Backup
            </div>
            <div class="backup-actions-grid tech-font">
                <button class="btn-backup-action" onclick="exportarBackupJSON()">
                    <span class="material-symbols-outlined" style="font-size: 1.1rem;">download</span> Backup .JSON
                </button>
                <label class="btn-backup-action" style="cursor: pointer; margin: 0;">
                    <span class="material-symbols-outlined" style="font-size: 1.1rem;">upload</span> Restaurar .JSON
                    <input type="file" id="input-restore-backup" accept=".json" style="display: none;" onchange="importarBackupJSON(event)">
                </label>
                <button class="btn-backup-action" onclick="exportarRelatorioExcelCSV()">
                    <span class="material-symbols-outlined" style="font-size: 1.1rem;">table_view</span> Excel (.CSV)
                </button>
            </div>
        </div>
    `;
    document.getElementById('progresso-body').innerHTML = conteudo;
    abrirModal('modalProgresso');
}

function baixarArquivo(conteudo, nomeArquivo, tipoMime) {
    const blob = new Blob([conteudo], { type: tipoMime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 200);
}

function exportarBackupJSON() {
    const backup = {
        versao: 1,
        aplicacao: 'Nex_TI',
        exportedAt: new Date().toISOString(),
        usuario: nomeSalvo,
        xp: xpTotal,
        coins: coinsTotal,
        rank: localStorage.getItem(userKey + 'rank'),
        fasesDesbloqueadas: fasesDesbloqueadas,
        bonusDesbloqueados: bonusDesbloqueados,
        srsData: srsData,
        decks: meusDecks,
        mapState: JSON.parse(localStorage.getItem(userKey + 'map_state') || '{}')
    };

    const carimbo = new Date().toISOString().slice(0, 10);
    baixarArquivo(
        JSON.stringify(backup, null, 2),
        `NexTI_Backup_${nomeSalvo}_${carimbo}.json`,
        'application/json;charset=utf-8;'
    );
    if (window.AudioEngine) AudioEngine.playUnlock();
    mostrarToast('success', 'Backup Exportado', 'Backup completo do estudante (.JSON) baixado com sucesso!');
}

async function importarBackupJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!data || data.aplicacao !== 'Nex_TI' || !data.versao) {
            if (window.AudioEngine) AudioEngine.playError();
            mostrarToast('error', 'Arquivo Inválido', 'O arquivo selecionado não é um backup válido do Nex_TI.');
            return;
        }

        const confirmar = await confirmarCyberDialog(
            "Restaurar Backup",
            `Deseja restaurar os dados de "${data.usuario || 'Usuário'}" (${data.xp || 0} XP, ${data.coins || 0} Coins)?\n\nIsso sincronizará o estado local com o backup.`
        );

        if (!confirmar) return;

        if (data.xp !== undefined) {
            xpTotal = data.xp;
            localStorage.setItem(userKey + 'xp', xpTotal);
        }
        if (data.coins !== undefined) {
            coinsTotal = data.coins;
            localStorage.setItem(userKey + 'coins', coinsTotal);
        }
        if (data.rank) localStorage.setItem(userKey + 'rank', data.rank);
        if (data.fasesDesbloqueadas) {
            fasesDesbloqueadas = data.fasesDesbloqueadas;
            localStorage.setItem(userKey + 'desbloqueadas', JSON.stringify(fasesDesbloqueadas));
        }
        if (data.bonusDesbloqueados) {
            bonusDesbloqueados = data.bonusDesbloqueados;
            localStorage.setItem(userKey + 'bonus_unlocked', JSON.stringify(bonusDesbloqueados));
        }
        if (data.srsData) {
            srsData = data.srsData;
            localStorage.setItem(userKey + 'srs', JSON.stringify(srsData));
        }
        if (data.decks) {
            meusDecks = data.decks;
            localStorage.setItem(userKey + 'decks', JSON.stringify(meusDecks));
        }
        if (data.mapState) {
            localStorage.setItem(userKey + 'map_state', JSON.stringify(data.mapState));
        }

        localStorage.setItem(userKey + 'nivelado', 'true');

        if (window.AudioEngine) AudioEngine.playLevelUp();
        mostrarToast('success', 'Restauração Concluída', 'Seus dados e progresso foram restaurados com sucesso!');
        
        setTimeout(() => {
            window.location.reload();
        }, 1200);

    } catch (err) {
        console.error("Erro ao importar backup:", err);
        if (window.AudioEngine) AudioEngine.playError();
        mostrarToast('error', 'Erro na Restauração', 'Falha ao processar o arquivo JSON de backup.');
    }
}

function exportarRelatorioExcelCSV() {
    const BOM_UTF8 = '\uFEFF';
    let linhas = [];
    linhas.push('Disciplina;Frente (Pergunta);Verso (Resposta);Dica;Repeticoes;Intervalo (Dias);Facilidade;Proxima Revisao');

    for (const [fase, cartas] of Object.entries(meusDecks)) {
        if (Array.isArray(cartas)) {
            cartas.forEach(c => {
                const srs = srsData[c.frente] || { rep: 0, interval: 0, ease: 2.5, next: 0 };
                const proxData = srs.next ? new Date(srs.next).toLocaleDateString('pt-BR') : 'Não agendado';
                const frenteClean = (c.frente || '').replace(/;/g, ',').replace(/\n/g, ' ');
                const versoClean = (c.verso || '').replace(/;/g, ',').replace(/\n/g, ' ');
                const dicaClean = (c.dica || '').replace(/;/g, ',').replace(/\n/g, ' ');
                linhas.push(`${fase.toUpperCase()};${frenteClean};${versoClean};${dicaClean};${srs.rep};${srs.interval};${srs.ease};${proxData}`);
            });
        }
    }

    const csvConteudo = BOM_UTF8 + linhas.join('\r\n');
    const carimbo = new Date().toISOString().slice(0, 10);
    baixarArquivo(csvConteudo, `NexTI_Relatorio_Flashcards_${carimbo}.csv`, 'text/csv;charset=utf-8;');
    if (window.AudioEngine) AudioEngine.playUnlock();
    mostrarToast('success', 'Planilha Excel Baixada', 'Relatório formatado com UTF-8 BOM e compatível com Excel baixado com sucesso!');
}

async function resetarProgresso() {
    const certeza = await confirmarCyberDialog(
        "Formatação de Save Data",
        `Usuário logado: ${nomeSalvo}\n\nIsso apagará permanentemente TODO o seu histórico de XP, Moedas, Árvore de Permissões e progresso SM-2.\n\nTem certeza que deseja formatar os dados?`
    );
    if (certeza) {
        localStorage.removeItem(userKey + 'xp');
        localStorage.removeItem(userKey + 'coins');
        localStorage.removeItem(userKey + 'nivelado');
        localStorage.removeItem(userKey + 'desbloqueadas');
        localStorage.removeItem(userKey + 'bonus_unlocked');
        localStorage.removeItem(userKey + 'decks');
        localStorage.removeItem(userKey + 'rank');
        localStorage.removeItem(userKey + 'srs'); 
        localStorage.removeItem(userKey + 'map_state');
        localStorage.removeItem(userKey + 'avatar_custom');
        
        window.location.href = '../login/login.html'; 
    }
}

async function deslogar() {
    const confirmar = await confirmarCyberDialog(
        "Encerrar Sessão",
        "Deseja encerrar a sessão atual e retornar à tela de autenticação?"
    );
    if (confirmar) {
        localStorage.removeItem('quest_user_name');
        localStorage.removeItem('quest_jwt_token');
        localStorage.removeItem('quest_user_id');
        window.location.href = '../login/login.html'; 
    }
}

function aplicarAvatarCustom(base64Image) {
    const avatarEl = document.querySelector('.dropdown-header .avatar');
    if (!avatarEl) return;

    const icon = avatarEl.querySelector('.material-symbols-outlined');
    if (icon) icon.style.display = 'none';

    // Aplica a imagem sobreposta ao degradê padrão (mantendo efeito translúcido em PNGs)
    avatarEl.style.backgroundImage = `url('${base64Image}'), linear-gradient(135deg, var(--nexti-purple), var(--nexti-cyan))`;
    avatarEl.style.backgroundSize = 'cover';
    avatarEl.style.backgroundPosition = 'center';
    avatarEl.style.backgroundRepeat = 'no-repeat';
}

function inicializarAvatar() {
    const avatarEl = document.querySelector('.dropdown-header .avatar');
    if (!avatarEl) return;

    let input = document.getElementById('avatar-input');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'avatar-input';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const base64Image = evt.target.result;
                    localStorage.setItem(userKey + 'avatar_custom', base64Image);
                    aplicarAvatarCustom(base64Image);
                    mostrarToast("success", "Avatar Atualizado", "Foto de perfil atualizada com sucesso!");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    avatarEl.style.cursor = 'pointer';
    avatarEl.title = 'Clique para alterar a foto do seu avatar';

    avatarEl.addEventListener('click', function() {
        input.click();
    });

    const avatarSalvo = localStorage.getItem(userKey + 'avatar_custom');
    if (avatarSalvo) {
        aplicarAvatarCustom(avatarSalvo);
    }
}

window.onload = async () => {
    if (window.AudioEngine) {
        atualizarIconeAudio(AudioEngine.isMuted());
    }
    await inicializarApi();
    verificarNivelamento();
    inicializarAvatar();
    
    // Restaurar estado ativo (modal ou aula)
    const activeState = JSON.parse(localStorage.getItem(userKey + 'active_state'));
    if (activeState) {
        if (activeState.type === 'modal') {
            if (activeState.id === 'modalMapaMental') {
                abrirMapaMental();
            } else {
                abrirModal(activeState.id);
            }
        } else if (activeState.type === 'aula') {
            const el = document.getElementById('menu-' + activeState.id);
            if (el) {
                carregarAula(activeState.id, activeState.title, el);
            }
        }
    }
};

// ==========================================
// 6. EFEITO SCROLL: BOTÃO VOLTAR AO TOPO
// ==========================================
window.addEventListener('scroll', function() {
    const btnTopo = document.getElementById('btn-voltar-topo');
    const rightPanel = document.getElementById('right-panel');
    const isMobilePlaying = window.innerWidth <= 600 && rightPanel.classList.contains('active');

    if (window.scrollY > 300 && !isMobilePlaying) {
        btnTopo.style.display = 'flex';
    } else {
        btnTopo.style.display = 'none';
    }
});

document.querySelectorAll('.aula-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 600) {
            document.getElementById('btn-voltar-topo').style.display = 'none';
        }
    });
});

// ==========================================
// 7. ACESSIBILIDADE (ZOOM E ALTO CONTRASTE)
// ==========================================
let currentZoom = parseInt(localStorage.getItem('quest_zoom')) || 100;
document.documentElement.style.fontSize = currentZoom + '%';

function mudarZoom(direcao) {
    if (direcao > 0 && currentZoom < 150) {
        currentZoom += 10; 
    } else if (direcao < 0 && currentZoom > 80) {
        currentZoom -= 10; 
    }
    
    document.documentElement.style.fontSize = currentZoom + '%';
    localStorage.setItem('quest_zoom', currentZoom);
}

let isHighContrast = localStorage.getItem('quest_high_contrast') === 'true';
if (isHighContrast) {
    document.body.classList.add('high-contrast-mode');
}

function toggleAltoContraste() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast-mode', isHighContrast);
    localStorage.setItem('quest_high_contrast', isHighContrast);
}

function toggleA11yMenu() {
    const widget = document.getElementById('a11y-widget');
    widget.classList.toggle('open');
}

function emDesenvolvimento(event) {
    event.preventDefault(); 
    mostrarToast("info", "Módulo em Construção", "Esta funcionalidade será liberada nas próximas atualizações!");
}

function tentarAbrirCertificado(elemento) {
    const certUnlocked = localStorage.getItem(userKey + 'certificado_unlocked') === 'true';
    if (!certUnlocked) {
        if (window.AudioEngine) AudioEngine.playError();
        mostrarToast("warning", "Certificado Bloqueado", "Conclua o Teste do Módulo 05 (ENADE) com pelo menos 80% de aproveitamento para liberar o certificado.");
        return;
    }

    const nomeAluno = localStorage.getItem('quest_user_name') || 'Desenvolvedor';
    const dataNumerica = new Date().toLocaleDateString('pt-BR');
    const opcoesData = { year: 'numeric', month: 'long', day: 'numeric' };
    const dataPorExtenso = new Date().toLocaleDateString('pt-BR', opcoesData);
    
    let hash = 0;
    const str = nomeAluno + dataNumerica + "NexTI_Academy_Enade_PIMIV";
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    const uuidAutenticidade = `NEX-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${dataNumerica.replace(/\//g, '')}`;

    document.getElementById('cert-nome-aluno').innerText = nomeAluno;
    document.getElementById('cert-data').innerText = dataPorExtenso;
    document.getElementById('cert-uuid').innerText = uuidAutenticidade;

    if (window.AudioEngine) AudioEngine.playUnlock();
    abrirModal('modalCertificado');
}

function imprimirCertificado() {
    window.print();
}

async function baixarCertificadoPDF() {
    const nomeAluno = document.getElementById('cert-nome-aluno').innerText;
    const dataPorExtenso = document.getElementById('cert-data').innerText;
    const uuidAutenticidade = document.getElementById('cert-uuid').innerText;

    const btn = document.querySelector('button[onclick="baixarCertificadoPDF()"]');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined">sync</span> GERANDO...`;
    }

    try {
        const blob = await ApiService.baixarCertificadoPDF(nomeAluno, dataPorExtenso, uuidAutenticidade);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Certificado_${nomeAluno.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        if (window.AudioEngine) AudioEngine.playLevelUp();
        if (window.ConfettiEngine) ConfettiEngine.celebrate();
        mostrarToast("success", "Download Concluído", "Certificado digital premium baixado com sucesso!");
    } catch (err) {
        console.error(err);
        if (window.AudioEngine) AudioEngine.playError();
        mostrarToast("error", "Erro no Download", "Não foi possível baixar o PDF. Certifique-se de que o backend (.NET 10) está rodando.");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span class="material-symbols-outlined">download</span> BAIXAR_PDF()`;
        }
    }
}
