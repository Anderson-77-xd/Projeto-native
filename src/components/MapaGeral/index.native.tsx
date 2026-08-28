import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Pesqueiro } from '../../data/pesqueiros';
import { Coordenada } from '../../hooks/useLocalizacaoUsuario';
import { colors } from '../../theme';

type Props = {
  pesqueiros: Pesqueiro[];
  localizacao: Coordenada | null;
  permissaoNegada: boolean;
  distanciaDe: (item: Pesqueiro) => string;
  onSelecionar: (item: Pesqueiro) => void;
};

export default function MapaGeral({ pesqueiros, localizacao, permissaoNegada, distanciaDe, onSelecionar }: Props) {
  const regiaoInicial = {
    latitude: localizacao?.latitude ?? -23.5329,
    longitude: localizacao?.longitude ?? -46.7918,
    latitudeDelta: 0.35,
    longitudeDelta: 0.35,
  };

  return (
    <MapView
      style={styles.mapa}
      provider={PROVIDER_GOOGLE}
      initialRegion={regiaoInicial}
      showsUserLocation={!permissaoNegada}
      showsMyLocationButton={!permissaoNegada}
    >
      {pesqueiros.map((item) => (
        <Marker
          key={item.id}
          coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          pinColor={colors.teal}
          onCalloutPress={() => onSelecionar(item)}
        >
          <Callout tooltip={false}>
            <View style={styles.callout}>
              <Text style={styles.calloutTitulo} numberOfLines={1}>{item.nome}</Text>
              <Text style={styles.calloutInfo}>{item.cidade} • {distanciaDe(item)}</Text>
              <Text style={styles.calloutLink}>Ver detalhes →</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapa: {
    flex: 1,
  },
  callout: {
    minWidth: 160,
    padding: 4,
  },
  calloutTitulo: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  calloutInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  calloutLink: {
    fontSize: 12,
    color: colors.teal,
    fontWeight: '600',
    marginTop: 4,
  },
});

