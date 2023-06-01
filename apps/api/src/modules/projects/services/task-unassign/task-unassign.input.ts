import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TaskUnassignInput {
  @Field()
  taskId: string;

  @Field()
  userId: string;
}
