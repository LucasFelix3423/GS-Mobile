import { Stack } from 'expo-router';
import { stackOptions } from '@/styles/navigation';

export const unstable_settings = { initialRouteName: '(tabs)' };

export default function AppLayout() {
  return (
    <Stack screenOptions={stackOptions}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="alertas/[id]" options={{ title: 'Detalhes do alerta' }} />
      <Stack.Screen name="local" options={{ title: 'Local monitorado' }} />
      <Stack.Screen name="sobre" options={{ title: 'Sobre o App' }} />
    </Stack>
  );
}
