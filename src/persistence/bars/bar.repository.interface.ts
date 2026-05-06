import { Bar } from '../../business/bars/bar';

export const BAR_REPOSITORY = 'BAR_REPOSITORY';

export interface IBarRepository {
  findAll(): Promise<Bar[]>;
  findById(id: string): Promise<Bar | null>;
  create(bar: Bar): Promise<Bar>;
  upsert(bar: Bar): Promise<Bar>;
  update(id: string, bar: Partial<Bar>): Promise<Bar | null>;
  delete(id: string): Promise<boolean>;
}
