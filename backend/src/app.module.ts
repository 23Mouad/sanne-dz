import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PartnersModule } from './partners/partners.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';
import { WilayasModule } from './wilayas/wilayas.module';
import { ContactModule } from './contact/contact.module';
import { MailModule } from './mail/mail.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate Limiting (global: 100 req/min per IP)
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 100 }]),

    // Serve uploaded files statically
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // Core
    PrismaModule,
    ScheduleModule.forRoot(),

    // Feature Modules
    AuthModule,
    UsersModule,
    PartnersModule,
    CategoriesModule,
    ReviewsModule,
    FavoritesModule,
    NotificationsModule,
    SubscriptionsModule,
    AdminModule,
    WilayasModule,
    ContactModule,
    MailModule,
  ],
  providers: [
    // Global rate limit guard
    { provide: APP_GUARD, useClass: ThrottlerGuard },

    // Global JWT guard (bypass with @Public())
    { provide: APP_GUARD, useClass: JwtAuthGuard },

    // Global roles guard
    { provide: APP_GUARD, useClass: RolesGuard },

    // Wrap all responses in standard format
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },

    // Global exception handler
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
