import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapaDetalhe from '../components/MapaDetalhe';
import {
  Comentario,
  Peixe,
  criarComentario,
  denunciarComentario,
  desfavoritarPesqueiro,
  favoritarPesqueiro,
  listarComentarios,
  listarEspeciesPorPesqueiro,
  listarFavoritos,
  registrarVisita,
} from '../services/api';

export default function Detalhes() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [carregandoComentarios, setCarregandoComentarios] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [textoComentario, setTextoComentario] = useState('');
  const [favorito, setFavorito] = useState(false);
  const [atualizandoFavorito, setAtualizandoFavorito] = useState(false);
  const [especiesReais, setEspeciesReais] = useState<Peixe[]>([]);

  const valor = (chave: string) => Array.isArray(params[chave]) ? params[chave][0] : params[chave];
  const id = valor('id') ?? '';
  const nome = valor('nome') ?? 'Pesqueiro';
  const cidade = valor('cidade') ?? '';
  const estado = valor('estado') ?? '';
  const imagem = valor('imagem');
  const descricao = valor('descricao') ?? '';
  const preco = valor('preco') ?? '';
  const horario = valor('horario') ?? '';
  const distancia = valor('distancia') ?? '';
  const telefone = valor('telefone') ?? '';
  const especiesMock = valor('especies')?.split(',') ?? [];
  const especies = especiesReais.length ? especiesReais.map((peixe) => peixe.nome) : especiesMock;
  const lat = Number(valor('latitude')) || undefined;
  const lng = Number(valor('longitude')) || undefined;

  async function carregarComentarios() {
    try {
      setCarregandoComentarios(true);
      setComentarios(await listarComentarios(id));
    } catch {
      setComentarios([]);
    } finally {
      setCarregandoComentarios(false);
    }
  }

  useEffect(() => { carregarComentarios(); }, [id]);
  useEffect(() => {
    listarFavoritos()
      .then((favoritos) => setFavorito(favoritos.some((item) => String(item.id) === String(id))))
      .catch(() => setFavorito(false));
  }, [id]);
  useEffect(() => {
    if (!id) return;
    listarEspeciesPorPesqueiro(id)
      .then(setEspeciesReais)
      .catch(() => setEspeciesReais([]));
  }, [id]);
  useEffect(() => {
    if (id) registrarVisita(id);
  }, [id]);

  const resumo = useMemo(() => {
    if (!comentarios.length) return null;
    return comentarios.reduce((total, item) => total + item.nota, 0) / comentarios.length;
  }, [comentarios]);

  function mostrarAlerta(titulo: string, mensagem: string) {
    if (Platform.OS === 'web') window.alert(mensagem);
    else Alert.alert(titulo, mensagem);
  }

  async function enviarAvaliacao() {
    if (!notaSelecionada) {
      mostrarAlerta('Escolha uma nota', 'Selecione de 1 a 5 estrelas para avaliar.');
      return;
    }
    if (!textoComentario.trim()) {
      mostrarAlerta('Escreva um comentário', 'Conte um pouco sobre a sua experiência.');
      return;
    }
    try {
      setEnviando(true);
      await criarComentario(id, notaSelecionada, textoComentario.trim());
      setTextoComentario('');
      setNotaSelecionada(0);
      await carregarComentarios();
      mostrarAlerta('Avaliação enviada', 'Obrigado por compartilhar sua experiência!');
    } catch (error) {
      mostrarAlerta('Não foi possível enviar', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    } finally {
      setEnviando(false);
    }
  }

  async function alternarFavorito() {
    try {
      setAtualizandoFavorito(true);
      if (favorito) await desfavoritarPesqueiro(id);
      else await favoritarPesqueiro(id);
      setFavorito((estado) => !estado);
    } catch (error) {
      mostrarAlerta('Não foi possível atualizar', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    } finally {
      setAtualizandoFavorito(false);
    }
  }

  function abrirRota() {
    if (!lat || !lng) return;
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
  }

  function apenasDigitos(texto: string) {
    return texto.replace(/\D/g, '');
  }

  function ligarPesqueiro() {
    const digitos = apenasDigitos(telefone);
    if (!digitos) return;
    Linking.openURL(`tel:${digitos}`);
  }

  function abrirWhatsapp() {
    const digitos = apenasDigitos(telefone);
    if (!digitos) return;
    const numeroComDdi = digitos.length <= 11 ? `55${digitos}` : digitos;
    Linking.openURL(`https://wa.me/${numeroComDdi}`);
  }

  async function enviarDenuncia(comentarioId: number) {
    try {
      await denunciarComentario(comentarioId);
      mostrarAlerta('Denúncia enviada', 'Obrigado, nossa equipe vai analisar esse comentário.');
    } catch (error) {
      mostrarAlerta('Não foi possível denunciar', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    }
  }

  function confirmarDenuncia(comentarioId: number) {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja denunciar este comentário para análise da moderação?')) {
        enviarDenuncia(comentarioId);
      }
      return;
    }
    Alert.alert('Denunciar comentário', 'Deseja denunciar este comentário para análise da moderação?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Denunciar', style: 'destructive', onPress: () => enviarDenuncia(comentarioId) },
    ]);
  }

  return <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="light-content" backgroundColor="#062A4A" />
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}><Pressable onPress={() => router.back()} style={styles.iconButton}><Ionicons name="arrow-back" size={22} color="#FFF" /></Pressable><Text style={styles.topTitle} numberOfLines={1}>{nome}</Text><Pressable onPress={alternarFavorito} disabled={atualizandoFavorito} style={styles.iconButton} accessibilityLabel="Adicionar aos favoritos"><Ionicons name={favorito ? 'heart' : 'heart-outline'} size={21} color={favorito ? '#FF8A8A' : '#FFF'} /></Pressable></View>
      <Image source={{ uri: imagem }} style={styles.cover} />
      <View style={styles.content}>
        <View style={styles.titleRow}><View style={styles.titleBlock}><Text style={styles.name}>{nome}</Text><Text style={styles.location}><Ionicons name="location-outline" size={15} color="#5C7A8E" /> {cidade}, {estado}{distancia ? ` · ${distancia}` : ''}</Text></View><Text style={styles.price}>R$ {preco}<Text style={styles.period}> / diária</Text></Text></View>
        <Text style={styles.description}>{descricao}</Text>

        <View style={styles.infoGrid}><Info icon="time-outline" label="Horário" value={horario} /><Info icon="fish-outline" label="Espécies" value={String(especies.length)} /></View>
        {!!especies.length && <View style={styles.species}>{especies.map((especie) => <View key={especie} style={styles.speciesTag}><Text style={styles.speciesText}>{especie}</Text></View>)}</View>}

        {!!telefone && <View style={styles.contatoRow}>
          <Pressable style={styles.contatoButton} onPress={ligarPesqueiro}><Ionicons name="call-outline" size={18} color="#087E8B" /><Text style={styles.contatoText}>Ligar</Text></Pressable>
          <Pressable style={styles.contatoButton} onPress={abrirWhatsapp}><Ionicons name="logo-whatsapp" size={18} color="#087E8B" /><Text style={styles.contatoText}>WhatsApp</Text></Pressable>
        </View>}

        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Avaliações</Text><Text style={styles.sectionSubtitle}>Opiniões de quem já pescou aqui</Text></View>{resumo !== null && <View style={styles.average}><Ionicons name="star" size={15} color="#EBA914" /><Text style={styles.averageText}>{resumo.toFixed(1)}</Text></View>}</View>
        <View style={styles.reviewForm}><Text style={styles.formTitle}>Como foi sua experiência?</Text><Text style={styles.formText}>Toque nas estrelas para dar sua nota.</Text><View style={styles.stars}>{[1, 2, 3, 4, 5].map((estrela) => <Pressable key={estrela} onPress={() => setNotaSelecionada(estrela)} hitSlop={5}><Ionicons name={estrela <= notaSelecionada ? 'star' : 'star-outline'} size={34} color="#EBA914" /></Pressable>)}</View><TextInput style={styles.commentInput} placeholder="Conte o que você achou do lugar..." placeholderTextColor="#7A919F" value={textoComentario} onChangeText={setTextoComentario} multiline maxLength={500} textAlignVertical="top" /><Text style={styles.counter}>{textoComentario.length}/500</Text><Pressable style={({ pressed }) => [styles.sendButton, (pressed || enviando) && styles.sendButtonPressed]} onPress={enviarAvaliacao} disabled={enviando}>{enviando ? <ActivityIndicator color="#FFF" /> : <><Text style={styles.sendText}>Publicar avaliação</Text><Ionicons name="send" size={16} color="#FFF" /></>}</Pressable></View>

        <View style={styles.commentsHeader}><Text style={styles.commentsTitle}>Comentários ({comentarios.length})</Text><Pressable onPress={carregarComentarios}><Ionicons name="refresh-outline" size={20} color="#087E8B" /></Pressable></View>
        {carregandoComentarios ? <ActivityIndicator color="#087E8B" style={styles.loading} /> : comentarios.length ? comentarios.map((comentario) => <CommentCard key={comentario.id} comentario={comentario} onDenunciar={confirmarDenuncia} />) : <View style={styles.empty}><Ionicons name="chatbubble-ellipses-outline" size={26} color="#4F8990" /><Text style={styles.emptyTitle}>Ainda não há comentários</Text><Text style={styles.emptyText}>Seja a primeira pessoa a compartilhar sua experiência.</Text></View>}

        {lat && lng && <View style={styles.mapSection}><Text style={styles.sectionTitle}>Localização</Text><MapaDetalhe latitude={lat} longitude={lng} /><Pressable style={styles.routeButton} onPress={abrirRota}><Ionicons name="navigate-outline" size={18} color="#087E8B" /><Text style={styles.routeText}>Abrir rota no Google Maps</Text></Pressable></View>}
      </View>
    </ScrollView>
  </SafeAreaView>;
}

