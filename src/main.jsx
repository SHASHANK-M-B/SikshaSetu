import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Check this line!
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

// Render the app first
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Register PWA logic after rendering
const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new Event('swUpdated'));
  },
  onOfflineReady() {
    console.log("SikhaSetu is ready for offline use! 🚀");
  }
});

// Global function for your attractive PWAPrompt.jsx
window.forceSWUpdate = () => updateSW(true);