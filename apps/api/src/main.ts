import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({ origin: [`http://localhost:3000`, `https://studio.apollographql.com`], credentials: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
