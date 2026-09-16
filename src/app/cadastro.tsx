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
import { cadastrarUsuario } from '../services/api';
import { colors } from '../theme';
import { emailValido } from '../utils/validarEmail';

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  function alerta(mensagem: string) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Atenção', mensagem);
    }
  }

  async function handleCadastro() {
    if (nome.trim() === '' || email.trim() === '' || senha.trim() === '') {
      alerta('Preencha todos os campos.');
      return;
    }

    if (/\s/.test(email) || !emailValido(email.trim())) {
      alerta('Digite um e-mail válido, sem espaços (exemplo: nome@dominio.com).');
      return;
    }

    if (senha.length < 8 || !/[0-9!@#$%^&*(),.?":{}|<>_\-+=[\]\\/;'`~]/.test(senha)) {
      alerta('A senha deve ter pelo menos 8 caracteres, incluindo pelo menos um número ou caractere especial.');
      return;
    }

    try {
      setCarregando(true);
      await cadastrarUsuario(nome.trim(), email.trim(), senha);

      if (Platform.OS === 'web') {
        window.alert('Conta criada com sucesso!');
        router.replace('/');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Sucesso', 'Conta criada com sucesso!', [
          { text: 'OK', onPress: () => router.replace('/') },
        ]);
      }
    } catch (error) {
      alerta(error instanceof Error ? error.message : 'Não foi possível criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar conta</Text>
      <Text style={styles.subtitulo}>Preencha os dados abaixo</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu nome completo"
        placeholderTextColor={colors.placeholder}
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seu@email.com"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={(texto) => setEmail(texto.replace(/\s/g, ''))}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Mínimo 8 caracteres, com número ou símbolo"
        placeholderTextColor={colors.placeholder}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btnCadastrar} onPress={handleCadastro} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnText}>Criar conta</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLogin} onPress={() => router.replace('/')}>
        <Text style={styles.btnLoginText}>
          Já tem conta? <Text style={styles.destaque}>Entrar</Text>
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
  btnCadastrar: {
    backgroundColor: colors.teal,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnLogin: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  btnLoginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  destaque: {
    color: colors.teal,
    fontWeight: 'bold',
  },
});
