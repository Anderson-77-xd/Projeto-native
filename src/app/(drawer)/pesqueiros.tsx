import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';

export type Pesqueiro = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  imagem: string;
  descricao: string;
  preco: number;
  horario: string;
  avaliacao: number;
  totalAvaliacoes: number;
  categoria: string;
  especies: string[];
  distancia: string;
};

export const pesqueiros: Pesqueiro[] = [
  {
    id: '1',
    nome: 'Pesqueiro Lago Azul',
    cidade: 'Osasco',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    descricao: 'Lago bem cuidado, ideal para pesca em família com crianças. Estrutura completa com banheiros e lanchonete.',
    preco: 30,
    horario: '08:00 - 18:00',
    avaliacao: 4.8,
    totalAvaliacoes: 124,
    categoria: 'Família',
    especies: ['Tilápia', 'Tucunaré', 'Traíra'],
    distancia: '3.2 km',
  },
  {
    id: '2',
    nome: 'Pesqueiro do Zé',
    cidade: 'Barueri',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600',
    descricao: 'Ambiente rústico e acolhedor com peixes de grande porte. Perfeito para quem busca desafio e natureza.',
    preco: 45,
    horario: '06:00 - 20:00',
    avaliacao: 4.5,
    totalAvaliacoes: 89,
    categoria: 'Esportivo',
    especies: ['Dourado', 'Pacu', 'Carpa'],
    distancia: '7.8 km',
  },
  {
    id: '3',
    nome: 'Recanto do Pescador',
    cidade: 'São Paulo',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600',
    descricao: 'Pesca noturna liberada com iluminação especial. Estrutura de camping disponível para pernoite.',
    preco: 55,
    horario: '00:00 - 23:59',
    avaliacao: 4.9,
    totalAvaliacoes: 211,
    categoria: 'Noturno',
    especies: ['Pintado', 'Surubim', 'Bagre'],
    distancia: '12.1 km',
  },
];

export default function Pesqueiros() {
  const router = useRouter();
  const [busca, setBusca] = useState('');

  const pesqueirosFiltrados = pesqueiros.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.cidade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Buscar pesqueiro ou cidade..."
          placeholderTextColor="#6b8fa3"
          style={styles.searchInput}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        data={pesqueirosFiltrados}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.92}
            onPress={() => router.push({ pathname: '/detalhes', params: item })}
          >
            <Image source={{ uri: item.imagem }} style={styles.imagem} />
            <View style={styles.categoriaTag}>
              <Text style={styles.categoriaTagText}>{item.categoria}</Text>
            </View>
            <View style={styles.distanciaTag}>
              <Text style={styles.distanciaText}>📍 {item.distancia}</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.nomeRow}>
                <Text style={styles.nome}>{item.nome}</Text>
                <View style={styles.avaliacaoBox}>
                  <Text style={styles.avaliacaoNota}>{item.avaliacao}</Text>
                </View>
              </View>
              <Text style={styles.cidade}>{item.cidade}, {item.estado}</Text>
              <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
              <View style={styles.footerCard}>
                <Text style={styles.preco}>R$ {item.preco}</Text>
                <Text style={styles.horario}>🕐 {item.horario}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#112e50',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e4d7a',
    height: 50,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#112e50',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e4d7a',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  imagem: {
    width: '100%',
    height: 180,
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
  infoContainer: {
    padding: 16,
  },
  nomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nome: {
    color: '#fff',
    fontSize: 18,
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
    fontSize: 13,
  },
  cidade: {
    color: '#7aabcc',
    fontSize: 13,
    marginBottom: 8,
  },
  descricao: {
    color: '#b8d4e8',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e4d7a',
  },
  preco: {
    color: '#4ADE80',
    fontSize: 18,
    fontWeight: 'bold',
  },
  horario: {
    color: '#b8d4e8',
    fontSize: 13,
  },
});
