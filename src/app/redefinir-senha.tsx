import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { redefinirSenha } from '../services/api';
import { colors } from '../theme';

export default function RedefinirSenha() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tokenRecebido = Array.isArray(params.token) ? params.token[0] : params.token;

  const [token, setToken] = useState(tokenRecebido ?? '');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  function extrairToken(valor: string) {
    const bruto = valor.trim();
    const match = bruto.match(/token=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : bruto;
  }

  function alerta(mensagem: string) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Atenção', mensagem);
    }
  }

  async function handleRedefinir() {
    const tokenLimpo = extrairToken(token);

    if (!tokenLimpo) {
      alerta('Cole o código ou o link recebido por e-mail.');
      return;
    }

    if (novaSenha.length < 6) {
      alerta('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alerta('As senhas não coincidem.');
      return;
    }

    try {
      setCarregando(true);
      await redefinirSenha(tokenLimpo, novaSenha);

      if (Platform.OS === 'web') {
        window.alert('Senha redefinida com sucesso! Faça login com a nova senha.');
        router.replace('/');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Sucesso', 'Senha redefinida com sucesso! Faça login com a nova senha.', [
          { text: 'OK', onPress: () => router.replace('/') },
        ]);
      }
    } catch (error) {
      alerta(error instanceof Error ? error.message : 'Não foi possível redefinir a senha.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Redefinir senha</Text>
      <Text style={styles.subtitulo}>
        Cole o código recebido no e-mail de redefinição e escolha uma nova senha.
      </Text>

      <Text style={styles.label}>Código ou link recebido por e-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Cole aqui o código ou o link do e-mail"
        placeholderTextColor={colors.placeholder}
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Nova senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Mínimo 6 caracteres"
        placeholderTextColor={colors.placeholder}
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />

      <Text style={styles.label}>Confirmar nova senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Repita a nova senha"
        placeholderTextColor={colors.placeholder}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btnRedefinir} onPress={handleRedefinir} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnText}>Redefinir senha</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLink} onPress={() => router.replace('/')}>
        <Text style={styles.btnLinkText}>
          Lembrou a senha? <Text style={styles.destaque}>Entrar</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  titulo: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitulo: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 36,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 50,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 20,
  },
  btnRedefinir: {
    backgroundColor: colors.teal,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnLink: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  btnLinkText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  destaque: {
    color: colors.teal,
    fontWeight: 'bold',
  },
});
