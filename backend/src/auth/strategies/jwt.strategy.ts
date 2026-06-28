import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET')!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    // Use Prisma.UserGetPayload so TypeScript knows ALL fields including
    // the new failedLoginAttempts / lockedUntil regardless of IDE type cache.
    type ValidatedUser = Prisma.UserGetPayload<{
      select: {
        id: true;
        email: true;
        role: true;
        isActive: true;
        isEmailVerified: true;
        firstName: true;
        lastName: true;
        partner: {
          select: { id: true; status: true; isPro: true };
        };
      };
    }> & { lockedUntil?: Date | null };

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        firstName: true,
        lastName: true,
        partner: {
          select: {
            id: true,
            status: true,
            isPro: true,
          },
        },
      },
    }) as ValidatedUser | null;

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    // SECURITY: Reject locked accounts — fetch lockedUntil separately
    // to avoid the IDE type resolution issue with the new schema field.
    const lockCheck = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { lockedUntil: true } as Prisma.UserSelect,
    }) as { lockedUntil: Date | null } | null;

    if (lockCheck?.lockedUntil && new Date() < lockCheck.lockedUntil) {
      throw new UnauthorizedException('Account temporarily locked');
    }

    return user;
  }
}
