import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
