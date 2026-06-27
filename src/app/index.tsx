import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { loginUsuario } from '../services/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function alerta(titulo: string, mensagem: string) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      const { Alert } = require('react-native');
      Alert.alert(titulo, mensagem);
    }
  }

  async function handleLogin() {
    if (email.trim() === '' || senha.trim() === '') {
      alerta('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setCarregando(true);
      const usuario = await loginUsuario(email.trim(), senha);
      await AsyncStorage.setItem('@smartfishing:usuario', JSON.stringify(usuario));
      router.replace('/(drawer)/home' as any);
    } catch (error) {
      alerta('Erro no login', error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <View style={styles.topo}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>Smart Fishing</Text>
        <Text style={styles.subtitulo}>Faça login para continuar</Text>
      </View>

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
      <View style={styles.inputSenhaRow}>
        <TextInput
          style={styles.inputSenha}
          placeholder="Sua senha"
          placeholderTextColor="#4a7a96"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!senhaVisivel}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
          <Text style={styles.senhaToggle}>
            {senhaVisivel ? 'Ocultar' : 'Mostrar'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnEntrar} onPress={handleLogin} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#0a2540" />
        ) : (
          <Text style={styles.btnEntrarText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnCadastro} onPress={() => router.push('/cadastro')}>
        <Text style={styles.btnCadastroText}>
          Não tem conta? <Text style={styles.destaque}>Criar conta</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001242',
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  topo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  titulo: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#7aabcc',
    fontSize: 14,
    marginTop: 6,
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
  inputSenhaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#112e50',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e4d7a',
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 28,
  },
  inputSenha: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  senhaToggle: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '600',
  },
  btnEntrar: {
    backgroundColor: '#7BCDBA',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  btnEntrarText: {
    color: '#0a2540',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnCadastro: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  btnCadastroText: {
    color: '#7aabcc',
    fontSize: 14,
  },
  destaque: {
    color: '#4ADE80',
    fontWeight: 'bold',
  },
});
