// src/app/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useRouter } from 'expo-router'; // <-- Importe o useRouter aqui também

export default function Home() {
  const [name, setName ,] = useState('');
  const [senha, setSenha ,] = useState('');
  const router = useRouter(); // <-- Inicialize o useRouter

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo, {name}!</Text>
      <Input
        placeholder="Digite seu nome"
        onChangeText={setName}
      />
      <Input
        placeholder="Digite sua senha"
        onChangeText={setSenha}
         secureTextEntry={true} // 
      />
      <Button
        title="Entrar"
        onPress={() => {

          if (name.trim() === '') {
            alert('Por favor, digite seu nome!');
          } else if (senha.trim() === '') {
            alert('Por favor, digite sua senha!');
          } else {
            router.push('/(drawer)/dashboard' as any);
          }
        }}
      />

      
      <Button
  title="Criar conta"
  onPress={() => router.push('/cadastro')}
/>
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#085594',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
});