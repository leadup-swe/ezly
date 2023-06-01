import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CollaboratorAddInput {
  @Field()
  userId: string;

  @Field()
  projectId: string;
}
