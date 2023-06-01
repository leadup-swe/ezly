import { Injectable } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ModuleRef } from '@nestjs/core';
import { Service } from 'src/types';

@Injectable()
export abstract class ServiceFactory<U extends Service<unknown, unknown>> {
  constructor(protected readonly container: ModuleRef) {}

  async create<T extends U>(type: Type<T>): Promise<T> {
    return this.container.create(type);
  }
}
