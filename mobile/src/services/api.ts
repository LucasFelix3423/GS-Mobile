import { create as createAxios, isAxiosError, type AxiosRequestConfig } from 'axios';

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

const defaultApiUrl = 'https://alerta-bairro-gs262.azurewebsites.net';
const baseUrl = (process.env.EXPO_PUBLIC_API_URL || defaultApiUrl).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export const apiClient = createAxios({
  baseURL: `${baseUrl}/api`,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const serverMessage =
        typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string'
          ? data.message
          : '';
      const messages: Record<number, string> = {
        401: 'Sua sessão expirou. Entre novamente.',
        404: 'Este registro não está mais disponível.',
        429: 'Muitas tentativas. Aguarde um minuto e tente novamente.',
      };
      return Promise.reject(new ApiError(status, serverMessage || messages[status] || 'Ocorreu um erro. Tente novamente.'));
    }
    return Promise.reject(new ApiError(0, 'Não foi possível conectar. Verifique sua conexão e tente novamente.'));
  },
);

async function request<T>(
  path: string,
  options: { token?: string; method?: AxiosRequestConfig['method']; body?: object } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.token) headers.Authorization = 'Bearer ' + options.token;
  if (options.body) headers['Content-Type'] = 'application/json';
  const response = await apiClient.request<T>({
    url: path,
    method: options.method ?? 'GET',
    headers,
    data: options.body,
  });
  return response.status === 204 ? (undefined as T) : response.data;
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