function Info({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) { return <View style={styles.infoCard}><Ionicons name={icon} size={20} color="#087E8B" /><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue} numberOfLines={1}>{value}</Text></View>; }
function CommentCard({ comentario, onDenunciar }: { comentario: Comentario; onDenunciar: (comentarioId: number) => void }) { const data = comentario.dataCadastro ? new Date(`${comentario.dataCadastro}T12:00:00`).toLocaleDateString('pt-BR') : ''; return <View style={styles.comment}><View style={styles.avatar}><Text style={styles.avatarText}>P</Text></View><View style={styles.commentBody}><View style={styles.commentTop}><Text style={styles.author}>Pescador #{comentario.usuarioId}</Text><View style={styles.commentTopRight}><View style={styles.commentStars}>{[1, 2, 3, 4, 5].map((estrela) => <Ionicons key={estrela} name={estrela <= comentario.nota ? 'star' : 'star-outline'} size={12} color="#EBA914" />)}</View><Pressable onPress={() => onDenunciar(comentario.id)} hitSlop={8} accessibilityLabel="Denunciar comentário"><Ionicons name="flag-outline" size={14} color="#8196A2" /></Pressable></View></View><Text style={styles.date}>{data}</Text><Text style={styles.commentText}>{comentario.descricao}</Text></View></View>; }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#062A4A' }, container: { flex: 1, backgroundColor: '#F4F8F8' }, topBar: { height: 65, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#062A4A' }, iconButton: { height: 39, width: 39, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#174865' }, topTitle: { color: '#FFF', fontSize: 15, fontWeight: '800', flex: 1, marginHorizontal: 14, textAlign: 'center' }, cover: { height: 250, width: '100%' }, content: { padding: 18, paddingBottom: 40 }, titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }, titleBlock: { flex: 1, paddingRight: 10 }, name: { color: '#15384D', fontSize: 24, fontWeight: '800' }, location: { color: '#607E90', fontSize: 13, marginTop: 6 }, price: { color: '#087E8B', fontSize: 19, fontWeight: '800', paddingTop: 4 }, period: { color: '#718A99', fontSize: 10, fontWeight: '400' }, description: { color: '#4E6B7C', fontSize: 14, lineHeight: 21, marginTop: 16 }, infoGrid: { flexDirection: 'row', gap: 10, marginTop: 20 }, infoCard: { flex: 1, borderRadius: 13, padding: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E1EBED' }, infoLabel: { color: '#78909E', fontSize: 11, marginTop: 7 }, infoValue: { color: '#26485C', fontSize: 13, fontWeight: '700', marginTop: 3 }, species: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }, speciesTag: { backgroundColor: '#DDF2EF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }, speciesText: { color: '#25665F', fontSize: 11, fontWeight: '700' }, contatoRow: { flexDirection: 'row', gap: 10, marginTop: 16 }, contatoButton: { flex: 1, backgroundColor: '#FFF', paddingVertical: 13, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, borderWidth: 1, borderColor: '#CDE2E1' }, contatoText: { color: '#087E8B', fontSize: 13, fontWeight: '800' }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 13 }, sectionTitle: { color: '#183B50', fontSize: 19, fontWeight: '800' }, sectionSubtitle: { color: '#718897', fontSize: 12, marginTop: 3 }, average: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF3D5', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12 }, averageText: { color: '#8C670B', fontSize: 14, fontWeight: '800' }, reviewForm: { backgroundColor: '#FFF', borderRadius: 17, padding: 16, borderWidth: 1, borderColor: '#DCE8EA' }, formTitle: { color: '#25495D', fontSize: 16, fontWeight: '800' }, formText: { color: '#6E8797', fontSize: 12, marginTop: 4 }, stars: { flexDirection: 'row', gap: 7, marginTop: 13, marginBottom: 14 }, commentInput: { minHeight: 92, borderWidth: 1, borderColor: '#D6E3E7', borderRadius: 12, backgroundColor: '#F7FAFA', padding: 12, color: '#25495D', fontSize: 14 }, counter: { alignSelf: 'flex-end', color: '#8196A2', fontSize: 10, marginTop: 4 }, sendButton: { height: 47, borderRadius: 12, marginTop: 10, backgroundColor: '#087E8B', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }, sendButtonPressed: { opacity: 0.8 }, sendText: { color: '#FFF', fontSize: 14, fontWeight: '800' }, commentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 27, marginBottom: 12 }, commentsTitle: { color: '#183B50', fontSize: 18, fontWeight: '800' }, loading: { marginVertical: 25 }, comment: { flexDirection: 'row', gap: 10, backgroundColor: '#FFF', borderRadius: 14, padding: 13, marginBottom: 10 }, avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#D6EFEC', justifyContent: 'center', alignItems: 'center' }, avatarText: { color: '#087E8B', fontSize: 14, fontWeight: '800' }, commentBody: { flex: 1 }, commentTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 }, author: { color: '#2B4C60', fontSize: 13, fontWeight: '800' }, commentTopRight: { flexDirection: 'row', alignItems: 'center', gap: 10 }, commentStars: { flexDirection: 'row', gap: 1 }, date: { color: '#8096A2', fontSize: 10, marginTop: 2 }, commentText: { color: '#4A687A', fontSize: 13, lineHeight: 19, marginTop: 8 }, empty: { backgroundColor: '#EAF6F4', borderRadius: 15, alignItems: 'center', padding: 24 }, emptyTitle: { color: '#275966', fontSize: 14, fontWeight: '800', marginTop: 8 }, emptyText: { color: '#66818E', fontSize: 12, textAlign: 'center', marginTop: 4 }, mapSection: { marginTop: 28 }, routeButton: { backgroundColor: '#FFF', marginTop: 10, paddingVertical: 13, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, borderWidth: 1, borderColor: '#CDE2E1' }, routeText: { color: '#087E8B', fontSize: 13, fontWeight: '800' },
});
