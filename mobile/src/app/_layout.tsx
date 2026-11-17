import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action, Feedback, Loading } from '@/components/ui';
import { AuthProvider, useAuth } from '@/state/auth';
import { colors } from '@/styles/theme';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold });
  if (!fontsLoaded && !fontError) return null;
  return <AuthProvider><StatusBar style="light" /><RootNavigator /></AuthProvider>;
}

function RootNavigator() {
  const { identity, loading, startupError, restore } = useAuth();
  if (loading || startupError) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.startup}>
          {loading ? <Loading label="Verificando sua sessão…" /> : <>
            <Feedback message={startupError ?? ''} />
            <Action label="Tentar novamente" onPress={() => void restore()} />
          </>}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Protected guard={!!identity} redirectTo="/login">
        <Stack.Screen name="(privado)" />
      </Stack.Protected>
      <Stack.Protected guard={!identity} redirectTo="/">
        <Stack.Screen name="(public)" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  startup: { flex: 1, backgroundColor: colors.background, padding: 22, gap: 14 },
});
