let isLoginMode = true;
let usersDB = JSON.parse(localStorage.getItem('quest_users')) || {};

function toggleMode(event) {
    if (event) event.preventDefault(); 
    if (window.AudioEngine) AudioEngine.playClick();
    isLoginMode = !isLoginMode; 
    
    const title = document.getElementById('form-title');
    const subtitle = document.getElementById('form-subtitle');
    const btn = document.getElementById('btn-submit');
    const footerText = document.getElementById('footer-text');
    const groupNome = document.getElementById('group-nome');
    const inputNome = document.getElementById('nome');
    const labelEmail = document.getElementById('label-email');
    const inputEmail = document.getElementById('email');

    if (isLoginMode) {
        title.innerHTML = 'Nex_<span class="tech-text">TI</span>';
        subtitle.innerText = 'Welcome back, developer.';
        btn.innerText = '> INITIALIZE_LOGIN()';
        footerText.innerHTML = 'Ainda não tem acesso? <a href="#" onclick="toggleMode(event)">Cadastre-se</a>';
        groupNome.style.display = 'none'; 
        inputNome.required = false;
        if (labelEmail) labelEmail.innerText = 'E-mail ou Nickname';
        if (inputEmail) inputEmail.placeholder = 'dev@quest.com ou Nickname';
    } else {
        title.innerHTML = 'New_<span class="tech-text">Access</span>';
        subtitle.innerText = 'Join the Quest.';
        btn.innerText = 'Criar Conta';
        footerText.innerHTML = 'Já tem acesso? <a href="#" onclick="toggleMode(event)">Faça Login</a>';
        groupNome.style.display = 'block'; 
        inputNome.required = true;
        if (labelEmail) labelEmail.innerText = 'E-mail';
        if (inputEmail) inputEmail.placeholder = 'dev@quest.com';
    }
}

async function handleAuth(event) {
    event.preventDefault();
    if (window.AudioEngine) AudioEngine.playClick();
    
    const credential = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('btn-submit');
    
    if (isLoginMode) {
        btn.innerText = "Autenticando...";
        btn.disabled = true;
        try {
            const data = await ApiService.login(credential, password);
            localStorage.setItem('quest_jwt_token', data.token);
            localStorage.setItem('quest_user_id', data.user.id);
            localStorage.setItem('quest_user_name', data.user.username);
            localStorage.setItem('quest_user_nivel', data.user.nivel);
            
            if (window.AudioEngine) AudioEngine.playCorrect();
            btn.innerText = "✓ Acesso Autorizado!";
            btn.style.borderColor = "var(--nexti-green)";
            btn.style.color = "var(--nexti-green)";
            
            setTimeout(() => { window.location.href = '../dashboard/index.html'; }, 600);
        } catch (error) {
            btn.disabled = false;
            if (window.AudioEngine) AudioEngine.playError();
            mostrarErro(error.message || "Acesso Bloqueado!");
        }
    } else {
        const nickname = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        btn.innerText = "Criando Conta...";
        btn.disabled = true;
        try {
            await ApiService.register(nickname, email, password);
            const loginData = await ApiService.login(nickname, password);
            
            localStorage.setItem('quest_jwt_token', loginData.token);
            localStorage.setItem('quest_user_id', loginData.user.id);
            localStorage.setItem('quest_user_name', loginData.user.username);
            localStorage.setItem('quest_user_nivel', loginData.user.nivel);
            
            if (window.AudioEngine) AudioEngine.playUnlock();
            btn.innerText = "✓ Conta Criada!";
            btn.style.borderColor = "var(--nexti-green)";
            btn.style.color = "var(--nexti-green)";
            
            setTimeout(() => { window.location.href = '../dashboard/index.html'; }, 800);
        } catch (error) {
            btn.disabled = false;
            if (window.AudioEngine) AudioEngine.playError();
            mostrarErro(error.message || "Erro no Cadastro");
        }
    }
}

function mostrarErro(mensagem) {
    const btn = document.getElementById('btn-submit');
    const textoReset = isLoginMode ? '> INITIALIZE_LOGIN()' : 'Criar Conta';
    
    btn.innerText = `⚠ ${mensagem}`;
    btn.style.color = "#ff5555"; 
    btn.style.borderColor = "#ff5555";
    
    setTimeout(() => { 
        btn.innerText = textoReset; 
        btn.style.color = "var(--nexti-cyan)"; 
        btn.style.borderColor = "var(--nexti-cyan)"; 
    }, 3000);
}
