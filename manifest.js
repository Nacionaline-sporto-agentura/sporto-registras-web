const VITE_BASE_URL = import.meta.env?.VITE_BASE_URL || '/';

export const manifestForPlugIn = {
  registerType: 'autoUpdate',
  includeAssests: ['favicon.ico', 'apple-touc-icon.png', 'masked-icon.svg'],
  workbox: {
    navigateFallbackDenylist: [/^\/(api|auth)\/.*/],
  },
  manifest: {
    name: 'Sporto Registras',
    short_name: 'Sporto Registras',
    description: 'Sporto Registras',
    icons: [
      {
        src: `${VITE_BASE_URL}/android-chrome-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'favicon',
      },
      {
        src: `${VITE_BASE_URL}/android-chrome-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'favicon',
      },
      {
        src: `${VITE_BASE_URL}/apple-touch-icon.png`,
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple touch icon',
      },
      {
        src: `${VITE_BASE_URL}/maskable_icon.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    theme_color: '#171717',
    background_color: '#0a1353',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
  },
};
