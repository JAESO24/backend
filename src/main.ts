import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ AJOUTE ÇA POUR AUTORISER LE FRONTEND
  app.enableCors({
    origin: 'http://localhost:5173', // Port par défaut de Vite/React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(3000);
  console.log('Backend en écoute sur http://localhost:3000');
}
bootstrap();