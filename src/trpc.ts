import { createTRPCNext } from '@trpc/next';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { TRPCRouter } from './pages/api/trpc/[trpc]';

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCNext<TRPCRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      },
    };
  },
});

export const trpcClient = createTRPCProxyClient<TRPCRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
