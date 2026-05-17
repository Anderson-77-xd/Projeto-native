// src/components/FisheryCard/index.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface FisheryCardProps {
  id: string;
  nome: string;
  cidade: string;
  imagem: string;
  preco: string;
  horario: string;
  descricao: string;
  rating?: number;
  onPress: () => void;
}

export function FisheryCard({
  nome,
  cidade,
  imagem,
  preco,
  horario,
  onPress,
  rating = 4.5,
}: FisheryCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: imagem }}
        style={styles.imageContainer}
        imageStyle={styles.image}
      >
        <View style={styles.overlay} />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={16} color={colors.warning} />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.nome} numberOfLines={2}>
          {nome}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.gray[500]}
          />
          <Text style={styles.cidade}>{cidade}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="time-outline"
            size={14}
            color={colors.gray[500]}
          />
          <Text style={styles.horario}>{horario}</Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.preco}>{preco}</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: spacing.lg,
  },
  image: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  ratingBadge: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    gap: spacing.xs,
  },
  ratingText: {
    ...typography.labelMedium,
    color: colors.gray[900],
    fontWeight: '600' as const,
  },
  content: {
    padding: spacing.lg,
  },
  nome: {
    ...typography.titleLarge,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  cidade: {
    ...typography.bodySmall,
    color: colors.gray[500],
  },
  horario: {
    ...typography.bodySmall,
    color: colors.gray[500],
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  preco: {
    ...typography.titleMedium,
    color: colors.primary,
    fontWeight: '700' as const,
  },
});
