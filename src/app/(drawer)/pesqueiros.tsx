import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { pesqueiros as pesqueirosLocais, Pesqueiro } from '../../data/pesqueiros';
import { listarPesqueiros } from '../../services/api';

const categorias = ['Todos', 'Família', 'Esportivo', 'Noturno', 'Inativo'];

export default function Pesqueiros() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [pesqueiros, setPesqueiros] = useState<Pesqueiro[]>(pesqueirosLocais);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarPesqueiros() {
      try {
        const dados = await listarPesqueiros();
        setPesqueiros(dados.length > 0 ? dados : pesqueirosLocais);
        setErro('');
      } catch {
        setPesqueiros(pesqueirosLocais);
        setErro('API offline. Mostrando dados locais.');
      } finally {
        setCarregando(false);
      }
    }

    carregarPesqueiros();
  }, []);

  const filtrados = pesqueiros.filter((p) => {
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
        <TouchableOpacity
          style={styles.btnNovoPesqueiro}
          onPress={() => router.push('/(drawer)/cadastrarPesqueiro')}
        >
          <Text style={styles.btnNovoPesqueiroText}>+ Cadastrar pesqueiro</Text>
        </TouchableOpacity>

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

        {carregando && <ActivityIndicator color="#4ADE80" style={styles.loading} />}
        {erro !== '' && <Text style={styles.aviso}>{erro}</Text>}

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
                <Text style={styles.distanciaText}>{item.distancia}</Text>
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
                <Text style={styles.horario}>{item.horario}</Text>
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
  btnNovoPesqueiro: {
    backgroundColor: '#4ADE80',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  btnNovoPesqueiroText: {
    color: '#0a2540',
    fontWeight: 'bold',
    fontSize: 15,
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
  loading: {
    marginBottom: 12,
  },
  aviso: {
    color: '#fbbf24',
    fontSize: 12,
    marginBottom: 10,
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
  vazioText: {
    color: '#7aabcc',
    fontSize: 16,
  },
});
