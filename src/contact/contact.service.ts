import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit, // Pour forcer une erreur au démarrage si config manquante
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService implements OnModuleInit {
  private readonly logger = new Logger(ContactService.name);
  private readonly adminEmail: string; // Toujours un string, jamais undefined

  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    // Récupération temporaire pour vérification
    const emailFromEnv = this.configService.get<string>('ADMIN_EMAIL');

    if (!emailFromEnv) {
      this.logger.error('⚠️ ADMIN_EMAIL est ABSENT du fichier .env');
      this.logger.error('Le service de contact ne pourra pas fonctionner.');
      // On n'assigne pas encore adminEmail → on le fera dans onModuleInit après crash contrôlé si besoin
    }

    // On assigne uniquement si présent (TypeScript est content car on sait que c'est string)
    this.adminEmail = emailFromEnv as string;
  }

  // Cette méthode est appelée au démarrage du module → on peut bloquer l'app si config critique manquante
  onModuleInit() {
    if (!this.adminEmail) {
      throw new Error(
        'Configuration critique manquante : ADMIN_EMAIL n\'est pas défini dans le fichier .env. L\'application ne peut pas démarrer.',
      );
    }

    this.logger.log(`✅ Email admin configuré avec succès : ${this.adminEmail}`);
  }

  async send(dto: CreateContactDto): Promise<{ message: string }> {
    // Pas besoin de re-vérifier ici : si on est arrivé là, adminEmail est forcément défini
    try {
      // Envoi parallèle des deux emails
      await Promise.all([
        this.sendAdminNotification(dto),
        this.sendClientConfirmation(dto),
      ]);

      this.logger.log(
        `Message de contact envoyé – De : ${dto.name} <${dto.email}> – Sujet : "${dto.subject}"`,
      );

      return { message: 'Message envoyé avec succès' };
    } catch (error) {
      this.logger.error(
        `Échec de l'envoi du message de contact de ${dto.email}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException(
        'Impossible d’envoyer votre message pour le moment. Veuillez réessayer plus tard.',
      );
    }
  }

  private async sendAdminNotification(dto: CreateContactDto) {
    const subject = `Nouveau message de contact : ${dto.subject} – ${dto.name}`;

    const html = `
      <h2 style="color: #f39c12; font-family: Arial, sans-serif;">Nouveau message via le formulaire de contact</h2>
      <ul style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.8; padding-left: 20px;">
        <li><strong>Nom :</strong> ${this.escapeHtml(dto.name)}</li>
        <li><strong>Email :</strong> <a href="mailto:${dto.email}">${dto.email}</a></li>
        <li><strong>Téléphone :</strong> ${dto.phone ? this.escapeHtml(dto.phone) : 'Non renseigné'}</li>
        <li><strong>Sujet :</strong> ${this.escapeHtml(dto.subject)}</li>
      </ul>

      <div style="background:#f8f9fa; padding:20px; border-left:4px solid #f39c12; margin:20px 0; font-family: Arial, sans-serif;">
        <strong>Message :</strong><br><br>
        <p style="white-space: pre-wrap; margin:0;">${this.escapeHtml(dto.message)}</p>
      </div>

      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
      <small style="color:#95a5a6; font-family: Arial, sans-serif;">
        Reçu le ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
      </small>
    `;

    await this.mailService.sendMail(this.adminEmail, subject, html);
  }

  private async sendClientConfirmation(dto: CreateContactDto) {
    const subject = 'Nous avons bien reçu votre message – Volailles d’Or 🐔';

    const html = `
      <h2 style="color: #f39c12; font-family: Arial, sans-serif;">Bonjour ${this.escapeHtml(dto.name)},</h2>
      <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
        Merci d’avoir pris contact avec <strong>Volailles d’Or</strong> ! 🐔
      </p>
      <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
        Nous avons bien reçu votre message concernant :<br>
        <strong>"${this.escapeHtml(dto.subject)}"</strong>
      </p>

      <div style="background:#f8f9fa; padding:20px; margin:30px 0; border-left:4px solid #f39c12; font-family: Arial, sans-serif;">
        <em style="white-space: pre-wrap;">${this.escapeHtml(dto.message)}</em>
      </div>

      <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
        Nous vous répondrons dans les plus brefs délais.
      </p>
      <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
        À très bientôt,<br>
        <strong>L’équipe Volailles d’Or</strong>
      </p>
    `;

    await this.mailService.sendMail(dto.email, subject, html);
  }

  // Fonction sécurisée pour empêcher les injections XSS dans les emails
  private escapeHtml(text: string | undefined | null): string {
    if (text == null || text === '') {
      return '';
    }
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (match) => map[match]);
  }
}