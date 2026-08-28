import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

type Props = {
  latitude: number;
  longitude: number;
};

export default function MapaDetalhe({ latitude, longitude }: Props) {
  const src = `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;

  return (
    <View style={styles.mapaContainer}>
      {/* @ts-ignore - iframe só existe no ambiente web */}
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapaContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
