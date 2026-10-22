import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { progressoDeNivel } from '@nexti/shared/gamificacao';
import { tokens } from '../theme/tokens';

/** Nível, números do SM-2 vindos da API e o estado da sincronização. */
export default function ProgressoScreen({ api, sinc, username, onSincronizar, onSair }) {
  const [numeros, setNumeros] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const nivel = progressoDeNivel(sinc.estado.xp);
  const pendentes = sinc.estado.fila.length;

  useEffect(() => {
    api.estatisticas(username).then(setNumeros).catch(() => setNumeros(null));
  }, [sinc.estado.xp]);

  async function sincronizarAgora() {
    setMensagem('Sincronizando...');
    setMensagem(await onSincronizar());
  }

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      <View style={styles.cartao}>
        <Text style={styles.rotulo}>Nível</Text>
        <Text style={styles.valor}>{nivel.rotuloRank}</Text>
        <View style={styles.barra} accessibilityLabel={`Progresso do nível: ${nivel.percentual}%`}>
          <View style={[styles.barraCheia, { width: `${nivel.percentual}%` }]} />
        </View>
        <Text style={styles.apoio}>{nivel.rotuloProgresso} · {nivel.rotuloProximo}</Text>
      </View>

      <View style={styles.linha}>
        <Numero rotulo="Cartas estudadas" valor={numeros?.totalEstudados} />
        <Numero rotulo="Para revisar hoje" valor={numeros?.cartasDevidasHoje} />
        <Numero rotulo="Cartas maduras" valor={numeros?.cartasMaduras} />
      </View>
      {!numeros && <Text style={styles.apoio}>Sem conexão: os números aparecem quando a API responder.</Text>}

      <View style={styles.cartao}>
        <Text style={styles.rotulo}>Sincronização</Text>
        <Text style={[styles.valor, { color: pendentes ? tokens.colors.gold : tokens.colors.green }]}>
          {pendentes ? `${pendentes} envio(s) pendente(s)` : 'Tudo enviado'}
        </Text>
        <TouchableOpacity style={styles.botao} onPress={sincronizarAgora} accessibilityRole="button">
          <Text style={styles.botaoTexto}>SINCRONIZAR AGORA</Text>
        </TouchableOpacity>
        {mensagem ? <Text style={styles.apoio}>{mensagem}</Text> : null}
      </View>

      <TouchableOpacity onPress={onSair} accessibilityRole="button">
        <Text style={styles.sair}>Sair da conta ({username})</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Numero({ rotulo, valor }) {
  return (
    <View style={styles.numero}>
      <Text style={styles.numeroValor}>{valor ?? '–'}</Text>
      <Text style={styles.numeroRotulo}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: tokens.spacing.md, gap: tokens.spacing.md },
  cartao: { backgroundColor: tokens.colors.bgCard, borderWidth: 1, borderColor: tokens.colors.border, borderRadius: tokens.borderRadius.md, padding: tokens.spacing.md, gap: 6 },
  rotulo: { fontSize: 11, fontWeight: '700', color: tokens.colors.textMuted, textTransform: 'uppercase' },
  valor: { fontSize: 20, fontWeight: '800', color: tokens.colors.textPrimary },
  barra: { height: 8, backgroundColor: tokens.colors.border, borderRadius: 4, overflow: 'hidden' },
  barraCheia: { height: 8, backgroundColor: tokens.colors.cyan },
  apoio: { fontSize: 12, color: tokens.colors.textMuted },
  linha: { flexDirection: 'row', gap: 8 },
  numero: { flex: 1, backgroundColor: tokens.colors.bgCard, borderWidth: 1, borderColor: tokens.colors.border, borderRadius: tokens.borderRadius.md, padding: 12, alignItems: 'center' },
  numeroValor: { fontSize: 22, fontWeight: '800', color: tokens.colors.cyan },
  numeroRotulo: { fontSize: 11, color: tokens.colors.textMuted, textAlign: 'center', marginTop: 2 },
  botao: { backgroundColor: tokens.colors.cyan, paddingVertical: 12, borderRadius: tokens.borderRadius.sm, alignItems: 'center', marginTop: 6 },
  botaoTexto: { fontSize: 13, fontWeight: '800', color: '#000', letterSpacing: 1 },
  sair: { fontSize: 14, color: tokens.colors.red, textAlign: 'center', marginVertical: tokens.spacing.md },
});
