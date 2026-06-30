import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PartnerStatus, SubscriptionPlan } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import {
  UpdatePartnerProfileDto, UpdateCategoriesDto, AddPhotoDto, AddVideoDto,
  UpdatePhotoDto, CreateProductDto, UpdateProductDto, PartnerSearchDto,
} from './dto/partner.dto';

// ===== PLAN LIMITS (enforced server-side) =====
const LIMITS = {
  SIMPLE: {
    maxCategories: 1,
    maxDescriptionLength: 300,
    maxPhotos: 3,
    maxVideos: 0,
    maxProducts: 3,
  },
  PRO: {
    maxCategories: 10,
    maxDescriptionLength: 2000,
    maxPhotos: 20,
    maxVideos: 1,
    maxProducts: Infinity,
  },
};

@Injectable()
export class PartnersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  private partnerSelect = {
    id: true, slug: true, businessName: true, description: true,
    logoUrl: true, coverUrl: true, address: true, mapLink: true, deliveryType: true,
    phone: true, whatsapp: true, email: true, website: true,
    facebook: true, instagram: true, tiktok: true, registreCommerce: true,
    schedule: true, status: true, isPro: true, isFeatured: true,
    rating: true, reviewCount: true, createdAt: true, updatedAt: true,
    deletionRequestedAt: true,
    minOrder: true, remoteWork: true, appointmentStatus: true, deliveryAvailable: true,
    services: true, achievements: true,
    wilaya: { select: { id: true, name: true } },
    categories: {
      include: { category: { select: { id: true, slug: true, name: true, icon: true, color: true } } },
    },
    photos: { orderBy: { order: 'asc' as const } },
    videos: true,
    stats: true,
    products: true,
  };

  // ===== PUBLIC: Search/List Partners =====
  async findAll(dto: PartnerSearchDto) {
    const page = Number(dto.page) || 1;
    const limit = Math.min(Number(dto.limit) || 12, 50);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: PartnerStatus.ACTIVE };

    if (dto.q) {
      where.OR = [
        { businessName: { contains: dto.q, mode: 'insensitive' } },
        { description: { contains: dto.q, mode: 'insensitive' } },
      ];
    }
    if (dto.wilayaId) where.wilayaId = dto.wilayaId;
    if (dto.plan) where.isPro = dto.plan === 'PRO';
    if (dto.categorySlug) {
      where.categories = {
        some: { category: { slug: dto.categorySlug } },
      };
    }

    let orderBy: Record<string, unknown> = { createdAt: 'desc' };
    if (dto.sort === 'rating') orderBy = { rating: 'desc' };
    else if (dto.sort === 'reviews') orderBy = { reviewCount: 'desc' };
    else if (dto.sort === 'recent') orderBy = { createdAt: 'desc' };

    // PRO partners first for relevance
    if (dto.sort === 'relevance' || !dto.sort) {
      orderBy = { isPro: 'desc' } as Record<string, unknown>;
    }

    const [partners, total] = await Promise.all([
      this.prisma.partner.findMany({ where, orderBy, skip, take: limit, select: this.partnerSelect }),
      this.prisma.partner.count({ where }),
    ]);

    partners.forEach(p => {
      if (!p.isPro && p.categories && p.categories.length > 1) {
        p.categories = [p.categories[0]];
      }
    });

    return {
      data: partners,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ===== PUBLIC: Featured Partners =====
  async findFeatured() {
    const partners = await this.prisma.partner.findMany({
      where: { status: PartnerStatus.ACTIVE, isFeatured: true },
      take: 10,
      select: this.partnerSelect,
      orderBy: { rating: 'desc' },
    });

    partners.forEach(p => {
      if (!p.isPro && p.categories && p.categories.length > 1) {
        p.categories = [p.categories[0]];
      }
    });

    return partners;
  }

  // ===== PUBLIC: Get by Slug =====
  async findBySlug(slug: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { slug },
      select: {
        ...this.partnerSelect,
        products: { where: { isActive: true } },
        reviews: {
          where: { status: 'APPROVED' },
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, rating: true, comment: true, createdAt: true,
            author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });
    if (!partner || partner.status !== PartnerStatus.ACTIVE)
      throw new NotFoundException('Partner not found');

    if (!partner.isPro && partner.categories && partner.categories.length > 1) {
      partner.categories = [partner.categories[0]] as any;
    }

    return partner;
  }

  // ===== TRACK STATS =====
  async recordView(partnerId: string) {
    await this.prisma.partnerStats.update({
      where: { partnerId },
      data: { profileViews: { increment: 1 } },
    });
    return { recorded: true };
  }

  private async appendClickHistory(partnerId: string, type: 'whatsapp' | 'phone') {
    const stats = await this.prisma.partnerStats.findUnique({ where: { partnerId } });
    if (!stats) return;

    let clicksHistory: { date: string; whatsapp: number; phone: number }[] = [];
    if (typeof stats.clicksHistory === 'string') {
      try { clicksHistory = JSON.parse(stats.clicksHistory); } catch (e) {}
    } else if (Array.isArray(stats.clicksHistory)) {
      clicksHistory = stats.clicksHistory as any;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let todayEntry = clicksHistory.find(c => c.date === todayStr);

    if (todayEntry) {
      if (type === 'whatsapp') todayEntry.whatsapp = (todayEntry.whatsapp || 0) + 1;
      if (type === 'phone') todayEntry.phone = (todayEntry.phone || 0) + 1;
    } else {
      clicksHistory.push({
        date: todayStr,
        whatsapp: type === 'whatsapp' ? 1 : 0,
        phone: type === 'phone' ? 1 : 0,
      });
    }

    if (clicksHistory.length > 90) clicksHistory = clicksHistory.slice(-90);

    await this.prisma.partnerStats.update({
      where: { partnerId },
      data: { clicksHistory: clicksHistory as any },
    });
  }

  async recordWhatsappClick(partnerId: string) {
    await this.prisma.partnerStats.update({
      where: { partnerId },
      data: { whatsappClicks: { increment: 1 } },
    });
    await this.appendClickHistory(partnerId, 'whatsapp');
    return { recorded: true };
  }

  async recordPhoneClick(partnerId: string) {
    await this.prisma.partnerStats.update({
      where: { partnerId },
      data: { phoneClicks: { increment: 1 } },
    });
    await this.appendClickHistory(partnerId, 'phone');
    return { recorded: true };
  }

  // ===== PARTNER DASHBOARD: Get own profile =====
  async getMyProfile(userId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      select: { ...this.partnerSelect, products: true, createdAt: true },
    });
    if (!partner) throw new NotFoundException('Partner profile not found');

    if (!partner.isPro && partner.categories && partner.categories.length > 1) {
      partner.categories = [partner.categories[0]] as any;
    }

    // Sync daily fake stats so numbers grow each day
    if (partner.stats) {
      await this.syncFakeStats(partner.id, partner.createdAt);
      // Re-fetch fresh stats after sync
      const freshStats = await this.prisma.partnerStats.findUnique({ where: { partnerId: partner.id } });
      if (freshStats) {
        // Compute weeklyViews and weeklyFavorites from viewsHistory for the chart
        let viewsHistory: { date: string; count: number }[] = [];
        try {
          viewsHistory = typeof freshStats.viewsHistory === 'string'
            ? JSON.parse(freshStats.viewsHistory as string)
            : (freshStats.viewsHistory as any) ?? [];
        } catch (e) {}

        const weeklyViews: number[] = [];
        const weeklyFavorites: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const entry = viewsHistory.find((v) => v.date === dateStr);
          const dailyViews = entry ? entry.count : 0;
          weeklyViews.push(dailyViews);
          // Favorites are roughly 20-30% of views
          weeklyFavorites.push(Math.max(0, Math.floor(dailyViews * 0.25)));
        }

        (partner as any).stats = {
          ...freshStats,
          weeklyViews,
          weeklyFavorites,
        };
      }
    }

    return partner;
  }

  // ===== PARTNER DASHBOARD: Update profile =====
  async updateMyProfile(userId: string, dto: UpdatePartnerProfileDto) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const limits = LIMITS[partner.isPro ? 'PRO' : 'SIMPLE'];

    if (dto.description && dto.description.length > limits.maxDescriptionLength) {
      throw new BadRequestException(
        `Description max length is ${limits.maxDescriptionLength} characters for your plan`,
      );
    }

    const updateData: any = {};
    if (dto.businessName) updateData.businessName = dto.businessName;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.phone) updateData.phone = dto.phone;
    if (dto.whatsapp) updateData.whatsapp = dto.whatsapp;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.wilayaId) updateData.wilayaId = dto.wilayaId;
    if (dto.mapLink !== undefined) updateData.mapLink = dto.mapLink;
    if (dto.deliveryType !== undefined) updateData.deliveryType = dto.deliveryType;
    if (dto.website !== undefined) updateData.website = dto.website;
    if (dto.facebook !== undefined) updateData.facebook = dto.facebook;
    if (dto.instagram !== undefined) updateData.instagram = dto.instagram;
    if (dto.tiktok !== undefined) updateData.tiktok = dto.tiktok;
    if (dto.registreCommerce !== undefined) updateData.registreCommerce = dto.registreCommerce;
    if (dto.schedule !== undefined) updateData.schedule = dto.schedule;
    if (dto.minOrder !== undefined) updateData.minOrder = dto.minOrder;
    if (dto.remoteWork !== undefined) updateData.remoteWork = dto.remoteWork;
    if (dto.appointmentStatus !== undefined) updateData.appointmentStatus = dto.appointmentStatus;
    if (dto.deliveryAvailable !== undefined) updateData.deliveryAvailable = dto.deliveryAvailable;
    if (dto.services !== undefined) updateData.services = dto.services;
    if (dto.achievements !== undefined) updateData.achievements = dto.achievements;

    return this.prisma.partner.update({
      where: { id: partner.id },
      data: updateData,
      select: { id: true, slug: true, businessName: true, updatedAt: true },
    });
  }

  // ===== Update logo/cover =====
  async updateLogo(userId: string, logoUrl: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');
    return this.prisma.partner.update({ where: { id: partner.id }, data: { logoUrl }, select: { id: true, logoUrl: true } });
  }

  async updateCover(userId: string, coverUrl: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');
    return this.prisma.partner.update({ where: { id: partner.id }, data: { coverUrl }, select: { id: true, coverUrl: true } });
  }

  // ===== Update categories (Pro: multiple, Simple: 1) =====
  async updateCategories(userId: string, dto: UpdateCategoriesDto) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const limits = LIMITS[partner.isPro ? 'PRO' : 'SIMPLE'];
    if (dto.categorySlugs.length > limits.maxCategories) {
      throw new BadRequestException(
        `Your plan allows a maximum of ${limits.maxCategories} ${limits.maxCategories === 1 ? 'category' : 'categories'}. Upgrade to Pro for multiple categories.`,
      );
    }

    const categories = await this.prisma.category.findMany({
      where: { slug: { in: dto.categorySlugs }, isActive: true },
    });
    if (categories.length === 0) throw new BadRequestException('No valid categories found');

    // Replace all categories
    await this.prisma.partnerCategory.deleteMany({ where: { partnerId: partner.id } });
    await this.prisma.partnerCategory.createMany({
      data: categories.map((c) => ({ partnerId: partner.id, categoryId: c.id })),
    });

    return { message: 'Categories updated', count: categories.length };
  }

  // ===== STATS =====
  private async syncFakeStats(partnerId: string, createdAt: Date) {
    const stats = await this.prisma.partnerStats.findUnique({ where: { partnerId } });
    if (!stats) return;

    // We use viewsHistory to track which days have been synced
    let viewsHistory: { date: string; count: number }[] = [];
    if (typeof stats.viewsHistory === 'string') {
      try { viewsHistory = JSON.parse(stats.viewsHistory); } catch (e) {}
    } else if (Array.isArray(stats.viewsHistory)) {
      viewsHistory = stats.viewsHistory as any;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const createdDate = new Date(createdAt);
    createdDate.setHours(0, 0, 0, 0);

    let profileViews = stats.profileViews;
    let favoritesCount = stats.favoritesCount;
    let hasChanges = false;

    // Ensure we don't sync more than 90 days into the past to avoid massive loops if old account
    const maxSyncDays = 90;
    const startSyncDate = new Date(today);
    startSyncDate.setDate(today.getDate() - maxSyncDays);

    let currentDate = new Date(createdDate > startSyncDate ? createdDate : startSyncDate);

    while (currentDate <= today) {
      const dateString = currentDate.toISOString().split('T')[0];
      const isSynced = viewsHistory.some(v => v.date === dateString);

      if (!isSynced) {
        // Calculate account age at this specific date
        const ageInDays = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let dailyViews = 0;
        let dailyFavorites = 0;

        // Views formula
        if (ageInDays <= 3) {
          dailyViews = 0;
        } else if (ageInDays <= 20) {
          dailyViews = Math.floor(Math.random() * 11) + 10; // 10 to 20
        } else {
          dailyViews = Math.floor(Math.random() * 31) + 20; // 20 to 50
        }

        // Favorites formula
        if (ageInDays <= 3) {
          dailyFavorites = 0;
        } else if (ageInDays <= 20) {
          dailyFavorites = Math.floor(Math.random() * 4) + 2; // 2 to 5 favorites
        } else {
          dailyFavorites = Math.floor(Math.random() * 11) + 5; // 5 to 15 favorites
        }

        // Ensure favorites are strictly less than views (fail-safe)
        if (dailyFavorites >= dailyViews) {
          dailyFavorites = Math.max(0, Math.floor(dailyViews * 0.3)); // Cap at 30% of views
        }

        profileViews += dailyViews;
        favoritesCount += dailyFavorites;
        
        viewsHistory.push({ date: dateString, count: dailyViews });
        hasChanges = true;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (hasChanges) {
      // Keep only last 90 days to prevent infinite growth
      if (viewsHistory.length > 90) {
        viewsHistory = viewsHistory.slice(-90);
      }

      await this.prisma.partnerStats.update({
        where: { partnerId },
        data: {
          profileViews,
          favoritesCount,
          viewsHistory: viewsHistory as any,
        },
      });
    }
  }

  async getMyStats(userId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      select: { id: true, createdAt: true, stats: true, isPro: true },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    if (partner.stats) {
      await this.syncFakeStats(partner.id, partner.createdAt);
      // Re-fetch stats after sync
      const updatedStats = await this.prisma.partnerStats.findUnique({ where: { partnerId: partner.id } });
      partner.stats = updatedStats as any;
    }

    return partner;
  }

  // ===== PHOTOS =====
  async getPhotos(userId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');
    return this.prisma.partnerPhoto.findMany({
      where: { partnerId: partner.id },
      orderBy: { order: 'asc' },
    });
  }

  async addPhoto(userId: string, url: string, dto: AddPhotoDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      include: { photos: true },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    const limits = LIMITS[partner.isPro ? 'PRO' : 'SIMPLE'];
    if (partner.photos.length >= limits.maxPhotos) {
      throw new BadRequestException(
        `Your plan allows a maximum of ${limits.maxPhotos} photos. Upgrade to Pro for more.`,
      );
    }

    const lastOrder = partner.photos.length > 0
      ? Math.max(...partner.photos.map((p) => p.order))
      : 0;

    return this.prisma.partnerPhoto.create({
      data: { partnerId: partner.id, url, caption: dto.caption, order: dto.order ?? lastOrder + 1 },
    });
  }

  async updatePhoto(userId: string, photoId: string, dto: UpdatePhotoDto) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const photo = await this.prisma.partnerPhoto.findUnique({ where: { id: photoId } });
    if (!photo || photo.partnerId !== partner.id) throw new NotFoundException('Photo not found');

    return this.prisma.partnerPhoto.update({ where: { id: photoId }, data: dto });
  }

  async deletePhoto(userId: string, photoId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const photo = await this.prisma.partnerPhoto.findUnique({ where: { id: photoId } });
    if (!photo || photo.partnerId !== partner.id) throw new NotFoundException('Photo not found');

    await this.prisma.partnerPhoto.delete({ where: { id: photoId } });
    return { message: 'Photo deleted' };
  }

  // ===== VIDEOS (Pro only) =====
  async getVideos(userId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');
    return this.prisma.partnerVideo.findMany({ where: { partnerId: partner.id } });
  }

  async addVideo(userId: string, dto: AddVideoDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      include: { videos: true },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    if (!partner.isPro) {
      throw new ForbiddenException('Video upload is available for Pro partners only. Upgrade your plan.');
    }

    if (partner.videos.length >= LIMITS.PRO.maxVideos) {
      throw new BadRequestException(`Maximum ${LIMITS.PRO.maxVideos} videos allowed`);
    }

    if (!dto.url) {
      throw new BadRequestException('Video file is required');
    }

    return this.prisma.partnerVideo.create({
      data: { partnerId: partner.id, url: dto.url, thumbnail: dto.thumbnail, caption: dto.caption },
    });
  }

  async deleteVideo(userId: string, videoId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const video = await this.prisma.partnerVideo.findUnique({ where: { id: videoId } });
    if (!video || video.partnerId !== partner.id) throw new NotFoundException('Video not found');

    await this.prisma.partnerVideo.delete({ where: { id: videoId } });
    return { message: 'Video deleted' };
  }

  // ===== PRODUCTS =====
  async getProducts(userId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');
    return this.prisma.product.findMany({ where: { partnerId: partner.id, isActive: true } });
  }

  async addProduct(userId: string, dto: CreateProductDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      include: { products: { where: { isActive: true } } },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    const limits = LIMITS[partner.isPro ? 'PRO' : 'SIMPLE'];
    if (partner.products.length >= limits.maxProducts) {
      throw new BadRequestException(
        `Your plan allows a maximum of ${limits.maxProducts} products. Upgrade to Pro for unlimited products.`,
      );
    }

    const data: any = { partnerId: partner.id };
    if (dto.name) data.name = dto.name;
    if (dto.description) data.description = dto.description;
    if (dto.price !== undefined && dto.price !== '') data.price = parseFloat(dto.price);
    if (dto.promoPrice !== undefined && dto.promoPrice !== '') data.promoPrice = parseFloat(dto.promoPrice);
    if (dto.imageUrl) data.imageUrl = dto.imageUrl;

    return this.prisma.product.create({ data });
  }

  async updateProduct(userId: string, productId: string, dto: UpdateProductDto) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.partnerId !== partner.id) throw new NotFoundException('Product not found');

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.price !== undefined && dto.price !== '') updateData.price = parseFloat(dto.price);
    if (dto.promoPrice !== undefined && dto.promoPrice !== '') updateData.promoPrice = parseFloat(dto.promoPrice);
    if (dto.imageUrl !== undefined) updateData.imageUrl = dto.imageUrl;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive === 'true' || dto.isActive === true;

    return this.prisma.product.update({ where: { id: productId }, data: updateData });
  }

  async deleteProduct(userId: string, productId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.partnerId !== partner.id) throw new NotFoundException('Product not found');

    await this.prisma.product.update({ where: { id: productId }, data: { isActive: false } });
    return { message: 'Product deleted' };
  }

  async requestDeletion(userId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      include: { user: { select: { email: true } } },
    });
    if (!partner) throw new NotFoundException('Partner profile not found');
    
    await this.prisma.partner.update({
      where: { id: partner.id },
      data: { deletionRequestedAt: new Date() },
    });

    // Send confirmation email to partner
    this.mailService.sendDeletionRequestConfirmation(partner.user.email, partner.businessName);

    // Notify admin
    this.mailService.sendAdminNotification(
      'Demande de suppression de compte',
      `Le partenaire "${partner.businessName}" a demandé la suppression de son compte.`,
      {
        'Nom du partenaire': partner.businessName,
        Email: partner.user.email,
        'Date de la demande': new Date().toLocaleString('fr-DZ'),
      },
    );

    return { message: 'Deletion request submitted successfully' };
  }
}
