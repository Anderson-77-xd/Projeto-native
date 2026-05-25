import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

const categorias = ['Todos', 'Família', 'Esportivo', 'Noturno'];

const listaPesqueiros = [
  {
    id: '1',
    nome: 'Pesqueiro Lago Azul',
    cidade: 'Osasco',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    descricao: 'Lago bem cuidado, ideal para pesca em família com crianças.',
    preco: 30,
    horario: '08:00 - 18:00',
    avaliacao: 4.8,
    totalAvaliacoes: 124,
    categoria: '',
    especies: ['Tilápia', 'Tucunaré', 'Traíra'],
    distancia: '3.2 km',
  },
  {
    id: '2',
    nome: 'Pesqueiro do Zé',
    cidade: 'Barueri',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600',
    descricao: 'Ambiente rústico com peixes de grande porte. Perfeito para desafio e natureza.',
    preco: 45,
    horario: '06:00 - 20:00',
    avaliacao: 4.5,
    totalAvaliacoes: 89,
    categoria: '',
    especies: ['Dourado', 'Pacu', 'Carpa'],
    distancia: '7.8 km',
  },
  {
    id: '3',
    nome: 'Recanto do Pescador',
    cidade: 'São Paulo',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600',
    descricao: 'Pesca noturna com iluminação especial. Camping disponível para pernoite.',
    preco: 55,
    horario: '00:00 - 23:59',
    avaliacao: 4.9,
    totalAvaliacoes: 211,
    categoria: '',
    especies: ['Pintado', 'Surubim', 'Bagre'],
    distancia: '12.1 km',
  },
  {
    id: '4',
    nome: 'Pesqueiro Vale Verde',
    cidade: 'Carapicuíba',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    descricao: 'Rodeado de natureza e árvores, perfeito para relaxar enquanto pesca.',
    preco: 35,
    horario: '07:00 - 18:00',
    avaliacao: 4.6,
    totalAvaliacoes: 98,
    categoria: '',
    especies: ['Tilápia', 'Lambari', 'Traíra'],
    distancia: '5.4 km',
  },
  {
    id: '5',
    nome: 'Pesque e Pague Tropical',
    cidade: 'Santana de Parnaíba',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600',
    descricao: 'Estrutura premium com restaurante, lago amplo e monitores especializados.',
    preco: 60,
    horario: '06:00 - 18:00',
    avaliacao: 4.7,
    totalAvaliacoes: 175,
    categoria: '',
    especies: ['Tucunaré', 'Dourado', 'Pacu', 'Carpa'],
    distancia: '15.0 km',
  },
  {
    id: '6',
    nome: 'Pesqueiro Águas Claras',
    cidade: 'Jandira',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600',
    descricao: 'Água cristalina e peixes abundantes. Ideal para pesca esportiva.',
    preco: 50,
    horario: '05:00 - 20:00',
    avaliacao: 4.4,
    totalAvaliacoes: 63,
    categoria: '',
    especies: ['Surubim', 'Pintado', 'Dourado'],
    distancia: '9.3 km',
  },
  {
    id: '7',
    nome: 'Rancho do Peixão',
    cidade: 'Itapevi',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    descricao: 'Ambiente familiar com lago grande. Churrasqueira disponível.',
    preco: 25,
    horario: '08:00 - 17:00',
    avaliacao: 4.3,
    totalAvaliacoes: 47,
    categoria: '',
    especies: ['Tilápia', 'Carpa', 'Lambari'],
    distancia: '18.5 km',
  },
  {
    id: '8',
    nome: 'Pesqueiro Lua Cheia',
    cidade: 'Osasco',
    estado: 'SP',
    imagem: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    descricao: 'Pesca noturna com iluminação LED no lago. Experiência única ao luar.',
    preco: 65,
    horario: '18:00 - 06:00',
    avaliacao: 4.9,
    totalAvaliacoes: 302,
    categoria: '',
    especies: ['Bagre', 'Traíra', 'Tucunaré', 'Pintado'],
    distancia: '4.1 km',
  },
];

