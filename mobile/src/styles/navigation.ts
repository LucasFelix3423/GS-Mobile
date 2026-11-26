import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { colors, font } from './theme';

export const stackOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: colors.navy },
  headerTintColor: colors.paper,
  headerTitleStyle: { fontFamily: font.heavy },
  headerBackButtonDisplayMode: 'minimal',
  contentStyle: { backgroundColor: colors.background },
};
