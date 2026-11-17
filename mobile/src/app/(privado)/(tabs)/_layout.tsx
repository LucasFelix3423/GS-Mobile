import { Tabs } from 'expo-router';
import { Icon } from '@/components/ui';
import { colors, font } from '@/styles/theme';

export default function MainTabs() {
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: colors.navy },
      headerTintColor: colors.paper,
      headerTitleStyle: { fontFamily: font.heavy, fontSize: 19 },
      headerTitle: 'Alerta Bairro',
      tabBarActiveTintColor: colors.tealDark,
      tabBarInactiveTintColor: colors.muted,
      tabBarActiveBackgroundColor: colors.paleMint,
      tabBarStyle: { minHeight: 61, backgroundColor: colors.paper, borderTopColor: colors.border },
      tabBarLabelStyle: { fontFamily: font.bold, fontSize: 12 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarAccessibilityLabel: 'Início', tabBarIcon: ({ color, size }) => <Icon name="home-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="alertas" options={{ title: 'Alertas', tabBarAccessibilityLabel: 'Alertas', tabBarIcon: ({ color, size }) => <Icon name="notifications-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="locais" options={{ title: 'Meus locais', tabBarAccessibilityLabel: 'Meus locais', tabBarIcon: ({ color, size }) => <Icon name="location-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}
