import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { loginUsuario } from '../services/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [campoAtivo, setCampoAtivo] = useState<'email' | 'senha' | null>(null);

  function alerta(titulo: string, mensagem: string) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
      return;
    }

    const { Alert } = require('react-native');
    Alert.alert(titulo, mensagem);
  }

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      alerta('Atenção', 'Preencha seu e-mail e sua senha para continuar.');
      return;
    }

    try {
      setCarregando(true);
      const sessao = await loginUsuario(email.trim(), senha);
      await AsyncStorage.multiSet([
        ['@smartfishing:usuario', JSON.stringify(sessao.usuario)],
        ['@smartfishing:token', sessao.token],
      ]);
      router.replace('/(drawer)/home' as any);
    } catch (error) {
      alerta('Não foi possível entrar', error instanceof Error ? error.message : 'Tente novamente em alguns instantes.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#062A4A" />
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.brand}>Smart Fishing</Text>
            <Text style={styles.tagline}>Sua próxima pescaria começa aqui.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Boas-vindas!</Text>
            <Text style={styles.subtitle}>Entre para encontrar os melhores pesqueiros.</Text>

            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.inputWrapper, campoAtivo === 'email' && styles.inputWrapperFocused]}>
              <Ionicons name="mail-outline" size={20} color={campoAtivo === 'email' ? '#087E8B' : '#60758A'} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#8294A5"
                value={email}
                onChangeText={setEmail}
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
              <Ionicons name="lock-closed-outline" size={20} color={campoAtivo === 'senha' ? '#087E8B' : '#60758A'} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#8294A5"
                value={senha}
                onChangeText={setSenha}
                onFocus={() => setCampoAtivo('senha')}
                onBlur={() => setCampoAtivo(null)}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
                autoComplete="password"
                returnKeyType="go"
                onSubmitEditing={handleLogin}
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

            <Pressable onPress={() => router.push('/esqueci-senha')} hitSlop={8} style={styles.forgotPasswordRow}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.loginButton, (pressed || carregando) && styles.loginButtonPressed]}
              onPress={handleLogin}
              disabled={carregando}
              accessibilityRole="button"
            >
              {carregando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Entrar</Text>}
            </Pressable>

            <View style={styles.createAccountRow}>
              <Text style={styles.createAccountText}>Ainda não tem uma conta?</Text>
              <Pressable onPress={() => router.push('/cadastro')} hitSlop={8}>
                <Text style={styles.createAccountLink}> Criar conta</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#062A4A' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, backgroundColor: '#062A4A' },
  hero: { alignItems: 'center', paddingTop: 28, paddingBottom: 30, paddingHorizontal: 24 },
  logoContainer: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#001A31', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 7 },
  logo: { width: 78, height: 78, borderRadius: 39 },
  brand: { color: '#FFFFFF', fontSize: 27, fontWeight: '800', marginTop: 14, letterSpacing: 0.2 },
  tagline: { color: '#B7D5E5', fontSize: 14, marginTop: 5 },
  card: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 28, paddingTop: 34, paddingBottom: 30, minHeight: 440 },
  title: { color: '#12324A', fontSize: 25, fontWeight: '800' },
  subtitle: { color: '#64788B', fontSize: 14, lineHeight: 21, marginTop: 6, marginBottom: 30 },
  label: { color: '#29475D', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  inputWrapper: { height: 54, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, marginBottom: 21, backgroundColor: '#F4F8FA', borderColor: '#D7E2E8', borderWidth: 1, borderRadius: 14 },
  inputWrapperFocused: { backgroundColor: '#F8FCFC', borderColor: '#087E8B', borderWidth: 2, paddingHorizontal: 14 },
  input: { flex: 1, height: '100%', color: '#18384F', fontSize: 15 },
  forgotPasswordRow: { alignSelf: 'flex-end', marginBottom: 22 },
  forgotPasswordText: { color: '#087E8B', fontSize: 13, fontWeight: '700' },
  loginButton: { height: 54, marginTop: 4, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#087E8B', shadowColor: '#075962', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  loginButtonPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  createAccountRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 },
  createAccountText: { color: '#60758A', fontSize: 14 },
  createAccountLink: { color: '#087E8B', fontSize: 14, fontWeight: '800' },
});
