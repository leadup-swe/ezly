import { registerEnumType } from '@nestjs/graphql';

export enum Visibility {
  PUBLIC = `PUBLIC`,
  PRIVATE = `PRIVATE`,
}
registerEnumType(Visibility, { name: `ProjectVisibility` });

export enum Status {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}
registerEnumType(Status, { name: `Status` });
