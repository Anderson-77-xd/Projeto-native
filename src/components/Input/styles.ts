// src/components/Input/styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 55,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    margin: 20,
    color: colors.textPrimary,
  },
});