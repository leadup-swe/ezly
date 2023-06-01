import { initTRPC } from '@trpc/server';
import { TCtx } from './core/ctx';
import SuperJSON from 'superjson';
import { ZodError } from 'zod';

const t = initTRPC.context<TCtx>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const procedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;
