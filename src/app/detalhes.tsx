import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {  useNavigation } from '@react-navigation/native';

export default function Detalhes() {
  const router = useRouter();
  const navigation = useNavigation();
  const { nome, cidade, estado, imagem, descricao, preco, horario, avaliacao, totalAvaliacoes, categoria, especies, distancia } = useLocalSearchParams();

  const imagemUrl = Array.isArray(imagem) ? imagem[0] : imagem;
  const especiesList = Array.isArray(especies) ? especies : (especies ? String(especies).split(',') : []);

  function renderEstrelas(nota: string | string[]) {
    const n = parseFloat(Array.isArray(nota) ? nota[0] : nota);
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(n) ? '★' : '☆').join('');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      {/* HEADER COM SETA E 3 BARRINHAS */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.push('/pesqueiros')}
        >
          <Text style={styles.headerBtnText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitulo} numberOfLines={1}>{nome}</Text>

        <TouchableOpacity
          style={styles.headerBtn}
         onPress={() => router.push('/home')}
        >
          <Text style={styles.menuIcone}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* IMAGEM */}
        <View style={styles.imagemContainer}>
          <Image source={{ uri: imagemUrl }} style={styles.imagem} />
          <View style={styles.categoriaTag}>
            <Text style={styles.categoriaTagText}>{categoria}</Text>
          </View>
          <View style={styles.distanciaTag}>
            <Text style={styles.distanciaText}>📍 {distancia}</Text>
          </View>
        </View>

        <View style={styles.content}>

          {/* NOME E AVALIAÇÃO */}
          <View style={styles.nomeRow}>
            <Text style={styles.nome}>{nome}</Text>
            <View style={styles.avaliacaoBox}>
              <Text style={styles.avaliacaoNota}>{avaliacao}</Text>
            </View>
          </View>

          {/* ESTRELAS */}
          <View style={styles.estrelasRow}>
            <Text style={styles.estrelas}>{renderEstrelas(avaliacao ?? '0')}</Text>
            <Text style={styles.totalAvaliacoes}>({totalAvaliacoes} avaliações)</Text>
          </View>

          {/* CIDADE */}
          <Text style={styles.cidade}>📍 {cidade}, {estado}</Text>

          {/* DESCRIÇÃO */}
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Sobre o pesqueiro</Text>
            <Text style={styles.descricao}>{descricao}</Text>
          </View>

          {/* INFORMAÇÕES */}
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Informações</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoCard}>
                <Text style={styles.infoIcone}>💰</Text>
                <Text style={styles.infoLabel}>Diária</Text>
                <Text style={styles.infoValor}>R$ {preco}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoIcone}>🕐</Text>
                <Text style={styles.infoLabel}>Horário</Text>
                <Text style={styles.infoValor}>{horario}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoIcone}>📍</Text>
                <Text style={styles.infoLabel}>Distância</Text>
                <Text style={styles.infoValor}>{distancia}</Text>
              </View>
            </View>
          </View>

          {/* ESPÉCIES */}
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>🎣 Espécies disponíveis</Text>
            <View style={styles.especiesTags}>
              {especiesList.map((esp, i) => (
                <View key={i} style={styles.especieTag}>
                  <Text style={styles.especieTagText}>{esp}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* BOTÃO */}
          

        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#0a2540',
  },
  headerBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#112e50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  headerBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuIcone: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },

  // IMAGEM
  imagemContainer: {
    position: 'relative',
  },
  imagem: {
    width: '100%',
    height: 220,
  },
  categoriaTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#4ADE80',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoriaTagText: {
    color: '#0a2540',
    fontSize: 11,
    fontWeight: 'bold',
  },
  distanciaTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(10,37,64,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  distanciaText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  // CONTEÚDO
  content: {
    padding: 16,
  },
  nomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 8,
  },
  nome: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  avaliacaoBox: {
    backgroundColor: '#1a6632',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  avaliacaoNota: {
    color: '#4ADE80',
    fontWeight: 'bold',
    fontSize: 14,
  },
  estrelasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  estrelas: {
    color: '#f59e0b',
    fontSize: 16,
  },
  totalAvaliacoes: {
    color: '#7aabcc',
    fontSize: 12,
  },
  cidade: {
    color: '#7aabcc',
    fontSize: 14,
    marginBottom: 16,
  },

  // SEÇÕES
  secao: {
    backgroundColor: '#112e50',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  secaoTitulo: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descricao: {
    color: '#b8d4e8',
    fontSize: 14,
    lineHeight: 22,
  },

  // INFO CARDS
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#0a2540',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  infoIcone: {
    fontSize: 20,
    marginBottom: 4,
  },
  infoLabel: {
    color: '#7aabcc',
    fontSize: 11,
    marginBottom: 4,
  },
  infoValor: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // ESPÉCIES
  especiesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  especieTag: {
    backgroundColor: '#0a2540',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  especieTagText: {
    color: '#7aabcc',
    fontSize: 13,
  },

  // BOTÃO
  btnReservar: {
    backgroundColor: '#4ADE80',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  btnReservarText: {
    color: '#0a2540',
    fontSize: 16,
    fontWeight: 'bold',
  },
});