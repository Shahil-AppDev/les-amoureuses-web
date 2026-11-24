import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

const LOADER = 'https://reservation.elloha.com/Scripts/widget-loader.min.js?v=42';
let loaderPromise: Promise<void> | null = null;

function ensureLoader() {
  if (!loaderPromise) {
    loaderPromise = new Promise((resolve, reject) => {
      if ((window as any).constellationBookingButtonLoad) return resolve();
      const s = document.createElement('script');
      s.src = LOADER;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Elloha loader failed'));
      document.body.appendChild(s);
    });
  }
  return loaderPromise;
}

// Reproduces the elloha widget embed used on lesamoureuses.wine/oenotourisme
export function EllohaButton({ widgetId, idoi = '190471b7-b0ac-490e-b45e-66c74649caec', culture = 'fr-FR' }: {
  widgetId: string;
  idoi?: string;
  culture?: string;
}) {
  const containerId = `ConstellationButtonContainer${widgetId}`;
  const suffix = widgetId.replace(/-/g, '');
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    ensureLoader()
      .then(() => {
        (window as any)[`constellationWidgetUrl${suffix}`] =
          `https://reservation.elloha.com/Widget/BookingButton/${widgetId}?idoi=${idoi}&culture=${culture}`;
        (window as any)[`constellationTypeModule${suffix}`] = 3;
        (window as any).constellationBookingButtonLoad?.(containerId);
      })
      .catch(() => {});
  }, [widgetId]);

  return <View nativeID={containerId} style={{ minHeight: 46 }} />;
}
