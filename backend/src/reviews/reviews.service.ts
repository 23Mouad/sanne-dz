import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsInt, Min, Max, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { containsBadWords } from '../common/utils/bad-words';
import { MailService } from '../mail/mail.service';

export class CreateReviewDto {
  @ApiProperty() @IsString() partnerId: string;
  @ApiProperty({ minimum: 1, maximum: 5 }) @IsInt() @Min(1) @Max(5) rating: number;
  @ApiProperty() @IsString() @MinLength(10) @MaxLength(500) comment: string;
}

export class UpdateReviewDto {
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MinLength(10) @MaxLength(500) comment?: string;
}

export class ReportReviewDto {
  @ApiProperty() @IsString() reason: string;
}

export class ModerateReviewDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() reason?: string;
}

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getPartnerReviews(partnerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { partnerId, status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true, rating: true, comment: true, createdAt: true,
          author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
      }),
      this.prisma.review.count({ where: { partnerId, status: 'APPROVED' } }),
    ]);
    return { data: reviews, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async create(userId: string, dto: CreateReviewDto) {
    const partner = await this.prisma.partner.findUnique({ where: { id: dto.partnerId } });
    if (!partner || partner.status !== 'ACTIVE') throw new NotFoundException('Partner not found');

    // Cannot review own business
    if (partner.userId === userId) throw new ForbiddenException('You cannot review your own business');

    const existing = await this.prisma.review.findUnique({
      where: { partnerId_authorId: { partnerId: dto.partnerId, authorId: userId } },
    });
    if (existing) throw new BadRequestException('You have already reviewed this partner');

    const hasBadWords = containsBadWords(dto.comment);
    const status = hasBadWords ? 'PENDING' : 'APPROVED';

    const review = await this.prisma.review.create({
      data: { partnerId: dto.partnerId, authorId: userId, rating: dto.rating, comment: dto.comment, status },
    });

    if (status === 'APPROVED') {
      await this.recalculateRating(dto.partnerId);
    } else {
      this.mailService.sendAdminNotification(
        'Avis en attente de modération',
        `Un nouvel avis a été posté sur le partenaire "${partner.businessName}" et nécessite votre attention car il contient des mots sensibles.`,
        {
          Note: dto.rating,
          Commentaire: dto.comment,
        }
      );
    }

    // Notify the partner
    const partnerUser = await this.prisma.user.findUnique({ where: { id: partner.userId } });
    if (partnerUser) {
      this.mailService.sendNotificationEmail(
        partnerUser.email,
        'Nouvel avis reçu',
        `Vous avez reçu un nouvel avis de ${dto.rating} étoile(s).`,
        '/dashboard/partner/reviews'
      );
    }

    return review;
  }

  async getMyReviewForPartner(userId: string, partnerId: string) {
    const review = await this.prisma.review.findUnique({
      where: { partnerId_authorId: { partnerId, authorId: userId } },
    });
    return review;
  }

  async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.authorId !== userId) throw new NotFoundException('Review not found');

    let status = review.status;
    if (dto.comment) {
      const hasBadWords = containsBadWords(dto.comment);
      status = hasBadWords ? 'PENDING' : 'APPROVED';
    }

    const updated = await this.prisma.review.update({ 
      where: { id: reviewId }, 
      data: { ...dto, status } 
    });

    await this.recalculateRating(review.partnerId);
    return updated;
  }

  async delete(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.authorId !== userId) throw new NotFoundException('Review not found');
    await this.prisma.review.delete({ where: { id: reviewId } });
    await this.recalculateRating(review.partnerId);
    return { message: 'Review deleted' };
  }

  async report(userId: string, reviewId: string, dto: ReportReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { partner: { select: { businessName: true } } },
    });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.review.update({
      where: { id: reviewId },
      data: { isReported: true, reportReason: dto.reason },
    });

    // Notify admin about reported review
    this.mailService.sendAdminNotification(
      'Avis signalé',
      `Un avis sur le partenaire "${review.partner.businessName}" a été signalé et nécessite votre attention.`,
      {
        'Raison du signalement': dto.reason,
        'Note de l\'avis': review.rating,
        Commentaire: review.comment,
      },
    );

    return { message: 'Review reported' };
  }

  async getMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: { partner: { select: { id: true, slug: true, businessName: true, logoUrl: true } } },
    });
  }

  async getPartnerDashboardReviews(userId: string, page = 1, limit = 10) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');
    
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { partnerId: partner.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
      }),
      this.prisma.review.count({ where: { partnerId: partner.id } }),
    ]);

    return { data: reviews, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ===== ADMIN =====
  async getAdminAll(status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    // Status can be passed as 'ALL' or empty to get everything
    const whereClause = status && status !== 'ALL' && status !== 'all' ? { status: status.toUpperCase() as any } : {};

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: { select: { id: true, firstName: true, lastName: true, email: true } },
          partner: { select: { id: true, slug: true, businessName: true } },
        },
      }),
      this.prisma.review.count({ where: whereClause }),
    ]);
    return { data: reviews, meta: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async adminDelete(reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.review.delete({ where: { id: reviewId } });
    await this.recalculateRating(review.partnerId);
    return { message: 'Review deleted permanently' };
  }

  async approve(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        author: { select: { email: true, firstName: true } },
        partner: { select: { businessName: true, userId: true, user: { select: { email: true } } } },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.review.update({ where: { id: reviewId }, data: { status: 'APPROVED' } });
    await this.recalculateRating(review.partnerId);

    // Email review author that their review is approved
    if (review.author?.email) {
      this.mailService.sendReviewModerated(review.author.email, 'APPROVED', review.partner.businessName);
    }

    // Email partner that a new review is now visible
    if (review.partner?.user?.email) {
      this.mailService.sendNewReviewApproved(review.partner.user.email, review.partner.businessName, review.rating);
    }

    return { message: 'Review approved' };
  }

  async reject(reviewId: string, dto: ModerateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        author: { select: { email: true } },
        partner: { select: { businessName: true } },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.review.update({ where: { id: reviewId }, data: { status: 'REJECTED', reportReason: dto.reason } });
    await this.recalculateRating(review.partnerId);

    // Email review author that their review was rejected
    if (review.author?.email) {
      this.mailService.sendReviewModerated(review.author.email, 'REJECTED', review.partner.businessName);
    }

    return { message: 'Review rejected' };
  }

  private async recalculateRating(partnerId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { partnerId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { id: true },
    });
    await this.prisma.partner.update({
      where: { id: partnerId },
      data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count.id },
    });
  }
}
