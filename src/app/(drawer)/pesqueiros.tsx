import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { pesqueiros as pesqueirosLocais, Pesqueiro } from '../../data/pesqueiros';
import { listarPesqueiros } from '../../services/api';
import { useLocalizacaoUsuario } from '../../hooks/useLocalizacaoUsuario';
import { calcularDistanciaKm, formatarDistancia } from '../../utils/distancia';

export default function Pesqueiros() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [precoMaximo, setPrecoMaximo] = useState<number | null>(null);
  const [especieSelecionada, setEspecieSelecionada] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [pesqueiros, setPesqueiros] = useState<Pesqueiro[]>(pesqueirosLocais);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const { localizacao } = useLocalizacaoUsuario();

  useEffect(() => {
    async function carregarPesqueiros() {
      try {
        const dados = await listarPesqueiros();
        setPesqueiros(dados.length ? dados : pesqueirosLocais);
        setErro('');
      } catch {
        setPesqueiros(pesqueirosLocais);
        setErro('Exibindo os dados salvos no dispositivo.');
      } finally {
        setCarregando(false);
      }
    }
    carregarPesqueiros();
  }, []);

  const pesqueirosComDistancia = useMemo(() => localizacao
    ? pesqueiros.map((p) => {
      const distanciaKm = calcularDistanciaKm(localizacao.latitude, localizacao.longitude, p.latitude, p.longitude);
      return { ...p, distancia: formatarDistancia(distanciaKm), distanciaKm };
    }).sort((a, b) => a.distanciaKm - b.distanciaKm)
    : pesqueiros, [localizacao, pesqueiros]);

  const filtrados = useMemo(() => pesqueirosComDistancia.filter((p) => {
    const texto = busca.trim().toLowerCase();
    const buscaCorresponde = !texto || p.nome.toLowerCase().includes(texto) || p.cidade.toLowerCase().includes(texto);
    const precoCorresponde = precoMaximo === null || p.preco <= precoMaximo;
    const especieCorresponde = !especieSelecionada || p.especies.includes(especieSelecionada);
    const categoriaCorresponde = !categoriaSelecionada || p.categoria === categoriaSelecionada;
    return buscaCorresponde && precoCorresponde && especieCorresponde && categoriaCorresponde;
  }), [busca, especieSelecionada, categoriaSelecionada, precoMaximo, pesqueirosComDistancia]);

  const especiesDisponiveis = useMemo(
    () => [...new Set(pesqueiros.flatMap((pesqueiro) => pesqueiro.especies))].slice(0, 8),
    [pesqueiros]
  );

  const categoriasDisponiveis = useMemo(
    () => [...new Set(pesqueiros.map((pesqueiro) => pesqueiro.categoria))],
    [pesqueiros]
  );

  function limparFiltros() {
    setPrecoMaximo(null);
    setEspecieSelecionada('');
    setCategoriaSelecionada('');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#062A4A" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>ENCONTRE SEU LUGAR</Text>
          <Text style={styles.headerTitle}>Pesqueiros</Text>
          <Text style={styles.headerSubtitle}>{localizacao ? 'Resultados ordenados por proximidade.' : 'Explore lugares para a sua próxima pescaria.'}</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={21} color="#5F7B8D" />
              <TextInput style={styles.searchInput} placeholder="Nome ou cidade" placeholderTextColor="#7891A1" value={busca} onChangeText={setBusca} autoCapitalize="none" returnKeyType="search" />
              {!!busca && <Pressable onPress={() => setBusca('')} hitSlop={8}><Ionicons name="close-circle" size={19} color="#6F8796" /></Pressable>}
            </View>
            <Pressable style={styles.mapButton} onPress={() => router.push('/mapa' as any)} accessibilityLabel="Abrir mapa"><Ionicons name="map-outline" size={23} color="#FFFFFF" /></Pressable>
          </View>
          <View style={styles.actionsRow}>
            <Pressable style={styles.filterButton} onPress={() => setFiltrosAbertos((aberto) => !aberto)}><Ionicons name="options-outline" size={18} color="#C5E6E9" /><Text style={styles.filterButtonText}>Filtros</Text>{(precoMaximo || especieSelecionada || categoriaSelecionada) ? <View style={styles.filterDot} /> : null}<Ionicons name={filtrosAbertos ? 'chevron-up' : 'chevron-down'} size={16} color="#C5E6E9" /></Pressable>
            <Pressable style={styles.cadastrarLink} onPress={() => router.push('/(drawer)/cadastrarPesqueiro')}><Ionicons name="add-circle-outline" size={18} color="#C5E6E9" /><Text style={styles.filterButtonText}>Cadastrar pesqueiro</Text></Pressable>
          </View>
        </View>

        {filtrosAbertos && <View style={styles.filtersPanel}>
          <View style={styles.filterTitleRow}><Text style={styles.filtersTitle}>Refine sua busca</Text><Pressable onPress={limparFiltros}><Text style={styles.clearFilters}>Limpar</Text></Pressable></View>
          <Text style={styles.filterLabel}>Preço da diária</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>{[[null, 'Qualquer preço'], [30, 'Até R$ 30'], [50, 'Até R$ 50'], [70, 'Até R$ 70']].map(([valor, texto]) => <Pressable key={String(texto)} style={[styles.filterChip, precoMaximo === valor && styles.filterChipActive]} onPress={() => setPrecoMaximo(valor as number | null)}><Text style={[styles.filterChipText, precoMaximo === valor && styles.filterChipTextActive]}>{texto}</Text></Pressable>)}</ScrollView>
          <Text style={styles.filterLabel}>Categoria</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>{['Todas', ...categoriasDisponiveis].map((categoria) => { const ativa = categoria === 'Todas' ? !categoriaSelecionada : categoriaSelecionada === categoria; return <Pressable key={categoria} style={[styles.filterChip, ativa && styles.filterChipActive]} onPress={() => setCategoriaSelecionada(categoria === 'Todas' ? '' : categoria)}><Text style={[styles.filterChipText, ativa && styles.filterChipTextActive]}>{categoria}</Text></Pressable>; })}</ScrollView>
          <Text style={styles.filterLabel}>Espécie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>{['Todas', ...especiesDisponiveis].map((especie) => { const ativa = especie === 'Todas' ? !especieSelecionada : especieSelecionada === especie; return <Pressable key={especie} style={[styles.filterChip, ativa && styles.filterChipActive]} onPress={() => setEspecieSelecionada(especie === 'Todas' ? '' : especie)}><Text style={[styles.filterChipText, ativa && styles.filterChipTextActive]}>{especie}</Text></Pressable>; })}</ScrollView>
        </View>}

        <View style={styles.filterArea}>
          <View style={styles.resultRow}>
            <Text style={styles.resultText}>{filtrados.length} {filtrados.length === 1 ? 'pesqueiro encontrado' : 'pesqueiros encontrados'}</Text>
            {localizacao && <View style={styles.locationStatus}><Ionicons name="navigate" size={13} color="#087E8B" /><Text style={styles.locationStatusText}>Por distância</Text></View>}
          </View>
        </View>

        {carregando && <ActivityIndicator color="#087E8B" style={styles.loading} />}
        {!!erro && <View style={styles.notice}><Ionicons name="cloud-offline-outline" size={16} color="#916B13" /><Text style={styles.noticeText}>{erro}</Text></View>}

        <View style={styles.list}>
          {filtrados.map((item) => <PesqueiroCard key={item.id} item={item} onPress={() => router.push({ pathname: '/detalhes', params: item })} />)}
          {!carregando && filtrados.length === 0 && <EmptyState onClear={() => { setBusca(''); limparFiltros(); }} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PesqueiroCard({ item, onPress }: { item: Pesqueiro; onPress: () => void }) {
  return <Pressable style={styles.card} onPress={onPress}>
    <Image source={{ uri: item.imagem }} style={styles.image} />
    <View style={styles.imageTags}><View style={styles.distanceBadge}><Ionicons name="location" size={12} color="#FFF" /><Text style={styles.distanceText}>{item.distancia}</Text></View></View>
    <View style={styles.cardBody}>
      <View style={styles.nameRow}><Text style={styles.name} numberOfLines={1}>{item.nome}</Text><View style={styles.rating}><Ionicons name="star" size={13} color="#EBA914" /><Text style={styles.ratingText}>{item.avaliacao}</Text></View></View>
      <Text style={styles.city}><Ionicons name="location-outline" size={14} color="#638092" /> {item.cidade}, {item.estado}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.descricao}</Text>
      <View style={styles.species}>{item.especies.slice(0, 3).map((especie) => <View key={especie} style={styles.speciesTag}><Text style={styles.speciesText}>{especie}</Text></View>)}</View>
      <View style={styles.cardFooter}><View><Text style={styles.daily}>DIÁRIA A PARTIR DE</Text><Text style={styles.price}>R$ {item.preco}</Text></View><View style={styles.footerRight}><View style={styles.hours}><Ionicons name="time-outline" size={14} color="#658090" /><Text style={styles.hoursText}>{item.horario}</Text></View><View style={styles.detailsButton}><Text style={styles.detailsText}>Detalhes</Text><Ionicons name="arrow-forward" size={15} color="#087E8B" /></View></View></View>
    </View>
  </Pressable>;
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return <View style={styles.empty}><View style={styles.emptyIcon}><Ionicons name="fish-outline" size={31} color="#087E8B" /></View><Text style={styles.emptyTitle}>Nenhum pesqueiro encontrado</Text><Text style={styles.emptyText}>Tente buscar por outro nome ou cidade.</Text><Pressable onPress={onClear}><Text style={styles.emptyLink}>Limpar busca</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#062A4A' }, container: { flex: 1, backgroundColor: '#F4F8F8' }, content: { paddingBottom: 35 },
  header: { backgroundColor: '#062A4A', paddingHorizontal: 20, paddingTop: 17, paddingBottom: 23 }, headerEyebrow: { color: '#9CC3D1', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, headerTitle: { color: '#FFFFFF', fontSize: 27, fontWeight: '800', marginTop: 4 }, headerSubtitle: { color: '#B5D3E0', fontSize: 13, marginTop: 4 }, searchRow: { flexDirection: 'row', gap: 10, marginTop: 20 }, searchBox: { flex: 1, height: 52, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 9 }, searchInput: { flex: 1, height: '100%', color: '#193B50', fontSize: 15 }, mapButton: { height: 52, width: 52, borderRadius: 14, backgroundColor: '#087E8B', justifyContent: 'center', alignItems: 'center' }, actionsRow: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 18, rowGap: 8, marginTop: 13 }, filterButton: { flexDirection: 'row', alignItems: 'center', gap: 6 }, filterButtonText: { color: '#C5E6E9', fontSize: 13, fontWeight: '700' }, filterDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: '#65E0B5' }, cadastrarLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  filtersPanel: { backgroundColor: '#E8F3F3', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 13 }, filterTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, filtersTitle: { color: '#244A5D', fontSize: 14, fontWeight: '800' }, clearFilters: { color: '#087E8B', fontSize: 12, fontWeight: '800' }, filterLabel: { color: '#617C8C', fontSize: 12, fontWeight: '700', marginTop: 14, marginBottom: 7 }, filterChips: { gap: 7, paddingRight: 16 }, filterChip: { borderWidth: 1, borderColor: '#C9DDE0', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#FFF' }, filterChipActive: { backgroundColor: '#087E8B', borderColor: '#087E8B' }, filterChipText: { color: '#527180', fontSize: 12, fontWeight: '600' }, filterChipTextActive: { color: '#FFF' },
  filterArea: { backgroundColor: '#FFFFFF', paddingVertical: 14, shadowColor: '#15394C', shadowOpacity: 0.08, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, resultRow: { marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, resultText: { color: '#668091', fontSize: 12 }, locationStatus: { flexDirection: 'row', gap: 4, alignItems: 'center' }, locationStatusText: { color: '#087E8B', fontSize: 11, fontWeight: '700' },
  loading: { marginTop: 24 }, notice: { marginHorizontal: 16, marginTop: 16, backgroundColor: '#FFF5D8', flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, padding: 10 }, noticeText: { color: '#765B19', fontSize: 12, flex: 1 }, list: { paddingTop: 17 },
  card: { marginHorizontal: 16, marginBottom: 16, borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFFFFF', shadowColor: '#173C4B', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 }, image: { height: 190, width: '100%' }, imageTags: { position: 'absolute', top: 12, right: 12, flexDirection: 'row' }, distanceBadge: { backgroundColor: 'rgba(6, 42, 60, 0.82)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 3 }, distanceText: { color: '#FFF', fontSize: 11, fontWeight: '700' }, cardBody: { padding: 16 }, nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, name: { color: '#17374B', fontSize: 19, fontWeight: '800', flex: 1 }, rating: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#FFF6DF', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 10 }, ratingText: { color: '#84620B', fontSize: 12, fontWeight: '800' }, city: { color: '#658091', fontSize: 12, marginTop: 6 }, description: { color: '#536D7E', fontSize: 13, lineHeight: 19, marginTop: 9 }, species: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }, speciesTag: { backgroundColor: '#EDF5F4', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 }, speciesText: { color: '#40706D', fontSize: 11, fontWeight: '600' }, cardFooter: { borderTopWidth: 1, borderTopColor: '#E7EEF0', marginTop: 14, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }, daily: { color: '#7B919F', fontSize: 9, letterSpacing: 0.5, fontWeight: '700' }, price: { color: '#087E8B', fontSize: 20, fontWeight: '800', marginTop: 2 }, footerRight: { alignItems: 'flex-end', gap: 8 }, hours: { flexDirection: 'row', gap: 4, alignItems: 'center' }, hoursText: { color: '#638092', fontSize: 11 }, detailsButton: { flexDirection: 'row', gap: 4, alignItems: 'center' }, detailsText: { color: '#087E8B', fontSize: 12, fontWeight: '800' },
  empty: { alignItems: 'center', paddingHorizontal: 36, paddingTop: 55 }, emptyIcon: { height: 65, width: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DDF4F1' }, emptyTitle: { color: '#17374B', fontSize: 17, fontWeight: '800', marginTop: 16 }, emptyText: { color: '#678090', fontSize: 13, textAlign: 'center', lineHeight: 19, marginTop: 7 }, emptyLink: { color: '#087E8B', fontSize: 14, fontWeight: '800', marginTop: 15 },
});
