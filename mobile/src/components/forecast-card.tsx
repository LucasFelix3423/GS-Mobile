import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { type ForecastAlert, type Severity } from '@/services/api';
import { alertTypes, severityLabels } from '@/services/forecasts';
import { colors, font } from '@/styles/theme';
import { Icon, shared } from './ui';

export function RiskBadge({ severity }: { severity: Severity }) {
  const high = severity === 'high';
  return (
    <View style={[styles.badge, { backgroundColor: high ? colors.paleRed : colors.paleAmber }]}>
      <Text style={[styles.badgeLabel, { color: high ? colors.red : colors.amber }]}>{severityLabels[severity]}</Text>
    </View>
  );
}

export function ForecastCard({ alert, onPress }: { alert: ForecastAlert; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.icon}><Icon name={alertTypes[alert.type].icon} /></View>
      <View style={styles.rowText}>
        <Text style={shared.label}>{alert.title}</Text>
        <Text style={shared.muted}>{alert.neighborhood}</Text>
        <RiskBadge severity={alert.severity} />
      </View>
      <Icon name="chevron-forward" size={17} color={colors.muted} />
    </Pressable>
  );
}

export function ForecastHero({ alert, onPress }: { alert?: ForecastAlert; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.hero, pressed && styles.pressed]}>
      <Image source={require('../../assets/images/forecast.png')} style={styles.heroImage} resizeMode="cover" accessible={false} />
      <View style={styles.heroContent}>
        {alert ? <RiskBadge severity={alert.severity} /> :
          <Text style={styles.heroLabel}>ALERTAS DO BAIRRO</Text>}
        <Text style={styles.heroTitle}>{alert?.title ?? 'Acompanhe o risco na sua região'}</Text>
        <Text style={styles.heroDescription}>{alert ? alert.neighborhood + ' · São Paulo' : 'Veja os cenários disponíveis para São Paulo.'}</Text>
        <View style={shared.row}>
          <Text style={styles.heroLink}>{alert ? 'Ver detalhes' : 'Explorar alertas'}</Text>
          <Icon name="arrow-forward" size={17} color={colors.mint} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 4 },
  badgeLabel: { fontFamily: font.heavy, fontSize: 12, lineHeight: 16 },
  row: { backgroundColor: colors.paper, borderColor: colors.border, borderWidth: 1, borderRadius: 17, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, minHeight: 91 },
  rowText: { flex: 1, gap: 3 },
  icon: { height: 42, width: 42, backgroundColor: colors.paleMint, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.77 },
  hero: { minHeight: 190, borderRadius: 23, backgroundColor: colors.navy, overflow: 'hidden', justifyContent: 'center' },
  heroImage: { position: 'absolute', top: 0, right: 0, width: '100%', height: '100%' },
  heroContent: { padding: 19, gap: 8, width: '75%' },
  heroLabel: { color: colors.mint, fontFamily: font.heavy, fontSize: 10, letterSpacing: 1.2 },
  heroTitle: { color: colors.paper, fontFamily: font.heavy, fontSize: 24, lineHeight: 28, letterSpacing: -0.65 },
  heroDescription: { color: '#D3E2EA', fontFamily: font.medium, fontSize: 13, lineHeight: 19 },
  heroLink: { color: colors.mint, fontFamily: font.heavy, fontSize: 13, lineHeight: 20 },
});
