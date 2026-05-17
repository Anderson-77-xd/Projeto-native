// src/app/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useRouter } from 'expo-router';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function Home() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = { name: '', password: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 4) {
      newErrors.password = 'Senha deve ter no mínimo 4 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // Simular delay de requisição
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="fish" size={64} color={colors.primary} />
          </View>
          <Text style={styles.appName}>Smart Fishing</Text>
          <Text style={styles.appSubtitle}>Encontre os melhores pesqueiros</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Input
            label="Nome"
            placeholder="Digite seu nome"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
            icon={<Ionicons name="person" size={20} color={colors.primary} />}
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
            secureTextEntry={true}
            icon={<Ionicons name="lock-closed" size={20} color={colors.primary} />}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            size="large"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem conta? </Text>
          <TouchableOpacity>
            <Text style={styles.signupText}>Cadastre-se aqui</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0F5EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  appName: {
    ...typography.displaySmall,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  appSubtitle: {
    ...typography.bodyLarge,
    color: colors.gray[500],
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: spacing.xxxl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    ...typography.labelMedium,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.bodyMedium,
    color: colors.gray[600],
  },
  signupText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600' as const,
  },
});
