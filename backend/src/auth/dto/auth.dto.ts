import {
  IsEmail, IsString, MinLength, MaxLength, IsPhoneNumber,
  Matches, IsBoolean, IsOptional, IsArray, ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const PHONE_REGEX = /^(0(5|6|7)\d{8}|\+213(5|6|7)\d{8})$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// ===== REGISTER CLIENT =====
export class RegisterClientDto {
  @ApiProperty({ example: 'Amina' })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Bensalem' })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'amina@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0555123456' })
  @Matches(PHONE_REGEX, { message: 'Invalid Algerian phone number (must start with 05, 06, or 07)' })
  phone: string;

  @ApiProperty({ example: '16' })
  @IsString()
  wilayaId: string;

  @ApiProperty({ example: 'Amina@123' })
  @Matches(PASSWORD_REGEX, {
    message: 'Password must be at least 8 characters with uppercase, lowercase, and a digit',
  })
  password: string;

  @ApiProperty({ example: 'Amina@123' })
  @IsString()
  confirmPassword: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  acceptTerms: boolean;
}

// ===== REGISTER PARTNER =====
export class RegisterPartnerDto {
  @ApiProperty({ example: 'Atelier Fatouma' })
  @IsString()
  @MaxLength(100)
  businessName: string;

  @ApiProperty({ example: 'fatouma@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0555123456' })
  @Matches(PHONE_REGEX, { message: 'Invalid Algerian phone number' })
  phone: string;

  @ApiProperty({ example: '213555123456' })
  @Matches(PHONE_REGEX, { message: 'Invalid Algerian WhatsApp number' })
  whatsapp: string;

  @ApiProperty({ example: '16' })
  @IsString()
  wilayaId: string;

  @ApiProperty({ example: '12 Rue Didouche Mourad, Alger' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mapLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deliveryType?: string;

  @ApiProperty({ example: ['ateliers-couture'], description: 'Simple plan: max 1 category. Pro: multiple.' })
  @IsArray()
  @ArrayNotEmpty()
  categorySlugs: string[];

  @ApiProperty({ example: 'Spécialiste en robes traditionnelles...' })
  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters' })
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  registreCommerce?: string;

  @ApiProperty({ example: 'Fatouma@123' })
  @Matches(PASSWORD_REGEX, {
    message: 'Password must be at least 8 characters with uppercase, lowercase, and a digit',
  })
  password: string;

  @ApiProperty({ example: 'Fatouma@123' })
  @IsString()
  confirmPassword: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  acceptTerms: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  acceptPartnerConditions: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPro?: boolean;
}

// ===== LOGIN =====
export class LoginDto {
  @ApiProperty({ example: 'amina@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Amina@123' })
  @IsString()
  password: string;
}

// ===== REFRESH TOKEN =====
export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

// ===== VERIFY EMAIL =====
export class VerifyEmailDto {
  @ApiProperty({ example: 'amina@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;
}

// ===== RESEND VERIFICATION =====
export class ResendVerificationDto {
  @ApiProperty({ example: 'amina@gmail.com' })
  @IsEmail()
  email: string;
}

// ===== FORGOT PASSWORD =====
export class ForgotPasswordDto {
  @ApiProperty({ example: 'amina@gmail.com' })
  @IsEmail()
  email: string;
}

// ===== RESET PASSWORD =====
export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewAmina@456' })
  @Matches(PASSWORD_REGEX, {
    message: 'Password must be at least 8 characters with uppercase, lowercase, and a digit',
  })
  password: string;

  @ApiProperty({ example: 'NewAmina@456' })
  @IsString()
  confirmPassword: string;
}
