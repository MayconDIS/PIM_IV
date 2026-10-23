# Nex_TI Mobile (React Native / Expo)

O app de celular do Nex_TI. Usa a mesma API e as mesmas regras do site.

## O que faz

| Tela | O que tem |
|---|---|
| **Login** | Entrar com nickname ou e-mail, ou criar conta. O token fica no cofre do aparelho (`expo-secure-store`). |
| **Fases** | As 22 fases por módulo. A próxima só abre quando a anterior é concluída. |
| **Estudo** | Cartas vindas da API, as vencidas primeiro. Errou, a carta volta no fim da sessão. No fim: XP e moedas. |
| **Progresso** | Nível, cartas estudadas e para revisar hoje (da API), envios pendentes e o botão "Sincronizar agora". |

Fluxo: Login → Fases ⇄ Progresso → Estudo → Fases.

## Sincronização

- Cada resposta vai para `POST /api/progresso/atualizar`; cada fase concluída, para `POST /api/progresso/concluir-fase`, e o app fica com o XP e as moedas que o servidor calcular.
- **Sem internet**, a resposta entra numa fila salva no aparelho e é enviada na próxima sincronização (ao abrir o app, ao sair de uma fase ou no botão).
- Ao sincronizar, o app traz da API o XP, as moedas e o agendamento de cada carta. Assim o que foi estudado no site aparece no celular.
- Sessão expirada (24 h): o app volta ao login sem perder a fila.

O SM-2, a ordem das fases e o prêmio de cada fase vêm de `@nexti/shared`, os mesmos do site. Os testes de módulo e as disciplinas bônus continuam só no site.

## Como rodar

Na pasta `sistema/`:

```bash
npm install
npm run dev:mobile      # abre o Expo; leia o QR code com o app Expo Go
```

Por padrão o app usa a API da Azure. Para usar a API do seu computador (mesma rede Wi-Fi):

```bash
EXPO_PUBLIC_API_URL=http://SEU_IP:5000/api npm run dev:mobile
```

## Testes

```bash
npm run test:mobile     # na pasta sistema/
```

Os testes cobrem o cliente da API e a sincronização: envio com e sem internet, fila, sessão expirada e as regras de prêmio e desbloqueio.

## Arquivos

```text
App.js                       navegação e cabeçalho com XP e moedas
src/screens/                 Login, Fases, Estudo e Progresso
src/services/api.js          chamadas à API
src/services/sincronizacao.js  progresso local, fila e sincronização
src/services/armazenamento.js  cofre (token) e AsyncStorage (progresso)
src/services/config.js       endereço da API
metro.config.js              configuração do Metro para o monorepo
```
