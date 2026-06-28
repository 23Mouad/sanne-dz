import {
  Controller, Get, Put, Delete, Body, UseGuards,
  UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UsersService, UpdateProfileDto, ChangePasswordDto, UpdateFcmTokenDto, UpdatePreferredCategoriesDto } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get own profile' })
  getProfile(@GetUser() user: { id: string }) {
    return this.usersService.getProfile(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update own profile' })
  updateProfile(@GetUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Put('profile/avatar')
  @ApiOperation({ summary: 'Upload profile avatar' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'avatars'),
        filename: (_req, file, cb) =>
          cb(null, `${uuidv4()}${extname(file.originalname)}`),
      }),
    }),
  )
  uploadAvatar(
    @GetUser() user: { id: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const url = `/uploads/avatars/${file.filename}`;
    return this.usersService.updateAvatar(user.id, url);
  }

  @Put('change-password')
  @ApiOperation({ summary: 'Change own password' })
  changePassword(@GetUser() user: { id: string }, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto);
  }

  @Put('fcm-token')
  @ApiOperation({ summary: 'Update FCM push token (mobile)' })
  updateFcmToken(@GetUser() user: { id: string }, @Body() dto: UpdateFcmTokenDto) {
    return this.usersService.updateFcmToken(user.id, dto);
  }

  @Put('preferred-categories')
  @ApiOperation({ summary: 'Update preferred categories' })
  updatePreferredCategories(
    @GetUser() user: { id: string },
    @Body() dto: UpdatePreferredCategoriesDto,
  ) {
    return this.usersService.updatePreferredCategories(user.id, dto);
  }

  @Delete('account')
  @ApiOperation({ summary: 'Delete own account permanently' })
  deleteAccount(@GetUser() user: { id: string }) {
    return this.usersService.deleteAccount(user.id);
  }
}
