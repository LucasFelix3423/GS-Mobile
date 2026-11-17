import { Platform } from 'react-native';

export type Profile = { id: string; name: string; email: string };
export type Session = { token: string; user: Profile; expiresAt: string };
export type Neighborhood = { id: string; name: string; zone: string };
export type PlaceInput = { name: string; neighborhoodId: string };
export type Place = PlaceInput & { id: string; neighborhood: string };
export type Severity = 'high' | 'moderate';
export type AlertType = 'flood' | 'landslide' | 'fire' | 'heat';
export type ForecastAlert = {
  id: string;
  neighborhoodId: string;
  neighborhood: string;
  type: AlertType;
  severity: Severity;
  title: string;
  description: string;
  guidance: string;
  startsAt: string;
  endsAt: string;
  simulated: boolean;
};

const localUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5075' : 'http://127.0.0.1:5075';
const baseUrl = (process.env.EXPO_PUBLIC_API_URL || localUrl).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, options: { token?: string; method?: string; body?: object } = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.token) headers.Authorization = 'Bearer ' + options.token;
  if (options.body) headers['Content-Type'] = 'application/json';
  let response: Response;
  try {
    response = await fetch(baseUrl + '/api' + path, {
      method: options.method ?? 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar. Verifique sua conexão e tente novamente.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const messages: Record<number, string> = {
      401: 'Sua sessão expirou. Entre novamente.',
      404: 'Este registro não está mais disponível.',
      429: 'Muitas tentativas. Aguarde um minuto e tente novamente.',
    };
    throw new ApiError(response.status, body?.message || messages[response.status] || 'Ocorreu um erro. Tente novamente.');
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export const api = {
  login: (email: string, password: string) => request<Session>('/auth/login', { method: 'POST', body: { email, password } }),
  signup: (name: string, email: string, password: string) => request<Session>('/auth/signup', { method: 'POST', body: { name, email, password } }),
  me: (token: string) => request<Profile>('/auth/me', { token }),
  logout: (token: string) => request<void>('/auth/logout', { token, method: 'POST' }),
  neighborhoods: (token: string) => request<Neighborhood[]>('/neighborhoods', { token }),
  places: (token: string) => request<Place[]>('/places', { token }),
  place: (token: string, id: string) => request<Place>('/places/' + encodeURIComponent(id), { token }),
  createPlace: (token: string, body: PlaceInput) => request<Place>('/places', { token, method: 'POST', body }),
  updatePlace: (token: string, id: string, body: PlaceInput) => request<Place>('/places/' + encodeURIComponent(id), { token, method: 'PUT', body }),
  deletePlace: (token: string, id: string) => request<void>('/places/' + encodeURIComponent(id), { token, method: 'DELETE' }),
  alerts: (token: string) => request<ForecastAlert[]>('/alerts', { token }),
  alert: (token: string, id: string) => request<ForecastAlert>('/alerts/' + encodeURIComponent(id), { token }),
};
