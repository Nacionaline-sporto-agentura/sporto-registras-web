export const manifestForPlugIn = (baseUrl) => {
  return {
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
          src: `${baseUrl}/android-chrome-192x192.png`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'favicon',
        },
        {
          src: `${baseUrl}/android-chrome-512x512.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'favicon',
        },
        {
          src: `${baseUrl}/apple-touch-icon.png`,
          sizes: '180x180',
          type: 'image/png',
          purpose: 'apple touch icon',
        },
        {
          src: `${baseUrl}/maskable_icon.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      theme_color: '#171717',
      background_color: '#0a1353',
      display: 'standalone',
      scope: '/app/',
      start_url: '/app/index.html',
      orientation: 'portrait',
    },
  };
};
