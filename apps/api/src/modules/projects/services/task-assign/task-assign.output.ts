import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaskAssignOutput {
  @Field()
  taskId: string;

  @Field()
  userId: string;
}
