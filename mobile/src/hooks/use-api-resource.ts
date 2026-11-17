import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useAuth } from '@/state/auth';

export function useApiResource<T>(load: (token: string) => Promise<T>) {
  const { authorized } = useAuth();
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<T>();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(true);
  const [completedRevision, setCompletedRevision] = useState(-1);

  useFocusEffect(useCallback(() => {
    let active = true;
    setPending(true);
    setError('');
    authorized(load).then(
      value => { if (active) setData(value); },
      failure => { if (active) setError(failure.message); },
    ).finally(() => {
      if (active) {
        setCompletedRevision(revision);
        setPending(false);
      }
    });
    return () => { active = false; };
  }, [authorized, load, revision]));

  return { data, error, loading: pending || completedRevision !== revision, refresh: () => setRevision(value => value + 1) };
}
