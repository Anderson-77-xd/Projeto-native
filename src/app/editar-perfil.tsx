import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { atualizarUsuario, Usuario } from '../services/api';
import { colors } from '../theme';
import { useExigirAutenticacao } from '../hooks/useExigirAutenticacao';
import { emailValido } from '../utils/validarEmail';

export default function EditarPerfil() {
  const router = useRouter();
  const { autenticado, verificando } = useExigirAutenticacao();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@smartfishing:usuario').then((usuarioSalvo) => {
      if (!usuarioSalvo) return;
      const usuarioAtual = JSON.parse(usuarioSalvo) as Usuario;
      setUsuario(usuarioAtual);
      setNome(usuarioAtual.nome);
      setEmail(usuarioAtual.email);
    });
  }, []);

  function alerta(mensagem: string) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Atenção', mensagem);
    }
  }

  async function handleSalvar() {
    if (!usuario?.id) {
      alerta('Faça login novamente para editar seu perfil.');
      return;
    }

    if (nome.trim() === '' || email.trim() === '') {
      alerta('Preencha nome e e-mail.');
      return;
    }

    if (/\s/.test(email) || !emailValido(email.trim())) {
      alerta('Digite um e-mail válido, sem espaços (exemplo: nome@dominio.com).');
      return;
    }

    if (novaSenha && (novaSenha.length < 8 || !/[0-9!@#$%^&*(),.?":{}|<>_\-+=[\]\\/;'`~]/.test(novaSenha))) {
      alerta('A nova senha deve ter pelo menos 8 caracteres, incluindo pelo menos um número ou caractere especial.');
      return;
    }

    try {
      setCarregando(true);
      const usuarioAtualizado = await atualizarUsuario(usuario.id, {
        nome: nome.trim(),
        email: email.trim(),
        ...(novaSenha ? { senha: novaSenha } : {}),
      });

      await AsyncStorage.setItem(
        '@smartfishing:usuario',
        JSON.stringify({ ...usuario, ...usuarioAtualizado, senha: undefined }),
      );

      if (Platform.OS === 'web') {
        window.alert('Perfil atualizado com sucesso!');
        router.back();
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      alerta(error instanceof Error ? error.message : 'Não foi possível atualizar o perfil.');
    } finally {
      setCarregando(false);
    }
  }

  if (verificando || !autenticado) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar perfil</Text>
      <Text style={styles.subtitulo}>Atualize suas informações abaixo</Text>

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

      <Text style={styles.label}>Nova senha (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Deixe em branco para manter a atual"
        placeholderTextColor={colors.placeholder}
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnText}>Salvar alterações</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnCancelar} onPress={() => router.back()} disabled={carregando}>
        <Text style={styles.btnCancelarText}>Cancelar</Text>
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
  btnSalvar: {
    backgroundColor: colors.teal,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnCancelar: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  btnCancelarText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
