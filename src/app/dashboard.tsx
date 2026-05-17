// src/app/dashboard.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { FisheryCard } from '../components/FisheryCard';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const pesqueiros = [
    {
      id: '1',
      nome: 'Pesqueiro Lago Azul',
      cidade: 'Osasco',
      imagem: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      descricao: 'Lugar tranquilo para pesca com família',
      preco: 'R$ 30',
      horario: '08:00 - 18:00',
      rating: 4.8,
    },
    {
      id: '2',
      nome: 'Pesqueiro do Zé',
      cidade: 'Barueri',
      imagem: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400',
      descricao: 'Excelente para pesca de traíra e tucunaré',
      preco: 'R$ 35',
      horario: '07:00 - 19:00',
      rating: 4.5,
    },
    {
      id: '3',
      nome: 'Recanto do Pescador',
      cidade: 'São Paulo',
      imagem: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400',
      descricao: 'Melhor para pesca esportiva',
      preco: 'R$ 40',
      horario: '06:00 - 20:00',
      rating: 4.9,
    },
    {
      id: '4',
      nome: 'Pesque & Pague Vila Soco',
      cidade: 'Itapevi',
      imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      descricao: 'Com estrutura completa e restaurante',
      preco: 'R$ 45',
      horario: '08:00 - 18:00',
      rating: 4.7,
    },
  ];

  const filteredPesqueiros = pesqueiros.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cidade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Pesqueiros" showMenu={true} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.gray[400]}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pesqueiros ou cidades..."
          placeholderTextColor={colors.gray[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultCountContainer}>
        <Text style={styles.resultCount}>
          {filteredPesqueiros.length} pesqueiros encontrados
        </Text>
      </View>

      {/* Pesqueiros List */}
      <FlatList
        data={filteredPesqueiros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <FisheryCard
              {...item}
              onPress={() =>
                router.push({
                  pathname: '/detalhes',
                  params: item,
                })
              }
            />
          </View>
        )}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        ListEmptyState={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color={colors.gray[300]} />
            <Text style={styles.emptyStateText}>
              Nenhum pesqueiro encontrado
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: spacing.xl,
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.gray[900],
  },
  resultCountContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  resultCount: {
    ...typography.bodySmall,
    color: colors.gray[500],
  },
  cardWrapper: {
    paddingHorizontal: spacing.xl,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyStateText: {
    ...typography.bodyLarge,
    color: colors.gray[400],
    marginTop: spacing.lg,
  },
});
