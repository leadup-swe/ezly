import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ColumnDeleteInput {
  @Field()
  columnId: string;
}
