import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { cadastrarPesqueiro } from '../../services/api';
import { colors } from '../../theme';

export default function CadastrarPesqueiro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [informacao, setInformacao] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [carregando, setCarregando] = useState(false);

  function alerta(mensagem: string) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Atenção', mensagem);
    }
  }

  async function handleCadastrar() {
    if (nome.trim() === '' || cep.trim() === '') {
      alerta('Preencha ao menos o nome e o endereço do pesqueiro.');
      return;
    }

    try {
      setCarregando(true);
      await cadastrarPesqueiro({
        nome: nome.trim(),
        telefone: telefone.trim(),
        descricao: descricao.trim(),
        informacao: informacao.trim(),
        cep: cep.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
      });

      if (Platform.OS === 'web') {
        window.alert('Pesqueiro cadastrado com sucesso!');
        router.push('/(drawer)/pesqueiros');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Sucesso', 'Pesqueiro cadastrado com sucesso!', [
          { text: 'OK', onPress: () => router.push('/(drawer)/pesqueiros') },
        ]);
      }
    } catch (error) {
      alerta(error instanceof Error ? error.message : 'Não foi possível cadastrar o pesqueiro.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Cadastrar pesqueiro</Text>
        <Text style={styles.subtitulo}>Preencha os dados abaixo</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do pesqueiro"
          placeholderTextColor={colors.placeholder}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(11) 99999-9999"
          placeholderTextColor={colors.placeholder}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <View style={styles.linha}>
          <View style={styles.colunaMenor}>
            <Text style={styles.label}>CEP</Text>
            <TextInput
              style={styles.input}
              placeholder="00000-000"
              placeholderTextColor={colors.placeholder}
              value={cep}
              onChangeText={setCep}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.colunaMenor}>
            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              placeholder="100"
              placeholderTextColor={colors.placeholder}
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Complemento</Text>
        <TextInput
          style={styles.input}
          placeholder="Rua, bairro..."
          placeholderTextColor={colors.placeholder}
          value={complemento}
          onChangeText={setComplemento}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o pesqueiro..."
          placeholderTextColor={colors.placeholder}
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <Text style={styles.label}>Informações adicionais</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Horário de funcionamento, regras..."
          placeholderTextColor={colors.placeholder}
          value={informacao}
          onChangeText={setInformacao}
          multiline
        />

        <TouchableOpacity style={styles.btnCadastrar} onPress={handleCadastrar} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnText}>Cadastrar pesqueiro</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titulo: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitulo: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
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
  textArea: {
    height: 90,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  linha: {
    flexDirection: 'row',
    gap: 12,
  },
  colunaMenor: {
    flex: 1,
  },
  btnCadastrar: {
    backgroundColor: colors.teal,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
