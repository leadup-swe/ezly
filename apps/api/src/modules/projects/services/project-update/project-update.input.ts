import { Field, InputType } from '@nestjs/graphql';
import { Status, Visibility } from 'src/types/graphql';

@InputType()
export class ProjectUpdateInput {
  @Field()
  projectId: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Visibility, { nullable: true })
  visibility?: Visibility;

  @Field(() => Status, { nullable: true })
  status?: Status;
}
