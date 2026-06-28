-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'PARTNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('SIMPLE', 'PRO');

-- CreateEnum
CREATE TYPE "SubscriptionCycle" AS ENUM ('MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_REVIEW', 'NEW_PARTNER', 'SUBSCRIPTION_EXPIRING', 'ACCOUNT_VALIDATED', 'ACCOUNT_REJECTED', 'PROMO', 'BROADCAST');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "wilayaId" TEXT,
    "avatar" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "fcmToken" TEXT,
    "refreshToken" TEXT,
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "emailVerifyToken" TEXT,
    "emailVerifyExpires" TIMESTAMP(3),
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "preferredCategoryIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wilayas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "wilayas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'from-gray-400 to-gray-600',
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "child_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_categories" (
    "partnerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "partner_categories_pkey" PRIMARY KEY ("partnerId","categoryId")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "coverUrl" TEXT,
    "wilayaId" TEXT,
    "address" TEXT,
    "mapLink" TEXT,
    "deliveryType" TEXT,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "registreCommerce" TEXT,
    "status" "PartnerStatus" NOT NULL DEFAULT 'PENDING',
    "isPro" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "rejectionReason" TEXT,
    "schedule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_photos" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_videos" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "promoPrice" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_stats" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "whatsappClicks" INTEGER NOT NULL DEFAULT 0,
    "phoneClicks" INTEGER NOT NULL DEFAULT 0,
    "favoritesCount" INTEGER NOT NULL DEFAULT 0,
    "viewsHistory" JSONB NOT NULL DEFAULT '[]',
    "clicksHistory" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "isReported" BOOLEAN NOT NULL DEFAULT false,
    "reportReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'SIMPLE',
    "cycle" "SubscriptionCycle" NOT NULL DEFAULT 'MONTHLY',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'DZD',
    "method" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_config" (
    "id" TEXT NOT NULL,
    "simplePriceMonthly" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "simplePriceAnnual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "proPriceMonthly" DOUBLE PRECISION NOT NULL DEFAULT 2500,
    "proPriceAnnual" DOUBLE PRECISION NOT NULL DEFAULT 28000,
    "trialDays" INTEGER NOT NULL DEFAULT 14,
    "annualDiscountPercent" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "wilayas_name_key" ON "wilayas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_slug_key" ON "sub_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "child_categories_slug_key" ON "child_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "partners_userId_key" ON "partners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "partners_slug_key" ON "partners"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "partner_stats_partnerId_key" ON "partner_stats"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_partnerId_authorId_key" ON "reviews"("partnerId", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_partnerId_key" ON "subscriptions"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_clientId_partnerId_key" ON "favorites"("clientId", "partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "app_config_key_key" ON "app_config"("key");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_wilayaId_fkey" FOREIGN KEY ("wilayaId") REFERENCES "wilayas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_categories" ADD CONSTRAINT "child_categories_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_categories" ADD CONSTRAINT "partner_categories_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_categories" ADD CONSTRAINT "partner_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_wilayaId_fkey" FOREIGN KEY ("wilayaId") REFERENCES "wilayas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_photos" ADD CONSTRAINT "partner_photos_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_videos" ADD CONSTRAINT "partner_videos_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_stats" ADD CONSTRAINT "partner_stats_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
