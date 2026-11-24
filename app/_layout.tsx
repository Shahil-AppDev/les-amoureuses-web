import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </AppProvider>
  );
}
