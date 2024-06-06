import { default as react } from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default () => {
  const env = loadEnv('all', process.cwd());

  return defineConfig({
    plugins: [react()],
    base: env.VITE_BASE_URL,
    server: {
      proxy: {
        '/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    assetsInclude: ['**/*.png'],
  });
};
