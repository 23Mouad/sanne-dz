import {
  Injectable, BadRequestException, UnauthorizedException,
  ConflictException, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomInt, randomBytes, timingSafeEqual } from 'crypto';
import {
  RegisterClientDto, RegisterPartnerDto, LoginDto,
  RefreshTokenDto, VerifyEmailDto, ResendVerificationDto,
  ForgotPasswordDto, ResetPasswordDto,
} from './dto/auth.dto';
import { UserRole } from '@prisma/client';
import { MailService } from '../mail/mail.service';

const BCRYPT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MINUTES = 15;
const MAX_OTP_ATTEMPTS = 5;

/**
 * Extended user type that includes the security fields added in the latest
 * schema migration. We define this locally because the IDE may resolve
 * @prisma/client to the static package stub (not the generated client)
 * under moduleResolution:nodenext, causing false "property does not exist" errors.
 */
interface UserWithSecurity {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerifyToken: string | null;
  emailVerifyExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  refreshToken: string | null;
  refreshTokenExpiresAt: Date | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  [key: string]: unknown;
}

interface UserWithPartner extends UserWithSecurity {
  partner: {
    id: string;
    status: string;
    isPro: boolean;
    slug: string;
    businessName: string;
  } | null;
}

interface PendingRegistration {
  type: 'CLIENT' | 'PARTNER';
  otp: string;
  expires: Date;
  hashedPassword?: string;
  dto: any;
  categories?: any[];
  slug?: string;
  requestedPro?: boolean;
}

