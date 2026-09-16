import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useExigirAutenticacao } from '../../hooks/useExigirAutenticacao';

export default function Layout() {
  const { autenticado, verificando } = useExigirAutenticacao();

  if (verificando || !autenticado) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#087E8B" />
      </View>
    );
  }

  return (
    <Drawer>
      <Drawer.Screen
        name="perfil"
        options={{ title: 'Perfil' }}
      />
      <Drawer.Screen
        name="home"
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="pesqueiros"
        options={{ title: 'pesqueiros' }}
      />
      <Drawer.Screen
        name="mapa"
        options={{ title: 'Mapa' }}
      />
      <Drawer.Screen
        name="cadastrarPesqueiro"
        options={{ title: 'Cadastrar pesqueiro' }}
      />
    </Drawer>
  );
}