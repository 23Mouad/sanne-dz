import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService, CreateCategoryDto, UpdateCategoryDto, CreateSubCategoryDto } from './categories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public() @Get() findAll() { return this.categoriesService.findAll(); }
  @Public() @Get(':slug') findBySlug(@Param('slug') slug: string) { return this.categoriesService.findBySlug(slug); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Post() create(@Body() dto: CreateCategoryDto) { return this.categoriesService.create(dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) { return this.categoriesService.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Delete(':id') remove(@Param('id') id: string) { return this.categoriesService.remove(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Post(':id/sub') addSub(@Param('id') id: string, @Body() dto: CreateSubCategoryDto) { return this.categoriesService.addSubCategory(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Put(':id/sub/:subId') updateSub(@Param('subId') subId: string, @Body() dto: CreateSubCategoryDto) { return this.categoriesService.updateSubCategory(subId, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Delete(':id/sub/:subId') removeSub(@Param('subId') subId: string) { return this.categoriesService.removeSubCategory(subId); }
}
