import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
        }}
      />


      <Drawer.Screen
      name="perfil"
      options={{
      title: 'Perfil',
  }}
/>

    <Drawer.Screen
  name="home"
  options={{
    title: 'Home',
  }}
/>

<Drawer.Screen
  name="pesqueiros"
  options={{
    title: 'Pesqueiros',
  }}
/>
    </Drawer>
  );
}