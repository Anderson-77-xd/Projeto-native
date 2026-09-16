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
import { esqueciSenha } from '../services/api';
import { colors } from '../theme';

export default function EsqueciSenha() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [campoAtivo, setCampoAtivo] = useState(false);

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Voltar">
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <View style={styles.heroIcon}>
              <Ionicons name={enviado ? 'mail-open-outline' : 'key-outline'} size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.brand}>Esqueci minha senha</Text>
            <Text style={styles.tagline}>
              {enviado ? 'Verifique sua caixa de entrada.' : 'Vamos te ajudar a recuperar o acesso.'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle}>
              {enviado
                ? 'Se o e-mail informado estiver cadastrado, você vai receber um link com as instruções para redefinir sua senha.'
                : 'Informe o e-mail da sua conta para receber o link de redefinição de senha.'}
            </Text>

            {enviado ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={22} color={colors.teal} />
                <Text style={styles.successText}>E-mail enviado para {email.trim()}</Text>
              </View>
            ) : (
              <>
                <Text style={styles.label}>E-mail</Text>
                <View style={[styles.inputWrapper, campoAtivo && styles.inputWrapperFocused]}>
                  <Ionicons name="mail-outline" size={20} color={campoAtivo ? colors.teal : '#60758A'} />
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor={colors.placeholder}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setCampoAtivo(true)}
                    onBlur={() => setCampoAtivo(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="go"
                    onSubmitEditing={handleEnviar}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [styles.button, (pressed || carregando) && styles.buttonPressed]}
                  onPress={handleEnviar}
                  disabled={carregando}
                  accessibilityRole="button"
                >
                  {carregando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Enviar link de redefinição</Text>}
                </Pressable>
              </>
            )}

            <Pressable style={styles.linkRow} onPress={() => router.push('/redefinir-senha')} hitSlop={8}>
              <Text style={styles.linkText}>
                Já tem um link? <Text style={styles.linkHighlight}>Redefinir senha</Text>
              </Text>
            </Pressable>

            <Pressable style={styles.linkRow} onPress={() => router.replace('/')} hitSlop={8}>
              <Text style={styles.linkText}>
                Lembrou a senha? <Text style={styles.linkHighlight}>Entrar</Text>
              </Text>
            </Pressable>
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
  brand: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 16, letterSpacing: 0.2, textAlign: 'center' },
  tagline: { color: '#B7D5E5', fontSize: 14, marginTop: 5, textAlign: 'center' },
  card: { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 28, paddingTop: 30, paddingBottom: 30, minHeight: 380 },
  subtitle: { color: '#64788B', fontSize: 14, lineHeight: 21, marginBottom: 26 },
  label: { color: '#29475D', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  inputWrapper: { height: 54, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, marginBottom: 21, backgroundColor: '#F4F8FA', borderColor: '#D7E2E8', borderWidth: 1, borderRadius: 14 },
  inputWrapperFocused: { backgroundColor: '#F8FCFC', borderColor: colors.teal, borderWidth: 2, paddingHorizontal: 14 },
  input: { flex: 1, height: '100%', color: '#18384F', fontSize: 15 },
  button: { height: 54, marginTop: 4, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.teal, shadowColor: '#075962', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  buttonPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  successBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#E3F5F0', borderRadius: 14, padding: 16, marginBottom: 10 },
  successText: { flex: 1, color: '#1E5A52', fontSize: 13, fontWeight: '600', lineHeight: 19 },
  linkRow: { alignItems: 'center', paddingVertical: 8, marginTop: 8 },
  linkText: { color: '#60758A', fontSize: 14 },
  linkHighlight: { color: colors.teal, fontWeight: '800' },
});
