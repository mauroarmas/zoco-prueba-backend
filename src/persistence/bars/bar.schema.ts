import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BarDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

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

  @Prop({ required: true, unique: true })
  hash_identificador: string;
}

export const BarSchema = SchemaFactory.createForClass(BarDocument);