@Injectable()
export class AuthService {
  private pendingRegistrations = new Map<string, PendingRegistration>();

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  // ===== Helpers =====
  private generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
  }

  private normalizePhone(phone: string): string {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('0')) return '+213' + cleaned.slice(1);
    return cleaned;
  }

  /**
   * Timing-safe comparison for OTP codes.
   * Prevents timing side-channel attacks that can leak token length.
   */
  private safeCompareOtp(provided: string, stored: string): boolean {
    if (!provided || !stored) return false;
    const maxLen = Math.max(provided.length, stored.length);
    const a = Buffer.from(provided.padEnd(maxLen, '\0'));
    const b = Buffer.from(stored.padEnd(maxLen, '\0'));
    return a.length === b.length && timingSafeEqual(a, b);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed, refreshTokenExpiresAt: expiresAt },
    });
  }

  // ===== REGISTER CLIENT =====
  async registerClient(dto: RegisterClientDto) {
    if (dto.password !== dto.confirmPassword)
      throw new BadRequestException('Passwords do not match');
    if (!dto.acceptTerms)
      throw new BadRequestException('You must accept the terms and conditions');

    const normalizedPhone = this.normalizePhone(dto.phone);
    const normalizedEmail = dto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: normalizedEmail }, { phone: normalizedPhone }] },
    });
    if (existing) {
      if (existing.email === normalizedEmail)
        throw new ConflictException('Email already registered');
      throw new ConflictException('Phone number already registered');
    }

    const wilaya = await this.prisma.wilaya.findUnique({ where: { id: dto.wilayaId } });
    if (!wilaya) throw new BadRequestException('Invalid wilaya');

    const hashed = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const otp = this.generateOtp();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000); // 1 min

    // SECURITY: Store pending registration in memory until OTP is verified.
    // Do NOT create the user in the database yet to avoid database pollution.
    this.pendingRegistrations.set(normalizedEmail, {
      type: 'CLIENT',
      otp,
      expires: otpExpires,
      hashedPassword: hashed,
      dto: { ...dto, email: normalizedEmail, phone: normalizedPhone }
    });

    await this.mailService.sendVerificationEmail(normalizedEmail, otp);

    return {
      message: 'Registration successful. Please verify your email to activate your account.',
      email: normalizedEmail,
      ...(this.config.get('NODE_ENV') !== 'production' && { verificationCode: otp }),
    };
  }

  // ===== REGISTER PARTNER =====
  async registerPartner(dto: RegisterPartnerDto) {
    if (dto.password !== dto.confirmPassword)
      throw new BadRequestException('Passwords do not match');
    if (!dto.acceptTerms || !dto.acceptPartnerConditions)
      throw new BadRequestException('You must accept all terms and conditions');

    if (dto.categorySlugs.length === 0)
      throw new BadRequestException('At least one category is required');

    const normalizedPhone = this.normalizePhone(dto.phone);
    const normalizedWhatsapp = this.normalizePhone(dto.whatsapp);
    const normalizedEmail = dto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: normalizedEmail }, { phone: normalizedPhone }] },
    });
    if (existing) {
      if (existing.email === normalizedEmail)
        throw new ConflictException('Email already registered');
      throw new ConflictException('Phone number already registered');
    }

    const wilaya = await this.prisma.wilaya.findUnique({ where: { id: dto.wilayaId } });
    if (!wilaya) throw new BadRequestException('Invalid wilaya');

    const categories = await this.prisma.category.findMany({
      where: { slug: { in: dto.categorySlugs }, isActive: true },
    });
    if (categories.length === 0)
      throw new BadRequestException('No valid categories found');

    const hashed = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const otp = this.generateOtp();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000);

    let slug = this.generateSlug(dto.businessName);
    const slugExists = await this.prisma.partner.findUnique({ where: { slug } });
    if (slugExists) slug = `${slug}-${Date.now()}`;

    // Detect if Pro plan was requested (client input only — actual Pro granted by admin)
    const requestedPro = !!(dto as any).isPro;

    // SECURITY: Store pending registration in memory until OTP is verified.
    this.pendingRegistrations.set(normalizedEmail, {
      type: 'PARTNER',
      otp,
      expires: otpExpires,
      hashedPassword: hashed,
      dto: { ...dto, email: normalizedEmail, phone: normalizedPhone, whatsapp: normalizedWhatsapp },
      categories: categories.map(c => ({ categoryId: c.id })),
      slug,
      requestedPro,
    });

    await this.mailService.sendVerificationEmail(normalizedEmail, otp);

    return {
      message: 'Registration successful. Please verify your email to activate your account.',
      email: normalizedEmail,
      ...(this.config.get('NODE_ENV') !== 'production' && { verificationCode: otp }),
    };
  }

  // ===== LOGIN =====
  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    // Fetch user with ALL fields (no select) + partner relation.
    // We explicitly type this so TypeScript knows about failedLoginAttempts/lockedUntil.
    const user = (await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        partner: {
          select: { id: true, status: true, isPro: true, slug: true, businessName: true },
        },
      },
    })) as UserWithPartner | null;

    // SECURITY: Always return generic message to prevent email enumeration
    if (!user) throw new UnauthorizedException('Invalid email or password');

    // SECURITY: Account lockout — check if account is locked
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      const remainingMs = user.lockedUntil.getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      throw new ForbiddenException(
        `Account temporarily locked due to too many failed attempts. Try again in ${remainingMin} minute(s).`,
      );
    }

    // SECURITY: Check if email is verified before allowing login
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email address before logging in. Check your inbox for the verification code.');
    }

    if (!user.isActive) throw new UnauthorizedException('Account is deactivated. Please contact support.');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      const newAttempts = (user.failedLoginAttempts ?? 0) + 1;
      const updateData: Record<string, unknown> = { failedLoginAttempts: newAttempts };

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOGIN_LOCKOUT_MINUTES * 60 * 1000);
        updateData.failedLoginAttempts = 0;
        this.mailService.sendSecurityAlert(
          user.email,
          `Compte verrouillé après ${MAX_LOGIN_ATTEMPTS} tentatives de connexion échouées.`,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await this.prisma.user.update({ where: { id: user.id }, data: updateData as any });
      throw new UnauthorizedException('Invalid email or password');
    }

    // SECURITY: Reset failed attempts on successful login
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null } as any,
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { password, refreshToken, emailVerifyToken, passwordResetToken, ...safeUser } = user;

    return { ...tokens, user: safeUser };
  }

  // ===== REFRESH TOKEN =====
  async refresh(dto: RefreshTokenDto) {
    let payload: { sub: string; email: string; role: string };
    try {
      payload = await this.jwt.verifyAsync(dto.refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.refreshToken || !user.isActive)
      throw new UnauthorizedException('Invalid session');

    const refreshExpired = user.refreshTokenExpiresAt
      ? new Date() > user.refreshTokenExpiresAt
      : false;
    if (refreshExpired) throw new UnauthorizedException('Session expired, please login again');

    const valid = await bcrypt.compare(dto.refreshToken, user.refreshToken);
    if (!valid) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // ===== LOGOUT =====
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null, refreshTokenExpiresAt: null },
    });
    return { message: 'Logged out successfully' };
  }

  // ===== VERIFY EMAIL =====
  async verifyEmail(dto: VerifyEmailDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    // 1. Check in-memory pending registrations first
    if (this.pendingRegistrations.has(normalizedEmail)) {
      const pending = this.pendingRegistrations.get(normalizedEmail)!;
      
      if (pending.expires && new Date() > pending.expires) {
        this.pendingRegistrations.delete(normalizedEmail);
        throw new BadRequestException('Verification code expired. Please request a new one.');
      }
      
      if (!this.safeCompareOtp(dto.code, pending.otp)) {
        throw new BadRequestException('Invalid verification code');
      }

      // OTP is valid! Create the user in the database now.
      let user;
      if (pending.type === 'CLIENT') {
        user = await this.prisma.user.create({
          data: {
            email: pending.dto.email,
            phone: pending.dto.phone,
            firstName: pending.dto.firstName.trim(),
            lastName: pending.dto.lastName.trim(),
            password: pending.hashedPassword!,
            role: UserRole.CLIENT,
            wilayaId: pending.dto.wilayaId,
            isActive: true, // Now fully active
            isEmailVerified: true,
          },
          include: { partner: true },
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            email: pending.dto.email,
            phone: pending.dto.phone,
            firstName: pending.dto.businessName.trim(),
            lastName: '',
            password: pending.hashedPassword!,
            role: UserRole.PARTNER,
            wilayaId: pending.dto.wilayaId,
            isActive: true, // Now fully active
            isEmailVerified: true,
            partner: {
              create: {
                slug: pending.slug!,
                businessName: pending.dto.businessName.trim(),
                description: pending.dto.description,
                isPro: false,
                requestedPro: pending.requestedPro,
                email: pending.dto.email,
                phone: pending.dto.phone,
                whatsapp: pending.dto.whatsapp,
                wilayaId: pending.dto.wilayaId,
                address: pending.dto.address,
                mapLink: pending.dto.mapLink,
                deliveryType: pending.dto.deliveryType,
                registreCommerce: pending.dto.registreCommerce,
                categories: {
                  create: pending.categories,
                },
                stats: { create: {} },
              },
            },
          },
          include: { partner: true },
        });
      }

      // Remove from pending
      this.pendingRegistrations.delete(normalizedEmail);

      // Send welcome email
      this.mailService.sendWelcomeEmail(user.email, user.firstName, user.role as 'CLIENT' | 'PARTNER');

      // Send admin notification if partner
      if (pending.type === 'PARTNER') {
        if (pending.requestedPro) {
          await this.mailService.sendAdminNotification(
            'Nouvelle demande de partenaire PRO',
            `Le partenaire "${pending.dto.businessName}" vient de s'inscrire et a demandé le plan PRO. En attente de votre validation.`,
            { Email: user.email, Téléphone: user.phone, WhatsApp: pending.dto.whatsapp, 'Plan demandé': 'PRO' }
          );
        } else {
          await this.mailService.sendAdminNotification(
            'Nouvelle demande de partenaire',
            `Le partenaire "${pending.dto.businessName}" vient de s'inscrire et attend votre validation.`,
            { Email: user.email, Téléphone: user.phone, WhatsApp: pending.dto.whatsapp }
          );
        }
      }

      // Issue tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return {
        message: 'Email verified successfully. Your account is now active.',
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          partner: user.partner,
        },
      };
    }

    // 2. Fallback to DB check (for users who already were inserted before this update)
    const dbUser = (await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        partner: {
          select: { id: true, status: true, isPro: true, slug: true, businessName: true },
        },
      },
    })) as (UserWithSecurity & { partner: any }) | null;

    if (!dbUser) throw new NotFoundException('User not found');
    if (dbUser.isEmailVerified) throw new BadRequestException('Email already verified');
    if (!dbUser.emailVerifyToken) throw new BadRequestException('No verification pending');

    if (dbUser.emailVerifyExpires && new Date() > dbUser.emailVerifyExpires)
      throw new BadRequestException('Verification code expired. Please request a new one.');

    // SECURITY: Brute-force protection for OTP
    const otpAttempts = dbUser.failedLoginAttempts ?? 0;
    if (otpAttempts >= MAX_OTP_ATTEMPTS) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await this.prisma.user.update({
        where: { id: dbUser.id },
        data: { emailVerifyToken: null, emailVerifyExpires: null, failedLoginAttempts: 0 } as any,
      });
      throw new BadRequestException(
        'Too many failed verification attempts. Please request a new code.',
      );
    }

    // SECURITY: Timing-safe OTP comparison
    if (!this.safeCompareOtp(dto.code, dbUser.emailVerifyToken as string)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await this.prisma.user.update({
        where: { id: dbUser.id },
        data: { failedLoginAttempts: (dbUser.failedLoginAttempts ?? 0) + 1 } as any,
      });
      throw new BadRequestException('Invalid verification code');
    }

    // Activate account and mark email as verified
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.prisma.user.update({
      where: { id: dbUser.id },
      data: {
        isEmailVerified: true,
        isActive: true, // Activate the account
        emailVerifyToken: null,
        emailVerifyExpires: null,
        failedLoginAttempts: 0,
      } as any,
    });

    // Send welcome email
    this.mailService.sendWelcomeEmail(
      dbUser.email,
      dbUser.firstName,
      dbUser.role as 'CLIENT' | 'PARTNER',
    );

    // Now issue tokens so the user can log in immediately after verification
    const tokens = await this.generateTokens(dbUser.id, dbUser.email, dbUser.role);
    await this.saveRefreshToken(dbUser.id, tokens.refreshToken);

    return {
      message: 'Email verified successfully. Your account is now active.',
      ...tokens,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
        partner: dbUser.partner,
      },
    };
  }

  // ===== RESEND VERIFICATION =====
  async resendVerification(dto: ResendVerificationDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    // 1. Check in-memory pending registrations first
    if (this.pendingRegistrations.has(normalizedEmail)) {
      const pending = this.pendingRegistrations.get(normalizedEmail)!;
      
      if (pending.expires) {
        const tokenIssuedAt = new Date(pending.expires.getTime() - 60 * 1000);
        const elapsed = Date.now() - tokenIssuedAt.getTime();
        const remaining = Math.ceil((60 * 1000 - elapsed) / 1000);
        if (remaining > 0) {
          throw new BadRequestException(`Veuillez patienter ${remaining} seconde(s) avant de renvoyer le code.`);
        }
      }

      const otp = this.generateOtp();
      const otpExpires = new Date(Date.now() + 1 * 60 * 1000);
      
      pending.otp = otp;
      pending.expires = otpExpires;
      
      await this.mailService.sendVerificationEmail(normalizedEmail, otp);

      return {
        message: 'Verification code sent',
        ...(this.config.get('NODE_ENV') !== 'production' && { verificationCode: otp }),
      };
    }

    // 2. Fallback to database
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified) throw new BadRequestException('Email already verified');

    // Enforce 1-minute cooldown
    if (user.emailVerifyExpires) {
      const tokenIssuedAt = new Date(user.emailVerifyExpires.getTime() - 60 * 1000);
      const elapsed = Date.now() - tokenIssuedAt.getTime();
      const remaining = Math.ceil((60 * 1000 - elapsed) / 1000);
      if (remaining > 0) {
        throw new BadRequestException(`Veuillez patienter ${remaining} seconde(s) avant de renvoyer le code.`);
      }
    }

    const otp = this.generateOtp();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: otp,
        emailVerifyExpires: otpExpires,
        failedLoginAttempts: 0,
      } as any,
    });

    await this.mailService.sendVerificationEmail(user.email, otp);

    return {
      message: 'Verification code sent',
      ...(this.config.get('NODE_ENV') !== 'production' && { verificationCode: otp }),
    };
  }

  // ===== FORGOT PASSWORD =====
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    // Always return success to prevent email enumeration
    if (!user) return { message: 'If the email exists, a reset link was sent' };

    // Enforce 1-minute cooldown between reset requests
    if (user.passwordResetExpires) {
      const tokenIssuedAt = new Date(user.passwordResetExpires.getTime() - 60 * 60 * 1000);
      const elapsed = Date.now() - tokenIssuedAt.getTime();
      const remaining = Math.ceil((60 * 1000 - elapsed) / 1000);
      if (remaining > 0) {
        throw new BadRequestException(`Veuillez patienter ${remaining} seconde(s) avant de renvoyer un lien.`);
      }
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // SECURITY: Hash the reset token before storing in DB
    const hashedToken = await bcrypt.hash(token, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: hashedToken, passwordResetExpires: expires },
    });

    this.mailService.sendForgotPasswordEmail(user.email, token);

    return {
      message: 'If the email exists, a reset link was sent',
      ...(this.config.get('NODE_ENV') !== 'production' && { resetToken: token }),
    };
  }

  // ===== RESET PASSWORD =====
  async resetPassword(dto: ResetPasswordDto) {
    if (dto.password !== dto.confirmPassword)
      throw new BadRequestException('Passwords do not match');

    // SECURITY: Since reset tokens are hashed, we scan users with active reset tokens
    // and use bcrypt.compare to find the matching one.
    const usersWithResetTokens = await this.prisma.user.findMany({
      where: {
        passwordResetToken: { not: null },
        passwordResetExpires: { gt: new Date() },
      },
      select: { id: true, passwordResetToken: true, passwordResetExpires: true },
    });

    let matchedUserId: string | null = null;
    for (const u of usersWithResetTokens) {
      if (u.passwordResetToken && await bcrypt.compare(dto.token, u.passwordResetToken)) {
        matchedUserId = u.id;
        break;
      }
    }

    if (!matchedUserId) throw new BadRequestException('Invalid or expired reset token');

    const hashed = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.prisma.user.update({
      where: { id: matchedUserId },
      data: {
        password: hashed,
        passwordResetToken: null,
        passwordResetExpires: null,
        refreshToken: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      } as any,
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: matchedUserId },
      select: { email: true },
    });
    if (updatedUser) {
      this.mailService.sendPasswordResetConfirmation(updatedUser.email);
    }

    return { message: 'Password reset successfully. Please login.' };
  }

  // ===== GET ME =====
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, phone: true, firstName: true, lastName: true,
        role: true, avatar: true, isEmailVerified: true, isPhoneVerified: true,
        preferredCategoryIds: true, createdAt: true,
        wilaya: { select: { id: true, name: true } },
        partner: {
          select: {
            id: true, slug: true, businessName: true, status: true,
            isPro: true, logoUrl: true, createdAt: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
