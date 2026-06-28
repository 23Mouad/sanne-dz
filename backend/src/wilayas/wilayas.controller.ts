import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WilayasService } from './wilayas.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Wilayas')
@Controller('wilayas')
export class WilayasController {
  constructor(private wilayasService: WilayasService) {}

  @Public() @Get() findAll() { return this.wilayasService.findAll(); }
  @Public() @Get('active') findActive() { return this.wilayasService.findActive(); }
  @Public() @Get(':id/partners') findPartners(@Param('id') id: string, @Query('page') page: number) {
    return this.wilayasService.findPartnersByWilaya(id, page);
  }
}
