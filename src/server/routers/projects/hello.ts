import { procedure } from 'src/server/trpc';

export const hello = procedure.query(() => {
  return { hello: 'world' };
});
