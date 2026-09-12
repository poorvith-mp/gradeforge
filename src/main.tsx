import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Service Worker registration (production only)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (document.getElementById('pwa-update-toast')) return;
              const toast = document.createElement('div');
              toast.id = 'pwa-update-toast';
              toast.setAttribute('role', 'alert');
              toast.className = 'fixed bottom-4 right-4 z-50 p-3 bg-gray-900 text-white text-xs font-mono border border-gray-700 shadow-2xl flex items-center gap-3';
              toast.innerHTML = `
                <span>Update ready.</span>
                <button id="pwa-reload-btn" style="text-decoration: underline; cursor: pointer; font-weight: bold; background: none; border: none; color: #60a5fa;">Reload</button>
              `;
              document.body.appendChild(toast);
              document.getElementById('pwa-reload-btn')?.addEventListener('click', () => {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              });
            }
          });
        });
      })
      .catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
  });
}

