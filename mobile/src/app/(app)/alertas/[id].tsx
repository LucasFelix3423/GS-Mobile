import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { RiskBadge } from '@/components/forecast-card';
import { Card, Feedback, Heading, Icon, Page, ResourceState, SectionTitle, shared } from '@/components/ui';
import { useApiResource } from '@/hooks/use-api-resource';
import { api } from '@/services/api';
import { alertTypes, formatAlertTime } from '@/services/forecasts';

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const load = useCallback((token: string) => api.alert(token, id), [id]);
  const { data, error, loading, refresh } = useApiResource(load);

  return (
    <Page>
      <ResourceState loading={loading} error={error} retry={refresh} />
      {data && <>
        <View style={shared.row}>
          <Icon name={alertTypes[data.type].icon} />
          <Text style={shared.label}>{alertTypes[data.type].label}</Text>
          <RiskBadge severity={data.severity} />
        </View>
        <Heading title={data.title} description={data.neighborhood + ' · São Paulo'} />
        {data.simulated && <Feedback kind="info" message="Alerta simulado para demonstração acadêmica." />}
        <Card>
          <SectionTitle>Período previsto</SectionTitle>
          <Text style={shared.text}>{formatAlertTime(data.startsAt)} até {formatAlertTime(data.endsAt)}</Text>
          <Text style={shared.muted}>Horário de São Paulo</Text>
        </Card>
        <Card><SectionTitle>O que pode acontecer</SectionTitle><Text style={shared.text}>{data.description}</Text></Card>
        <Card><SectionTitle>Orientação do cenário</SectionTitle><Text style={shared.text}>{data.guidance}</Text></Card>
      </>}
    </Page>
  );
}
