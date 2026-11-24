export type Lang = 'fr' | 'en';

export interface Product {
  id: number;
  slug: string;
  name: string;
  type: 'simple' | 'variable' | string;
  price: number;
  categories: string[];
  image: string | null;
  thumb: string | null;
  images: string[];
  attributes: { name: string; terms: string[] }[];
  variationIds: number[];
  inStock: boolean;
  purchasable: boolean;
  description?: string;
}

export interface Variation {
  id: number;
  price: number;
  attributes: { name: string; value: string }[];
  inStock: boolean;
}

export interface Post {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  image: string | null;
}

export interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string | null;
}

export interface Activity {
  id: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  duration?: string;
  priceFrom: number;
  ellohaId: string;
}
