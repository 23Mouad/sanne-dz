import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WilayasService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.wilaya.findMany({ orderBy: { id: 'asc' } }); }
  findActive() { return this.prisma.wilaya.findMany({ where: { isActive: true }, orderBy: { id: 'asc' } }); }

  async findPartnersByWilaya(wilayaId: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const [partners, total] = await Promise.all([
      this.prisma.partner.findMany({
        where: { wilayaId, status: 'ACTIVE' },
        skip, take: limit,
        select: { id: true, slug: true, businessName: true, logoUrl: true, rating: true, reviewCount: true, isPro: true },
      }),
      this.prisma.partner.count({ where: { wilayaId, status: 'ACTIVE' } }),
    ]);
    return { data: partners, meta: { total, page, totalPages: Math.ceil(total / limit) } };
  }
}
