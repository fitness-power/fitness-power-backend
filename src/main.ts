import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './filters/CustomExceptionFilter';
import { ValidationPipe } from '@nestjs/common';
import { configDotenv } from 'dotenv';
import fastifyMultipart from '@fastify/multipart';
import cors from '@fastify/cors';

configDotenv({ path: './src/config/config.env' });
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      rawBody: true,
    },
  );
  await app.register(cors, {
    origin: [
      process.env.FRONTEND_URL,
      'https://egypt-tours-backend.onrender.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 1024 * 1024 * Number(process.env.MAX_FILE_SIZE),
    },
  });

  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
    console.log('listening on port ' + process.env.PORT);
  });
}
bootstrap();
