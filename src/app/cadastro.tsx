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

    if (senha.length < 6) {
      alerta('A senha deve ter pelo menos 6 caracteres.');
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
        placeholderTextColor="#4a7a96"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seu@email.com"
        placeholderTextColor="#4a7a96"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Mínimo 6 caracteres"
        placeholderTextColor="#4a7a96"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btnCadastrar} onPress={handleCadastro} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#0a2540" />
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
    backgroundColor: '#0a2540',
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitulo: {
    color: '#7aabcc',
    fontSize: 15,
    marginBottom: 36,
  },
  label: {
    color: '#b8d4e8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#112e50',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e4d7a',
    paddingHorizontal: 16,
    height: 50,
    color: '#fff',
    fontSize: 15,
    marginBottom: 20,
  },
  btnCadastrar: {
    backgroundColor: '#4ADE80',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  btnText: {
    color: '#0a2540',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnLogin: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  btnLoginText: {
    color: '#7aabcc',
    fontSize: 14,
  },
  destaque: {
    color: '#4ADE80',
    fontWeight: 'bold',
  },
});
