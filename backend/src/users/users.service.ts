import {
  Injectable, BadRequestException, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { IsString, MinLength, Matches, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export class UpdateProfileDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() firstName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() lastName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() wilayaId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
}

export class ChangePasswordDto {
  @ApiProperty() @IsString() currentPassword: string;
  @ApiProperty() @Matches(PASSWORD_REGEX, { message: 'Weak password' }) newPassword: string;
  @ApiProperty() @IsString() confirmNewPassword: string;
}

export class UpdateFcmTokenDto {
  @ApiProperty() @IsString() fcmToken: string;
}

export class UpdatePreferredCategoriesDto {
  @ApiProperty({ type: [String] }) @IsArray() categoryIds: string[];
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, phone: true, firstName: true, lastName: true,
        role: true, avatar: true, isEmailVerified: true,
        preferredCategoryIds: true, createdAt: true,
        wilaya: { select: { id: true, name: true } },
        partner: { select: { id: true, slug: true, businessName: true, status: true, isPro: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.wilayaId) {
      const wilaya = await this.prisma.wilaya.findUnique({ where: { id: dto.wilayaId } });
      if (!wilaya) throw new BadRequestException('Invalid wilaya');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, firstName: true, lastName: true, wilayaId: true, phone: true },
    });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: { id: true, avatar: true },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword)
      throw new BadRequestException('Passwords do not match');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed, refreshToken: null },
    });

    // Send security alert email
    this.mailService.sendSecurityAlert(user.email, 'Mot de passe modifié depuis votre tableau de bord');

    return { message: 'Password changed successfully' };
  }

  async updateFcmToken(userId: string, dto: UpdateFcmTokenDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { fcmToken: dto.fcmToken },
    });
    return { message: 'FCM token updated' };
  }

  async updatePreferredCategories(userId: string, dto: UpdatePreferredCategoriesDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { preferredCategoryIds: dto.categoryIds },
      select: { id: true, preferredCategoryIds: true },
    });
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true } });
    
    // Send goodbye email BEFORE deletion
    if (user) {
      await this.mailService.sendAccountDeleted(user.email, user.firstName);
    }

    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Account deleted successfully' };
  }
}
