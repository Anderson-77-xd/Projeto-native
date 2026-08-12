import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topo}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.titulo}>Smart Fishing</Text>
          <Text style={styles.subtitulo}>Faça login para continuar</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color="#4a7a96" style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#4a7a96"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color="#4a7a96" style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#4a7a96"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!senhaVisivel}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} hitSlop={8}>
              <Ionicons
                name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                size={19}
                color="#7aabcc"
              />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  topo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#112e50',
    borderWidth: 1,
    borderColor: '#1e4d7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
  },
  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  subtitulo: {
    color: '#7aabcc',
    fontSize: 14,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#0e2c4d',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e4d7a',
    padding: 22,
  },
  label: {
    color: '#b8d4e8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#112e50',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e4d7a',
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 18,
  },
  inputIcone: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  btnEntrar: {
    backgroundColor: '#4ADE80',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
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
