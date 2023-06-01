import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RestCtx = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const payload = context.switchToHttp().getRequest().user;

    return {
      userId: payload?.userId,
      orgId: payload?.orgId,
    };
  },
);