export default function Pesqueiros() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');

  const filtrados = listaPesqueiros.filter((p) => {
    const matchCategoria =
      categoriaSelecionada === 'Todos' || p.categoria === categoriaSelecionada;
    const matchBusca =
      busca === '' ||
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.cidade.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  function renderEstrelas(nota: number) {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(nota) ? '★' : '☆'
    ).join('');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <ScrollView showsVerticalScrollIndicator={false}>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pesqueiro ou cidade..."
          placeholderTextColor="#4a7a96"
          value={busca}
          onChangeText={setBusca}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasScroll}
        >
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.tag, categoriaSelecionada === cat && styles.tagAtiva]}
              onPress={() => setCategoriaSelecionada(cat)}
            >
              <Text style={[styles.tagText, categoriaSelecionada === cat && styles.tagTextAtivo]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.resultado}>
          {filtrados.length} pesqueiro{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
        </Text>

        {filtrados.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.92}
            onPress={() => router.push({ pathname: '/detalhes', params: item })}
          >
            <View style={styles.imagemContainer}>
              <Image source={{ uri: item.imagem }} style={styles.imagem} />
              <View style={styles.categoriaTag}>
                <Text style={styles.categoriaTagText}>{item.categoria}</Text>
              </View>
              <View style={styles.distanciaTag}>
                <Text style={styles.distanciaText}> {item.distancia}</Text>
              </View>
            </View>

            <View style={styles.info}>
              <View style={styles.nomeRow}>
                <Text style={styles.nome}>{item.nome}</Text>
                <View style={styles.avaliacaoBox}>
                  <Text style={styles.avaliacaoNota}>{item.avaliacao}</Text>
                </View>
              </View>

              <Text style={styles.estrelas}>
                {renderEstrelas(item.avaliacao)}
                <Text style={styles.totalAvaliacoes}> ({item.totalAvaliacoes})</Text>
              </Text>

              <Text style={styles.cidade}>{item.cidade}, {item.estado}</Text>

              <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>

              <View style={styles.especiesRow}>
                {item.especies.map((esp) => (
                  <View key={esp} style={styles.especieTag}>
                    <Text style={styles.especieTagText}>{esp}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.footer}>
                <View>
                  <Text style={styles.precoLabel}>Diária</Text>
                  <Text style={styles.preco}>R$ {item.preco}</Text>
                </View>
                <Text style={styles.horario}> {item.horario}</Text>
                <TouchableOpacity
                  style={styles.verBtn}
                  onPress={() => router.push({ pathname: '/detalhes', params: item })}
                >
                  <Text style={styles.verBtnText}>Ver mais</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filtrados.length === 0 && (
          <View style={styles.vazio}>
            <Text style={styles.vazioIcone}></Text>
            <Text style={styles.vazioText}>Nenhum pesqueiro encontrado</Text>
          </View>
        )}

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
  searchInput: {
    backgroundColor: '#112e50',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e4d7a',
    paddingHorizontal: 16,
    height: 50,
    color: '#fff',
    fontSize: 15,
    marginBottom: 14,
  },
  categoriasScroll: {
    paddingBottom: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: '#112e50',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#1e4d7a',
    marginRight: 8,
  },
  tagAtiva: {
    backgroundColor: '#4ADE80',
    borderColor: '#4ADE80',
  },
  tagText: {
    color: '#7aabcc',
    fontWeight: '600',
    fontSize: 14,
  },
  tagTextAtivo: {
    color: '#0a2540',
  },
  resultado: {
    color: '#7aabcc',
    fontSize: 13,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#112e50',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  imagemContainer: {
    position: 'relative',
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
  info: {
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
  estrelas: {
    color: '#f59e0b',
    fontSize: 13,
    marginBottom: 4,
  },
  totalAvaliacoes: {
    color: '#7aabcc',
    fontSize: 11,
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
  especiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  especieTag: {
    backgroundColor: '#0a2540',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  especieTagText: {
    color: '#7aabcc',
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e4d7a',
  },
  precoLabel: {
    color: '#7aabcc',
    fontSize: 10,
    marginBottom: 2,
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
  verBtn: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  verBtnText: {
    color: '#0a2540',
    fontWeight: 'bold',
    fontSize: 13,
  },
  vazio: {
    alignItems: 'center',
    paddingTop: 60,
  },
  vazioIcone: {
    fontSize: 48,
    marginBottom: 12,
  },
  vazioText: {
    color: '#7aabcc',
    fontSize: 16,
  },
});