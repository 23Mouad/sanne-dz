import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.favorite.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        partner: {
          select: {
            id: true, slug: true, businessName: true, logoUrl: true, coverUrl: true, wilaya: { select: { name: true } },
            rating: true, reviewCount: true, isPro: true,
            categories: { include: { category: { select: { name: true, icon: true } } } },
          },
        },
      },
    });
  }

  async add(userId: string, partnerId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id: partnerId } });
    if (!partner || partner.status !== 'ACTIVE') throw new NotFoundException('Partner not found');

    const existing = await this.prisma.favorite.findUnique({
      where: { clientId_partnerId: { clientId: userId, partnerId } },
    });
    if (existing) throw new ConflictException('Already in favorites');

    const fav = await this.prisma.favorite.create({ data: { clientId: userId, partnerId } });
    await this.prisma.partnerStats.update({ where: { partnerId }, data: { favoritesCount: { increment: 1 } } });
    return fav;
  }

  async remove(userId: string, partnerId: string) {
    const fav = await this.prisma.favorite.findUnique({
      where: { clientId_partnerId: { clientId: userId, partnerId } },
    });
    if (!fav) throw new NotFoundException('Not in favorites');

    await this.prisma.favorite.delete({ where: { clientId_partnerId: { clientId: userId, partnerId } } });
    await this.prisma.partnerStats.update({ where: { partnerId }, data: { favoritesCount: { decrement: 1 } } });
    return { message: 'Removed from favorites' };
  }

  async check(userId: string, partnerId: string) {
    const fav = await this.prisma.favorite.findUnique({
      where: { clientId_partnerId: { clientId: userId, partnerId } },
    });
    return { isFavorite: !!fav };
  }
}
