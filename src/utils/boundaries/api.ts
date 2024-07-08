import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from './schema';

const throwOnError: Middleware = {
  async onResponse({ response }) {
    if (response.status >= 400) {
      const body = response.headers.get('content-type')?.includes('json')
        ? await response.clone().json()
        : await response.clone().text();
      throw new Error(body);
    }
    return undefined;
  },
};

export const BoundariesClient = createClient<paths>({
  baseUrl: '/api/boundaries',
});

BoundariesClient.use(throwOnError);