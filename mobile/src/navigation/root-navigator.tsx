import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ExpoLinking from 'expo-linking';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action, Feedback, Icon, Loading } from '@/components/ui';
import { AboutScreen } from '@/screens/about-screen';
import { AlertDetailsScreen } from '@/screens/alert-details-screen';
import { AlertsScreen } from '@/screens/alerts-screen';
import { HomeScreen } from '@/screens/home-screen';
import { LoginScreen } from '@/screens/login-screen';
import { PlaceScreen } from '@/screens/place-screen';
import { PlacesScreen } from '@/screens/places-screen';
import { SignupScreen } from '@/screens/signup-screen';
import { useAuth } from '@/state/auth';
import { stackOptions } from '@/styles/navigation';
import { colors, font } from '@/styles/theme';
import type { MainTabParamList, RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.paper,
    text: colors.text,
    border: colors.border,
    primary: colors.teal,
  },
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [ExpoLinking.createURL('/')],
  config: {
    screens: {
      Login: 'login',
      Cadastro: 'cadastro',
      MainTabs: {
        screens: {
          Inicio: '',
          Alertas: 'alertas',
          Locais: 'locais',
        },
      },
      AlertaDetalhes: 'alertas/:id',
      Local: 'local',
      Sobre: 'sobre',
    },
  },
};

function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.paper,
        headerTitleStyle: { fontFamily: font.heavy, fontSize: 19 },
        headerTitle: 'Alerta Bairro',
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.tealDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarActiveBackgroundColor: colors.paleMint,
        tabBarStyle: { minHeight: 61, backgroundColor: colors.paper, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: font.bold, fontSize: 12 },
      }}>
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarAccessibilityLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Icon name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Alertas"
        component={AlertsScreen}
        options={{
          title: 'Alertas',
          tabBarAccessibilityLabel: 'Alertas',
          tabBarIcon: ({ color, size }) => <Icon name="notifications-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Locais"
        component={PlacesScreen}
        options={{
          title: 'Meus locais',
          tabBarAccessibilityLabel: 'Meus locais',
          tabBarIcon: ({ color, size }) => <Icon name="location-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { identity, loading, startupError, restore } = useAuth();

  if (loading || startupError) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.startup}>
          {loading ? (
            <Loading label="Verificando sua sessão…" />
          ) : (
            <>
              <Feedback message={startupError ?? ''} />
              <Action label="Tentar novamente" onPress={() => void restore()} />
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <RootStack.Navigator screenOptions={stackOptions}>
        {identity ? (
          <RootStack.Group>
            <RootStack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
            <RootStack.Screen name="AlertaDetalhes" component={AlertDetailsScreen} options={{ title: 'Detalhes do alerta' }} />
            <RootStack.Screen name="Local" component={PlaceScreen} options={{ title: 'Local monitorado' }} />
            <RootStack.Screen name="Sobre" component={AboutScreen} options={{ title: 'Sobre o App' }} />
          </RootStack.Group>
        ) : (
          <RootStack.Group>
            <RootStack.Screen name="Login" component={LoginScreen} options={{ title: 'Alerta Bairro' }} />
            <RootStack.Screen name="Cadastro" component={SignupScreen} options={{ title: 'Cadastro' }} />
          </RootStack.Group>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  startup: { flex: 1, backgroundColor: colors.background, padding: 22, gap: 14 },
});
