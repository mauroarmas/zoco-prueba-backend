import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IBarsService } from './bars.service.interface';
import { IBarRepository, BAR_REPOSITORY } from '../../../persistence/bars/bar.repository.interface';
import { Bar } from '../bar';
import { CreateBarDto } from '../create-bar.dto';
import { UpdateBarDto } from '../update-bar.dto';

@Injectable()
export class BarsService implements IBarsService {
  constructor(
    @Inject(BAR_REPOSITORY)
    private readonly barRepository: IBarRepository,
  ) {}

  async getAllBars(): Promise<Bar[]> {
    return this.barRepository.findAll();
  }

  async getBarById(id: string): Promise<Bar | null> {
    return this.barRepository.findById(id);
  }

  private generateSlug(name: string): string {
    const lower = name.toLowerCase();
    const withoutAccents = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'para', 'por', 'y', 'o', 'tucuman'];
    
    const words = withoutAccents
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0 && !stopWords.includes(w));
    
    return words.sort().join('-');
  }

  async createBar(data: CreateBarDto): Promise<Bar> {
    const hash_identificador = this.generateSlug(data.name);
    const newBar = new Bar({ ...data, scrapedAt: new Date(), isActive: true, hash_identificador });
    return this.barRepository.upsert(newBar);
  }

  async updateBar(id: string, data: UpdateBarDto): Promise<Bar | null> {
    const existing = await this.barRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Bar with id ${id} not found`);
    }
    return this.barRepository.update(id, data);
  }

  async deleteBar(id: string): Promise<boolean> {
    const existing = await this.barRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Bar with id ${id} not found`);
    }
    // Implement soft delete by updating isActive
    const updated = await this.barRepository.update(id, { isActive: false });
    return updated !== null;
  }
}
