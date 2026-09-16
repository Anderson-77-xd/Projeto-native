import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';

export function useExigirAutenticacao() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [verificando, setVerificando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      setVerificando(true);
      setAutenticado(false);

      AsyncStorage.getItem('@smartfishing:token').then((token) => {
        if (!ativo) return;

        if (!token) {
          router.replace('/');
          return;
        }

        setAutenticado(true);
        setVerificando(false);
      });

      return () => {
        ativo = false;
      };
    }, [router]),
  );

  return { autenticado, verificando };
}
