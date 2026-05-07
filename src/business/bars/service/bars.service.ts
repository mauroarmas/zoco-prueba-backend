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
  ) { }

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

  async createBar(data: CreateBarDto) {
    const hash_identificador = this.generateSlug(data.name);

    // 1. Buscamos si el bar ya existe en la base de datos
    const existingBar = await this.barRepository.findOne(hash_identificador);
    const exists = Boolean(existingBar);
    
    // 2. Preparamos el objeto
    const barData = new Bar({ ...data, scrapedAt: new Date(), isActive: true, hash_identificador });

    // 3. Guardamos/Actualizamos
    const savedBar = await this.barRepository.upsert(barData);

    // 4. El Truco Mágico: Devolvemos el bar guardado + una bandera (flag)
    return {
      ...savedBar, // Devuelve todos los datos del bar
      isNewRecord: !exists // true si no existía, false si ya existía
    };
  }

  async updateBar(id: string, data: UpdateBarDto): Promise<Bar | null> {
    const existing = await this.barRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Bar with id ${id} not found`);
    }
    return this.barRepository.update(id, data);
  }

  async triggerScraping(pageNumber: number) {
  return this.barRepository.triggerScraping(pageNumber);
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
