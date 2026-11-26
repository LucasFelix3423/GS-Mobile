import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type MainTabParamList = {
  Inicio: undefined;
  Alertas: undefined;
  Locais: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  AlertaDetalhes: { id: string };
  Local: { id?: string } | undefined;
  Sobre: undefined;
};

export type RootStackNavigationProp<RouteName extends keyof RootStackParamList = keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, RouteName>;

export type MainTabNavigationProp<RouteName extends keyof MainTabParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, RouteName>,
  NativeStackNavigationProp<RootStackParamList>
>;
