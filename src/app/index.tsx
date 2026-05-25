import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  function handleLogin() {
    if (name.trim() === '' || senha.trim() === '') {
      if (Platform.OS === 'web') {
        window.alert('Preencha todos os campos.');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Atenção', 'Preencha todos os campos.');
      }
      return;
    }

    router.push('/(drawer)/home' as any);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      {/* LOGO E TÍTULO */}
      <View style={styles.topo}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>Smart Fishing</Text>
        <Text style={styles.subtitulo}>Faça login para continuar</Text>
      </View>

      {/* CAMPOS */}
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="seu nome"
        placeholderTextColor="#4a7a96"
        value={name}
        onChangeText={setName}
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

      {/* BOTÃO ENTRAR */}
      <TouchableOpacity style={styles.btnEntrar} onPress={handleLogin}>
        <Text style={styles.btnEntrarText}>Entrar</Text>
      </TouchableOpacity>

      {/* CADASTRO */}
      <TouchableOpacity style={styles.btnCadastro} onPress={() => router.push('/cadastro')}>
        <Text style={styles.btnCadastroText}>
          Não tem conta?{' '}
          <Text style={styles.destaque}>Criar conta</Text>
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