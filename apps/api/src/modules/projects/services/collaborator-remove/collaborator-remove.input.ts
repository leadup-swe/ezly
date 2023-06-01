import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CollaboratorRemoveInput {
  @Field()
  userId: string;

  @Field()
  projectId: string;
}
