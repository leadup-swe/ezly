import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ProjectGetColumnOutput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [String])
  taskOrder: string[];
}

@ObjectType()
class ProjectGetTaskOutput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  subTaskCount: number;

  @Field(() => [String])
  assigneesIds: string[];
}

@ObjectType()
export class ProjectGetOutput {
  @Field()
  title: string;

  @Field(() => [String])
  columnsOrder: string[];

  @Field(() => [ProjectGetColumnOutput])
  columns: ProjectGetColumnOutput[];

  @Field(() => [ProjectGetTaskOutput])
  tasks: ProjectGetTaskOutput[];

  @Field(() => [String])
  collaboratorsIds: string[];
}
