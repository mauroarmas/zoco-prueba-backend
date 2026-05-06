export class Bar {
  id?: string;
  name: string;
  description?: string;
  location: string;
  category: string;
  source: string;
  date?: Date;
  scrapedAt: Date;
  isActive: boolean;
  hash_identificador: string;

  constructor(partial: Partial<Bar>) {
    Object.assign(this, partial);
  }
}
