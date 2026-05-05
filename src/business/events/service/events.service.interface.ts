import { Event } from '../event';
import { CreateEventDto } from '../create-event.dto';

export interface IEventsService {
  getAllEvents(): Promise<Event[]>;
  createEvent(data: CreateEventDto): Promise<Event>;
}
