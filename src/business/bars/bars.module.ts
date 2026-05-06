import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarsController } from '../../presentation/bars.controller';
import { BarsService } from './service/bars.service';
import { BarDocument, BarSchema } from '../../persistence/bars/bar.schema';
import { BarRepository } from '../../persistence/bars/bar.repository';
import { BAR_REPOSITORY } from '../../persistence/bars/bar.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BarDocument.name, schema: BarSchema }])
  ],
  controllers: [BarsController],
  providers: [
    BarsService,
    {
      provide: BAR_REPOSITORY,
      useClass: BarRepository,
    },
  ],
  exports: [BarsService],
})
export class BarsModule {}
