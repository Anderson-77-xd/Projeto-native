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
import { useRouter } from 'expo-router';
import { esqueciSenha } from '../services/api';
import { colors } from '../theme';

export default function EsqueciSenha() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function alerta(mensagem: string) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Atenção', mensagem);
    }
  }

  async function handleEnviar() {
    if (!email.trim()) {
      alerta('Informe o e-mail cadastrado na sua conta.');
      return;
    }

    try {
      setCarregando(true);
      await esqueciSenha(email.trim());
      setEnviado(true);
    } catch (error) {
      alerta(error instanceof Error ? error.message : 'Não foi possível enviar o e-mail. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Esqueci minha senha</Text>
      <Text style={styles.subtitulo}>
        {enviado
          ? 'Se o e-mail informado estiver cadastrado, você vai receber um link com as instruções para redefinir sua senha.'
          : 'Informe o e-mail da sua conta para receber o link de redefinição de senha.'}
      </Text>

      {!enviado && (
        <>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.btnEnviar} onPress={handleEnviar} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnText}>Enviar link de redefinição</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.btnLink} onPress={() => router.push('/redefinir-senha')}>
        <Text style={styles.btnLinkText}>
          Já tem um link? <Text style={styles.destaque}>Redefinir senha</Text>
        </Text>
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
  btnEnviar: {
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
