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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { redefinirSenha } from '../services/api';
import { colors } from '../theme';

export default function RedefinirSenha() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tokenRecebido = Array.isArray(params.token) ? params.token[0] : params.token;

  const [token, setToken] = useState(tokenRecebido ?? '');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [campoAtivo, setCampoAtivo] = useState<'token' | 'senha' | 'confirmar' | null>(null);

  function extrairToken(valor: string) {
    const bruto = valor.trim();
    const match = bruto.match(/token=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : bruto;
  }

  function alerta(mensagem: string) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Atenção', mensagem);
    }
  }

  async function handleRedefinir() {
    const tokenLimpo = extrairToken(token);

    if (!tokenLimpo) {
      alerta('Cole o código ou o link recebido por e-mail.');
      return;
    }

    if (novaSenha.length < 8 || !/[0-9!@#$%^&*(),.?":{}|<>_\-+=[\]\\/;'`~]/.test(novaSenha)) {
      alerta('A nova senha deve ter pelo menos 8 caracteres, incluindo pelo menos um número ou caractere especial.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alerta('As senhas não coincidem.');
      return;
    }

    try {
      setCarregando(true);
      await redefinirSenha(tokenLimpo, novaSenha);

      if (Platform.OS === 'web') {
        window.alert('Senha redefinida com sucesso! Faça login com a nova senha.');
        router.replace('/');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Sucesso', 'Senha redefinida com sucesso! Faça login com a nova senha.', [
          { text: 'OK', onPress: () => router.replace('/') },
        ]);
      }
    } catch (error) {
      alerta(error instanceof Error ? error.message : 'Não foi possível redefinir a senha.');
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
              <Ionicons name="shield-checkmark-outline" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.brand}>Redefinir senha</Text>
            <Text style={styles.tagline}>Escolha uma nova senha para sua conta.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Código ou link recebido por e-mail</Text>
            <View style={[styles.inputWrapper, campoAtivo === 'token' && styles.inputWrapperFocused]}>
              <Ionicons name="link-outline" size={20} color={campoAtivo === 'token' ? colors.teal : '#60758A'} />
              <TextInput
                style={styles.input}
                placeholder="Cole aqui o código ou o link do e-mail"
                placeholderTextColor={colors.placeholder}
                value={token}
                onChangeText={setToken}
                onFocus={() => setCampoAtivo('token')}
                onBlur={() => setCampoAtivo(null)}
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Nova senha</Text>
            <View style={[styles.inputWrapper, campoAtivo === 'senha' && styles.inputWrapperFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={campoAtivo === 'senha' ? colors.teal : '#60758A'} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 8 caracteres, com número ou símbolo"
                placeholderTextColor={colors.placeholder}
                value={novaSenha}
                onChangeText={setNovaSenha}
                onFocus={() => setCampoAtivo('senha')}
                onBlur={() => setCampoAtivo(null)}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setSenhaVisivel((v) => !v)} hitSlop={10} accessibilityRole="button" accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}>
                <Ionicons name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'} size={22} color="#35617B" />
              </Pressable>
            </View>

            <Text style={styles.label}>Confirmar nova senha</Text>
            <View style={[styles.inputWrapper, campoAtivo === 'confirmar' && styles.inputWrapperFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={campoAtivo === 'confirmar' ? colors.teal : '#60758A'} />
              <TextInput
                style={styles.input}
                placeholder="Repita a nova senha"
                placeholderTextColor={colors.placeholder}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                onFocus={() => setCampoAtivo('confirmar')}
                onBlur={() => setCampoAtivo(null)}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
                returnKeyType="go"
                onSubmitEditing={handleRedefinir}
              />
            </View>

            <Pressable
              style={({ pressed }) => [styles.button, (pressed || carregando) && styles.buttonPressed]}
              onPress={handleRedefinir}
              disabled={carregando}
              accessibilityRole="button"
            >
              {carregando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Redefinir senha</Text>}
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
  brand: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 16, letterSpacing: 0.2 },
  tagline: { color: '#B7D5E5', fontSize: 14, marginTop: 5, textAlign: 'center' },
  card: { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 28, paddingTop: 30, paddingBottom: 30, minHeight: 480 },
  label: { color: '#29475D', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  inputWrapper: { height: 54, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, marginBottom: 21, backgroundColor: '#F4F8FA', borderColor: '#D7E2E8', borderWidth: 1, borderRadius: 14 },
  inputWrapperFocused: { backgroundColor: '#F8FCFC', borderColor: colors.teal, borderWidth: 2, paddingHorizontal: 14 },
  input: { flex: 1, height: '100%', color: '#18384F', fontSize: 15 },
  button: { height: 54, marginTop: 6, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.teal, shadowColor: '#075962', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  buttonPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  linkRow: { alignItems: 'center', paddingVertical: 8, marginTop: 12 },
  linkText: { color: '#60758A', fontSize: 14 },
  linkHighlight: { color: colors.teal, fontWeight: '800' },
});
