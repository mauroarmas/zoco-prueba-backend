import { Bar } from '../bar';
import { CreateBarDto } from '../create-bar.dto';
import { UpdateBarDto } from '../update-bar.dto';

export interface IBarsService {
  getAllBars(): Promise<Bar[]>;
  getBarById(id: string): Promise<Bar | null>;
  createBar(data: CreateBarDto): Promise<Bar>;
  updateBar(id: string, data: UpdateBarDto): Promise<Bar | null>;
  deleteBar(id: string): Promise<boolean>;
}
