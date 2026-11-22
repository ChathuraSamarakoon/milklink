import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/tokens.css';
import './styles/globals.css';
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

// Static app-shell service worker registration (production only).
if (import.meta.env.PROD && 'serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); }); }
