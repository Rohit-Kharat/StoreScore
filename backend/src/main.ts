import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ensureDatabaseExists } from './database/init-db';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function bootstrap() {
  // Load environment variables early
  dotenv.config({ path: path.join(__dirname, '../.env') });

  // Make sure database exists
  await ensureDatabaseExists();

  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration
  app.enableCors({
    origin: '*', // For development, allow any origin. In production, restrict this.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`NestJS server is running on: http://localhost:${port}`);
}
bootstrap();
