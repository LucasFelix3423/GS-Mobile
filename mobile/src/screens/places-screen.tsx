import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Action, Card, Empty, Feedback, Heading, Icon, Page, ResourceState, shared } from '@/components/ui';
import { useApiResource } from '@/hooks/use-api-resource';
import type { MainTabNavigationProp } from '@/navigation/types';
import { api, type Place } from '@/services/api';
import { useAuth } from '@/state/auth';

export function PlacesScreen() {
  const navigation = useNavigation<MainTabNavigationProp<'Locais'>>();
  const { authorized } = useAuth();
  const places = useApiResource(api.places);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function deletePlace(place: Place) {
    if (deleting) return;
    setDeleting(true);
    setError('');
    setNotice('');
    try {
      await authorized(token => api.deletePlace(token, place.id));
      setConfirm(null);
      setNotice('Local excluído.');
      places.refresh();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Não foi possível excluir o local.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Page refresh={places.refresh} refreshing={places.loading && !!places.data}>
      <Heading title="Meus locais" description="Gerencie os bairros que você acompanha." />
      <Action label="Adicionar local" icon="add" onPress={() => navigation.navigate('Local')} />
      <ResourceState loading={places.loading} error={places.error} retry={places.refresh} />
      <Feedback kind="info" message={notice} />
      {places.data?.length === 0 && <Empty icon="location-outline" title="Nenhum local cadastrado"
        description="Adicione um local para ver os alertas na tela inicial." />}
      {places.data?.map(place => <Card key={place.id}>
        <View style={shared.row}><Icon name="location-outline" /><View style={shared.grow}>
          <Text style={shared.label}>{place.name}</Text><Text style={shared.muted}>{place.neighborhood} · São Paulo</Text>
        </View></View>
        {confirm === place.id ? <>
          <Text style={shared.text}>Excluir {place.name} dos seus locais monitorados?</Text>
          <Feedback message={error} />
          <View style={styles.actions}>
            <Action label="Cancelar" disabled={deleting} variant="secondary" onPress={() => { setConfirm(null); setError(''); }} />
            <Action label="Confirmar exclusão" busy={deleting} variant="danger" onPress={() => void deletePlace(place)} />
          </View>
        </> : <View style={styles.actions}>
          <Action label="Editar" icon="create-outline" variant="secondary" disabled={deleting}
            onPress={() => navigation.navigate('Local', { id: place.id })} />
          <Action label="Excluir" icon="trash-outline" variant="danger" disabled={deleting}
            onPress={() => { setConfirm(place.id); setError(''); setNotice(''); }} />
        </View>}
      </Card>)}
    </Page>
  );
}

const styles = StyleSheet.create({ actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });
