import { Injectable, Inject } from '@nestjs/common';
import { IEventsService } from './events.service.interface';
import { IEventRepository, EVENT_REPOSITORY } from '../../../persistence/events/event.repository.interface';
import { Event } from '../event';
import { CreateEventDto } from '../create-event.dto';

@Injectable()
export class EventsService implements IEventsService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async createEvent(data: CreateEventDto): Promise<Event> {
    const newEvent = new Event({ ...data, scrapedAt: new Date(), isActive: true });
    return this.eventRepository.create(newEvent);
  }
}
