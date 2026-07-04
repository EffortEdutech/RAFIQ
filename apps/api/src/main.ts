import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import { HttpExceptionFilter } from './modules/common/http-exception.filter.js';
import { RequestLoggingInterceptor } from './modules/common/request-logging.interceptor.js';
import { AppModule } from './modules/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((request: any, response: any, next: () => void) => {
    const incomingRequestId = request.headers['x-request-id'];
    const requestId = Array.isArray(incomingRequestId)
      ? incomingRequestId[0]
      : incomingRequestId || randomUUID();
    request.requestId = requestId;
    response.setHeader('x-request-id', requestId);
    next();
  });
  app.enableCors({
    origin: [
      'http://127.0.0.1:8057',
      'http://localhost:8057',
    ],
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor());

  const openApiDocument = SwaggerModule.createDocument(
    app as any,
    new DocumentBuilder()
      .setTitle('RAFIQ Private API')
      .setDescription('Private product API over the locked-down private_api database RPC contract. Content is not approved for public release.')
      .setVersion('0.1.0')
      .addTag('health')
      .addTag('private-content')
      .build(),
  );
  SwaggerModule.setup('api/docs', app as any, openApiDocument);
  app.getHttpAdapter().get('/api/openapi.json', (_request: any, response: any) => {
    response.json(openApiDocument);
  });

  const host = process.env.RAFIQ_API_HOST ?? '127.0.0.1';
  const port = Number(process.env.RAFIQ_API_PORT ?? 8056);

  await app.listen(port, host);
}

void bootstrap();
