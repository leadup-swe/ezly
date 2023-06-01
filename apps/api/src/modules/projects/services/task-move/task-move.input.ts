import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TaskMoveInput {
  @Field()
  projectId: string;

  @Field()
  sourceColumnId: string;

  @Field()
  sourceIndex: number;

  @Field()
  destinationColumnId: string;

  @Field()
  destinationIndex: number;
}
