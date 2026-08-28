import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors } from '../../theme';

type Props = {
  latitude: number;
  longitude: number;
};

export default function MapaDetalhe({ latitude, longitude }: Props) {
  return (
    <View style={styles.mapaContainer}>
      <MapView
        style={styles.mapa}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker coordinate={{ latitude, longitude }} pinColor={colors.teal} />
      </MapView>
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
  mapa: {
    flex: 1,
  },
});
