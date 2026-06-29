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
    
    // Notify mouadev3 directly
    this.mailService.sendNotificationEmail(
      'mouadev3@gmail.com',
      'Nouveau message de contact',
      `Vous avez reçu un nouveau message de contact depuis le site.\n\nNom: ${dto.name}\nEmail: ${dto.email}\nSujet: ${dto.subject}\nMessage: ${dto.message}`
    );

    return { message: 'Your message has been received. We will get back to you soon.' };
  }
}
