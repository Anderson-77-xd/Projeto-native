import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

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

export default function Perfil() {
  const router = useRouter();

  function handleSair() {
    if (Platform.OS === 'web') {
      window.alert('Você saiu da conta.');
      router.replace('/');
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Sair', 'Deseja sair da sua conta?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: () => router.replace('/') },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* AVATAR E NOME */}
        <View style={styles.topo}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../assets/Foto-perfil.jpg')}
              style={styles.avatar}
            />
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}></Text>
            </View>
          </View>
          <Text style={styles.nome}>João Pescador</Text>
          <Text style={styles.email}>joao@email.com</Text>
          <Text style={styles.cidade}> Osasco, SP</Text>
        </View>

        {/* ESTATÍSTICAS */}
        <View style={styles.statsRow}>
          {estatisticas.map((e, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValor}>{e.valor}</Text>
              <Text style={styles.statLabel}>{e.label}</Text>
            </View>
          ))}
        </View>

        {/* INFORMAÇÕES */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Informações</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcone}></Text>
            <View>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValor}>João Pescador</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcone}></Text>
            <View>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValor}>joao@email.com</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcone}></Text>
            <View>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValor}>(11) 99999-9999</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcone}></Text>
            <View>
              <Text style={styles.infoLabel}>Cidade</Text>
              <Text style={styles.infoValor}>Osasco, SP</Text>
            </View>
          </View>
        </View>

        {/* HISTÓRICO */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Últimas pescarias</Text>

          {historico.map((h) => (
            <View key={h.id}>
              <View style={styles.historicoRow}>
                <View style={styles.historicoIcone}>
                  <Text style={{ fontSize: 20 }}></Text>
                </View>
                <View style={{ flex: 1}}>
                  <Text style={styles.historicoLocal}>{h.local}</Text>
                  <Text style={styles.historicoMeta}>{h.peixe}  {}</Text>
                </View>
                <Text style={styles.historicoData}>{h.data}</Text>
              </View>
              {h.id !== '3' && <View style={styles.divisor} />}
            </View>
          ))}
        </View>

        {/* BOTÃO SAIR */}
        <TouchableOpacity style={styles.btnSair} onPress={handleSair}>
          <Text style={styles.btnSairText}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
  },

  // TOPO
  topo: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
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
    backgroundColor: '#112e50',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a2540',
  },
  avatarBadgeText: {
    fontSize: 16,
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

  // STATS
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

  // SEÇÃO
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

  // INFO
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

  // HISTÓRICO
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

  // BOTÃO SAIR
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