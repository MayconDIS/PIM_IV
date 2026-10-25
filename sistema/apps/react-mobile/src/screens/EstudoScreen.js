import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { devolveParaRevisao, estadoDaCarta, previsoes } from '@nexti/shared/sm2';
import { tokens } from '../theme/tokens';

const BOTOES = [
  { resultado: 'again', rotulo: 'Errei', cor: tokens.colors.sm2Again },
  { resultado: 'hard', rotulo: 'Difícil', cor: tokens.colors.sm2Hard },
  { resultado: 'good', rotulo: 'Bom', cor: tokens.colors.sm2Good },
  { resultado: 'easy', rotulo: 'Fácil', cor: tokens.colors.sm2Easy },
];

/** Sessão de estudo de uma fase: as cartas vêm da API e cada resposta é sincronizada. */
export default function EstudoScreen({ fase, api, sinc, onSair, onErroDeSessao }) {
  const [fila, setFila] = useState(null);
  const [virada, setVirada] = useState(false);
  const [erro, setErro] = useState('');
  const [fim, setFim] = useState(null);
  const [respondendo, setRespondendo] = useState(false);

  async function baixar() {
    setErro('');
    try {
      const cartas = await api.flashcards(fase.id);
      setFila(sinc.ordenarCartas(cartas));
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => { baixar(); }, [fase.id]);

  async function responder(resultado) {
    const [carta, ...resto] = fila;
    setRespondendo(true);
    try {
      await sinc.responder(carta, resultado);
    } catch (e) {
      if (e.status === 401) return onErroDeSessao();
    } finally {
      setRespondendo(false);
    }
    // Errou: a carta volta para o fim da sessão, como no site.
    const proxima = devolveParaRevisao(resultado) ? [...resto, carta] : resto;
    setVirada(false);
    if (proxima.length) {
      setFila(proxima);
    } else {
      setFila([]);
      try {
        setFim(await sinc.concluirFase(fase.id));
      } catch (e) {
        if (e.status === 401) onErroDeSessao();
      }
    }
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
        <TouchableOpacity accessibilityRole="button" style={styles.botaoPrincipal} onPress={baixar}><Text style={styles.botaoPrincipalTexto}>TENTAR DE NOVO</Text></TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" onPress={onSair}><Text style={styles.link}>Voltar às fases</Text></TouchableOpacity>
      </View>
    );
  }
  if (fim) {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Fase concluída! 🎉</Text>
        {fim.premio.xp || fim.premio.moedas
          ? <Text style={styles.premio}>+{fim.premio.xp} XP · +{fim.premio.moedas} moedas</Text>
          : <Text style={styles.textoApoio}>Revisão concluída. O prêmio desta fase já foi recebido; a revisão conta para o SM-2.</Text>}
        {fim.seguinte && <Text style={styles.textoApoio}>Próxima fase liberada.</Text>}
        <TouchableOpacity accessibilityRole="button" style={styles.botaoPrincipal} onPress={onSair}><Text style={styles.botaoPrincipalTexto}>VOLTAR ÀS FASES</Text></TouchableOpacity>
      </View>
    );
  }
  if (!fila || !fila.length) return <View style={styles.centro}><ActivityIndicator color={tokens.colors.cyan} /></View>;

  const carta = fila[0];
  const rotulos = previsoes(estadoDaCarta(sinc.estado.srs, carta.id));

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      <View style={styles.topo}>
        <TouchableOpacity onPress={onSair} accessibilityRole="button" accessibilityLabel="Voltar às fases" hitSlop={{ top: 14, bottom: 14, left: 12, right: 12 }}><Text style={styles.link}>‹ Fases</Text></TouchableOpacity>
        <Text style={styles.contador}>{fase.titulo} · faltam {fila.length}</Text>
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={() => setVirada(!virada)} style={[styles.carta, virada && styles.cartaVirada]} accessibilityRole="button" accessibilityHint="Vira a carta">
        <Text style={styles.etiqueta}>{virada ? '✓ RESPOSTA' : '? PERGUNTA'}</Text>
        <Text style={styles.textoCarta}>{virada ? carta.verso : carta.frente}</Text>
        {!virada && carta.opcoes?.length ? carta.opcoes.map((opcao) => <Text key={opcao} style={styles.opcao}>{opcao}</Text>) : null}
        {!virada && carta.dica ? <Text style={styles.dica}>💡 {carta.dica}</Text> : null}
      </TouchableOpacity>

      {virada ? (
        <View style={styles.botoes}>
          {BOTOES.map((b) => (
            <TouchableOpacity key={b.resultado} style={[styles.botaoSm2, { borderColor: b.cor }]} disabled={respondendo} onPress={() => responder(b.resultado)} accessibilityRole="button" accessibilityLabel={`${b.rotulo}, volta em ${rotulos[b.resultado]}`}>
              <Text style={[styles.botaoSm2Texto, { color: b.cor }]}>{b.rotulo}</Text>
              <Text style={styles.previsao}>{rotulos[b.resultado]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TouchableOpacity style={styles.botaoPrincipal} onPress={() => setVirada(true)} accessibilityRole="button">
          <Text style={styles.botaoPrincipalTexto}>MOSTRAR RESPOSTA</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: tokens.spacing.md, gap: tokens.spacing.md },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: tokens.spacing.lg, gap: tokens.spacing.md },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contador: { fontSize: 12, fontWeight: '700', color: tokens.colors.cyan, flexShrink: 1, textAlign: 'right' },
  carta: {
    minHeight: 260,
    backgroundColor: tokens.colors.bgCard,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  cartaVirada: { borderColor: tokens.colors.green },
  etiqueta: { fontSize: 10, fontWeight: '700', color: tokens.colors.textMuted, letterSpacing: 1 },
  textoCarta: { fontSize: 17, lineHeight: 25, color: tokens.colors.textPrimary },
  opcao: { color: tokens.colors.textSecondary, fontSize: 15, lineHeight: 21, marginTop: 10 },
  dica: { fontSize: 12, color: tokens.colors.textSecondary, fontStyle: 'italic' },
  botoes: { flexDirection: 'row', gap: 8 },
  botaoSm2: { flex: 1, backgroundColor: tokens.colors.bgCard, borderWidth: 1, borderRadius: tokens.borderRadius.sm, paddingVertical: 10, alignItems: 'center' },
  botaoSm2Texto: { fontSize: 13, fontWeight: '700' },
  previsao: { fontSize: 10, color: tokens.colors.textMuted, marginTop: 2 },
  botaoPrincipal: { backgroundColor: tokens.colors.cyan, paddingVertical: 14, paddingHorizontal: 24, borderRadius: tokens.borderRadius.sm, alignItems: 'center', alignSelf: 'stretch' },
  botaoPrincipalTexto: { fontSize: 14, fontWeight: '800', color: '#000', letterSpacing: 1 },
  link: { fontSize: 14, color: tokens.colors.cyan },
  titulo: { fontSize: 24, fontWeight: '800', color: tokens.colors.textPrimary },
  premio: { fontSize: 18, fontWeight: '700', color: tokens.colors.green },
  textoApoio: { fontSize: 13, color: tokens.colors.textMuted },
  erro: { fontSize: 14, color: tokens.colors.red, textAlign: 'center' },
});
