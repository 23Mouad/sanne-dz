import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFile, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';
import {
  UpdatePartnerProfileDto, UpdateCategoriesDto, AddPhotoDto, AddVideoDto,
  UpdatePhotoDto, CreateProductDto, UpdateProductDto, PartnerSearchDto,
} from './dto/partner.dto';

const imageUploadInterceptor = (subDir: string) =>
  FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', subDir),
      filename: (_req, file, cb) => cb(null, `${uuidv4()}${extname(file.originalname)}`),
    }),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
        return cb(new Error('Only jpeg, png, webp images are allowed'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });
const videoUploadInterceptor = (subDir: string) =>
  FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', subDir),
      filename: (_req, file, cb) => cb(null, `${uuidv4()}${extname(file.originalname)}`),
    }),
  });
const imageFilePipe = new ParseFilePipe({ validators: [] });



const videoFilePipe = new ParseFilePipe({ validators: [] });





@ApiTags('Partners')
@Controller('partners')
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  // ===== PUBLIC =====
  @Public()
  @Get()
  @ApiOperation({ summary: 'Search and list active partners' })
  findAll(@Query() dto: PartnerSearchDto) {
    return this.partnersService.findAll(dto);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured Pro partners' })
  findFeatured() {
    return this.partnersService.findFeatured();
  }

  // ===== PARTNER DASHBOARD =====
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get own partner profile (dashboard)' })
  getMyProfile(@GetUser() user: { id: string }) {
    return this.partnersService.getMyProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('me')
  @ApiOperation({ summary: 'Update own partner profile' })
  updateMyProfile(@GetUser() user: { id: string }, @Body() dto: UpdatePartnerProfileDto) {
    return this.partnersService.updateMyProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('me/logo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor('logos'))
  @ApiOperation({ summary: 'Upload partner logo' })
  uploadLogo(
    @GetUser() user: { id: string },
    @UploadedFile(imageFilePipe) file: Express.Multer.File,
  ) {
    return this.partnersService.updateLogo(user.id, `/uploads/logos/${file.filename}`);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('me/cover')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor('covers'))
  @ApiOperation({ summary: 'Upload partner cover image' })
  uploadCover(
    @GetUser() user: { id: string },
    @UploadedFile(imageFilePipe) file: Express.Multer.File,
  ) {
    return this.partnersService.updateCover(user.id, `/uploads/covers/${file.filename}`);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('me/categories')
  @ApiOperation({ summary: 'Update partner categories (Simple: 1, Pro: multiple)' })
  updateCategories(@GetUser() user: { id: string }, @Body() dto: UpdateCategoriesDto) {
    return this.partnersService.updateCategories(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/stats')
  @ApiOperation({ summary: 'Get partner stats' })
  getStats(@GetUser() user: { id: string }) {
    return this.partnersService.getMyStats(user.id);
  }

  // ===== PHOTOS =====
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/photos')
  getPhotos(@GetUser() user: { id: string }) {
    return this.partnersService.getPhotos(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('me/photos')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor('photos'))
  @ApiOperation({ summary: 'Upload photo (Simple: max 3, Pro: max 20)' })
  addPhoto(
    @GetUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: AddPhotoDto,
  ) {
    return this.partnersService.addPhoto(user.id, `/uploads/photos/${file.filename}`, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('me/photos/:id')
  updatePhoto(@GetUser() user: { id: string }, @Param('id') id: string, @Body() dto: UpdatePhotoDto) {
    return this.partnersService.updatePhoto(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('me/photos/:id')
  deletePhoto(@GetUser() user: { id: string }, @Param('id') id: string) {
    return this.partnersService.deletePhoto(user.id, id);
  }

  // ===== VIDEOS (Pro only) =====
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/videos')
  getVideos(@GetUser() user: { id: string }) {
    return this.partnersService.getVideos(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('me/videos')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(videoUploadInterceptor('videos'))
  @ApiOperation({ summary: 'Add video (Pro only)' })
  addVideo(
    @GetUser() user: { id: string },
    @UploadedFile(videoFilePipe) file: Express.Multer.File,
    @Body() dto: AddVideoDto,
  ) {
    if (file) {
      dto.url = `/uploads/videos/${file.filename}`;
    }
    return this.partnersService.addVideo(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('me/videos/:id')
  deleteVideo(@GetUser() user: { id: string }, @Param('id') id: string) {
    return this.partnersService.deleteVideo(user.id, id);
  }

  // ===== PRODUCTS =====
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/products')
  getProducts(@GetUser() user: { id: string }) {
    return this.partnersService.getProducts(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('me/products')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor('products'))
  @ApiOperation({ summary: 'Add product (Simple: max 3, Pro: unlimited)' })
  addProduct(
    @GetUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/products/${file.filename}`;
    }
    return this.partnersService.addProduct(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('me/products/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageUploadInterceptor('products'))
  updateProduct(
    @GetUser() user: { id: string },
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProductDto,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/products/${file.filename}`;
    }
    return this.partnersService.updateProduct(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('me/products/:id')
  deleteProduct(@GetUser() user: { id: string }, @Param('id') id: string) {
    return this.partnersService.deleteProduct(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/stats')
  @ApiOperation({ summary: 'Get partner statistics' })
  getMyStats(@GetUser() user: { id: string }) {
    return this.partnersService.getMyStats(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('me/request-deletion')
  @ApiOperation({ summary: 'Request partner account deletion' })
  requestDeletion(@GetUser() user: { id: string }) {
    return this.partnersService.requestDeletion(user.id);
  }

  // ===== PUBLIC: By Slug (MUST BE LAST to avoid matching 'me') =====
  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get partner public profile by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.partnersService.findBySlug(slug);
  }

  @Public()
  @Post(':id/view')
  @HttpCode(HttpStatus.OK)
  recordView(@Param('id') id: string) {
    return this.partnersService.recordView(id);
  }

  @Public()
  @Post(':id/whatsapp-click')
  @HttpCode(HttpStatus.OK)
  recordWhatsapp(@Param('id') id: string) {
    return this.partnersService.recordWhatsappClick(id);
  }

  @Public()
  @Post(':id/phone-click')
  @HttpCode(HttpStatus.OK)
  recordPhone(@Param('id') id: string) {
    return this.partnersService.recordPhoneClick(id);
  }
}
