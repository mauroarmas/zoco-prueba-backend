import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { envValidationSchema } from 'src/config/env-validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from '../../business/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],  
      validationSchema: envValidationSchema
    }), 
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DB_URL');
        console.log(`Intentando conectar a MongoDB en: ${uri}`);
        return { 
          uri,
          family: 4, // Fuerza el uso de IPv4 (soluciona el error ECONNREFUSED de SRV en Node.js)
        };
      },
      inject: [ConfigService],
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
