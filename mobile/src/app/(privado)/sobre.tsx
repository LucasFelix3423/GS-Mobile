import Constants from 'expo-constants';
import { Image, StyleSheet, Text } from 'react-native';
import { Card, Feedback, Heading, Page, SectionTitle, shared } from '@/components/ui';

export default function AboutScreen() {
  const config = Constants.expoConfig;
  const commit = typeof config?.extra?.commit === 'string' ? config.extra.commit : '';
  return (
    <Page>
      <Image source={require('../../../assets/images/icon.png')} style={styles.logo} accessible={false} />
      <Heading title="Alerta Bairro" description="FIAP Global Solution 2026/2" />
      <Feedback kind="info" message="Este projeto acadêmico apresenta cenários simulados de risco climático. Em situações reais, consulte os canais oficiais." />
      <Card>
        <SectionTitle>Versão {config?.version ?? '1.0.0'}</SectionTitle>
        <Text style={shared.label}>Commit de referência</Text>
        <Text selectable style={shared.text}>{commit || 'Hash indisponível nesta execução local.'}</Text>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({ logo: { width: 68, height: 68, borderRadius: 18 } });
