import { Controller, Get, Put, Delete, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService, BroadcastDto } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getAll(@GetUser() user: { id: string }, @Query('page') page: number) {
    return this.notificationsService.getAll(user.id, page);
  }

  @Get('unread-count')
  getUnreadCount(@GetUser() user: { id: string }) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Put(':id/read')
  @HttpCode(HttpStatus.OK)
  markRead(@GetUser() user: { id: string }, @Param('id') id: string) {
    return this.notificationsService.markRead(user.id, id);
  }

  @Put('read-all')
  @HttpCode(HttpStatus.OK)
  markAllRead(@GetUser() user: { id: string }) {
    return this.notificationsService.markAllRead(user.id);
  }

  @Delete(':id')
  deleteOne(@GetUser() user: { id: string }, @Param('id') id: string) {
    return this.notificationsService.delete(user.id, id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('broadcast')
  broadcast(@Body() dto: BroadcastDto) {
    return this.notificationsService.broadcast(dto);
  }

  // Admin: broadcast history
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('broadcast/history')
  getBroadcastHistory(@Query('page') page: number) {
    return this.notificationsService.getBroadcastHistory(page);
  }

  // Admin: delete a broadcast log entry
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('broadcast/log/:id')
  deleteBroadcastLog(@Param('id') id: string) {
    return this.notificationsService.deleteBroadcastLog(id);
  }
}
