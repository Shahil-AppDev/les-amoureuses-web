import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { Lang } from '../lib/types';

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  ageVerified: boolean | null;
  verifyAge: (ok: boolean) => void;
}

const Ctx = createContext<AppState>({ lang: 'fr', setLang: () => {}, ageVerified: null, verifyAge: () => {} });
export const useApp = () => useContext(Ctx);

const storage = {
  get(k: string) {
    try { return Platform.OS === 'web' ? localStorage.getItem(k) : null; } catch { return null; }
  },
  set(k: string, v: string) {
    try { if (Platform.OS === 'web') localStorage.setItem(k, v); } catch {}
  },
};

let memAge: string | null = null;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const v = Platform.OS === 'web' ? storage.get('la_age_ok') : memAge;
    setAgeVerified(v === '1');
  }, []);

  const verifyAge = (ok: boolean) => {
    setAgeVerified(ok);
    if (ok) {
      storage.set('la_age_ok', '1');
      memAge = '1';
    }
  };

  return <Ctx.Provider value={{ lang, setLang, ageVerified, verifyAge }}>{children}</Ctx.Provider>;
}
