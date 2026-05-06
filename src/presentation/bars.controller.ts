import { Controller, Get, Post, Body, Query, Param, Put, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { BarsService } from '../business/bars/service/bars.service';
import { IBarRepository, BAR_REPOSITORY } from '../persistence/bars/bar.repository.interface';
import { Inject } from '@nestjs/common';
import { CreateBarDto } from '../business/bars/create-bar.dto';
import { UpdateBarDto } from '../business/bars/update-bar.dto';
import { Bar } from '../business/bars/bar';

@Controller('bars')
export class BarsController {
  constructor(
    private readonly barsService: BarsService,
    // Inyectamos el repositorio solo para el endpoint de validación rápida
    @Inject(BAR_REPOSITORY) private readonly barRepo: IBarRepository
    
  ) {}

  @Get()
  async getAll(): Promise<Bar[]> {
    return this.barsService.getAllBars();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Bar | null> {
    return this.barsService.getBarById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CreateBarDto): Promise<Bar> {
    return this.barsService.createBar(body);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() body: UpdateBarDto): Promise<Bar | null> {
    return this.barsService.updateBar(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.barsService.deleteBar(id);
    return { success };
  }
}
