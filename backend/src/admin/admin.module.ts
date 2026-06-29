import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [NotificationsModule, MailModule, ConfigModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
