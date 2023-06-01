import { Field, ObjectType } from '@nestjs/graphql';
import { Status, Visibility } from 'src/types/graphql';

@ObjectType()
export class ProjectUpdateOutput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Status)
  status: Status;

  @Field(() => Visibility)
  visibility: Visibility;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [String])
  columnsOrder: string[];
}
