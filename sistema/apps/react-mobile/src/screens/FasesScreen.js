import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MODULOS } from '@nexti/shared/content';
import { tokens } from '../theme/tokens';

/** As 22 fases da trilha, por módulo. Fase bloqueada não abre. */
export default function FasesScreen({ liberadas, onAbrir }) {
  return (
    <ScrollView contentContainerStyle={styles.lista}>
      {MODULOS.map((modulo) => (
        <View key={modulo.id} style={styles.modulo}>
          <Text style={styles.moduloTitulo}>{modulo.nome}</Text>
          {modulo.fases.map((fase) => {
            const liberada = liberadas.includes(fase.id);
            return (
              <TouchableOpacity
                key={fase.id}
                style={[styles.fase, !liberada && styles.faseBloqueada]}
                disabled={!liberada}
                onPress={() => onAbrir(fase)}
                accessibilityRole="button"
                accessibilityLabel={`${fase.titulo}${liberada ? '' : ', bloqueada'}`}
              >
                <Text style={[styles.faseTitulo, !liberada && styles.textoApagado]}>{fase.titulo}</Text>
                <Text style={styles.faseInfo}>{liberada ? `${fase.totalCards} cartas · +${fase.xp} XP` : '🔒 Conclua a fase anterior'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      <Text style={styles.rodape}>Os testes de módulo e as disciplinas bônus ficam no site.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lista: { padding: tokens.spacing.md, gap: tokens.spacing.md },
  modulo: { gap: 6 },
  moduloTitulo: { fontSize: 12, fontWeight: '800', color: tokens.colors.cyan, letterSpacing: 1, textTransform: 'uppercase' },
  fase: {
    backgroundColor: tokens.colors.bgCard,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderLeftWidth: 3,
    borderLeftColor: tokens.colors.cyan,
    borderRadius: tokens.borderRadius.sm,
    padding: 12,
  },
  faseBloqueada: { borderLeftColor: tokens.colors.border, opacity: 0.6 },
  faseTitulo: { fontSize: 14, fontWeight: '700', color: tokens.colors.textPrimary },
  textoApagado: { color: tokens.colors.textMuted },
  faseInfo: { fontSize: 12, color: tokens.colors.textMuted, marginTop: 2 },
  rodape: { fontSize: 11, color: tokens.colors.textMuted, textAlign: 'center', marginVertical: tokens.spacing.md },
});
