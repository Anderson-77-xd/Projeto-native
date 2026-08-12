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
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Cadastrar pesqueiro</Text>
        <Text style={styles.subtitulo}>Preencha os dados abaixo</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do pesqueiro"
          placeholderTextColor="#4a7a96"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(11) 99999-9999"
          placeholderTextColor="#4a7a96"
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
              placeholderTextColor="#4a7a96"
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
              placeholderTextColor="#4a7a96"
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
          placeholderTextColor="#4a7a96"
          value={complemento}
          onChangeText={setComplemento}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o pesqueiro..."
          placeholderTextColor="#4a7a96"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <Text style={styles.label}>Informações adicionais</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Horário de funcionamento, regras..."
          placeholderTextColor="#4a7a96"
          value={informacao}
          onChangeText={setInformacao}
          multiline
        />

        <TouchableOpacity style={styles.btnCadastrar} onPress={handleCadastrar} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color="#0a2540" />
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
    backgroundColor: '#0a2540',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titulo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitulo: {
    color: '#7aabcc',
    fontSize: 14,
    marginBottom: 24,
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
    backgroundColor: '#4ADE80',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#0a2540',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
