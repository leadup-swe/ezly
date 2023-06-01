import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CollaboratorAddOutput {
  @Field()
  id: string;

  @Field()
  projectId: string;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
