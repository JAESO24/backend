import * as nodemailer from 'nodemailer';

export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        await this.transporter.sendMail({
            from: `"Volailles d'Or" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });
    }
}
