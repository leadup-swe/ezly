import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaskCreateOutput {
  @Field()
  taskId: string;

  @Field()
  columnId: string;
}
