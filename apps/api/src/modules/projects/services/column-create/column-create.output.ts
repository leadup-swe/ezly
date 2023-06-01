import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ColumnCreateOutput {
  @Field()
  columnId: string;
}
