# Nex_TI Mobile (React Native / Expo)

Protótipo móvel da plataforma **Nex_TI – EdTech Learning Platform** (PIM IV - UNIP).
Tem uma tela de estudo com quatro cartas demonstrativas, cálculo de revisão,
XP e moedas em memória. Ao reiniciar o app, esse estado é perdido. Login,
persistência e sincronização com a API .NET 10 ainda não estão implementados.

---

## 🚀 Tecnologias
- **React Native** & **Expo**
- **Algoritmo SM-2 Nativo**: Cálculo matemático do intervalo de repetição e fator de facilidade.
- **Design DNA**: Tokens de cores neon, Dark Mode cyberpunk e tipografia técnica.
- **Motor local**: `src/services/sm2.js`; a tela ainda não usa o motor de `@nexti/shared`.

---

## 📱 Como Rodar

Na pasta `sistema/`:
```bash
npm install
npm run dev:mobile
```

Ou dentro do diretório `sistema/apps/react-mobile`:
```bash
npx expo start
```
