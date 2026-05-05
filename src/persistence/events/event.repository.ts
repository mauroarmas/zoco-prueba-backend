import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEventRepository } from './event.repository.interface';
import { Event } from '../../business/events/event';
import { EventDocument } from './event.schema';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @InjectModel(EventDocument.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  private toDomain(doc: any): Event {
    return new Event({
      id: doc._id.toString(),
      name: doc.name,
      location: doc.location,
      category: doc.category,
      source: doc.source,
      date: doc.date,
      scrapedAt: doc.scrapedAt,
      isActive: doc.isActive,
    });
  }

  async findAll(): Promise<Event[]> {
    const events = await this.eventModel.find().exec();
    return events.map(this.toDomain);
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.eventModel.findById(id).exec();
    return event ? this.toDomain(event) : null;
  }

  async create(event: Event): Promise<Event> {
    const newEvent = new this.eventModel(event);
    const savedEvent = await newEvent.save();
    return this.toDomain(savedEvent);
  }

  async update(id: string, event: Partial<Event>): Promise<Event | null> {
    const updated = await this.eventModel.findByIdAndUpdate(id, event, { new: true }).exec();
    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.eventModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
