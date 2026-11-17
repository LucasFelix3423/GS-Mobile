import { deleteItemAsync, getItemAsync, setItemAsync, WHEN_UNLOCKED_THIS_DEVICE_ONLY } from 'expo-secure-store';
import { Platform } from 'react-native';

const key = 'alerta-bairro.session';

export const sessionStorage = {
  async read() {
    if (Platform.OS === 'web') return globalThis.sessionStorage.getItem(key);
    return getItemAsync(key);
  },
  async write(token: string) {
    if (Platform.OS === 'web') globalThis.sessionStorage.setItem(key, token);
    else await setItemAsync(key, token, { keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY });
  },
  async clear() {
    if (Platform.OS === 'web') globalThis.sessionStorage.removeItem(key);
    else await deleteItemAsync(key);
  },
};
