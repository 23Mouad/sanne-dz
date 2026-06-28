import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getConfig() {
    let config = await this.prisma.subscriptionConfig.findFirst();
    if (!config) {
      config = await this.prisma.subscriptionConfig.create({
        data: { simplePriceMonthly: 0, simplePriceAnnual: 0, proPriceMonthly: 2500, proPriceAnnual: 28000 },
      });
    }
    return config;
  }

  async getMine(userId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      include: { subscription: { include: { payments: { orderBy: { createdAt: 'desc' }, take: 10 } } } },
    });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner.subscription;
  }

  async upgrade(userId: string, cycle: 'MONTHLY' | 'ANNUAL') {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const config = await this.getConfig();
    const price = cycle === 'ANNUAL' ? config.proPriceAnnual : config.proPriceMonthly;

    const endDate = new Date();
    if (cycle === 'ANNUAL') endDate.setFullYear(endDate.getFullYear() + 1);
    else endDate.setMonth(endDate.getMonth() + 1);

    // Update partner isPro and subscription
    await Promise.all([
      this.prisma.partner.update({ where: { id: partner.id }, data: { isPro: true } }),
      this.prisma.subscription.upsert({
        where: { partnerId: partner.id },
        create: { partnerId: partner.id, plan: 'PRO', cycle, startDate: new Date(), endDate, price, isActive: true },
        update: { plan: 'PRO', cycle, startDate: new Date(), endDate, price, isActive: true },
      }),
    ]);

    // Payment stub — wire real gateway later
    return {
      success: true,
      message: 'Plan upgraded to Pro. Payment gateway will be integrated soon.',
      plan: 'PRO', cycle, price,
      paymentStatus: 'pending',
    };
  }

  async downgrade(userId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId }, include: { user: { select: { email: true } } } });
    if (!partner) throw new NotFoundException('Partner not found');
    if (!partner.isPro) throw new ForbiddenException('Already on Simple plan');

    await Promise.all([
      this.prisma.partner.update({ where: { id: partner.id }, data: { isPro: false, isFeatured: false } }),
      this.prisma.subscription.update({ where: { partnerId: partner.id }, data: { plan: 'SIMPLE', price: 0 } }),
    ]);

    // Send email about downgrade
    this.mailService.sendPlanChanged(partner.user.email, 'SIMPLE', partner.businessName);

    return { message: 'Downgraded to Simple plan. Some features are now restricted.' };
  }

  async getPaymentHistory(userId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      include: { subscription: { include: { payments: { orderBy: { createdAt: 'desc' } } } } },
    });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner.subscription?.payments ?? [];
  }

  async updateConfig(data: { proPriceMonthly?: number; proPriceAnnual?: number; simplePriceMonthly?: number; simplePriceAnnual?: number }) {
    let config = await this.prisma.subscriptionConfig.findFirst();
    if (!config) {
      config = await this.prisma.subscriptionConfig.create({ data: {} });
    }
    return this.prisma.subscriptionConfig.update({ where: { id: config.id }, data });
  }

  async adminGetAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [subs, total] = await Promise.all([
      this.prisma.subscription.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { partner: { select: { businessName: true, wilaya: { select: { name: true } } } } },
      }),
      this.prisma.subscription.count(),
    ]);
    return { data: subs, meta: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async adminChangePlan(partnerId: string, plan: 'PRO' | 'SIMPLE') {
    await Promise.all([
      this.prisma.partner.update({ where: { id: partnerId }, data: { isPro: plan === 'PRO' } }),
      this.prisma.subscription.upsert({
        where: { partnerId },
        create: { partnerId, plan, isActive: true },
        update: { plan },
      }),
    ]);
    return { message: `Plan changed to ${plan}` };
  }

  // ===== MANUAL PAYMENTS (PRO UPGRADE) =====

  async requestUpgrade(userId: string, cycle: 'MONTHLY' | 'ANNUAL', whatsappClicked: boolean, receiptSent: boolean) {
    const partner = await this.prisma.partner.findUnique({ where: { userId }, include: { subscription: true } });
    if (!partner) throw new NotFoundException('Partner not found');

    const config = await this.getConfig();
    const price = cycle === 'ANNUAL' ? config.proPriceAnnual : config.proPriceMonthly;

    // Create or update subscription record (keep current plan until approved)
    const sub = await this.prisma.subscription.upsert({
      where: { partnerId: partner.id },
      create: { partnerId: partner.id, plan: 'SIMPLE', cycle, isActive: true, price: 0 },
      update: {}, // don't change existing active sub until payment is approved
    });

    // Find if there's already a pending manual payment
    let payment = await this.prisma.payment.findFirst({
      where: { subscriptionId: sub.id, status: 'PENDING', method: 'MANUAL' },
    });

    if (payment) {
      // Update existing pending payment metadata
      const meta = payment.metadata as Record<string, any> || {};
      payment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          metadata: { ...meta, whatsappClicked: meta.whatsappClicked || whatsappClicked, receiptSent: meta.receiptSent || receiptSent, cycle },
        },
      });
    } else {
      // Create new pending payment
      payment = await this.prisma.payment.create({
        data: {
          subscriptionId: sub.id,
          amount: price,
          method: 'MANUAL',
          status: 'PENDING',
          metadata: { whatsappClicked, receiptSent, cycle },
        },
      });
    }

    // Send admin notification
    this.mailService.sendAdminNotification(
      'Demande d\'abonnement Pro',
      `Le partenaire "${partner.businessName}" vient de demander un passage à l'abonnement PRO (${cycle}). Veuillez vérifier le paiement via la méthode manuelle.`,
      {
        'Nom du partenaire': partner.businessName,
        'Cycle demandé': cycle,
        'Reçu envoyé': receiptSent ? 'Oui' : 'Non',
        'WhatsApp cliqué': whatsappClicked ? 'Oui' : 'Non',
      }
    );

    return { success: true, payment, message: 'Upgrade request recorded' };
  }

  async getPendingRequest(userId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId }, include: { subscription: true } });
    if (!partner || !partner.subscription) return null;

    const payment = await this.prisma.payment.findFirst({
      where: { subscriptionId: partner.subscription.id, status: 'PENDING', method: 'MANUAL' },
      orderBy: { createdAt: 'desc' },
    });

    return payment;
  }

  async adminGetPendingPayments(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    // We only show payments where the user either clicked WhatsApp OR sent the receipt
    const whereClause = {
      status: 'PENDING' as const,
      method: 'MANUAL',
      OR: [
        { metadata: { path: ['receiptSent'], equals: true } },
        { metadata: { path: ['whatsappClicked'], equals: true } },
      ]
    };

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: whereClause,
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          subscription: {
            include: {
              partner: {
                select: {
                  businessName: true,
                  phone: true,
                  whatsapp: true,
                  user: { select: { firstName: true, lastName: true, email: true } },
                }
              }
            }
          }
        },
      }),
      this.prisma.payment.count({ where: whereClause }),
    ]);

    return { data: payments, meta: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async adminApprovePayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { subscription: { include: { partner: { include: { user: true } } } } },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const meta = payment.metadata as Record<string, any>;
    const cycle = meta?.cycle === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
    
    const endDate = new Date();
    if (cycle === 'ANNUAL') endDate.setFullYear(endDate.getFullYear() + 1);
    else endDate.setMonth(endDate.getMonth() + 1);

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'SUCCESS' },
      }),
      this.prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: { plan: 'PRO', cycle, price: payment.amount, startDate: new Date(), endDate, isActive: true },
      }),
      this.prisma.partner.update({
        where: { id: payment.subscription.partnerId },
        data: { isPro: true },
      }),
      this.prisma.notification.create({
        data: {
          userId: payment.subscription.partner.userId,
          type: 'ACCOUNT_VALIDATED',
          title: 'Abonnement Pro Activé !',
          message: 'Votre paiement a été approuvé et votre compte est maintenant en mode PRO.',
          link: '/dashboard/partner/subscription'
        }
      })
    ]);

    // Send email notification about Pro activation
    if (payment.subscription?.partner?.user?.email) {
      this.mailService.sendPlanChanged(
        payment.subscription.partner.user.email,
        'PRO',
        payment.subscription.partner.businessName,
      );
    }

    return { success: true, message: 'Payment approved, subscription activated' };
  }

  async adminRejectPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { subscription: { include: { partner: true } } },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'FAILED' },
      }),
      this.prisma.notification.create({
        data: {
          userId: payment.subscription.partner.userId,
          type: 'ACCOUNT_REJECTED',
          title: 'Paiement Refusé',
          message: 'Votre demande d\'abonnement a été refusée. Veuillez vérifier vos informations de paiement.',
          link: '/dashboard/partner/subscription/payment'
        }
      })
    ]);

    // Send email notification about payment rejection
    if (payment.subscription?.partner) {
      const partnerUser = await this.prisma.user.findUnique({ where: { id: payment.subscription.partner.userId }, select: { email: true } });
      if (partnerUser) {
        this.mailService.sendNotificationEmail(
          partnerUser.email,
          'Paiement Refusé',
          'Votre demande d\'abonnement Pro a été refusée. Veuillez vérifier vos informations de paiement et réessayer.',
          '/dashboard/partner/subscription/payment',
        );
      }
    }

    return { success: true, message: 'Payment rejected' };
  }

  // ===== AUTOMATED TASKS =====
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredSubscriptions() {
    this.logger.log('Running daily check for expired PRO subscriptions...');
    
    // Find all active PRO subscriptions that have passed their end date
    const expiredSubscriptions = await this.prisma.subscription.findMany({
      where: {
        plan: 'PRO',
        isActive: true,
        endDate: { lt: new Date() },
      },
      include: {
        partner: {
          include: { user: { select: { email: true } } }
        }
      }
    });

    if (expiredSubscriptions.length === 0) {
      this.logger.log('No expired subscriptions found.');
      return;
    }

    this.logger.log(`Found ${expiredSubscriptions.length} expired subscriptions. Downgrading to SIMPLE plan...`);

    for (const sub of expiredSubscriptions) {
      try {
        await this.prisma.$transaction([
          this.prisma.partner.update({
            where: { id: sub.partnerId },
            data: { isPro: false, isFeatured: false },
          }),
          this.prisma.subscription.update({
            where: { id: sub.id },
            data: { plan: 'SIMPLE', price: 0 },
          }),
          this.prisma.notification.create({
            data: {
              userId: sub.partner.userId,
              type: 'ACCOUNT_VALIDATED', // Re-using type for general notification or if there's a specific type for expiry use it.
              title: 'Abonnement Pro Expiré',
              message: 'Votre abonnement PRO est arrivé à terme. Vous êtes de retour sur le plan SIMPLE.',
              link: '/dashboard/partner/subscription'
            }
          })
        ]);

        if (sub.partner?.user?.email) {
          this.mailService.sendPlanChanged(sub.partner.user.email, 'SIMPLE', sub.partner.businessName);
        }
      } catch (error) {
        this.logger.error(`Failed to downgrade partner ${sub.partnerId}`, error);
      }
    }

    this.logger.log('Finished checking expired subscriptions.');
  }
}
