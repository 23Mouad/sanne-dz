import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';

export class BroadcastDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() message: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() link?: string;
  @ApiProperty({ required: false, enum: ['all', 'partners', 'clients', 'specific'] }) @IsOptional() @IsString() target?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() wilayaId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() categorySlug?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() specificEmails?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { data: notifications, meta: { total, unreadCount, page, totalPages: Math.ceil(total / limit) } };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({ where: { userId, isRead: false } });
    return { count };
  }

  async markRead(userId: string, notifId: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id: notifId } });
    if (!notif || notif.userId !== userId) throw new NotFoundException('Notification not found');
    await this.prisma.notification.update({ where: { id: notifId }, data: { isRead: true } });
    return { message: 'Marked as read' };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    return { message: 'All marked as read' };
  }

  async delete(userId: string, notifId: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id: notifId } });
    if (!notif || notif.userId !== userId) throw new NotFoundException('Notification not found');
    await this.prisma.notification.delete({ where: { id: notifId } });
    return { message: 'Notification deleted' };
  }

  // ===== ADMIN: Broadcast =====
  async broadcast(dto: BroadcastDto) {
    const where: any = { isActive: true };

    if (dto.target === 'partners') {
      // Only users who have a partner profile
      const partners = await this.prisma.partner.findMany({
        where: {
          status: 'ACTIVE',
          ...(dto.wilayaId ? { wilayaId: dto.wilayaId } : {}),
          ...(dto.categorySlug ? { categories: { some: { category: { slug: dto.categorySlug } } } } : {}),
        },
        select: { userId: true },
      });
      where.id = { in: partners.map(p => p.userId) };
    } else if (dto.target === 'clients') {
      where.role = 'CLIENT';
      if (dto.wilayaId) where.wilayaId = dto.wilayaId;
    } else if (dto.target === 'specific') {
      if (dto.specificEmails) {
        const emails = dto.specificEmails.split(',').map(e => e.trim()).filter(Boolean);
        if (emails.length > 0) {
          where.email = { in: emails };
        } else {
          where.id = 'none'; // Prevent sending to all if specificEmails is empty
        }
      } else {
        where.id = 'none';
      }
    } else {
      // 'all' - everyone
      if (dto.wilayaId) where.wilayaId = dto.wilayaId;
    }

    const users = await this.prisma.user.findMany({ where, select: { id: true, email: true } });
    
    if (users.length > 0) {
      await this.prisma.notification.createMany({
        data: users.map((u) => ({
          userId: u.id,
          type: NotificationType.BROADCAST,
          title: dto.title,
          message: dto.message,
          link: dto.link,
        })),
      });

      // Send emails to all targeted users
      for (const u of users) {
        this.mailService.sendNotificationEmail(u.email, dto.title, dto.message, dto.link);
      }
    }

    // Log the broadcast for admin history
    await this.prisma.broadcastLog.create({
      data: {
        title: dto.title,
        message: dto.message,
        target: dto.target || 'all',
        wilayaId: dto.wilayaId,
        categorySlug: dto.categorySlug,
        count: users.length,
      },
    });

    return { message: `Broadcast sent to ${users.length} users`, count: users.length };
  }

  // ===== ADMIN: Get broadcast history =====
  async getBroadcastHistory(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.broadcastLog.findMany({
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.broadcastLog.count(),
    ]);
    return { data: logs, meta: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  // ===== ADMIN: Delete broadcast log =====
  async deleteBroadcastLog(logId: string) {
    await this.prisma.broadcastLog.delete({ where: { id: logId } });
    return { message: 'Broadcast log deleted' };
  }

  // ===== Internal: create notification for a user =====
  async createForUser(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    data?: any,
  ) {
    const notification = await this.prisma.notification.create({
      data: { userId, type, title, message, link, data },
    });

    // Fetch user email to send the notification
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (user && user.email) {
      this.mailService.sendNotificationEmail(user.email, title, message, link);
    }

    return notification;
  }
}
