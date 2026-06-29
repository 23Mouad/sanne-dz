import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService, CreateReviewDto, UpdateReviewDto, ReportReviewDto, ModerateReviewDto } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Public()
  @Get('partner/:partnerId')
  getPartnerReviews(
    @Param('partnerId') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.reviewsService.getPartnerReviews(id, page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @Get('me/partner/:partnerId')
  getMyReviewForPartner(@GetUser() user: { id: string }, @Param('partnerId') partnerId: string) {
    return this.reviewsService.getMyReviewForPartner(user.id, partnerId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @Post()
  create(@GetUser() user: { id: string }, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @Put(':id')
  update(@GetUser() user: { id: string }, @Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @Delete(':id')
  delete(@GetUser() user: { id: string }, @Param('id') id: string) {
    return this.reviewsService.delete(user.id, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @Post(':id/report')
  @HttpCode(HttpStatus.OK)
  report(@GetUser() user: { id: string }, @Param('id') id: string, @Body() dto: ReportReviewDto) {
    return this.reviewsService.report(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  getMyReviews(@GetUser() user: { id: string }) {
    return this.reviewsService.getMyReviews(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @Get('partner-dashboard')
  getPartnerDashboardReviews(@GetUser() user: { id: string }, @Query('page') page: string, @Query('limit') limit: string) {
    return this.reviewsService.getPartnerDashboardReviews(user.id, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
  }

  // ===== ADMIN =====
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/all')
  getAdminAll(@Query('status') status: string, @Query('page') page: number) {
    return this.reviewsService.getAdminAll(status, page);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('admin/:id')
  adminDelete(@Param('id') id: string) {
    return this.reviewsService.adminDelete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Put(':id/approve')
  @HttpCode(HttpStatus.OK)
  approve(@Param('id') id: string) {
    return this.reviewsService.approve(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Put(':id/reject')
  @HttpCode(HttpStatus.OK)
  reject(@Param('id') id: string, @Body() dto: ModerateReviewDto) {
    return this.reviewsService.reject(id, dto);
  }
}
