import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import fs = require('fs');
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { extractAllErrors } from './helper/validation';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
dotenv.config();
const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const swaggerPrefix: string | null = config.get<string>('SWAGGER_PREFIX') ?? null;
  // const httpAdapter = app.get(HttpAdapterHost); 
  app.setGlobalPrefix('api');

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors) => {
        const errors = validationErrors.map((value) => {
          return extractAllErrors(value);
        });
        return new UnprocessableEntityException(...errors);
      },
    }),
  );  

  const port: number = config.get<number>('PORT') || 3000;
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The API description')
      .setVersion(json.version)
      .addServer('/')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPrefix || '/docs', app, document);
  }

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(app.get(Reflector)),
  // );

  await app.listen(port, '0.0.0.0');
}
bootstrap();
