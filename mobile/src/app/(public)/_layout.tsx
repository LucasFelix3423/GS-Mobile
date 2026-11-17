import { Stack } from 'expo-router';
import { stackOptions } from '@/styles/navigation';

export const unstable_settings = { initialRouteName: 'login' };

export default function AuthLayout() {
  return (
    <Stack screenOptions={stackOptions}>
      <Stack.Screen name="login" options={{ title: 'Alerta Bairro' }} />
      <Stack.Screen name="cadastro" options={{ title: 'Cadastro' }} />
    </Stack>
  );
}
