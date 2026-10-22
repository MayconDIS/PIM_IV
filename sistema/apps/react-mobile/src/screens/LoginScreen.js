import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { tokens } from '../theme/tokens';

/** Entrar ou criar conta. As regras de senha e nickname são conferidas pela API. */
export default function LoginScreen({ api, onEntrar, aviso }) {
  const [modo, setModo] = useState('entrar');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(aviso ?? '');

  const cadastrando = modo === 'cadastrar';

  async function enviar() {
    setErro('');
    setCarregando(true);
    try {
      if (cadastrando) await api.cadastrar(usuario.trim(), email.trim(), senha);
      const sessao = await api.entrar(usuario.trim(), senha);
      await onEntrar(sessao);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.logo}>Nex<Text style={{ color: tokens.colors.cyan }}>_TI</Text></Text>
      <Text style={styles.subtitulo}>{cadastrando ? 'Criar conta' : 'Entrar'}</Text>

      <TextInput
        style={styles.campo}
        placeholder={cadastrando ? 'Nickname' : 'Nickname ou e-mail'}
        placeholderTextColor={tokens.colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        value={usuario}
        onChangeText={setUsuario}
        accessibilityLabel={cadastrando ? 'Nickname' : 'Nickname ou e-mail'}
      />
      {cadastrando && (
        <TextInput
          style={styles.campo}
          placeholder="E-mail"
          placeholderTextColor={tokens.colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="E-mail"
        />
      )}
      <TextInput
        style={styles.campo}
        placeholder="Senha"
        placeholderTextColor={tokens.colors.textMuted}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        accessibilityLabel="Senha"
      />
      {cadastrando && (
        <Text style={styles.dica}>A senha precisa de 8 caracteres, maiúscula, minúscula, número e símbolo.</Text>
      )}

      {erro ? <Text style={styles.erro} accessibilityRole="alert">{erro}</Text> : null}

      <TouchableOpacity style={styles.botao} onPress={enviar} disabled={carregando || !usuario || !senha} accessibilityRole="button">
        {carregando ? <ActivityIndicator color="#000" /> : <Text style={styles.botaoTexto}>{cadastrando ? 'CRIAR CONTA' : 'ENTRAR'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { setModo(cadastrando ? 'entrar' : 'cadastrar'); setErro(''); }} accessibilityRole="button">
        <Text style={styles.trocar}>{cadastrando ? 'Já tenho conta: entrar' : 'Não tem conta? Criar agora'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, justifyContent: 'center', padding: tokens.spacing.lg, gap: tokens.spacing.sm },
  logo: { fontSize: 40, fontWeight: '900', color: tokens.colors.textPrimary, textAlign: 'center', letterSpacing: 1 },
  subtitulo: { fontSize: 14, color: tokens.colors.textMuted, textAlign: 'center', marginBottom: tokens.spacing.md },
  campo: {
    backgroundColor: tokens.colors.bgCard,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.sm,
    color: tokens.colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  dica: { fontSize: 11, color: tokens.colors.textMuted },
  erro: { fontSize: 13, color: tokens.colors.red },
  botao: { backgroundColor: tokens.colors.cyan, borderRadius: tokens.borderRadius.sm, paddingVertical: 14, alignItems: 'center', marginTop: tokens.spacing.sm },
  botaoTexto: { fontSize: 14, fontWeight: '800', color: '#000', letterSpacing: 1 },
  trocar: { fontSize: 13, color: tokens.colors.cyan, textAlign: 'center', marginTop: tokens.spacing.md },
});
