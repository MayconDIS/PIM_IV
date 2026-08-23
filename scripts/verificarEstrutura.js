import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('\n🔍 [Nex_TI Monorepo] Verificando integridade da estrutura...\n');

const caminhosObrigatorios = [
    // Apps
    'apps/web/package.json',
    'apps/web/index.html',
    'apps/web/pages/dashboard/index.html',
    'apps/web/pages/dashboard/js/app.js',
    'apps/web/pages/login/login.html',
    'apps/web/assets/js/api.js',
    'apps/web/assets/js/audio.js',
    'apps/web/assets/js/confetti.js',
    'apps/web/assets/js/data.js',
    // Apps: React Web (React + Vite)
    'apps/react-web/package.json',
    'apps/react-web/vite.config.js',
    'apps/react-web/index.html',
    'apps/react-web/src/App.jsx',
    'apps/react-web/src/main.jsx',
    // Apps: Mobile (React Native / Expo)
    'apps/mobile/package.json',
    'apps/mobile/app.json',
    'apps/mobile/App.js',
    // Apps: API (.NET 10 Minimal APIs)
    'apps/api/package.json',
    'apps/api/NexTI_API.csproj',
    'apps/api/Program.cs',
    'apps/api/Data/AppDbContext.cs',
    'apps/api/Endpoints/EndpointExtensions.cs',
    'apps/api/Services/Sm2Engine.cs',
    'apps/api/Services/DatabaseSeeder.cs',
    // Packages
    'packages/shared/package.json',
    'packages/shared/src/data.js',
    'packages/shared/src/audio.js',
    'packages/shared/src/confetti.js',
    'design-dna/style.css',
    'design-dna/paleta.json',
    'design-dna/diretrizes.md',
    // Database & Docs
    'database/NexTI_DB.sql',
    'docs/MANUAL_DE_EXECUCAO.md',
    'docs/MANUAL_TECNICO.md',
    'docs/MANUAL_PRATICO.md',
    // Root configs
    'package.json',
    'start.py',
    'README.md',
    '.gitignore',
    // Tests
    'tests/NexTI_API.Tests/NexTI_API.Tests.csproj',
    'tests/NexTI_API.Tests/Sm2EngineTests.cs',
    'tests/NexTI_API.Tests/UsuarioAndAuthTests.cs',
    'tests/NexTI_API.Tests/SecurityAndGamificationTests.cs'
];

let falhas = 0;

for (const item of caminhosObrigatorios) {
    const fullPath = path.join(rootDir, item);
    if (fs.existsSync(fullPath)) {
        console.log(`  ✅ [OK] ${item}`);
    } else {
        console.error(`  ❌ [FALHA] Não encontrado: ${item}`);
        falhas++;
    }
}

console.log('\n──────────────────────────────────────────────────');
if (falhas === 0) {
    console.log(`✨ [SUCESSO] Todos os ${caminhosObrigatorios.length} nós e arquivos canônicos do Monorepo foram validados com êxito!\n`);
    process.exit(0);
} else {
    console.error(`⚠️ [ERRO] ${falhas} arquivo(s) obrigatório(s) ausente(s).\n`);
    process.exit(1);
}
