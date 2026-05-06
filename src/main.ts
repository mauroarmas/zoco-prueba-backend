import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
// import * as dns from 'dns'; 

// Evita setear servidores DNS estáticos en entornos Serverless como Vercel,
// puede causar bloqueos de red internos y ser el culpable directo de que la función falle.
// dns.setServers(['8.8.8.8', '8.8.4.4']);

let cachedServer: express.Express;

async function bootstrap() {
  // Si el servidor ya se inicializó en esta instancia serverless, lo reutilizamos
  if (!cachedServer) {
    const expressApp = express();
    
    // Creamos la app de Nest pasándole la instancia de Express
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.setGlobalPrefix('api');

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

    // En lugar de app.listen(), usamos app.init()
    await app.init();
    
    cachedServer = expressApp;
  }
  
  return cachedServer;
}

// Exportamos la función manejadora que Vercel espera
export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};