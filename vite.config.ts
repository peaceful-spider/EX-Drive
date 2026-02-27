import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      // Basic settings — makes your site installable
      registerType: 'autoUpdate',           // auto updates when new version is deployed
      devOptions: {
        enabled: true                       // lets you test PWA features in dev mode (localhost)
      },

      // Where to find manifest and icons
      includeAssets: [
        'favicon.ico',
        'icons/*.png',
        'apple-touch-icon.png',
        'screenshots/*.png'
      ],

      manifest: {
        name: 'ElgoraX Drive',
        short_name: 'ElgoraX',
        description: 'Secure, privacy-first cloud storage for everyone',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      // Basic offline caching (cache all built files)
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}']
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Keep your existing assetsInclude
  assetsInclude: ['**/*.svg', '**/*.csv'],
})