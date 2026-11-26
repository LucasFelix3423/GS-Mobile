import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View, type ColorValue, type TextInputProps } from 'react-native';
import { colors, font } from '@/styles/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Icon({ name, size = 22, color = colors.teal }: { name: IconName; size?: number; color?: ColorValue }) {
  const iconColor = typeof color === 'number' ? colors.teal : color ?? colors.teal;
  return <Ionicons name={name} size={size} color={iconColor} accessible={false} aria-hidden />;
}

export function Page({ children, refresh, refreshing = false }: { children: ReactNode; refresh?: () => void; refreshing?: boolean }) {
  const focused = useIsFocused();
  return (
    <ScrollView
      style={[styles.page, Platform.OS === 'web' && !focused && styles.hidden]}
      contentContainerStyle={styles.body}
      accessibilityElementsHidden={!focused}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      aria-hidden={!focused}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      refreshControl={refresh ? <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.teal} /> : undefined}>
      {children}
    </ScrollView>
  );
}

export function Heading({ title, description }: { title: string; description?: string }) {
  return (
    <View style={styles.heading}>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text accessibilityRole="header" style={styles.sectionTitle}>{children}</Text>;
}

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function Action({ label, onPress, icon, variant = 'primary', busy = false, disabled = false }: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'danger';
  busy?: boolean;
  disabled?: boolean;
}) {
  const primary = variant === 'primary';
  const tint = primary ? colors.paper : variant === 'danger' ? colors.red : colors.tealDark;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [styles.button, primary && styles.primary, variant === 'danger' && styles.danger,
        (pressed || disabled || busy) && styles.pressed]}>
      {busy ? <ActivityIndicator color={tint} /> : icon && <Icon name={icon} color={tint} size={19} />}
      <Text style={[styles.buttonText, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} style={styles.input} {...props} />
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function Feedback({ message, kind = 'error' }: { message: string; kind?: 'error' | 'info' }) {
  if (!message) return null;
  const info = kind === 'info';
  const tint = info ? colors.tealDark : colors.red;
  return (
    <View style={[styles.feedback, { backgroundColor: info ? colors.paleMint : colors.paleRed }]}>
      <Icon name={info ? 'information-circle-outline' : 'alert-circle-outline'} color={tint} size={20} />
      <Text accessibilityRole={info ? undefined : 'alert'} accessibilityLiveRegion="polite" style={[styles.feedbackText, { color: tint }]}>
        {message}
      </Text>
    </View>
  );
}

export function Loading({ label = 'Carregando…' }: { label?: string }) {
  return (
    <View style={styles.loading} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.teal} size="small" />
      <Text style={styles.description}>{label}</Text>
    </View>
  );
}

export function ResourceState({ loading, error, retry }: { loading: boolean; error: string; retry: () => void }) {
  if (loading) return <Loading />;
  return error ? <Card><Feedback message={error} /><Action label="Tentar novamente" onPress={retry} variant="secondary" /></Card> : null;
}

export function Empty({ icon, title, description, action }: { icon: IconName; title: string; description: string; action?: ReactNode }) {
  return (
    <Card>
      <Icon name={icon} size={26} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {action}
    </Card>
  );
}

export const shared = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  grow: { flex: 1 },
  group: { gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  text: { color: colors.text, fontFamily: font.regular, fontSize: 15, lineHeight: 22 },
  muted: { color: colors.muted, fontFamily: font.medium, fontSize: 14, lineHeight: 21 },
  label: { color: colors.text, fontFamily: font.bold, fontSize: 15, lineHeight: 21 },
});

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  hidden: { display: 'none' },
  body: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 23, paddingBottom: 32, gap: 18 },
  heading: { gap: 6 },
  title: { color: colors.navy, fontFamily: font.heavy, fontSize: 31, lineHeight: 38, letterSpacing: -1.15 },
  description: { color: colors.muted, fontFamily: font.medium, fontSize: 15, lineHeight: 22 },
  sectionTitle: { color: colors.navy, fontFamily: font.heavy, fontSize: 19, lineHeight: 25, letterSpacing: -0.25 },
  card: { padding: 16, gap: 12, backgroundColor: colors.paper, borderColor: colors.border, borderWidth: 1, borderRadius: 19 },
  button: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8, minHeight: 50, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.paleMint },
  primary: { backgroundColor: colors.teal },
  danger: { backgroundColor: colors.paleRed },
  pressed: { opacity: 0.68 },
  buttonText: { fontFamily: font.heavy, fontSize: 14, lineHeight: 20, textAlign: 'center', flexShrink: 1 },
  field: { gap: 7 },
  label: { color: colors.text, fontFamily: font.bold, fontSize: 14, lineHeight: 20 },
  input: { minHeight: 51, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.paper, borderRadius: 12, fontFamily: font.medium, fontSize: 16, color: colors.text },
  chip: { minHeight: 44, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 99, justifyContent: 'center', backgroundColor: colors.paper, borderColor: colors.border, borderWidth: 1 },
  chipSelected: { borderColor: colors.teal, backgroundColor: colors.teal },
  chipText: { color: colors.text, fontFamily: font.bold, fontSize: 13, lineHeight: 18 },
  chipTextSelected: { color: colors.paper },
  feedback: { alignItems: 'flex-start', flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12 },
  feedbackText: { flex: 1, fontFamily: font.bold, fontSize: 13, lineHeight: 19 },
  loading: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
