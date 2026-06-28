import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() icon: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() color?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() icon?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() color?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
}

export class CreateSubCategoryDto {
  @ApiProperty() @IsString() name: string;
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private toSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 80);
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        subCategories: {
          include: { childCategories: true },
        },
        _count: { select: { partners: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    const cat = await this.prisma.category.findUnique({
      where: { slug },
      include: { subCategories: { include: { childCategories: true } } },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.toSlug(dto.name);
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Category with this name already exists');

    const count = await this.prisma.category.count();
    return this.prisma.category.create({
      data: { name: dto.name, slug, icon: dto.icon, color: dto.color ?? 'from-gray-400 to-gray-600', description: dto.description, order: count },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    await this.prisma.category.update({ where: { id }, data: { isActive: false } });
    return { message: 'Category deactivated' };
  }

  async addSubCategory(categoryId: string, dto: CreateSubCategoryDto) {
    const cat = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) throw new NotFoundException('Category not found');
    const slug = this.toSlug(dto.name);
    return this.prisma.subCategory.create({ data: { name: dto.name, slug, categoryId } });
  }

  async updateSubCategory(subId: string, dto: CreateSubCategoryDto) {
    return this.prisma.subCategory.update({ where: { id: subId }, data: { name: dto.name } });
  }

  async removeSubCategory(subId: string) {
    await this.prisma.subCategory.delete({ where: { id: subId } });
    return { message: 'Sub-category deleted' };
  }
}
