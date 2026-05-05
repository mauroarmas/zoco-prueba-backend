export class Event {
  id?: string;
  name: string;
  location: string;
  category: string;
  source: string;
  date?: Date;
  scrapedAt: Date;
  isActive: boolean;

  constructor(partial: Partial<Event>) {
    Object.assign(this, partial);
  }
}
