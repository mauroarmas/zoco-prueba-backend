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

  async findOne(hash_identificador: string): Promise<Bar | null> {
  const bar = await this.barModel.findOne({ hash_identificador }).exec();
  return bar ? this.toDomain(bar) : null;
}

  async upsert(bar: Bar): Promise<Bar> {
    const upserted = await this.barModel.findOneAndUpdate(
      { hash_identificador: bar.hash_identificador },
      bar,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ).exec();
    return this.toDomain(upserted);
  }

  async create(bar: Bar): Promise<Bar> {
    const newBar = new this.barModel(bar);
    const savedBar = await newBar.save();
    return this.toDomain(savedBar);
  }

  async triggerScraping(pageNumber: number) {
    // Nota: Por lo general las URLs de n8n son /webhook-test/... o /webhook/..., 
    // pero mantenemos tu URL por si la configuraste así:
    const n8nWebhookUrl = 'http://localhost:5678/webhook-test/hacer-scraping'; 
    // (He cambiado /rest/webhooks-test a /webhook-test que es el formato estándar, si no te funciona vuelve a tu URL)
    
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pagina: pageNumber })
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`n8n webhook failed with status ${response.status}: ${responseText.substring(0, 200)}...`);
      }
      
      // Intentamos parsear a JSON, pero si devuelve un texto o HTML que no rompa la app
      try {
        return JSON.parse(responseText);
      } catch (e) {
        return { 
          success: true, 
          message: "Webhook ejecutado pero la respuesta no era JSON", 
          data: responseText 
        };
      }
    } catch (error) {
      console.error("Error al llamar al webhook de n8n:", error);
      throw error;
    }
  }

  async update(id: string, bar: Partial<Bar>): Promise<Bar | null> {
    const updated = await this.barModel.findByIdAndUpdate(id, bar, { returnDocument: 'after' }).exec();
    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.barModel.findByIdAndDelete(id).exec();
    return result !== null;
  }


}
