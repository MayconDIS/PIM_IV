import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { tokens } from './src/theme/tokens';
import { calcularSm2 } from './src/services/sm2';

const DECK_INICIAL = [
  {
    fase: 'mod1-aula1',
    frente: 'O que define a Primeira Lei de De Morgan na lógica booleana?',
    verso: 'A negação da conjunção é equivalente à disjunção das negações: ~(A ∧ B) ≡ ~A ∨ ~B.',
    dica: 'Pense em distribuir a negação invertendo o operador.'
  },
  {
    fase: 'mod1-aula2',
    frente: 'Qual é a diferença fundamental entre Herança e Composição na POO?',
    verso: 'Herança estabelece uma relação "é um" e cria acoplamento rígido; Composição estabelece "tem um", oferecendo maior flexibilidade e baixo acoplamento.',
    dica: 'Princípio de Design: Favoreça Composição sobre Herança.'
  },
  {
    fase: 'mod2-aula1',
    frente: 'O que o princípio SRP (Single Responsibility Principle) preconiza?',
    verso: 'Uma classe deve ter apenas um, e somente um, motivo para mudar, possuindo responsabilidade única bem delimitada.',
    dica: 'Primeiro princípio do acrônimo SOLID.'
  },
  {
    fase: 'mod2-aula2',
    frente: 'Para que serve a regra de exclusão ON DELETE CASCADE no SQL Server?',
    verso: 'Garante integridade referencial apagando automaticamente registros dependentes quando o registro pai for deletado.',
    dica: 'Evita registros órfãos nas chaves estrangeiras.'
  }
];

