import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { pesqueiros as pesqueirosLocais, Pesqueiro } from '../../data/pesqueiros';
import { listarPesqueiros } from '../../services/api';

const cidadesProximas = ['Barueri', 'Osasco', 'São Paulo', 'Santana de Parnaíba', 'Carapicuíba', 'Jandira', 'Itapevi'];

export default function Home() {
  const router = useRouter();
  const [pesqueiros, setPesqueiros] = useState<Pesqueiro[]>(pesqueirosLocais);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarPesqueiros() {
      try {
        const dados = await listarPesqueiros();
        setPesqueiros(dados.length ? dados : pesqueirosLocais);
        setErro('');
      } catch {
        setPesqueiros(pesqueirosLocais);
        setErro('Você está vendo os pesqueiros disponíveis offline.');
      } finally {
        setCarregando(false);
      }
    }
    carregarPesqueiros();
  }, []);

  const destaques = useMemo(() => [...pesqueiros].sort((a, b) => b.avaliacao - a.avaliacao).slice(0, 5), [pesqueiros]);
  const proximos = useMemo(() => pesqueiros.filter((p) => cidadesProximas.includes(p.cidade)).slice(0, 3), [pesqueiros]);
  const irParaDetalhes = (item: Pesqueiro) => router.push({ pathname: '/detalhes', params: item });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#062A4A" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Explore novos lugares</Text>
            <Text style={styles.headerTitle}>Onde vamos pescar?</Text>
          </View>
          <Pressable style={styles.logoButton} onPress={() => router.push('/perfil' as any)} accessibilityLabel="Abrir perfil">
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
          </Pressable>
        </View>

        <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200' }} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroShade}>
            <View style={styles.heroPill}><Ionicons name="sparkles" size={14} color="#D8F5E9" /><Text style={styles.heroPillText}>ESCOLHA DA SEMANA</Text></View>
            <Text style={styles.heroTitle}>Seu próximo dia de pesca está aqui.</Text>
            <Text style={styles.heroDescription}>Descubra pesqueiros, espécies e experiências perto de você.</Text>
            <Pressable style={styles.heroButton} onPress={() => router.push('/pesqueiros' as any)}>
              <Text style={styles.heroButtonText}>Explorar pesqueiros</Text><Ionicons name="arrow-forward" size={18} color="#063B42" />
            </Pressable>
          </View>
        </ImageBackground>

        {carregando && <ActivityIndicator color="#087E8B" style={styles.loading} />}
        {!!erro && <View style={styles.notice}><Ionicons name="cloud-offline-outline" size={16} color="#916B13" /><Text style={styles.noticeText}>{erro}</Text></View>}

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionTitle}>Mais bem avaliados</Text><Text style={styles.sectionSubtitle}>Os favoritos de quem pesca</Text></View>
          <Pressable onPress={() => router.push('/pesqueiros' as any)}><Text style={styles.seeAll}>Ver todos</Text></Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {destaques.map((item) => <FeaturedCard key={item.id} item={item} onPress={() => irParaDetalhes(item)} />)}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionTitle}>Perto de você</Text><Text style={styles.sectionSubtitle}>Região de Barueri e arredores</Text></View>
          <Pressable onPress={() => router.push('/mapa' as any)} style={styles.mapLink}><Ionicons name="map-outline" size={16} color="#087E8B" /><Text style={styles.mapLinkText}>Mapa</Text></Pressable>
        </View>

        {(proximos.length ? proximos : pesqueiros.slice(0, 3)).map((item) => <NearbyCard key={item.id} item={item} onPress={() => irParaDetalhes(item)} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

function FeaturedCard({ item, onPress }: { item: Pesqueiro; onPress: () => void }) {
  return <Pressable style={styles.featuredCard} onPress={onPress}><Image source={{ uri: item.imagem }} style={styles.featuredImage} /><View style={styles.featuredInfo}><View style={styles.rating}><Ionicons name="star" size={13} color="#EBA914" /><Text style={styles.ratingText}>{item.avaliacao}</Text></View><Text style={styles.featuredName} numberOfLines={1}>{item.nome}</Text><Text style={styles.featuredCity}>{item.cidade}, {item.estado}</Text><Text style={styles.featuredPrice}>R$ {item.preco}<Text style={styles.pricePeriod}> / diária</Text></Text></View></Pressable>;
}

function NearbyCard({ item, onPress }: { item: Pesqueiro; onPress: () => void }) {
  return <Pressable style={styles.nearbyCard} onPress={onPress}><Image source={{ uri: item.imagem }} style={styles.nearbyImage} /><View style={styles.nearbyInfo}><View style={styles.nearbyTop}><Text style={styles.nearbyName} numberOfLines={1}>{item.nome}</Text><View style={styles.smallRating}><Ionicons name="star" size={12} color="#EBA914" /><Text style={styles.smallRatingText}>{item.avaliacao}</Text></View></View><Text style={styles.nearbyLocation}><Ionicons name="location-outline" size={14} color="#638092" /> {item.cidade}, {item.estado} · {item.distancia}</Text><Text style={styles.nearbyDetails} numberOfLines={1}>{item.especies.slice(0, 3).join(' · ')}</Text><Text style={styles.nearbyPrice}>R$ {item.preco} <Text style={styles.pricePeriod}>/ diária</Text></Text></View><Ionicons name="chevron-forward" size={20} color="#86A1AF" /></Pressable>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#062A4A' }, container: { flex: 1, backgroundColor: '#F4F8F8' }, content: { paddingBottom: 34 },
  header: { backgroundColor: '#062A4A', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, greeting: { color: '#A8C7D7', fontSize: 13 }, headerTitle: { color: '#FFF', fontSize: 25, fontWeight: '800', marginTop: 3 }, logoButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', padding: 3, overflow: 'hidden' }, logo: { width: '100%', height: '100%', borderRadius: 22 },
  hero: { height: 258, marginHorizontal: 16, marginTop: -10 }, heroImage: { borderRadius: 22 }, heroShade: { flex: 1, borderRadius: 22, justifyContent: 'flex-end', padding: 20, backgroundColor: 'rgba(4, 33, 49, 0.47)' }, heroPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5, backgroundColor: 'rgba(6, 54, 68, 0.85)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 9 }, heroPillText: { color: '#D8F5E9', fontSize: 10, fontWeight: '800', letterSpacing: 0.7 }, heroTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', lineHeight: 30, maxWidth: 280 }, heroDescription: { color: '#E0EDF1', fontSize: 13, lineHeight: 19, marginTop: 6, maxWidth: 290 }, heroButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#C7F1D9', paddingVertical: 11, borderRadius: 12, marginTop: 16, width: 205 }, heroButtonText: { color: '#063B42', fontSize: 13, fontWeight: '800' },
  loading: { marginTop: 18 }, notice: { marginHorizontal: 16, marginTop: 16, backgroundColor: '#FFF5D8', flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, padding: 10 }, noticeText: { color: '#765B19', fontSize: 12, flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 29, marginBottom: 14 }, sectionTitle: { color: '#14374B', fontSize: 19, fontWeight: '800' }, sectionSubtitle: { color: '#708795', fontSize: 12, marginTop: 3 }, seeAll: { color: '#087E8B', fontSize: 13, fontWeight: '800' }, horizontalList: { paddingLeft: 20, paddingRight: 8, gap: 13 },
  featuredCard: { width: 205, backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#173C4B', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 }, featuredImage: { width: '100%', height: 119 }, featuredInfo: { padding: 12 }, rating: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#FFF7DE', borderRadius: 12, paddingHorizontal: 7, paddingVertical: 3, marginTop: -25, marginBottom: 9 }, ratingText: { color: '#8B6200', fontSize: 11, fontWeight: '800' }, featuredName: { color: '#17374B', fontSize: 14, fontWeight: '800' }, featuredCity: { color: '#708795', fontSize: 12, marginTop: 4 }, featuredPrice: { color: '#087E8B', fontSize: 14, fontWeight: '800', marginTop: 11 }, pricePeriod: { color: '#718896', fontSize: 11, fontWeight: '400' },
  mapLink: { flexDirection: 'row', alignItems: 'center', gap: 3 }, mapLinkText: { color: '#087E8B', fontSize: 13, fontWeight: '800' }, nearbyCard: { minHeight: 104, marginHorizontal: 16, marginBottom: 12, padding: 10, borderRadius: 16, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', shadowColor: '#173C4B', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, nearbyImage: { width: 82, height: 82, borderRadius: 12 }, nearbyInfo: { flex: 1, paddingHorizontal: 11 }, nearbyTop: { flexDirection: 'row', alignItems: 'center', gap: 7 }, nearbyName: { color: '#17374B', fontSize: 14, fontWeight: '800', flex: 1 }, smallRating: { flexDirection: 'row', gap: 2, alignItems: 'center' }, smallRatingText: { color: '#82610C', fontSize: 11, fontWeight: '700' }, nearbyLocation: { color: '#698293', fontSize: 11, marginTop: 5 }, nearbyDetails: { color: '#718896', fontSize: 11, marginTop: 5 }, nearbyPrice: { color: '#087E8B', fontSize: 13, fontWeight: '800', marginTop: 6 },
});
