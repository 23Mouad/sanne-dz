import { IsString, IsOptional, IsUrl, IsEmail, IsArray, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const PHONE_REGEX = /^(0(5|6|7)\d{8}|\+213(5|6|7)\d{8})$/;

export class UpdatePartnerProfileDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(100) businessName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() whatsapp?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() wilayaId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() mapLink?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() deliveryType?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() website?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() facebook?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() instagram?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tiktok?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() registreCommerce?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() schedule?: Record<string, unknown>;
  
  @ApiProperty({ required: false }) @IsOptional() @IsString() minOrder?: string;
  @ApiProperty({ required: false }) @IsOptional() remoteWork?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsString() appointmentStatus?: string;
  @ApiProperty({ required: false }) @IsOptional() deliveryAvailable?: boolean;
  
  @ApiProperty({ required: false, type: [String] }) @IsOptional() @IsArray() services?: string[];
  @ApiProperty({ required: false, type: [String] }) @IsOptional() @IsArray() achievements?: string[];
}

export class UpdateCategoriesDto {
  @ApiProperty({ type: [String] }) @IsArray() categorySlugs: string[];
}

export class AddPhotoDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() caption?: string;
  @ApiProperty({ required: false }) @IsOptional() order?: number;
}

export class AddVideoDto {
  @ApiProperty({ required: false }) @IsOptional() url?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() thumbnail?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() caption?: string;
}

export class UpdatePhotoDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() caption?: string;
  @ApiProperty({ required: false }) @IsOptional() order?: number;
}

export class CreateProductDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(100) name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() price?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsString() promoPrice?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
}

export class UpdateProductDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(100) name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() price?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsString() promoPrice?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() isActive?: any;
}

export class PartnerSearchDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() q?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() wilayaId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() categorySlug?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() subCategorySlug?: string;
  @ApiProperty({ required: false }) @IsOptional() plan?: 'SIMPLE' | 'PRO' | '';
  @ApiProperty({ required: false }) @IsOptional() sort?: 'rating' | 'reviews' | 'recent' | 'relevance';
  @ApiProperty({ required: false }) @IsOptional() page?: number;
  @ApiProperty({ required: false }) @IsOptional() limit?: number;
}
