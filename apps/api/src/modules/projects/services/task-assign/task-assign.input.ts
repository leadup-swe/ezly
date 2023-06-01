import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TaskAssignInput {
  @Field()
  taskId: string;

  @Field()
  userId: string;
}
