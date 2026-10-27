import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (erros) => new BadRequestException(erros.flatMap((erro) => Object.values(erro.constraints ?? {}))),
  }));
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
