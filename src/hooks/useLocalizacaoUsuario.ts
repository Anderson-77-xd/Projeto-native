import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export type Coordenada = {
  latitude: number;
  longitude: number;
};

type Resultado = {
  localizacao: Coordenada | null;
  carregando: boolean;
  erro: string | null;
  permissaoNegada: boolean;
};

/**
 * Hook que solicita permissão de localização e retorna a posição atual do usuário.
 */
export function useLocalizacaoUsuario(): Resultado {
  const [localizacao, setLocalizacao] = useState<Coordenada | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [permissaoNegada, setPermissaoNegada] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function obterLocalizacao() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          if (ativo) {
            setPermissaoNegada(true);
            setErro('Permissão de localização negada.');
            setCarregando(false);
          }
          return;
        }

        const posicao = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (ativo) {
          setLocalizacao({
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude,
          });
          setCarregando(false);
        }
      } catch (e) {
        if (ativo) {
          setErro(e instanceof Error ? e.message : 'Não foi possível obter a localização.');
          setCarregando(false);
        }
      }
    }

    obterLocalizacao();

    return () => {
      ativo = false;
    };
  }, []);

  return { localizacao, carregando, erro, permissaoNegada };
}
