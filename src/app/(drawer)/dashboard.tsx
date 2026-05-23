import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';

import { useRouter } from 'expo-router';

const pesqueiros = [
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

const categorias = ['Todos', 'Família', 'Esportivo', 'Noturno'];

const estatisticas = [
  { valor: '47', label: 'Capturas' },
  { valor: '12', label: 'Espécies' },
  { valor: '8.3', label: 'Maior (kg)' },
];

export default function Dashboard() {
  const router = useRouter();
  const [categoriaSelecionada, setCategoriaSelecionada] = React.useState('Todos');
  const [busca, setBusca] = React.useState('');

  const pesqueirosFiltrados = pesqueiros.filter((p) => {
    const matchCategoria =
      categoriaSelecionada === 'Todos' || p.categoria === categoriaSelecionada;
    const matchBusca =
      busca === '' ||
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.cidade.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  function renderEstrelas(nota: number) {
    const cheia = Math.floor(nota);
    const resultado = [];
    for (let i = 0; i < 5; i++) {
      resultado.push(i < cheia ? '★' : '☆');
    }
    return resultado.join('');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.ola}>👋 Olá, Pescador!</Text>
            <Text style={styles.subtitulo}>Encontre os melhores pesqueiros</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Text style={styles.avatarText}>JP</Text>
          </TouchableOpacity>
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

        {/* CLIMA */}
        <View style={styles.climaCard}>
          <View style={styles.climaLeft}>
            <Text style={styles.climaTemp}>24°</Text>
            <View>
              <Text style={styles.climaDesc}>☀️ Ensolarado</Text>
              <Text style={styles.climaDica}>Ótimo dia para pescar!</Text>
            </View>
          </View>
          <View style={styles.climaRight}>
            <Text style={styles.climaInfo}>💨 12 km/h</Text>
            <Text style={styles.climaInfo}>💧 65% umidade</Text>
            <Text style={styles.climaInfo}>🌊 Maré baixa</Text>
          </View>
        </View>

        {/* BUSCA */}
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

        {/* CATEGORIAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriasScroll}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.tag,
                categoriaSelecionada === cat && styles.tagAtiva,
              ]}
              onPress={() => setCategoriaSelecionada(cat)}
            >
              <Text
                style={[
                  styles.tagText,
                  categoriaSelecionada === cat && styles.tagTextAtivo,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SEÇÃO TITLE */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Pesqueiros próximos</Text>
          <TouchableOpacity onPress={() => router.push('/pesqueiros' as any)}>
            <Text style={styles.verTodos}>Ver todos →</Text>
          </TouchableOpacity>
        </View>

        {/* CARDS */}
        {pesqueirosFiltrados.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.92}
            onPress={() =>
              router.push({ pathname: '/detalhes', params: item })
            }
          >
            {/* IMAGEM */}
            <View style={styles.imagemContainer}>
              <Image source={{ uri: item.imagem }} style={styles.imagem} />
              <View style={styles.categoriaTag}>
                <Text style={styles.categoriaTagText}>{item.categoria}</Text>
              </View>
              <View style={styles.distanciaTag}>
                <Text style={styles.distanciaText}>📍 {item.distancia}</Text>
              </View>
            </View>

            {/* INFORMAÇÕES */}
            <View style={styles.infoContainer}>

              {/* NOME E AVALIAÇÃO */}
              <View style={styles.nomeRow}>
                <Text style={styles.nome}>{item.nome}</Text>
                <View style={styles.avaliacaoBox}>
                  <Text style={styles.avaliacaoNota}>{item.avaliacao}</Text>
                </View>
              </View>

              {/* ESTRELAS */}
              <View style={styles.estrelasRow}>
                <Text style={styles.estrelas}>{renderEstrelas(item.avaliacao)}</Text>
                <Text style={styles.totalAvaliacoes}>({item.totalAvaliacoes} avaliações)</Text>
              </View>

              {/* CIDADE */}
              <Text style={styles.cidade}>
                {item.cidade}, {item.estado}
              </Text>

              {/* DESCRIÇÃO */}
              <Text style={styles.descricao} numberOfLines={2}>
                {item.descricao}
              </Text>

              {/* ESPÉCIES */}
              <View style={styles.especiesRow}>
                <Text style={styles.especiesLabel}>🎣 Espécies:</Text>
                <View style={styles.especiesTags}>
                  {item.especies.map((esp) => (
                    <View key={esp} style={styles.especieTag}>
                      <Text style={styles.especieTagText}>{esp}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* RODAPÉ */}
              <View style={styles.footerCard}>
                <View>
                  <Text style={styles.precoLabel}>Diária</Text>
                  <Text style={styles.preco}>R$ {item.preco}</Text>
                </View>
                <View style={styles.horarioBox}>
                  <Text style={styles.horarioIcon}>🕐</Text>
                  <Text style={styles.horario}>{item.horario}</Text>
                </View>
                <TouchableOpacity style={styles.verBtn}>
                  <Text style={styles.verBtnText}>Ver mais</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// Importar React para useState
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  ola: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#7aabcc',
    marginTop: 4,
    fontSize: 14,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a6632',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ADE80',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // ESTATÍSTICAS
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#112e50',
    borderRadius: 14,
    padding: 12,
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

  // CLIMA
  climaCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#112e50',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  climaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  climaTemp: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  climaDesc: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  climaDica: {
    color: '#4ADE80',
    fontSize: 12,
    marginTop: 2,
  },
  climaRight: {
    gap: 4,
    alignItems: 'flex-end',
  },
  climaInfo: {
    color: '#7aabcc',
    fontSize: 12,
  },

  // BUSCA
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#112e50',
    marginHorizontal: 20,
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

  // CATEGORIAS
  categoriasScroll: {
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#112e50',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1e4d7a',
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

  // SEÇÃO
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  secaoTitulo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verTodos: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '600',
  },

  // CARD
  card: {
    backgroundColor: '#112e50',
    borderRadius: 20,
    marginHorizontal: 20,
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

  // INFO
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
  estrelasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  estrelas: {
    color: '#f59e0b',
    fontSize: 13,
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

  // ESPÉCIES
  especiesRow: {
    marginBottom: 14,
  },
  especiesLabel: {
    color: '#7aabcc',
    fontSize: 12,
    marginBottom: 6,
  },
  especiesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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

  // RODAPÉ DO CARD
  footerCard: {
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
  horarioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  horarioIcon: {
    fontSize: 14,
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
});