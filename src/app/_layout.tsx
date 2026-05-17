// src/app/_layout.tsx
import { Stack } from 'expo-router';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="detalhes"
        options={{
          title: 'Detalhes',
        }}
      />
      <Stack.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
    </Stack>
  );
}
