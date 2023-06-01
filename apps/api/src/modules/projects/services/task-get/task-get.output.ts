import { Field, ObjectType } from '@nestjs/graphql';
import { Status } from 'src/types/graphql';

@ObjectType()
export class TaskGetOutput {
  @Field()
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  columnId: string;

  @Field({ nullable: true })
  deadline: Date;

  @Field(() => Status)
  status: Status;

  @Field(() => [String])
  assigneesIds: string[];

  @Field(() => [String])
  subTasksOrder: string[];

  @Field()
  createdBy: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
