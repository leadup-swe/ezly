import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { ClerkService } from './clerk/clerk.service';

@Module({
  providers: [PrismaService, ClerkService],
  exports: [PrismaService, ClerkService],
})
export class CoreModule {}
