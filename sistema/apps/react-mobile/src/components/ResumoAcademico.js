import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tokens } from '../theme/tokens';

export default function ResumoAcademico({ disciplina }) {
  const [aberto, setAberto] = useState(false);
  if (!disciplina) return null;
  return (
    <View style={styles.caixa}>
      <TouchableOpacity onPress={() => setAberto(!aberto)} accessibilityRole="button" accessibilityState={{ expanded: aberto }} style={styles.botao}>
        <Text style={styles.titulo}>{aberto ? 'Ocultar resumo' : 'Resumo e materiais'} · {disciplina.origem} · {disciplina.semestre}º semestre</Text>
      </TouchableOpacity>
      {aberto && <View style={styles.textos}>
        {disciplina.resumo.map((texto, indice) => <Text key={indice} style={styles.texto}>{texto}</Text>)}
        <Text style={styles.titulo}>O que revisar</Text>
        {disciplina.topicos.map(topico => <Text key={topico} style={styles.texto}>• {topico}</Text>)}
        <Text style={styles.titulo}>Materiais de referência</Text>
        {disciplina.fontes.map(fonte => <Text key={fonte.id} style={styles.fonte}>{fonte.titulo} · {fonte.formato === 'pptx' ? 'slides' : 'páginas'} {fonte.paginas.join(', ')}</Text>)}
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { borderColor: tokens.colors.border, borderWidth: 1, borderRadius: 10, backgroundColor: tokens.colors.bgCard },
  botao: { padding: 12, minHeight: 44, justifyContent: 'center' },
  textos: { padding: 12, gap: 12 },
  titulo: { color: tokens.colors.cyan, fontWeight: '700', fontSize: 13 },
  texto: { color: tokens.colors.textPrimary, fontSize: 14, lineHeight: 22 },
  fonte: { color: tokens.colors.textSecondary, fontSize: 12, lineHeight: 19 },
});
