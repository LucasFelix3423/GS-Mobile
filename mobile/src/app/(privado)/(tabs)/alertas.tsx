import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ForecastCard } from '@/components/forecast-card';
import { Card, Chip, Empty, Feedback, Heading, Page, ResourceState, shared } from '@/components/ui';
import { useApiResource } from '@/hooks/use-api-resource';
import { api, type Severity } from '@/services/api';
import { severityLabels, sortedAlerts } from '@/services/forecasts';

async function loadAlerts(token: string) {
  const [alerts, places] = await Promise.all([api.alerts(token), api.places(token)]);
  return { alerts: sortedAlerts(alerts), places };
}

export default function AlertsScreen() {
  const router = useRouter();
  const [severity, setSeverity] = useState<Severity | ''>('');
  const [placeId, setPlaceId] = useState('');
  const result = useApiResource(loadAlerts);
  const selectedPlace = result.data?.places.find(place => place.id === placeId);
  const filtered = result.data?.alerts.filter(alert =>
    (!severity || alert.severity === severity) && (!selectedPlace || selectedPlace.neighborhoodId === alert.neighborhoodId)) ?? [];

  return (
    <Page refresh={result.refresh} refreshing={result.loading && !!result.data}>
      <Heading title="Alertas" description="Cenários de risco para São Paulo." />
      <Feedback kind="info" message="Simulação acadêmica · Dados demonstrativos" />
      <ResourceState loading={result.loading && !result.data} error={result.error} retry={result.refresh} />
      {result.data && <>
        <Card>
          <Text style={shared.label}>Gravidade</Text>
          <View style={shared.wrap}>
            <Chip label="Todas" selected={!severity} onPress={() => setSeverity('')} />
            {(['high', 'moderate'] as const).map(item =>
              <Chip key={item} label={severityLabels[item]} selected={severity === item} onPress={() => setSeverity(item)} />)}
          </View>
          {result.data.places.length > 0 && <>
            <Text style={shared.label}>Local monitorado</Text>
            <View style={shared.wrap}>
              <Chip label="Todos os bairros" selected={!selectedPlace} onPress={() => setPlaceId('')} />
              {result.data.places.map(place =>
                <Chip key={place.id} label={place.name + ' · ' + place.neighborhood} selected={selectedPlace?.id === place.id}
                  onPress={() => setPlaceId(place.id)} />)}
            </View>
          </>}
        </Card>
        {filtered.length === 0 ? <Empty icon="search-outline" title="Nenhum alerta encontrado"
          description="Experimente mudar os filtros para consultar outros cenários." />
          : <View style={shared.group}>
            {filtered.map(alert => <ForecastCard key={alert.id} alert={alert}
              onPress={() => router.push({ pathname: '/alertas/[id]', params: { id: alert.id } })} />)}
          </View>}
      </>}
    </Page>
  );
}