export default function App() {
  const [xp, setXp] = useState(150);
  const [coins, setCoins] = useState(45);
  const [activeTab, setActiveTab] = useState('study'); // 'study' | 'progress' | 'decks'
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [srsState, setSrsState] = useState({});
  const [history, setHistory] = useState([]);

  const currentCard = DECK_INICIAL[cardIndex % DECK_INICIAL.length];

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleAnswer = (quality) => {
    const prevCardState = srsState[currentCard.frente] || {};
    const newCardState = calcularSm2(prevCardState, quality);

    setSrsState({
      ...srsState,
      [currentCard.frente]: newCardState
    });

    const xpGained = quality >= 3 ? 15 : 5;
    const coinsGained = quality >= 4 ? 5 : 2;

    setXp((prev) => prev + xpGained);
    setCoins((prev) => prev + coinsGained);

    setHistory((prev) => [
      { frente: currentCard.frente, quality, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9)
    ]);

    setFlipped(false);
    setCardIndex((prev) => (prev + 1) % DECK_INICIAL.length);
  };

  const currentCardSrs = srsState[currentCard.frente] || { rep: 0, interval: 0, ease: 2.5 };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={tokens.colors.bgApp} />

      {/* Header Superior Neon */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>Nex_<Text style={{ color: tokens.colors.cyan }}>TI</Text></Text>
          <Text style={styles.logoSubtext}>MOBILE STUDY ENGINE</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeText}>⚡ {xp} XP</Text>
          </View>
          <View style={[styles.statBadge, { borderColor: tokens.colors.gold }]}>
            <Text style={[styles.statBadgeText, { color: tokens.colors.gold }]}>🪙 {coins}</Text>
          </View>
        </View>
      </View>

      {/* Barra de Navegação Rápida (Tabs) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'study' && styles.tabButtonActive]}
          onPress={() => setActiveTab('study')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'study' && styles.tabButtonTextActive]}>
            📚 Estudo SM-2
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'progress' && styles.tabButtonActive]}
          onPress={() => setActiveTab('progress')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'progress' && styles.tabButtonTextActive]}>
            📊 Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'study' ? (
        <ScrollView contentContainerStyle={styles.studyContent}>
          {/* Card Meta Info */}
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.cardCounter}>
              Card {cardIndex + 1} de {DECK_INICIAL.length}
            </Text>
            <Text style={styles.cardEaseText}>
              Facilidade: {currentCardSrs.ease}x • Repetições: {currentCardSrs.rep}
            </Text>
          </View>

          {/* Flashcard Interativo Touch */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleFlip}
            style={[styles.flashcard, flipped && styles.flashcardFlipped]}
          >
            <View style={styles.cardTag}>
              <Text style={styles.cardTagText}>
                {flipped ? '✓ RESPOSTA' : '? PERGUNTA'}
              </Text>
            </View>

            <Text style={styles.cardMainText}>
              {flipped ? currentCard.verso : currentCard.frente}
            </Text>

            {currentCard.dica && (
              <View style={styles.hintContainer}>
                <Text style={styles.hintText}>💡 {currentCard.dica}</Text>
              </View>
            )}

            <Text style={styles.tapToFlipText}>
              {flipped ? 'Toque para rever a pergunta' : 'Toque no card para debugar / virar'}
            </Text>
          </TouchableOpacity>

          {/* Botões do Algoritmo SM-2 */}
          {flipped ? (
            <View style={styles.sm2Container}>
              <Text style={styles.sm2Title}>Como foi sua lembrança?</Text>
              <View style={styles.sm2ButtonGrid}>
                <TouchableOpacity
                  style={[styles.sm2Btn, { borderColor: tokens.colors.sm2Again }]}
                  onPress={() => handleAnswer(1)}
                >
                  <Text style={[styles.sm2BtnText, { color: tokens.colors.sm2Again }]}>De novo</Text>
                  <Text style={styles.sm2Subtext}>1 dia</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sm2Btn, { borderColor: tokens.colors.sm2Hard }]}
                  onPress={() => handleAnswer(3)}
                >
                  <Text style={[styles.sm2BtnText, { color: tokens.colors.sm2Hard }]}>Difícil</Text>
                  <Text style={styles.sm2Subtext}>2 dias</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sm2Btn, { borderColor: tokens.colors.sm2Good }]}
                  onPress={() => handleAnswer(4)}
                >
                  <Text style={[styles.sm2BtnText, { color: tokens.colors.sm2Good }]}>Bom</Text>
                  <Text style={styles.sm2Subtext}>6 dias</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sm2Btn, { borderColor: tokens.colors.sm2Easy }]}
                  onPress={() => handleAnswer(5)}
                >
                  <Text style={[styles.sm2BtnText, { color: tokens.colors.sm2Easy }]}>Fácil</Text>
                  <Text style={styles.sm2Subtext}>15 dias</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.btnShowAnswer} onPress={handleFlip}>
              <Text style={styles.btnShowAnswerText}>MOSTRAR RESPOSTA</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.progressContent}>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardLabel}>Nível do Estudante</Text>
            <Text style={styles.metricCardValue}>Rank: Intermediário</Text>
            <Text style={styles.metricCardSubtext}>Próximo nível com 300 XP</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricCardLabel}>Cards no Sistema</Text>
            <Text style={[styles.metricCardValue, { color: tokens.colors.cyan }]}>
              {DECK_INICIAL.length} Cards
            </Text>
            <Text style={styles.metricCardSubtext}>Sincronizados com o banco SQL Server</Text>
          </View>

          <Text style={styles.historyTitle}>Últimas Revisões Realizadas</Text>
          {history.length === 0 ? (
            <Text style={styles.emptyHistory}>Nenhuma revisão realizada nesta sessão.</Text>
          ) : (
            history.map((item, idx) => (
              <View key={idx} style={styles.historyItem}>
                <Text style={styles.historyText} numberOfLines={1}>
                  {item.frente}
                </Text>
                <Text style={styles.historyTime}>{item.time}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bgApp
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: tokens.colors.textPrimary,
    letterSpacing: 1
  },
  logoSubtext: {
    fontSize: 9,
    fontWeight: '700',
    color: tokens.colors.textMuted,
    letterSpacing: 1.5
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8
  },
  statBadge: {
    backgroundColor: tokens.colors.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: tokens.borderRadius.sm,
    borderWidth: 1,
    borderColor: tokens.colors.cyan
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.cyan
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    gap: 8
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: tokens.borderRadius.sm,
    backgroundColor: tokens.colors.bgCard,
    borderWidth: 1,
    borderColor: tokens.colors.border
  },
  tabButtonActive: {
    borderColor: tokens.colors.cyan,
    backgroundColor: '#002533'
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.colors.textMuted
  },
  tabButtonTextActive: {
    color: tokens.colors.cyan
  },
  studyContent: {
    padding: tokens.spacing.md,
    alignItems: 'center'
  },
  cardHeaderInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm
  },
  cardCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.cyan
  },
  cardEaseText: {
    fontSize: 11,
    color: tokens.colors.textMuted
  },
  flashcard: {
    width: '100%',
    minHeight: 260,
    backgroundColor: tokens.colors.bgCard,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.lg,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8
  },
  flashcardFlipped: {
    borderColor: tokens.colors.green,
    backgroundColor: '#0e1a18'
  },
  cardTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  cardTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.colors.textMuted,
    letterSpacing: 1
  },
  cardMainText: {
    fontSize: 16,
    lineHeight: 24,
    color: tokens.colors.textPrimary,
    fontWeight: '500',
    marginVertical: tokens.spacing.md
  },
  hintContainer: {
    backgroundColor: 'rgba(0, 240, 255, 0.06)',
    padding: 10,
    borderRadius: tokens.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: tokens.colors.cyan
  },
  hintText: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    fontStyle: 'italic'
  },
  tapToFlipText: {
    fontSize: 11,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    marginTop: tokens.spacing.sm
  },
  btnShowAnswer: {
    width: '100%',
    backgroundColor: tokens.colors.cyan,
    paddingVertical: 14,
    borderRadius: tokens.borderRadius.sm,
    alignItems: 'center',
    marginTop: tokens.spacing.lg
  },
  btnShowAnswerText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1
  },
  sm2Container: {
    width: '100%',
    marginTop: tokens.spacing.lg,
    alignItems: 'center'
  },
  sm2Title: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.sm
  },
  sm2ButtonGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },
  sm2Btn: {
    flex: 1,
    backgroundColor: tokens.colors.bgCard,
    borderWidth: 1,
    borderRadius: tokens.borderRadius.sm,
    paddingVertical: 10,
    alignItems: 'center'
  },
  sm2BtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  sm2Subtext: {
    fontSize: 10,
    color: tokens.colors.textMuted,
    marginTop: 2
  },
  progressContent: {
    padding: tokens.spacing.md
  },
  metricCard: {
    backgroundColor: tokens.colors.bgCard,
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginBottom: tokens.spacing.sm
  },
  metricCardLabel: {
    fontSize: 11,
    color: tokens.colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  metricCardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: tokens.colors.green,
    marginTop: 4
  },
  metricCardSubtext: {
    fontSize: 11,
    color: tokens.colors.textMuted,
    marginTop: 4
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm
  },
  emptyHistory: {
    fontSize: 12,
    color: tokens.colors.textMuted,
    fontStyle: 'italic'
  },
  historyItem: {
    backgroundColor: tokens.colors.bgCard,
    padding: 12,
    borderRadius: tokens.borderRadius.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  historyText: {
    flex: 1,
    fontSize: 12,
    color: tokens.colors.textSecondary,
    marginRight: 8
  },
  historyTime: {
    fontSize: 10,
    color: tokens.colors.textMuted
  }
});
