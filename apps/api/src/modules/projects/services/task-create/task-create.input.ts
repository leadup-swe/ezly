import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TaskCreateInput {
  @Field()
  columnId: string;
}
