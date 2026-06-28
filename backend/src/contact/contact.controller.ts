import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactService, CreateContactDto } from './contact.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  submit(@Body() dto: CreateContactDto) { return this.contactService.submit(dto); }
}
