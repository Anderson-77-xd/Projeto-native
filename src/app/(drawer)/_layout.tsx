import { Drawer } from 'expo-router/drawer';

export default function Layout() {
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