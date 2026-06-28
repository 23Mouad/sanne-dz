import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';

export class CreateContactDto {
  @ApiProperty() @IsString() @MaxLength(100) name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MaxLength(200) subject: string;
  @ApiProperty() @IsString() @MaxLength(2000) message: string;
}

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async submit(dto: CreateContactDto) {
    await this.prisma.contactMessage.create({ data: dto });
    
    // Notify admin
    this.mailService.sendAdminNotification(
      'Nouveau message de contact',
      `Vous avez reçu un nouveau message de contact depuis le site.`,
      {
        Nom: dto.name,
        Email: dto.email,
        Sujet: dto.subject,
        Message: dto.message,
      }
    );

    return { message: 'Your message has been received. We will get back to you soon.' };
  }
}
