import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { cadastrarUsuario } from '../services/api';
import { colors } from '../theme';
import { emailValido } from '../utils/validarEmail';

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [campoAtivo, setCampoAtivo] = useState<'nome' | 'email' | 'senha' | null>(null);

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Voltar">
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <View style={styles.heroIcon}>
              <Ionicons name="person-add-outline" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.brand}>Criar conta</Text>
            <Text style={styles.tagline}>Junte-se à comunidade de pescadores.</Text>
          </View>

          <View style={styles.card}>
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
                returnKeyType="next"
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
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputWrapper, campoAtivo === 'senha' && styles.inputWrapperFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={campoAtivo === 'senha' ? colors.teal : '#60758A'} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 8 caracteres, com número ou símbolo"
                placeholderTextColor={colors.placeholder}
                value={senha}
                onChangeText={setSenha}
                onFocus={() => setCampoAtivo('senha')}
                onBlur={() => setCampoAtivo(null)}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
                returnKeyType="go"
                onSubmitEditing={handleCadastro}
              />
              <Pressable
                onPress={() => setSenhaVisivel((visivel) => !visivel)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <Ionicons name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'} size={22} color="#35617B" />
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [styles.button, (pressed || carregando) && styles.buttonPressed]}
              onPress={handleCadastro}
              disabled={carregando}
              accessibilityRole="button"
            >
              {carregando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Criar conta</Text>}
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Já tem uma conta?</Text>
              <Pressable onPress={() => router.replace('/')} hitSlop={8}>
                <Text style={styles.footerLink}> Entrar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.navy },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, backgroundColor: colors.navy },
  hero: { alignItems: 'center', paddingTop: 12, paddingBottom: 30, paddingHorizontal: 24 },
  backButton: { position: 'absolute', top: 4, left: 20, height: 39, width: 39, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.12)', alignItems: 'center', justifyContent: 'center' },
  heroIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255, 255, 255, 0.14)', alignItems: 'center', justifyContent: 'center', marginTop: 44 },
  brand: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', marginTop: 16, letterSpacing: 0.2 },
  tagline: { color: '#B7D5E5', fontSize: 14, marginTop: 5 },
  card: { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 28, paddingTop: 30, paddingBottom: 30, minHeight: 420 },
  label: { color: '#29475D', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  inputWrapper: { height: 54, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, marginBottom: 21, backgroundColor: '#F4F8FA', borderColor: '#D7E2E8', borderWidth: 1, borderRadius: 14 },
  inputWrapperFocused: { backgroundColor: '#F8FCFC', borderColor: colors.teal, borderWidth: 2, paddingHorizontal: 14 },
  input: { flex: 1, height: '100%', color: '#18384F', fontSize: 15 },
  button: { height: 54, marginTop: 6, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.teal, shadowColor: '#075962', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  buttonPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 },
  footerText: { color: '#60758A', fontSize: 14 },
  footerLink: { color: colors.teal, fontSize: 14, fontWeight: '800' },
});
