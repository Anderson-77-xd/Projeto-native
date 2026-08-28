import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { pesqueiros as pesqueirosLocais, Pesqueiro } from '../../data/pesqueiros';
import { listarPesqueiros } from '../../services/api';
import { useLocalizacaoUsuario } from '../../hooks/useLocalizacaoUsuario';
import { calcularDistanciaKm, formatarDistancia } from '../../utils/distancia';
import MapaGeral from '../../components/MapaGeral';
import { colors } from '../../theme';

export default function Mapa() {
  const router = useRouter();
  const [pesqueiros, setPesqueiros] = useState<Pesqueiro[]>(pesqueirosLocais);
  const { localizacao, carregando, permissaoNegada } = useLocalizacaoUsuario();

  useEffect(() => {
    listarPesqueiros()
      .then((dados) => setPesqueiros(dados.length > 0 ? dados : pesqueirosLocais))
      .catch(() => setPesqueiros(pesqueirosLocais));
  }, []);

  function distanciaDe(item: Pesqueiro): string {
    if (!localizacao) return item.distancia;
    return formatarDistancia(
      calcularDistanciaKm(localizacao.latitude, localizacao.longitude, item.latitude, item.longitude)
    );
  }

  function selecionarPesqueiro(item: Pesqueiro) {
    router.push({ pathname: '/detalhes', params: item as any });
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.teal} size="large" />
        <Text style={styles.carregandoTexto}>Obtendo sua localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />

      {permissaoNegada && (
        <View style={styles.avisoBox}>
          <Text style={styles.avisoTexto}>
            Localização não autorizada. Mostrando pesqueiros sem sua posição atual.
          </Text>
        </View>
      )}

      <MapaGeral
        pesqueiros={pesqueiros}
        localizacao={localizacao}
        permissaoNegada={permissaoNegada}
        distanciaDe={distanciaDe}
        onSelecionar={selecionarPesqueiro}
      />

      <TouchableOpacity style={styles.btnVoltar} onPress={() => router.push('/pesqueiros')}>
        <Text style={styles.btnVoltarTexto}>← Lista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  centro: {
    flex: 1,
    backgroundColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carregandoTexto: {
    color: colors.navyMuted,
    marginTop: 12,
    fontSize: 14,
  },
  avisoBox: {
    backgroundColor: colors.warningBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  avisoTexto: {
    color: colors.warningText,
    fontSize: 12,
  },
  btnVoltar: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(6, 42, 74, 0.85)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 10,
  },
  btnVoltarTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
