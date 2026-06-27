import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Usuario } from '../../services/api';

const estatisticas = [
  { valor: '47', label: 'Capturas' },
  { valor: '12', label: 'Pesqueiros' },
  { valor: '8', label: 'Espécies' },
];

const historico = [
  { id: '1', local: 'Pesqueiro Lago Azul', data: '18/05/2026', peixe: 'Tilápia', peso: '2.3 kg' },
  { id: '2', local: 'Pesqueiro do Zé', data: '10/05/2026', peixe: 'Dourado', peso: '4.1 kg' },
  { id: '3', local: 'Recanto do Pescador', data: '02/05/2026', peixe: 'Pintado', peso: '6.8 kg' },
];

const usuarioPadrao: Usuario = {
  nome: 'Usuário Smart Fishing',
  email: 'sem-login@smartfishing.com',
  nivelAcesso: 'CLIENTE',
  statusUsuario: true,
};

function chaveFotoPerfil(email: string) {
  return `@smartfishing:fotoPerfil:${email}`;
}

export default function Perfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario>(usuarioPadrao);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  useEffect(() => {
    async function carregarPerfil() {
      const usuarioSalvo = await AsyncStorage.getItem('@smartfishing:usuario');
      const usuarioAtual = usuarioSalvo ? JSON.parse(usuarioSalvo) as Usuario : usuarioPadrao;
      const fotoSalva = await AsyncStorage.getItem(chaveFotoPerfil(usuarioAtual.email));

      setUsuario(usuarioAtual);
      setFotoPerfil(fotoSalva);
    }

    carregarPerfil();
  }, []);

  function alerta(titulo: string, mensagem: string) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      const { Alert } = require('react-native');
      Alert.alert(titulo, mensagem);
    }
  }

  async function trocarFotoPerfil() {
    if (Platform.OS !== 'web') {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        alerta('Permissão necessária', 'Permita o acesso à galeria para trocar sua foto.');
        return;
      }
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });

    if (resultado.canceled) {
      return;
    }

    const uri = resultado.assets[0]?.uri;

    if (!uri) {
      alerta('Erro', 'Não foi possível carregar a imagem selecionada.');
      return;
    }

    setFotoPerfil(uri);
    await AsyncStorage.setItem(chaveFotoPerfil(usuario.email), uri);
  }

  async function sairDaConta() {
    await AsyncStorage.removeItem('@smartfishing:usuario');
    router.replace('/');
  }

  function handleSair() {
    if (Platform.OS === 'web') {
      window.alert('Você saiu da conta.');
      sairDaConta();
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Sair', 'Deseja sair da sua conta?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: sairDaConta },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topo}>
          <View style={styles.avatarContainer}>
            <Image
              source={fotoPerfil ? { uri: fotoPerfil } : require('../../../assets/Foto-perfil.jpg')}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.avatarBadge}
              onPress={trocarFotoPerfil}
              activeOpacity={0.85}
            >
              <Text style={styles.avatarBadgeText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.btnTrocarFoto}
            onPress={trocarFotoPerfil}
            activeOpacity={0.85}
          >
            <Text style={styles.btnTrocarFotoText}>Trocar foto</Text>
          </TouchableOpacity>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
          <Text style={styles.cidade}>{usuario.nivelAcesso ?? 'CLIENTE'}</Text>
        </View>

        <View style={styles.statsRow}>
          {estatisticas.map((e, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValor}>{e.valor}</Text>
              <Text style={styles.statLabel}>{e.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Informações</Text>

          <InfoRow label="Nome" value={usuario.nome} />
          <View style={styles.divisor} />

          <InfoRow label="E-mail" value={usuario.email} />
          <View style={styles.divisor} />

          <InfoRow label="Nível de acesso" value={usuario.nivelAcesso ?? 'CLIENTE'} />
          <View style={styles.divisor} />

          <InfoRow
            label="Status"
            value={usuario.statusUsuario === false ? 'Inativo' : 'Ativo'}
          />
          {usuario.dataCadastro && (
            <>
              <View style={styles.divisor} />
              <InfoRow label="Cadastro" value={usuario.dataCadastro} />
            </>
          )}
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Últimas pescarias</Text>

          {historico.map((h) => (
            <View key={h.id}>
              <View style={styles.historicoRow}>
                <View style={styles.historicoIcone}>
                  <Text style={{ fontSize: 20 }}></Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historicoLocal}>{h.local}</Text>
                  <Text style={styles.historicoMeta}>{h.peixe} · {h.peso}</Text>
                </View>
                <Text style={styles.historicoData}>{h.data}</Text>
              </View>
              {h.id !== '3' && <View style={styles.divisor} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.btnSair} onPress={handleSair}>
          <Text style={styles.btnSairText}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcone}></Text>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValor}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
  },
  topo: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4ADE80',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4ADE80',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a2540',
  },
  avatarBadgeText: {
    color: '#0a2540',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  btnTrocarFoto: {
    backgroundColor: '#112e50',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1e4d7a',
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 14,
  },
  btnTrocarFotoText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '700',
  },
  nome: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    color: '#7aabcc',
    fontSize: 14,
    marginTop: 4,
  },
  cidade: {
    color: '#4ADE80',
    fontSize: 13,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#112e50',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  statValor: {
    color: '#4ADE80',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#7aabcc',
    fontSize: 11,
    marginTop: 3,
  },
  secao: {
    backgroundColor: '#112e50',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  secaoTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 4,
  },
  infoIcone: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  infoLabel: {
    color: '#7aabcc',
    fontSize: 12,
  },
  infoValor: {
    color: '#fff',
    fontSize: 15,
    marginTop: 2,
  },
  divisor: {
    height: 1,
    backgroundColor: '#1e4d7a',
    marginVertical: 12,
  },
  historicoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historicoIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a2540',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historicoLocal: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  historicoMeta: {
    color: '#7aabcc',
    fontSize: 12,
    marginTop: 2,
  },
  historicoData: {
    color: '#4a7a96',
    fontSize: 11,
  },
  btnSair: {
    marginHorizontal: 16,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  btnSairText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
