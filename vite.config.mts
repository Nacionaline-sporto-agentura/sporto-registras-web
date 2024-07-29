import { default as react } from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { manifestForPlugIn } from './manifest';
import {NodeGlobalsPolyfillPlugin} from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from 'rollup-plugin-node-polyfills';

const nodePolyfillsPlugin: any = nodePolyfills();


export default () => {
  const env = loadEnv('all', process.cwd());

  return defineConfig({
    plugins: [react(), VitePWA(manifestForPlugIn(env.VITE_BASE_URL) as Partial<VitePWAOptions>)],
    resolve: {
      alias: {
        buffer: 'buffer',
        util: 'util',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true
          })
        ]
      }
    },
    build: {
      rollupOptions: {
        plugins: [
          nodePolyfillsPlugin,
        ],
      },
    },
    base: env.VITE_BASE_URL,
    server: {
      proxy: {
        open: env.VITE_BASE_URL,
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
