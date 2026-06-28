import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
