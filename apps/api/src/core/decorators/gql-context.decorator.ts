import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

type SelectionsItem = {
  name: {
    value: unknown;
  };
};

export const GqlCtx = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const payload = GqlExecutionContext.create(context).getContext().req.user;

    const queryFields: unknown[] = GqlExecutionContext.create(context)
      .getInfo()
      .fieldNodes[0].selectionSet?.selections.map(
        (item: SelectionsItem) => item.name.value,
      );

    return {
      userId: payload?.userId,
      orgId: payload?.orgId,
      query: queryFields,
    };
  },
);
