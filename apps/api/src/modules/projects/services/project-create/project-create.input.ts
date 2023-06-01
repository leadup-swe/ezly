import { Field, InputType } from '@nestjs/graphql';
import { Visibility } from 'src/types/graphql';

@InputType()
export class ProjectCreateInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Visibility, { nullable: true })
  visibility: Visibility;
}
