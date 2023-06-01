import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ColumnCreateInput {
  @Field()
  projectId: string;

  @Field()
  name: string;
}
