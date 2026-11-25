import React from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Domaine Les Amoureuses</title>
        <meta name="description" content="Domaine viticole bio & biodynamique en Ardèche — vins, œnotourisme, événements." />
        <script dangerouslySetInnerHTML={{ __html: `
          (function () {
            var seg = location.pathname.split('/')[1]; var base = seg ? '/' + seg + '/' : '/';
            var m = document.createElement('link');
            m.rel = 'manifest';
            m.href = base + 'manifest.webmanifest';
            document.head.appendChild(m);
          })();
        `}} />
        <meta name="theme-color" content="#24251E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: `
          body { background: #F4EFE5; }
          a:focus-visible, button:focus-visible, [role="button"]:focus-visible {
            outline: 2px solid #B26F4B;
            outline-offset: 3px;
          }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
          }
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            window.addEventListener('load', function () {
              var seg = location.pathname.split('/')[1]; var base = seg ? '/' + seg + '/' : '/';
              navigator.serviceWorker.register(base + 'service-worker.js', { scope: base }).catch(function () {});
            });
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
