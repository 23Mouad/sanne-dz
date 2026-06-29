import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3001;
  const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';
  const isProduction = nodeEnv === 'production';

  // ===== Request Body Size Limits =====
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  // ===== Security Headers =====
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow serving /uploads
      contentSecurityPolicy: isProduction ? {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      } : false, // Disable CSP in development for Swagger etc.
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true } : false,
    }),
  );
  app.use(compression());

  // ===== CORS (Web + Flutter) =====
  const frontendUrls = (config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000')
    .split(',').map(o => o.trim());
const allowedOrigins = [
    ...frontendUrls,
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost', // Flutter web dev
  ];

  // Add mobile allowed origins from env
  const mobileOrigins = config.get<string>('MOBILE_ALLOWED_ORIGINS');
  if (mobileOrigins) {
    allowedOrigins.push(...mobileOrigins.split(',').map(o => o.trim()));
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ===== Global Validation =====
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strip unknown fields
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ===== Global API Prefix =====
  app.setGlobalPrefix('api/v1');

  // ===== Ensure upload directories exist =====
  const uploadBase = join(process.cwd(), 'uploads');
  ['avatars', 'logos', 'covers', 'photos', 'videos', 'products'].forEach((dir) =>
    mkdirSync(join(uploadBase, dir), { recursive: true }),
  );

  // ===== Swagger (disabled in production) =====
  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Sanne DZ API')
      .setDescription('Backend API for Sanne DZ marketplace — Web + Flutter')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  console.log(`🚀 Sanne DZ API running on http://localhost:${port}/api/v1`);
  console.log(`🌍 Environment: ${nodeEnv}`);
}

bootstrap();
