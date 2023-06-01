import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TaskGetInput {
  @Field()
  taskId: string;
}
