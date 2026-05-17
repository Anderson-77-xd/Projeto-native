// src/app/detalhes.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function Detalhes() {
  const { nome, cidade, imagem, descricao, preco, horario } = useLocalSearchParams();
  const router = useRouter();

  const imagemUrl = Array.isArray(imagem) ? imagem[0] : imagem;

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Detalhes" showMenu={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imagemUrl }}
            style={styles.imagem}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <View style={styles.titleContainer}>
              <Text style={styles.nome} numberOfLines={2}>
                {nome}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={colors.warning} />
                <Text style={styles.rating}>4.8</Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="location"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.infoTitle}>Localização</Text>
            </View>
            <Text style={styles.infoValue}>{cidade}</Text>
          </View>

          {/* Hours */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="time"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.infoTitle}>Horário de Funcionamento</Text>
            </View>
            <Text style={styles.infoValue}>{horario}</Text>
          </View>

          {/* Price */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="cash"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.infoTitle}>Valor da Entrada</Text>
            </View>
            <Text style={[styles.infoValue, styles.preco]}>{preco}</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Sobre este pesqueiro</Text>
            <Text style={styles.descriptionText}>{descricao}</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Comodidades</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Estacionamento</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Banheiros</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Bar e Restaurante</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Aluguel de Equipamentos</Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <Button
              title="Ligar para Pesqueiro"
              onPress={() => {}}
              variant="primary"
              size="large"
            />
            <Button
              title="Visualizar no Mapa"
              onPress={() => {}}
              variant="secondary"
              size="large"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.xl,
  },
  headerInfo: {
    marginBottom: spacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  nome: {
    ...typography.headingMedium,
    color: colors.gray[900],
    flex: 1,
    marginRight: spacing.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.sm,
  },
  rating: {
    ...typography.labelMedium,
    color: colors.gray[900],
    fontWeight: '600' as const,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  infoTitle: {
    ...typography.titleMedium,
    color: colors.gray[900],
    fontWeight: '600' as const,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.gray[600],
    marginLeft: spacing.xxxl,
  },
  preco: {
    ...typography.headingSmall,
    color: colors.primary,
    fontWeight: '700' as const,
    marginLeft: spacing.xxxl,
  },
  descriptionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  descriptionTitle: {
    ...typography.titleLarge,
    color: colors.gray[900],
    marginBottom: spacing.md,
    fontWeight: '600' as const,
  },
  descriptionText: {
    ...typography.bodyMedium,
    color: colors.gray[600],
    lineHeight: 24,
  },
  featuresCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  featuresTitle: {
    ...typography.titleLarge,
    color: colors.gray[900],
    marginBottom: spacing.lg,
    fontWeight: '600' as const,
  },
  featuresList: {
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    ...typography.bodyMedium,
    color: colors.gray[700],
  },
  buttonsContainer: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
