import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [campoAtivo, setCampoAtivo] = useState<'nome' | 'email' | 'senha' | null>(null);

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
      <SafeAreaView style={styles.loadingSafeArea}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.topTitle}>Editar perfil</Text>
        <View style={styles.iconButton} />
      </View>

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.subtitle}>Atualize suas informações abaixo</Text>

          <Text style={styles.label}>Nome</Text>
          <View style={[styles.inputWrapper, campoAtivo === 'nome' && styles.inputWrapperFocused]}>
            <Ionicons name="person-outline" size={20} color={campoAtivo === 'nome' ? colors.teal : '#60758A'} />
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.placeholder}
              value={nome}
              onChangeText={setNome}
              onFocus={() => setCampoAtivo('nome')}
              onBlur={() => setCampoAtivo(null)}
            />
          </View>

          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.inputWrapper, campoAtivo === 'email' && styles.inputWrapperFocused]}>
            <Ionicons name="mail-outline" size={20} color={campoAtivo === 'email' ? colors.teal : '#60758A'} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={(texto) => setEmail(texto.replace(/\s/g, ''))}
              onFocus={() => setCampoAtivo('email')}
              onBlur={() => setCampoAtivo(null)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Nova senha (opcional)</Text>
          <View style={[styles.inputWrapper, campoAtivo === 'senha' && styles.inputWrapperFocused]}>
            <Ionicons name="lock-closed-outline" size={20} color={campoAtivo === 'senha' ? colors.teal : '#60758A'} />
            <TextInput
              style={styles.input}
              placeholder="Deixe em branco para manter a atual"
              placeholderTextColor={colors.placeholder}
              value={novaSenha}
              onChangeText={setNovaSenha}
              onFocus={() => setCampoAtivo('senha')}
              onBlur={() => setCampoAtivo(null)}
              secureTextEntry={!senhaVisivel}
              autoCapitalize="none"
            />
            {!!novaSenha && (
              <Pressable onPress={() => setSenhaVisivel((v) => !v)} hitSlop={10} accessibilityRole="button" accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}>
                <Ionicons name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'} size={22} color="#35617B" />
              </Pressable>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, (pressed || carregando) && styles.buttonPressed]}
            onPress={handleSalvar}
            disabled={carregando}
            accessibilityRole="button"
          >
            {carregando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Salvar alterações</Text>}
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => router.back()} disabled={carregando} hitSlop={8}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingSafeArea: { flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  safeArea: { flex: 1, backgroundColor: colors.background },
  topBar: { height: 65, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.navy },
  iconButton: { height: 39, width: 39, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.12)' },
  topTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: 26 },
  label: { color: '#29475D', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  inputWrapper: { height: 54, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, marginBottom: 20, backgroundColor: colors.surface, borderColor: '#D7E2E8', borderWidth: 1, borderRadius: 14 },
  inputWrapperFocused: { backgroundColor: '#F8FCFC', borderColor: colors.teal, borderWidth: 2, paddingHorizontal: 14 },
  input: { flex: 1, height: '100%', color: '#18384F', fontSize: 15 },
  button: { height: 54, marginTop: 8, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.teal, shadowColor: '#075962', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  buttonPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  cancelButton: { alignItems: 'center', paddingVertical: 14, marginTop: 6 },
  cancelText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});
