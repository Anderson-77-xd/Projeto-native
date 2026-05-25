import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { pesqueiros, Pesqueiro } from '../../data/pesqueiros';

const cidadesProximas = ['Barueri', 'Osasco', 'São Paulo', 'Santana de Parnaíba', 'Carapicuíba', 'Jandira', 'Itapevi'];
const recomendados = [...pesqueiros].sort((a, b) => b.avaliacao - a.avaliacao).slice(0, 5);
const proximosBarueri = pesqueiros.filter((p) => cidadesProximas.includes(p.cidade));

export default function Home() {
  const router = useRouter();

  function irParaDetalhes(item: Pesqueiro) {
    router.push({ pathname: '/detalhes', params: item });
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appNome}>Smart Fishing</Text>
      </View>

      {/* BANNER */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200' }}
        style={styles.banner}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.bannerTitle}> Encontre os melhores lugares para pesca</Text>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => router.push('/pesqueiros' as any)}
          >
            <Text style={styles.bannerButtonText}>Ver Pesqueiros</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* DESTAQUES — CARROSSEL */}
      <View style={styles.secaoHeader}>
        <Text style={styles.sectionTitle}> Destaques</Text>
        <TouchableOpacity onPress={() => router.push('/pesqueiros' as any)}>
          <Text style={styles.verTodos}>Ver todos →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carrosselContent}
      >
        {pesqueiros.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.carrosselCard}
            activeOpacity={0.9}
            onPress={() => irParaDetalhes(item)}
          >
            <Image source={{ uri: item.imagem }} style={styles.carrosselImagem} />
            <View>
             
            </View>
            <View style={styles.carrosselInfo}>
              <Text style={styles.carrosselNome} numberOfLines={1}>{item.nome}</Text>
              <Text style={styles.carrosselCidade}> {item.cidade}</Text>
              <View style={styles.carrosselFooter}>
                <Text style={styles.carrosselAvaliacao}> {item.avaliacao}</Text>
                <Text style={styles.carrosselPreco}>R$ {item.preco}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MAIS BEM AVALIADOS */}
      <View style={styles.secaoHeader}>
        <Text style={styles.sectionTitle}> Mais bem avaliados</Text>
      </View>

      {recomendados.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => irParaDetalhes(item)}
        >
          <Image source={{ uri: item.imagem }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <View style={styles.cardNomeRow}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.nome}</Text>
              <View style={styles.cardAvaliacaoBox}>
                <Text style={styles.cardAvaliacao}> {item.avaliacao}</Text>
              </View>
            </View>
            <Text style={styles.cardCidade}> {item.cidade}, {item.estado}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.descricao}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardPreco}>R$ {item.preco}</Text>
              <Text style={styles.cardHorario}> {item.horario}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* PRÓXIMOS A BARUERI */}
      <View style={styles.secaoHeader}>
        <Text style={styles.sectionTitle}>Próximos a Barueri</Text>
      </View>

      {proximosBarueri.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => irParaDetalhes(item)}
        >
          <Image source={{ uri: item.imagem }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <View style={styles.cardNomeRow}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.nome}</Text>
              <View style={styles.cardAvaliacaoBox}>
                <Text style={styles.cardAvaliacao}> {item.avaliacao}</Text>
              </View>
            </View>
            <Text style={styles.cardCidade}> {item.cidade}, {item.estado} · {item.distancia}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.descricao}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardPreco}>R$ {item.preco}</Text>
              <Text style={styles.cardHorario}> {item.horario}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
    paddingHorizontal: 16,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  logo: {
    width: 52,
    height: 52,
    position: 'absolute',
    left: 0,
  },
  appNome: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // BANNER
  banner: {
    height: 220,
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 18,
    borderRadius: 20,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  bannerButton: {
    backgroundColor: '#4ADE80',
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  bannerButtonText: {
    color: '#0a2540',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // SEÇÃO
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verTodos: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '600',
  },

  // CARROSSEL
  carrosselContent: {
    paddingBottom: 20,
    gap: 12,
  },
  carrosselCard: {
    width: 200,
    backgroundColor: '#112e50',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  carrosselImagem: {
    width: '100%',
    height: 120,
  },
  carrosselCategoriaTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4ADE80',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  carrosselCategoriaText: {
    color: '#0a2540',
    fontSize: 10,
    fontWeight: 'bold',
  },
  carrosselInfo: {
    padding: 10,
  },
  carrosselNome: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  carrosselCidade: {
    color: '#7aabcc',
    fontSize: 12,
    marginBottom: 8,
  },
  carrosselFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carrosselAvaliacao: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '600',
  },
  carrosselPreco: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // CARDS
  card: {
    backgroundColor: '#112e50',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e4d7a',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 14,
  },
  cardNomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  cardAvaliacaoBox: {
    backgroundColor: '#1a6632',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardAvaliacao: {
    color: '#4ADE80',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardCidade: {
    color: '#7aabcc',
    fontSize: 12,
    marginBottom: 6,
  },
  cardDescription: {
    color: '#b8d4e8',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e4d7a',
  },
  cardPreco: {
    color: '#4ADE80',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardHorario: {
    color: '#b8d4e8',
    fontSize: 12,
  },
});