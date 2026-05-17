// src/components/Button/styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  // Variante Primary
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimaryText: {
    color: colors.white,
    fontSize: typography.titleMedium.fontSize,
    fontWeight: typography.titleMedium.fontWeight,
  },

  // Variante Secondary
  buttonSecondary: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonSecondaryText: {
    color: colors.white,
    fontSize: typography.titleMedium.fontSize,
    fontWeight: typography.titleMedium.fontWeight,
  },

  // Variante Outline
  buttonOutline: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonOutlineText: {
    color: colors.primary,
    fontSize: typography.titleMedium.fontSize,
    fontWeight: typography.titleMedium.fontWeight,
  },

  // Variante Ghost
  buttonGhost: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonGhostText: {
    color: colors.primary,
    fontSize: typography.titleMedium.fontSize,
    fontWeight: typography.titleMedium.fontWeight,
  },

  // Estados Disabled
  buttonDisabled: {
    opacity: 0.5,
  },

  // Tamanhos
  buttonSmall: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 40,
  },
  buttonSmallText: {
    fontSize: typography.labelLarge.fontSize,
    fontWeight: typography.labelLarge.fontWeight,
  },

  buttonLarge: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  buttonLargeText: {
    fontSize: typography.headingSmall.fontSize,
    fontWeight: typography.headingSmall.fontWeight,
  },
});
