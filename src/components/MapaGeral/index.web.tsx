import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default function MapaGeral({ pesqueiros, localizacao, distanciaDe, onSelecionar }: Props) {
  const centro = localizacao ?? { latitude: -23.5329, longitude: -46.7918 };
  const src = `https://www.google.com/maps?q=${centro.latitude},${centro.longitude}&z=11&output=embed`;

  return (
    <View style={styles.container}>
      <View style={styles.mapaContainer}>
        {/* @ts-ignore - iframe só existe no ambiente web */}
        <iframe
          src={src}
          style={{ width: '100%', height: '100%', border: 0 }}
          loading="lazy"
        />
      </View>

      <Text style={styles.aviso}>
        No navegador o mapa mostra sua região. No app mobile os pesqueiros aparecem como marcadores clicáveis.
      </Text>

      <ScrollView style={styles.lista}>
        {pesqueiros.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => onSelecionar(item)}>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardInfo}>{item.cidade} • {distanciaDe(item)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapaContainer: {
    height: 220,
  },
  aviso: {
    color: colors.navyMuted,
    fontSize: 12,
    padding: 12,
  },
  lista: {
    flex: 1,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: colors.navySurface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  cardNome: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardInfo: {
    color: colors.navyMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
