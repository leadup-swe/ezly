import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TaskUpdateInput {
  @Field()
  taskId: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}
