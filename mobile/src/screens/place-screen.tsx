import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { Action, Card, Chip, Feedback, Field, Heading, Page, ResourceState, shared } from '@/components/ui';
import { useApiResource } from '@/hooks/use-api-resource';
import type { RootStackNavigationProp, RootStackParamList } from '@/navigation/types';
import { api, type Neighborhood, type PlaceInput } from '@/services/api';
import { useAuth } from '@/state/auth';

export function PlaceScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Local'>>();
  const id = route.params?.id;
  const load = useCallback(async (token: string) => {
    const [neighborhoods, place] = await Promise.all([api.neighborhoods(token), id ? api.place(token, id) : null]);
    return { neighborhoods, place };
  }, [id]);
  const result = useApiResource(load);
  return (
    <Page>
      <Heading title={id ? 'Editar local' : 'Adicionar local'}
        description="Dê um nome ao local e escolha o bairro que quer acompanhar." />
      <ResourceState loading={result.loading && !result.data} error={result.error} retry={result.refresh} />
      {result.data && <PlaceForm key={id ?? 'new'} id={id} initial={result.data.place}
        neighborhoods={result.data.neighborhoods} />}
    </Page>
  );
}

function PlaceForm({ id, initial, neighborhoods }: { id?: string; initial: PlaceInput | null; neighborhoods: Neighborhood[] }) {
  const navigation = useNavigation<RootStackNavigationProp<'Local'>>();
  const { authorized } = useAuth();
  const [name, setName] = useState(initial?.name ?? '');
  const [neighborhoodId, setNeighborhoodId] = useState(initial?.neighborhoodId ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const back = () => (navigation.canGoBack() ? navigation.goBack() : navigation.replace('MainTabs', { screen: 'Locais' }));

  async function submit() {
    if (submitting.current) return;
    setError('');
    if (name.trim().length < 2) return setError('Informe um nome com pelo menos 2 caracteres.');
    if (!neighborhoodId) return setError('Escolha um bairro.');
    submitting.current = true;
    setBusy(true);
    try {
      const body = { name: name.trim(), neighborhoodId };
      await authorized(token => id ? api.updatePlace(token, id, body) : api.createPlace(token, body));
      back();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Não foi possível salvar o local.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <Card>
      <Field label="Nome do local" value={name} onChangeText={setName} placeholder="Ex.: Casa" maxLength={60} editable={!busy} />
      <Text style={shared.label}>Bairro em São Paulo</Text>
      <View style={shared.wrap}>
        {neighborhoods.map(item => <Chip key={item.id} label={item.name} selected={item.id === neighborhoodId}
          onPress={() => { if (!busy) setNeighborhoodId(item.id); }} />)}
      </View>
      <Feedback message={error} />
      <Action label="Salvar local" onPress={() => void submit()} busy={busy} icon="checkmark" />
      <Action label="Cancelar" onPress={back} disabled={busy} variant="secondary" />
    </Card>
  );
}
