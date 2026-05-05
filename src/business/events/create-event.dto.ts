export class CreateEventDto {
  name: string;
  location: string;
  category: string;
  source: string;
  date?: Date;
}
