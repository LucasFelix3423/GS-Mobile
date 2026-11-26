import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { RootStackNavigationProp } from '@/navigation/types';
import { api } from '@/services/api';
import { useAuth } from '@/state/auth';
import { colors, font } from '@/styles/theme';
import { Action, Card, Feedback, Field, Heading, Page } from './ui';

export function AuthForm({ signup = false }: { signup?: boolean }) {
  const navigation = useNavigation<RootStackNavigationProp<'Login' | 'Cadastro'>>();
  const { start } = useAuth();
  const submitting = useRef(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (submitting.current) return;
    setError('');
    if (signup && name.trim().length < 2) return setError('Informe um nome com pelo menos 2 caracteres.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Informe um e-mail válido.');
    if (password.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres.');
    submitting.current = true;
    setBusy(true);
    try {
      const session = signup ? await api.signup(name, email, password) : await api.login(email, password);
      await start(session);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Tente novamente.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <Page>
      <View style={styles.brand}>
        <Image source={require('../../assets/images/forecast.png')} style={styles.image} resizeMode="cover" accessible={false} />
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} accessible={false} />
        <Text style={styles.brandName}>Alerta Bairro</Text>
        <Text style={styles.brandDescription}>Riscos climáticos perto dos lugares que importam.</Text>
      </View>
      <Heading title={signup ? 'Crie sua conta' : 'Entre na sua conta'}
        description={signup ? 'Cadastre-se para acompanhar seus locais.' : 'Acesse seus locais e os alertas da sua região.'} />
      <Card>
        {signup && <Field label="Nome" value={name} onChangeText={setName} maxLength={60} autoComplete="name" />}
        <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" autoCorrect={false} maxLength={254} placeholder="voce@exemplo.com" />
        <Field label="Senha" value={password} onChangeText={setPassword} maxLength={128} secureTextEntry
          autoComplete={signup ? 'new-password' : 'current-password'} returnKeyType="go" onSubmitEditing={submit} />
        <Feedback message={error} />
        <Action label={signup ? 'Cadastrar' : 'Entrar'} icon={signup ? 'person-add-outline' : 'log-in-outline'} busy={busy} onPress={submit} />
      </Card>
      <Action label={signup ? 'Já tenho conta' : 'Criar conta'} variant="secondary"
        disabled={busy} onPress={() => signup ? (navigation.canGoBack() ? navigation.goBack() : navigation.replace('Login')) : navigation.navigate('Cadastro')} />
    </Page>
  );
}

const styles = StyleSheet.create({
  brand: { gap: 6, overflow: 'hidden', minHeight: 176, borderRadius: 24, backgroundColor: colors.navy, padding: 18, justifyContent: 'center' },
  image: { position: 'absolute', top: 0, right: 0, width: '100%', height: '100%' },
  logo: { width: 43, height: 43, borderRadius: 12, marginBottom: 3 },
  brandName: { color: colors.paper, fontFamily: font.heavy, fontSize: 29, letterSpacing: -1 },
  brandDescription: { color: '#D3E2EA', fontFamily: font.medium, lineHeight: 20, maxWidth: 220, fontSize: 14 },
});
