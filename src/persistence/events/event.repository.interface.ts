import { Event } from '../../business/events/event';

export const EVENT_REPOSITORY = 'EVENT_REPOSITORY';

export interface IEventRepository {
  findAll(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  create(event: Event): Promise<Event>;
  update(id: string, event: Partial<Event>): Promise<Event | null>;
  delete(id: string): Promise<boolean>;
}
