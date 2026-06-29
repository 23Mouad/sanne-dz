import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { escapeHtml } from '../common/utils/sanitize.util';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);
  private logoDataUri = ''; // base64 logo, loaded once at startup

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  onModuleInit() {}

  /**
   * Returns a clean, single frontend URL — guards against FRONTEND_URL being
   * comma-separated (e.g. "https://textile-dz.tech,https://www.textile-dz.tech").
   */
  private getFrontendUrl(): string {
    const raw = this.getFrontendUrl();
    // Take only the first value if multiple are present
    return raw.split(',')[0].trim();
  }

  private getBaseTemplate(content: string, title: string): string {
    const logoSrc = 'https://textile-dz.tech/logoMain.png';
    const frontendUrl = this.getFrontendUrl();

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      color: #1f2937;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 40px 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .email-header {
      text-align: center;
      padding: 30px 20px 20px;
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
    }
    .email-header img {
      max-width: 180px;
      height: auto;
    }
    .email-body {
      padding: 30px 40px;
      line-height: 1.6;
    }
    .email-body h1 {
      font-size: 24px;
      color: #111827;
      margin-top: 0;
      margin-bottom: 20px;
      text-align: center;
    }
    .email-body p {
      margin-bottom: 16px;
      font-size: 16px;
      color: #4b5563;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .verification-code {
      display: block;
      width: fit-content;
      margin: 20px auto;
      padding: 15px 30px;
      background-color: #f9fafb;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 4px;
      color: #111827;
      text-align: center;
    }
    .info-box {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 16px 0;
    }
    .info-box p {
      margin: 4px 0;
      font-size: 14px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }
    .status-success { background-color: #d1fae5; color: #065f46; }
    .status-warning { background-color: #fef3c7; color: #92400e; }
    .status-danger { background-color: #fee2e2; color: #991b1b; }
    .status-info { background-color: #dbeafe; color: #1e40af; }
    .email-footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <img src="${logoSrc}" alt="Sanne Textile DZ Logo">
      </div>
      <div class="email-body">
        ${content}
      </div>
        <div class="email-footer">
          &copy; ${new Date().getFullYear()} Sanne Textile DZ. Tous droits réservés.<br>
          Ce message est généré automatiquement, merci de ne pas y répondre.
        </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  private async sendMail(to: string, subject: string, html: string) {
    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM', '"Sanne Textile DZ" <mouadev3@gmail.com>'),
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email successfully sent to ${to} for subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}: ${error.message}`, error.stack);
    }
  }

  // ===== VERIFICATION EMAIL =====
  async sendVerificationEmail(to: string, code: string) {
    const title = 'Vérification de votre compte Sanne Textile DZ';
    const content = `
      <h1>Bienvenue sur Sanne Textile DZ !</h1>
      <p>Merci de vous être inscrit. Pour activer votre compte, veuillez utiliser le code de vérification ci-dessous :</p>
      <div class="verification-code">${escapeHtml(code)}</div>
      <p>Ce code est valide pendant 1 minute. Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== WELCOME EMAIL (after verification) =====
  async sendWelcomeEmail(to: string, name: string, role: 'CLIENT' | 'PARTNER') {
    const title = 'Bienvenue sur Sanne Textile DZ !';
    const frontendUrl = this.getFrontendUrl();

    const roleText = role === 'PARTNER'
      ? 'En tant que partenaire, votre profil sera visible à des milliers de clients potentiels dans toute l\'Algérie.'
      : 'Vous pouvez maintenant explorer les meilleurs professionnels dans votre wilaya et les contacter directement.';

    const dashboardUrl = role === 'PARTNER' ? `${frontendUrl}/dashboard/partner` : `${frontendUrl}/search`;
    const btnText = role === 'PARTNER' ? 'Accéder à mon dashboard' : 'Explorer les partenaires';

    const content = `
      <h1>Bienvenue ${escapeHtml(name)} ! 🎉</h1>
      <p>Votre email a été vérifié avec succès et votre compte Sanne Textile DZ est maintenant actif.</p>
      <p>${roleText}</p>
      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="btn">${btnText}</a>
      </div>
      <p style="font-size: 14px; color: #9ca3af;">Merci de faire confiance à Sanne Textile DZ !</p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== FORGOT PASSWORD =====
  async sendForgotPasswordEmail(to: string, token: string) {
    const title = 'Réinitialisation de votre mot de passe';
    const frontendUrl = this.getFrontendUrl();
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const content = `
      <h1>Mot de passe oublié ?</h1>
      <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Sanne Textile DZ.</p>
      <p>Vous pouvez réinitialiser votre mot de passe en cliquant sur le bouton ci-dessous :</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="btn">Réinitialiser le mot de passe</a>
      </div>
      <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
      <a href="${resetUrl}" style="word-break: break-all; color: #3b82f6;">${resetUrl}</a></p>
      <p>Ce lien expirera dans 1 heure. Si vous n'avez pas fait cette demande, vous pouvez ignorer ce message en toute sécurité.</p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== PASSWORD RESET CONFIRMATION =====
  async sendPasswordResetConfirmation(to: string) {
    const title = 'Mot de passe réinitialisé avec succès';
    const frontendUrl = this.getFrontendUrl();

    const content = `
      <h1>Mot de passe modifié ✅</h1>
      <p>Votre mot de passe a été réinitialisé avec succès.</p>
      <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
      <div style="text-align: center;">
        <a href="${frontendUrl}/login" class="btn">Se connecter</a>
      </div>
      <div class="info-box">
        <p>⚠️ <strong>Si vous n'avez pas effectué cette modification</strong>, veuillez contacter immédiatement notre support à <a href="mailto:mouadev3@gmail.com">mouadev3@gmail.com</a>.</p>
      </div>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== SECURITY ALERT (password changed from dashboard) =====
  async sendSecurityAlert(to: string, action: string) {
    const title = 'Alerte de sécurité — Sanne Textile DZ';

    const content = `
      <h1>🔒 Alerte de sécurité</h1>
      <p>Une action de sécurité a été effectuée sur votre compte Sanne Textile DZ :</p>
      <div class="info-box">
        <p><strong>Action :</strong> ${escapeHtml(action)}</p>
        <p><strong>Date :</strong> ${new Date().toLocaleString('fr-DZ', { dateStyle: 'long', timeStyle: 'short' })}</p>
      </div>
      <p>Si vous n'êtes pas à l'origine de cette action, veuillez immédiatement changer votre mot de passe et contacter notre support.</p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== ACCOUNT SUSPENDED =====
  async sendAccountSuspended(to: string, businessName: string, reason?: string) {
    const title = 'Compte suspendu — Sanne Textile DZ';

    const reasonHtml = reason
      ? `<div class="info-box"><p><strong>Raison :</strong> ${escapeHtml(reason)}</p></div>`
      : '';

    const content = `
      <h1>Compte Suspendu</h1>
      <p>Bonjour,</p>
      <p>Nous vous informons que votre compte partenaire <strong>"${escapeHtml(businessName)}"</strong> a été suspendu par l'équipe Sanne Textile DZ.</p>
      ${reasonHtml}
      <p>Votre profil n'est plus visible sur la plateforme. Si vous pensez qu'il s'agit d'une erreur, veuillez nous contacter à <a href="mailto:mouadev3@gmail.com">mouadev3@gmail.com</a>.</p>
      <p><span class="status-badge status-warning">Suspendu</span></p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== ACCOUNT REACTIVATED =====
  async sendAccountReactivated(to: string, businessName: string) {
    const title = 'Compte réactivé — Sanne Textile DZ';
    const frontendUrl = this.getFrontendUrl();

    const content = `
      <h1>Compte Réactivé ! 🎉</h1>
      <p>Bonne nouvelle ! Votre compte partenaire <strong>"${escapeHtml(businessName)}"</strong> a été réactivé par l'équipe Sanne Textile DZ.</p>
      <p>Votre profil est de nouveau visible sur la plateforme et les clients peuvent vous trouver.</p>
      <div style="text-align: center;">
        <a href="${frontendUrl}/dashboard/partner" class="btn">Accéder à mon dashboard</a>
      </div>
      <p><span class="status-badge status-success">Actif</span></p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== ACCOUNT DELETED =====
  async sendAccountDeleted(to: string, name: string) {
    const title = 'Compte supprimé — Sanne Textile DZ';

    const content = `
      <h1>Au revoir ${escapeHtml(name)} 😢</h1>
      <p>Votre compte Sanne Textile DZ a été supprimé conformément à votre demande (ou par décision administrative).</p>
      <p>Toutes vos données ont été définitivement supprimées de notre plateforme.</p>
      <div class="info-box">
        <p>Si vous souhaitez revenir, vous êtes toujours le/la bienvenu(e) ! Créez un nouveau compte à tout moment sur <a href="https://sanne.dz">sanne.dz</a>.</p>
      </div>
      <p>Merci d'avoir fait partie de la communauté Sanne Textile DZ.</p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== ACCOUNT BANNED =====
  async sendAccountBanned(to: string, name: string) {
    const title = 'Compte désactivé — Sanne Textile DZ';

    const content = `
      <h1>Compte Désactivé</h1>
      <p>Bonjour ${escapeHtml(name)},</p>
      <p>Votre compte Sanne Textile DZ a été désactivé par l'équipe d'administration.</p>
      <p>Vous ne pouvez plus accéder à la plateforme. Si vous pensez qu'il s'agit d'une erreur, veuillez nous contacter.</p>
      <div class="info-box">
        <p>📧 Contact : <a href="mailto:mouadev3@gmail.com">mouadev3@gmail.com</a></p>
      </div>
      <p><span class="status-badge status-danger">Désactivé</span></p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== PLAN CHANGED =====
  async sendPlanChanged(to: string, plan: 'PRO' | 'SIMPLE', businessName: string) {
    const title = plan === 'PRO'
      ? 'Abonnement Pro Activé ! — Sanne Textile DZ'
      : 'Plan modifié — Sanne Textile DZ';

    const frontendUrl = this.getFrontendUrl();

    const planContent = plan === 'PRO' ? `
      <h1>Plan Pro Activé ! 🌟</h1>
      <p>Félicitations ! Votre compte partenaire <strong>"${escapeHtml(businessName)}"</strong> est maintenant en mode <strong>PRO</strong>.</p>
      <p>Vous bénéficiez maintenant de :</p>
      <ul style="color: #4b5563;">
        <li>✅ Photos illimitées + vidéos</li>
        <li>✅ Badge Premium sur votre profil</li>
        <li>✅ Priorité dans les résultats de recherche</li>
        <li>✅ Mise en avant sur la page d'accueil</li>
        <li>✅ Statistiques avancées</li>
        <li>✅ Support prioritaire</li>
      </ul>
      <div style="text-align: center;">
        <a href="${frontendUrl}/dashboard/partner" class="btn">Voir mon dashboard Pro</a>
      </div>
      <p><span class="status-badge status-success">Pro</span></p>
    ` : `
      <h1>Plan Modifié</h1>
      <p>Votre compte partenaire <strong>"${escapeHtml(businessName)}"</strong> est maintenant sur le <strong>Plan Simple</strong>.</p>
      <p>Certaines fonctionnalités Pro ne sont plus disponibles. Vous pouvez repasser au Plan Pro à tout moment depuis votre dashboard.</p>
      <div style="text-align: center;">
        <a href="${frontendUrl}/dashboard/partner/subscription" class="btn">Gérer mon abonnement</a>
      </div>
    `;

    await this.sendMail(to, title, this.getBaseTemplate(planContent, title));
  }

  // ===== REVIEW MODERATED =====
  async sendReviewModerated(to: string, status: 'APPROVED' | 'REJECTED', partnerName: string) {
    const title = status === 'APPROVED'
      ? 'Votre avis a été approuvé — Sanne Textile DZ'
      : 'Votre avis a été rejeté — Sanne Textile DZ';

    const content = status === 'APPROVED' ? `
      <h1>Avis Approuvé ✅</h1>
      <p>Bonne nouvelle ! Votre avis sur <strong>"${escapeHtml(partnerName)}"</strong> a été examiné et approuvé par notre équipe de modération.</p>
      <p>Il est maintenant visible publiquement sur le profil du partenaire.</p>
      <p>Merci pour votre contribution à la communauté Sanne Textile DZ !</p>
      <p><span class="status-badge status-success">Approuvé</span></p>
    ` : `
      <h1>Avis Rejeté</h1>
      <p>Votre avis sur <strong>"${escapeHtml(partnerName)}"</strong> a été examiné par notre équipe de modération et n'a pas été approuvé.</p>
      <p>Cela peut être dû à un contenu inapproprié ou ne respectant pas nos règles communautaires.</p>
      <div class="info-box">
        <p>Si vous pensez qu'il s'agit d'une erreur, contactez-nous à <a href="mailto:mouadev3@gmail.com">mouadev3@gmail.com</a>.</p>
      </div>
      <p><span class="status-badge status-danger">Rejeté</span></p>
    `;

    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== PARTNER REVIEW APPROVED (notify partner their review is now visible) =====
  async sendNewReviewApproved(to: string, businessName: string, rating: number) {
    const title = 'Un nouvel avis est visible sur votre profil — Sanne Textile DZ';
    const stars = '⭐'.repeat(rating);

    const content = `
      <h1>Nouvel avis publié ${stars}</h1>
      <p>Un avis qui était en modération sur votre profil <strong>"${escapeHtml(businessName)}"</strong> vient d'être approuvé et est maintenant visible par tous.</p>
      <div class="info-box">
        <p><strong>Note :</strong> ${rating}/5 ${stars}</p>
      </div>
      <p>Consultez vos avis depuis votre dashboard partenaire.</p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== FEATURED STATUS CHANGED =====
  async sendFeaturedStatus(to: string, isFeatured: boolean, businessName: string) {
    const title = isFeatured
      ? 'Vous êtes maintenant en vedette ! — Sanne Textile DZ'
      : 'Mise en avant retirée — Sanne Textile DZ';

    const frontendUrl = this.getFrontendUrl();

    const content = isFeatured ? `
      <h1>En Vedette ! ⭐</h1>
      <p>Félicitations ! Votre profil <strong>"${escapeHtml(businessName)}"</strong> est maintenant mis en avant sur la page d'accueil de Sanne Textile DZ.</p>
      <p>Cela signifie une visibilité accrue et plus de clients potentiels qui vous découvrent.</p>
      <div style="text-align: center;">
        <a href="${frontendUrl}" class="btn">Voir la page d'accueil</a>
      </div>
      <p><span class="status-badge status-success">En vedette</span></p>
    ` : `
      <h1>Mise en avant retirée</h1>
      <p>Votre profil <strong>"${escapeHtml(businessName)}"</strong> n'est plus mis en avant sur la page d'accueil.</p>
      <p>Votre profil reste bien sûr toujours visible dans les résultats de recherche.</p>
    `;

    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== DELETION REQUEST CONFIRMATION =====
  async sendDeletionRequestConfirmation(to: string, businessName: string) {
    const title = 'Demande de suppression reçue — Sanne Textile DZ';

    const content = `
      <h1>Demande de suppression reçue</h1>
      <p>Nous avons bien reçu votre demande de suppression pour le compte partenaire <strong>"${escapeHtml(businessName)}"</strong>.</p>
      <p>Notre équipe traitera votre demande dans les plus brefs délais. Vous recevrez un email de confirmation une fois la suppression effectuée.</p>
      <div class="info-box">
        <p>⚠️ <strong>Vous pouvez annuler cette demande</strong> en nous contactant à <a href="mailto:mouadev3@gmail.com">mouadev3@gmail.com</a> avant le traitement.</p>
      </div>
      <p><span class="status-badge status-warning">En attente de traitement</span></p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== GENERIC NOTIFICATION EMAIL =====
  async sendNotificationEmail(to: string, title: string, message: string, link?: string) {
    const frontendUrl = this.getFrontendUrl();
    let buttonHtml = '';
    
    if (link) {
      const fullUrl = link.startsWith('http') ? link : `${frontendUrl}${link}`;
      buttonHtml = `
        <div style="text-align: center; margin-top: 20px;">
          <a href="${fullUrl}" class="btn">Voir les détails</a>
        </div>
      `;
    }

    const content = `
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      ${buttonHtml}
    `;
    
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== ADMIN NOTIFICATION =====
  async sendAdminNotification(subject: string, message: string, metadata?: any) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    if (!adminEmail) {
      this.logger.warn('ADMIN_EMAIL is not defined in environment variables, skipping admin notification.');
      return;
    }

    let metadataHtml = '';
    if (metadata && Object.keys(metadata).length > 0) {
      metadataHtml = '<div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>Détails :</strong><ul>';
      for (const [key, value] of Object.entries(metadata)) {
        metadataHtml += `<li><strong>${escapeHtml(String(key))} :</strong> ${escapeHtml(String(value))}</li>`;
      }
      metadataHtml += '</ul></div>';
    }

    const content = `
      <h1>Alerte Administrateur</h1>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      ${metadataHtml}
    `;

    await this.sendMail(adminEmail, `[Admin Sanne Textile DZ] ${subject}`, this.getBaseTemplate(content, 'Alerte Administrateur'));
  }

  // ===== ACCOUNT UNBLOCKED =====
  async sendAccountUnbanned(to: string, name: string) {
    const title = 'Compte réactivé — Sanne Textile DZ';
    const frontendUrl = this.getFrontendUrl();

    const content = `
      <h1>Compte Réactivé ✅</h1>
      <p>Bonjour ${escapeHtml(name)},</p>
      <p>Bonne nouvelle ! Votre compte Sanne Textile DZ a été réactivé par l'équipe d'administration.</p>
      <p>Vous pouvez maintenant vous reconnecter et accéder à toutes les fonctionnalités de la plateforme.</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${frontendUrl}/login" class="btn">Se connecter</a>
      </div>
      <p><span class="status-badge status-success">Compte actif</span></p>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }

  // ===== ADMIN PASSWORD OTP =====
  async sendAdminPasswordOtp(to: string, otp: string) {
    const title = 'Code de confirmation — Changement de mot de passe administrateur';

    const content = `
      <h1>🔐 Confirmation de changement de mot de passe</h1>
      <p>Vous avez demandé à changer le mot de passe de votre compte administrateur Sanne Textile DZ.</p>
      <p>Voici votre code de vérification (valide 10 minutes) :</p>
      <div class="verification-code">${escapeHtml(otp)}</div>
      <p>Si vous n'avez pas fait cette demande, ignorez cet email. Votre mot de passe reste inchangé.</p>
      <div class="info-box">
        <p>⚠️ <strong>Ne partagez jamais ce code</strong> avec quiconque. L'équipe Sanne Textile DZ ne vous demandera jamais votre code.</p>
      </div>
    `;
    await this.sendMail(to, title, this.getBaseTemplate(content, title));
  }
}

