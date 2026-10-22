/**
 * Onde o app guarda dados no aparelho.
 * - Sessão (token e usuário): SecureStore, o cofre do sistema (Keychain/Keystore).
 * - Progresso e fila de envio: AsyncStorage, um por usuário.
 */
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_SESSAO = 'nexti_sessao';

export const armazenamento = {
  async lerSessao() {
    const texto = await SecureStore.getItemAsync(CHAVE_SESSAO);
    return texto ? JSON.parse(texto) : null;
  },
  salvarSessao: (sessao) => SecureStore.setItemAsync(CHAVE_SESSAO, JSON.stringify(sessao)),
  apagarSessao: () => SecureStore.deleteItemAsync(CHAVE_SESSAO),

  async ler(chave) {
    const texto = await AsyncStorage.getItem(chave);
    return texto ? JSON.parse(texto) : null;
  },
  gravar: (chave, valor) => AsyncStorage.setItem(chave, JSON.stringify(valor)),
};
