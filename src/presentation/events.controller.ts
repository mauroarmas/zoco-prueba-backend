import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from '../business/events/service/events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAll() {
    return this.eventsService.getAllEvents();
  }

  @Post()
  async create(@Body() body: any) {
    return this.eventsService.createEvent(body);
  }
}
