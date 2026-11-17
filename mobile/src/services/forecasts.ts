import type { AlertType, ForecastAlert, Severity } from './api';

export const alertTypes: Record<AlertType, { label: string; icon: 'water-outline' | 'trail-sign-outline' | 'flame-outline' | 'sunny-outline' }> = {
  flood: { label: 'Enchente', icon: 'water-outline' },
  landslide: { label: 'Deslizamento', icon: 'trail-sign-outline' },
  fire: { label: 'Incêndio', icon: 'flame-outline' },
  heat: { label: 'Onda de calor', icon: 'sunny-outline' },
};

export const severityLabels: Record<Severity, string> = { high: 'Risco alto', moderate: 'Risco moderado' };

export function sortedAlerts(alerts: ForecastAlert[]) {
  const ranks: Record<Severity, number> = { high: 0, moderate: 1 };
  return [...alerts].sort((first, second) =>
    ranks[first.severity] - ranks[second.severity] || first.startsAt.localeCompare(second.startsAt));
}

export function formatAlertTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}
