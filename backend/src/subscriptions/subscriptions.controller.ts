import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Public() @Get('config') getConfig() { return this.subscriptionsService.getConfig(); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @Get('me') getMine(@GetUser() user: { id: string }) { return this.subscriptionsService.getMine(user.id); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @Post('upgrade') upgrade(@GetUser() user: { id: string }, @Body('cycle') cycle: 'MONTHLY' | 'ANNUAL') {
    return this.subscriptionsService.upgrade(user.id, cycle ?? 'MONTHLY');
  }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @Post('downgrade') downgrade(@GetUser() user: { id: string }) { return this.subscriptionsService.downgrade(user.id); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @Get('history') getHistory(@GetUser() user: { id: string }) { return this.subscriptionsService.getPaymentHistory(user.id); }

  // ===== ADMIN =====
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Put('config') updateConfig(@Body() data: Record<string, number>) { return this.subscriptionsService.updateConfig(data); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Get() getAll(@Query('page') page: number) { return this.subscriptionsService.adminGetAll(page); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Put(':partnerId/plan') changePlan(@Param('partnerId') id: string, @Body('plan') plan: 'PRO' | 'SIMPLE') {
    return this.subscriptionsService.adminChangePlan(id, plan);
  }

  // ===== MANUAL PAYMENTS (PRO UPGRADE) =====

  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @Post('request-upgrade')
  async requestUpgrade(
    @GetUser() user: { id: string },
    @Body('cycle') cycle: 'MONTHLY' | 'ANNUAL',
    @Body('whatsappClicked') whatsappClicked: boolean,
    @Body('receiptSent') receiptSent: boolean
  ) {
    try {
      return await this.subscriptionsService.requestUpgrade(user.id, cycle ?? 'MONTHLY', whatsappClicked || false, receiptSent || false);
    } catch (e: any) {
      return { success: false, error: e.message || e.toString(), stack: e.stack };
    }
  }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @Get('pending-request')
  getPendingRequest(@GetUser() user: { id: string }) {
    return this.subscriptionsService.getPendingRequest(user.id);
  }

  @Public()
  @Get('debug-upgrade')
  async debugUpgrade() {
    try {
      const p = await this.subscriptionsService['prisma'].partner.findFirst({ include: { user: true } });
      if (!p) throw new Error('No partner found');
      return await this.subscriptionsService.requestUpgrade(p.userId, 'MONTHLY', false, true);
    } catch(e: any) {
      return { error: e.message, stack: e.stack };
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Get('payments/pending')
  getPendingPayments(@Query('page') page: number) {
    return this.subscriptionsService.adminGetPendingPayments(page ? Number(page) : 1);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Put('payments/:id/approve')
  approvePayment(@Param('id') id: string) {
    return this.subscriptionsService.adminApprovePayment(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) @ApiBearerAuth()
  @Put('payments/:id/reject')
  rejectPayment(@Param('id') id: string) {
    return this.subscriptionsService.adminRejectPayment(id);
  }
}
