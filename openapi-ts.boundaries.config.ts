import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://registras.ltusportas.lt/api/boundaries/openapi.json',
  output: 'src/utils/boundaries',
  base: '/api/boundaries',
});