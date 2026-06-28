import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getAll(@GetUser() user: { id: string }) { return this.favoritesService.getAll(user.id); }

  @Post(':partnerId')
  add(@GetUser() user: { id: string }, @Param('partnerId') id: string) { return this.favoritesService.add(user.id, id); }

  @Delete(':partnerId')
  remove(@GetUser() user: { id: string }, @Param('partnerId') id: string) { return this.favoritesService.remove(user.id, id); }

  @Get('check/:partnerId')
  check(@GetUser() user: { id: string }, @Param('partnerId') id: string) { return this.favoritesService.check(user.id, id); }
}
