import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError, api, type Profile, type Session } from '@/services/api';
import { sessionStorage } from '@/services/session-storage';

type Identity = { token: string; user: Profile };
type Auth = {
  identity: Identity | null;
  loading: boolean;
  startupError: string | null;
  restore: () => void;
  start: (session: Session) => Promise<void>;
  logout: () => Promise<void>;
  authorized: <T>(request: (token: string) => Promise<T>) => Promise<T>;
};

const AuthContext = createContext<Auth | null>(null);

async function readIdentity(): Promise<Identity | null> {
  const token = await sessionStorage.read();
  if (!token) return null;
  try {
    return { token, user: await api.me(token) };
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    await sessionStorage.clear();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [startupError, setStartupError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const clear = useCallback(async () => {
    await sessionStorage.clear();
    setIdentity(null);
  }, []);

  useEffect(() => {
    let active = true;
    readIdentity().then(value => {
      if (active) setIdentity(value);
    }, () => {
      if (active) setStartupError('Não foi possível verificar sua sessão. Tente de novo.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [attempt]);

  const retry = useCallback(() => {
    setLoading(true);
    setStartupError(null);
    setAttempt(value => value + 1);
  }, []);

  const start = useCallback(async (session: Session) => {
    await sessionStorage.write(session.token);
    setIdentity({ token: session.token, user: session.user });
  }, []);

  const authorized = useCallback(async <T,>(request: (token: string) => Promise<T>) => {
    if (!identity) throw new ApiError(401, 'Entre na sua conta novamente.');
    try {
      return await request(identity.token);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) await clear().catch(() => setIdentity(null));
      throw error;
    }
  }, [identity, clear]);

  const logout = useCallback(async () => {
    await authorized(api.logout);
    await clear();
  }, [authorized, clear]);

  const value = useMemo(() => ({ identity, loading, startupError, restore: retry, start, logout, authorized }),
    [identity, loading, startupError, retry, start, logout, authorized]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthProvider ausente.');
  return auth;
}
