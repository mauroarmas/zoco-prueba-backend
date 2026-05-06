import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBarRepository } from './bar.repository.interface';
import { Bar } from '../../business/bars/bar';
import { BarDocument } from './bar.schema';

@Injectable()
export class BarRepository implements IBarRepository {
  constructor(
    @InjectModel(BarDocument.name) private readonly barModel: Model<BarDocument>,
  ) {}

  private toDomain(doc: any): Bar {
    return new Bar({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      location: doc.location,
      category: doc.category,
      source: doc.source,
      date: doc.date,
      scrapedAt: doc.scrapedAt,
      isActive: doc.isActive,
      hash_identificador: doc.hash_identificador,
    });
  }

  async findAll(): Promise<Bar[]> {
    const bars = await this.barModel.find().exec();
    return bars.map(this.toDomain);
  }

  async findById(id: string): Promise<Bar | null> {
    const bar = await this.barModel.findById(id).exec();
    return bar ? this.toDomain(bar) : null;
  }

  async upsert(bar: Bar): Promise<Bar> {
    const upserted = await this.barModel.findOneAndUpdate(
      { hash_identificador: bar.hash_identificador },
      bar,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
    return this.toDomain(upserted);
  }

  async create(bar: Bar): Promise<Bar> {
    const newBar = new this.barModel(bar);
    const savedBar = await newBar.save();
    return this.toDomain(savedBar);
  }

  async update(id: string, bar: Partial<Bar>): Promise<Bar | null> {
    const updated = await this.barModel.findByIdAndUpdate(id, bar, { new: true }).exec();
    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.barModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
