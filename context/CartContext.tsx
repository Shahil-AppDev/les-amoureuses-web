import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { storeApi, type StoreCart } from '../lib/store-api';

interface CartState {
  cart: StoreCart | null;
  loading: boolean;
  error: string | null;
  add: (id: number, quantity?: number, variationId?: number) => Promise<void>;
  update: (key: string, quantity: number) => Promise<void>;
  remove: (key: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<CartState>({
  cart: null, loading: true, error: null,
  add: async () => {}, update: async () => {}, remove: async () => {}, refresh: async () => {},
});
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (fn: () => Promise<StoreCart>) => {
    try {
      setError(null);
      setCart(await fn());
    } catch (e: any) {
      setError(e.message ?? 'Cart error');
    }
  }, []);

  const refresh = useCallback(() => run(() => storeApi.getCart()), [run]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  return (
    <Ctx.Provider
      value={{
        cart, loading, error,
        add: (id, q, v) => run(() => storeApi.addItem(id, q ?? 1, v)),
        update: (k, q) => run(() => storeApi.updateItem(k, q)),
        remove: (k) => run(() => storeApi.removeItem(k)),
        refresh,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
