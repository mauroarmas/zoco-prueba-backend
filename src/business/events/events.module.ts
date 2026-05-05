import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from '../../presentation/events.controller';
import { EventsService } from './service/events.service';
import { EventDocument, EventSchema } from '../../persistence/events/event.schema';
import { EventRepository } from '../../persistence/events/event.repository';
import { EVENT_REPOSITORY } from '../../persistence/events/event.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EventDocument.name, schema: EventSchema }])
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: EVENT_REPOSITORY,
      useClass: EventRepository,
    },
  ],
  exports: [EventsService],
})
export class EventsModule {}
