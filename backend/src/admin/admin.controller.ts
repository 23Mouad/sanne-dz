import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

// ===== DTOs (proper validation instead of `any`) =====
export class RejectDto { @ApiProperty() @IsString() reason: string; }
export class SuspendDto { @ApiProperty({ required: false }) @IsOptional() @IsString() reason?: string; }

export class UpdateSubscriptionConfigDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() proPriceMonthly?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() proPriceAnnual?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() simplePriceMonthly?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() simplePriceAnnual?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() trialDays?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() annualDiscountPercent?: number;
}

export class UpdatePartnerPlanDto {
  @ApiProperty() @IsBoolean() isPro: boolean;
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Partners
  @Get('partners')
  getPartners(@Query('status') status: string, @Query('search') search: string, @Query('page') page: number) {
    return this.adminService.getPartners(status, search, page);
  }

  @Put('partners/:id/approve')
  approve(@Param('id') id: string) { return this.adminService.approvePartner(id); }

  @Put('partners/:id/reject')
  reject(@Param('id') id: string, @Body() dto: RejectDto) { return this.adminService.rejectPartner(id, dto.reason); }

  @Put('partners/:id/suspend')
  suspend(@Param('id') id: string, @Body() dto: SuspendDto) { return this.adminService.suspendPartner(id, dto.reason); }

  @Put('partners/:id/reactivate')
  reactivate(@Param('id') id: string) { return this.adminService.reactivatePartner(id); }

  @Put('partners/:id/featured')
  toggleFeatured(@Param('id') id: string) { return this.adminService.toggleFeatured(id); }

  @Delete('partners/:id')
  deletePartner(@Param('id') id: string) { return this.adminService.deletePartner(id); }

  // Users
  @Get('users')
  getUsers(@Query('search') search: string, @Query('page') page: number) { return this.adminService.getUsers(search, page); }

  @Put('users/:id/ban')
  banUser(@Param('id') id: string) { return this.adminService.banUser(id); }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) { return this.adminService.deleteUser(id); }

  // Stats
  @Get('stats') getStats() { return this.adminService.getStats(); }
  @Get('stats/top-wilayas') getTopWilayas() { return this.adminService.getTopWilayas(); }
  @Get('stats/top-categories') getTopCategories() { return this.adminService.getTopCategories(); }

  // Subscriptions — now with proper DTO validation
  @Get('config/subscription')
  getSubscriptionConfig() { return this.adminService.getSubscriptionConfig(); }

  @Put('config/subscription')
  updateSubscriptionConfig(@Body() dto: UpdateSubscriptionConfigDto) {
    return this.adminService.updateSubscriptionConfig(dto);
  }

  @Put('partners/:id/plan')
  updatePartnerPlan(@Param('id') id: string, @Body() dto: UpdatePartnerPlanDto) {
    return this.adminService.updatePartnerPlan(id, dto.isPro);
  }

  // Export
  @Get('export/partners') exportPartners() { return this.adminService.exportPartners(); }
  @Get('export/clients') exportClients() { return this.adminService.exportClients(); }

  // Settings
  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  updateSettings(@Body() data: Record<string, unknown>) {
    // Sanitize: Only allow string values, reject objects/arrays
    const stringified: Record<string, string> = {};
    for (const [key, val] of Object.entries(data)) {
      if (typeof val === 'object' && val !== null) continue; // Skip nested objects
      stringified[key] = String(val ?? '');
    }
    return this.adminService.updateSettings(stringified);
  }
}
