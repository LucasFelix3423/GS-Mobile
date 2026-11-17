import { colors, font } from './theme';

export const stackOptions = {
  headerStyle: { backgroundColor: colors.navy },
  headerTintColor: colors.paper,
  headerTitleStyle: { fontFamily: font.heavy },
  headerBackButtonDisplayMode: 'minimal' as const,
  contentStyle: { backgroundColor: colors.background },
};
