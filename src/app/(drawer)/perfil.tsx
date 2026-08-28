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
import { Comentario, listarComentarios, listarFavoritos, listarHistorico, Usuario } from '../../services/api';
import { Pesqueiro } from '../../data/pesqueiros';
import { colors } from '../../theme';

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
  const [favoritos, setFavoritos] = useState<Pesqueiro[]>([]);
  const [minhasAvaliacoes, setMinhasAvaliacoes] = useState<Comentario[]>([]);
  const [historico, setHistorico] = useState<Pesqueiro[]>([]);

  useEffect(() => {
    async function carregarPerfil() {
      const usuarioSalvo = await AsyncStorage.getItem('@smartfishing:usuario');
      const usuarioAtual = usuarioSalvo ? JSON.parse(usuarioSalvo) as Usuario : usuarioPadrao;
      const fotoSalva = await AsyncStorage.getItem(chaveFotoPerfil(usuarioAtual.email));

      setUsuario(usuarioAtual);
      setFotoPerfil(fotoSalva);

      try {
        const [favoritosSalvos, comentarios, historicoSalvo] = await Promise.all([
          listarFavoritos(),
          listarComentarios(),
          listarHistorico(),
        ]);
        setFavoritos(favoritosSalvos);
        setMinhasAvaliacoes(comentarios.filter((comentario) => comentario.usuarioId === usuarioAtual.id));
        setHistorico(historicoSalvo);
      } catch {
        setFavoritos([]);
        setMinhasAvaliacoes([]);
        setHistorico([]);
      }
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

  const estatisticas = [
    { valor: String(favoritos.length), label: 'Favoritos' },
    { valor: String(minhasAvaliacoes.length), label: 'Avaliações' },
    { valor: usuario.statusUsuario === false ? '0' : '1', label: 'Conta ativa' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />

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
          <Text style={styles.secaoTitulo}>Últimos pesqueiros visitados</Text>
          {historico.length === 0 ? (
            <Text style={styles.semConteudo}>Os pesqueiros que você visitar aparecerão aqui.</Text>
          ) : historico.slice(0, 3).map((pesqueiro) => (
            <TouchableOpacity key={pesqueiro.id} style={styles.favoritoRow} onPress={() => router.push({ pathname: '/detalhes', params: pesqueiro })}>
              <Text style={styles.favoritoNome}>{pesqueiro.nome}</Text>
              <Text style={styles.favoritoMeta}>{pesqueiro.cidade}, {pesqueiro.estado}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Meus favoritos</Text>
          {favoritos.length === 0 ? (
            <Text style={styles.semConteudo}>Toque no coração de um pesqueiro para salvá-lo aqui.</Text>
          ) : favoritos.slice(0, 3).map((pesqueiro) => (
            <TouchableOpacity key={pesqueiro.id} style={styles.favoritoRow} onPress={() => router.push({ pathname: '/detalhes', params: pesqueiro })}>
              <Text style={styles.favoritoNome}>{pesqueiro.nome}</Text>
              <Text style={styles.favoritoMeta}>{pesqueiro.cidade} · R$ {pesqueiro.preco}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Minhas avaliações</Text>
          {minhasAvaliacoes.length === 0 ? (
            <Text style={styles.semConteudo}>Suas avaliações aparecerão aqui.</Text>
          ) : minhasAvaliacoes.slice(0, 3).map((comentario) => (
            <View key={comentario.id} style={styles.avaliacaoRow}>
              <Text style={styles.avaliacaoNota}>{'★'.repeat(comentario.nota)}</Text>
              <Text style={styles.avaliacaoTexto} numberOfLines={2}>{comentario.descricao}</Text>
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
    backgroundColor: colors.background,
  },
  topo: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 28,
    backgroundColor: colors.navy,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
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
    borderColor: colors.teal,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.teal,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.navy,
  },
  avatarBadgeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  btnTrocarFoto: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 14,
  },
  btnTrocarFotoText: {
    color: colors.tealSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  nome: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    color: colors.navyMuted,
    fontSize: 14,
    marginTop: 4,
  },
  cidade: {
    color: colors.tealSoft,
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
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#173C4B',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statValor: {
    color: colors.teal,
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },
  secao: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#173C4B',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  secaoTitulo: {
    color: colors.textPrimary,
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
    color: colors.textSecondary,
    fontSize: 12,
  },
  infoValor: {
    color: colors.textPrimary,
    fontSize: 15,
    marginTop: 2,
  },
  divisor: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  semConteudo: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  favoritoRow: {
    paddingVertical: 10,
  },
  favoritoNome: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  favoritoMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  avaliacaoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avaliacaoNota: {
    color: colors.star,
    fontSize: 13,
    marginBottom: 4,
  },
  avaliacaoTexto: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  btnSair: {
    marginHorizontal: 16,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  btnSairText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});
