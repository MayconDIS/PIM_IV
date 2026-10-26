import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { tokens } from './src/theme/tokens';
import { API_URL } from './src/services/config';
import { criarApi } from './src/services/api';
import { armazenamento } from './src/services/armazenamento';
import { criarSincronizador } from './src/services/sincronizacao';
import LoginScreen from './src/screens/LoginScreen';
import FasesScreen from './src/screens/FasesScreen';
import EstudoScreen from './src/screens/EstudoScreen';
import ProgressoScreen from './src/screens/ProgressoScreen';

/**
 * Navegação do app: login → (fases ⇄ progresso) → estudo de uma fase.
 * A sessão fica no cofre do aparelho; o progresso é sincronizado com a API
 * ao abrir o app, ao voltar de uma fase e no botão "Sincronizar agora".
 */
export default function App() {
  const [sessao, setSessao] = useState(undefined); // undefined = ainda lendo do aparelho
  const [aviso, setAviso] = useState('');
  const [aba, setAba] = useState('fases');
  const [faseAberta, setFaseAberta] = useState(null);
  const [, setVersao] = useState(0);
  const sincRef = useRef(null);
  const novoLoginRef = useRef(false);

  const atualizarTela = () => setVersao((v) => v + 1);
  const api = useMemo(() => criarApi({ baseUrl: API_URL, obterToken: () => sessao?.token }), [sessao]);

  useEffect(() => {
    armazenamento.lerSessao().then((s) => setSessao(s ?? null)).catch(() => setSessao(null));
  }, []);

  // Ao ter uma sessão: carrega o progresso do aparelho e sincroniza com a API.
  useEffect(() => {
    if (!sessao) return;
    const sinc = criarSincronizador({ api, armazenamento, username: sessao.user.username,
      perfil: sessao.user.perfil, novoLogin: novoLoginRef.current });
    novoLoginRef.current = false;
    sincRef.current = sinc;
    sinc.carregar().then(atualizarTela).then(() => sincronizar());
  }, [sessao]);

  async function sincronizar() {
    try {
      await sincRef.current.sincronizar();
      atualizarTela();
      return 'Sincronizado com o servidor.';
    } catch (e) {
      atualizarTela();
      if (e.status === 401) {
        sair('Sua sessão expirou. Entre de novo para enviar o progresso.');
        return '';
      }
      return e.message;
    }
  }

  async function entrar(novaSessao) {
    await armazenamento.salvarSessao(novaSessao);
    setAviso('');
    setAba('fases');
    novoLoginRef.current = true;
    setSessao(novaSessao);
  }

  async function sair(mensagem = '') {
    await armazenamento.apagarSessao();
    sincRef.current = null;
    setFaseAberta(null);
    setAviso(mensagem);
    setSessao(null);
  }

  let conteudo;
  if (sessao === undefined) {
    conteudo = <View style={styles.centro}><ActivityIndicator color={tokens.colors.cyan} /></View>;
  } else if (!sessao) {
    conteudo = <LoginScreen api={api} onEntrar={entrar} aviso={aviso} />;
  } else if (!sincRef.current) {
    conteudo = <View style={styles.centro}><ActivityIndicator color={tokens.colors.cyan} /></View>;
  } else if (faseAberta) {
    conteudo = (
      <EstudoScreen
        fase={faseAberta}
        api={api}
        sinc={sincRef.current}
        onSair={() => { setFaseAberta(null); sincronizar(); }}
        onErroDeSessao={() => sair('Sua sessão expirou. Entre de novo.')}
      />
    );
  } else {
    conteudo = (
      <>
        {aba === 'fases'
          ? <FasesScreen liberadas={sincRef.current.fasesDisponiveis} onAbrir={setFaseAberta} />
          : <ProgressoScreen api={api} sinc={sincRef.current} username={sessao.user.username} onSincronizar={sincronizar} onSair={() => sair()} />}
        <View style={styles.abas}>
          <Aba titulo="📚 Fases" ativa={aba === 'fases'} onPress={() => setAba('fases')} />
          <Aba titulo="📊 Progresso" ativa={aba === 'progresso'} onPress={() => setAba('progresso')} />
        </View>
      </>
    );
  }

  const estado = sincRef.current?.estado;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={tokens.colors.bgApp} />
      {sessao && estado && (
        <View style={styles.cabecalho}>
          <Text style={styles.logo}>Nex<Text style={{ color: tokens.colors.cyan }}>_TI</Text></Text>
          <View style={styles.selos}>
            <Text style={styles.selo}>⚡ {estado.xp} XP</Text>
            <Text style={[styles.selo, styles.seloMoedas]}>🪙 {estado.moedas}</Text>
          </View>
        </View>
      )}
      {conteudo}
    </SafeAreaView>
  );
}

function Aba({ titulo, ativa, onPress }) {
  return (
    <TouchableOpacity style={[styles.aba, ativa && styles.abaAtiva]} onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: ativa }}>
      <Text style={[styles.abaTexto, ativa && styles.abaTextoAtiva]}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.bgApp },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  logo: { fontSize: 22, fontWeight: '900', color: tokens.colors.textPrimary, letterSpacing: 1 },
  selos: { flexDirection: 'row', gap: 8 },
  selo: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.cyan,
    borderWidth: 1,
    borderColor: tokens.colors.cyan,
    borderRadius: tokens.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  seloMoedas: { color: tokens.colors.gold, borderColor: tokens.colors.gold },
  abas: { flexDirection: 'row', gap: 8, padding: tokens.spacing.sm, borderTopWidth: 1, borderTopColor: tokens.colors.border },
  aba: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: tokens.borderRadius.sm, backgroundColor: tokens.colors.bgCard, borderWidth: 1, borderColor: tokens.colors.border },
  abaAtiva: { borderColor: tokens.colors.cyan },
  abaTexto: { fontSize: 13, fontWeight: '600', color: tokens.colors.textMuted },
  abaTextoAtiva: { color: tokens.colors.cyan },
});
