import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Configuración de pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }),
  ); 

  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  }); 

  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector), 
    {excludePrefixes: ['password']} 
  ));

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  const NODE_ENV = configService.get<string>('NODE_ENV');

  await app.listen(PORT, () => {
    Logger.log(`Server running on http://localhost:${PORT} in ${NODE_ENV} mode`, 'main.ts');	
  });
}
bootstrap();
