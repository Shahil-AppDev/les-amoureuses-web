import { Platform } from 'react-native';
import { SITE } from '../constants/theme';
import type { CartItem, Variation } from './types';

const BASE = `${SITE.api}/wc/store/v1`;

// La Store API est bloquée en CORS cross-origin côté navigateur (ACAO absent des
// réponses GET/POST). Sur web, le parcours hébergé WooCommerce reste la voie de
// secours officielle : add-to-cart GET + panier/checkout hébergés (Paybox).
export const hosted = {
  addToCart: (productId: number, quantity = 1, variationId?: number) =>
    `${SITE.fr}/?add-to-cart=${variationId ?? productId}&quantity=${quantity}`,
  cart: `${SITE.fr}/panier/`,
  checkout: `${SITE.fr}/commande/`,
};

const storage = {
  get(key: string): string | null {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') return localStorage.getItem(key);
    return mem[key] ?? null;
  },
  set(key: string, value: string) {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    else mem[key] = value;
  },
};
const mem: Record<string, string> = {};

let nonce: string | null = storage.get('wc_nonce');
let cartToken: string | null = storage.get('wc_cart_token');

function captureHeaders(res: Response) {
  const n = res.headers.get('Nonce');
  const t = res.headers.get('Cart-Token');
  if (n) { nonce = n; storage.set('wc_nonce', n); }
  if (t) { cartToken = t; storage.set('wc_cart_token', t); }
}

async function request(path: string, init: RequestInit = {}, retry = true): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (nonce) headers['Nonce'] = nonce;
  if (cartToken) headers['Cart-Token'] = cartToken;
  const res = await fetch(`${BASE}${path}`, { ...init, headers, credentials: 'include' });
  captureHeaders(res);
  if (res.status === 401 && retry) {
    nonce = null;
    await request('/cart', {}, false);
    return request(path, init, false);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Store API ${res.status}`);
  }
  return res.json();
}

export interface StoreCart {
  itemsCount: number;
  items: CartItem[];
  total: number;
  currency: string;
}

function mapCart(c: any): StoreCart {
  return {
    itemsCount: c.items_count ?? 0,
    items: (c.items || []).map((i: any) => ({
      key: i.key,
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: parseInt(i.prices?.price ?? '0', 10) / 100,
      image: i.images?.[0]?.thumbnail ?? i.images?.[0]?.src ?? null,
    })),
    total: parseInt(c.totals?.total_price ?? '0', 10) / 100,
    currency: c.totals?.currency_code ?? 'EUR',
  };
}

export const storeApi = {
  async getCart(): Promise<StoreCart> {
    return mapCart(await request('/cart'));
  },
  async addItem(id: number, quantity = 1, variationId?: number): Promise<StoreCart> {
    // A variation is added directly via its own product id in the Store API
    return mapCart(await request('/cart/add-item', {
      method: 'POST',
      body: JSON.stringify({ id: variationId ?? id, quantity }),
    }));
  },
  async updateItem(key: string, quantity: number): Promise<StoreCart> {
    return mapCart(await request('/cart/update-item', { method: 'POST', body: JSON.stringify({ key, quantity }) }));
  },
  async removeItem(key: string): Promise<StoreCart> {
    return mapCart(await request('/cart/remove-item', { method: 'POST', body: JSON.stringify({ key }) }));
  },
  async getVariation(id: number): Promise<Variation> {
    const v = await request(`/products/${id}`);
    return {
      id: v.id,
      price: parseInt(v.prices?.price ?? '0', 10) / 100,
      attributes: (v.attributes || []).map((a: any) => ({ name: a.name, value: a.value })),
      inStock: v.is_in_stock !== false,
    };
  },
  async getProduct(slug: string) {
    const list = await request(`/products?slug=${encodeURIComponent(slug)}`);
    return Array.isArray(list) ? list[0] : null;
  },
  async checkout(input: {
    billing: Record<string, string>;
    shipping: Record<string, string>;
    note?: string;
  }): Promise<{ redirectUrl: string | null; orderId: number }> {
    const res = await request('/checkout', {
      method: 'POST',
      body: JSON.stringify({
        billing_address: input.billing,
        shipping_address: input.shipping,
        payment_method: 'paybox_std',
        customer_note: input.note ?? '',
        create_account: false,
      }),
    });
    const details = res.payment_result?.payment_details || {};
    const redirect =
      details.redirect || details.redirect_url || details.payment_url ||
      res.payment_result?.redirect_url || null;
    return { redirectUrl: redirect, orderId: res.order_id ?? 0 };
  },
};
