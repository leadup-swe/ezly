import { Field, ObjectType } from '@nestjs/graphql';
import { Status } from 'src/types/graphql';

@ObjectType()
export class TaskUpdateOutput {
  @Field()
  taskId: string;

  @Field()
  columnId: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  deadline?: Date;

  @Field(() => Status)
  status: Status;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  createdBy: string;

  @Field(() => [String])
  subTasksOrder: string[];
}
