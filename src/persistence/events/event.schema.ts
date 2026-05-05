import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EventDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  location: string;

  @Prop()
  category: string;

  @Prop()
  source: string;

  @Prop()
  date: Date;

  @Prop({ default: Date.now })
  scrapedAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(EventDocument);
