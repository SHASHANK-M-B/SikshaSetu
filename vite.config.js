import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // ----------------------------
    // ✅ PWA Plugin Added Here
    // ----------------------------
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // allow large JS bundles
      },
      manifest: {
        name: 'RemoteClass For RuralArea',
        short_name: 'RemoteClass',
        description: 'Learning platform for rural areas',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'image/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'image/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'image/pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],

  // REQUIRED for @ imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // REQUIRED for loading .glb + .png textures (R3F)
  assetsInclude: ['**/*.glb', '**/*.png'],

  // Fix import issues with react-three modules
  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/rapier',
      'meshline',
    ],
  }
})
