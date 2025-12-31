import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: Number(this.configService.get<string>('MAIL_PORT')),
            secure: this.configService.get<string>('MAIL_SECURE') === 'true', // false pour port 587
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASS'),
            },
            // === LIGNE MAGIQUE QUI RÈGLE LE PROBLÈME ===
            family: 4, // Force IPv4 uniquement → évite queryAaaa
            // ============================================
            tls: {
                rejectUnauthorized: false, // À laisser en dev, à enlever en prod si certificat OK
            },
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        const mailOptions = {
            from: this.configService.get<string>('MAIL_USER'),
            to,
            subject,
            html,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email envoyé à ${to}`);
        } catch (error) {
            console.error('Erreur envoi email :', error);
            throw error; // Important : remonter l’erreur pour que ContactService la catch
        }
    }
}