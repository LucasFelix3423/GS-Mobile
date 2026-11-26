import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ForecastCard, ForecastHero } from '@/components/forecast-card';
import { Action, Empty, Feedback, Heading, Icon, Page, ResourceState, SectionTitle, shared } from '@/components/ui';
import { useApiResource } from '@/hooks/use-api-resource';
import type { MainTabNavigationProp } from '@/navigation/types';
import { api } from '@/services/api';
import { sortedAlerts } from '@/services/forecasts';
import { useAuth } from '@/state/auth';
import { colors } from '@/styles/theme';

async function loadDashboard(token: string) {
  const [places, alerts] = await Promise.all([api.places(token), api.alerts(token)]);
  const neighborhoods = new Set(places.map(place => place.neighborhoodId));
  return { places, matching: sortedAlerts(alerts.filter(alert => neighborhoods.has(alert.neighborhoodId))) };
}

export function HomeScreen() {
  const navigation = useNavigation<MainTabNavigationProp<'Inicio'>>();
  const { identity, logout } = useAuth();
  const resource = useApiResource(loadDashboard);
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const topAlert = resource.data?.matching[0];
  const openAlert = (id: string) => navigation.navigate('AlertaDetalhes', { id });

  async function signOut() {
    if (signingOut) return;
    setLogoutError('');
    setSigningOut(true);
    try {
      await logout();
    } catch (failure) {
      setLogoutError(failure instanceof Error ? failure.message : 'Não foi possível sair.');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Page refresh={resource.refresh} refreshing={resource.loading && !!resource.data}>
      <View style={shared.row}>
        <View style={shared.grow}>
          <Heading title={'Olá, ' + (identity?.user.name.split(/\s+/)[0] ?? 'morador')} description="Acompanhe os lugares importantes para você." />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Sobre o App" onPress={() => navigation.navigate('Sobre')}
          style={({ pressed }) => [styles.about, pressed && { opacity: 0.65 }]}>
          <Icon name="information-circle-outline" />
        </Pressable>
      </View>

      <Feedback kind="info" message="Modo demonstração · Alertas simulados" />
      <ResourceState loading={resource.loading && !resource.data} error={resource.error} retry={resource.refresh} />
      {resource.data && <>
        <ForecastHero alert={topAlert} onPress={() => topAlert ? openAlert(topAlert.id) : navigation.navigate('Alertas')} />
        <SectionTitle>Meus locais</SectionTitle>
        {resource.data.places.length === 0 ? <Empty icon="location-outline" title="Adicione seu primeiro local"
          description="Escolha um bairro para ver os alertas relacionados a ele."
          action={<Action label="Adicionar local" icon="add" onPress={() => navigation.navigate('Local')} />} />
          : <>
            <View style={styles.summary}>
              <View style={shared.row}>
                <Icon name="location-outline" />
                <Text style={shared.label}>{resource.data.places.length} {resource.data.places.length === 1 ? 'local monitorado' : 'locais monitorados'}</Text>
              </View>
              <Text style={shared.muted}>{resource.data.matching.length === 0
                ? 'Nenhum alerta simulado para os bairros salvos.'
                : resource.data.matching.length === 1 ? '1 alerta simulado para seus locais.' : resource.data.matching.length + ' alertas simulados para seus locais.'}</Text>
            </View>
            {resource.data.matching.slice(1, 4).map(alert => <ForecastCard key={alert.id} alert={alert} onPress={() => openAlert(alert.id)} />)}
            <Action label="Gerenciar meus locais" variant="secondary" icon="location-outline" onPress={() => navigation.navigate('Locais')} />
          </>}
      </>}
      <Feedback message={logoutError} />
      <Action label="Sair da conta" icon="log-out-outline" variant="secondary" busy={signingOut} onPress={() => void signOut()} />
    </Page>
  );
}

const styles = StyleSheet.create({
  about: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.border },
  summary: { backgroundColor: colors.paper, borderColor: colors.border, borderWidth: 1, borderRadius: 16, gap: 6, padding: 15 },
});
