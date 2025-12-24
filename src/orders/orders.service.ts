import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly mailService: MailService) {}

  async create(orderData: CreateOrderDto) {
    try {
      // 1️⃣ (OPTIONNEL) Sauvegarde en base
      // await this.orderRepository.save(orderData);

      const fullName = `${orderData.firstName} ${orderData.lastName}`;

      // 2️⃣ EMAIL CLIENT
      await this.mailService.sendMail(
        orderData.email,
        'Confirmation de votre commande – Volailles d’Or',
        `
        <div style="font-family: Arial, sans-serif;">
          <h2>Merci pour votre commande ${fullName} 🐔</h2>
          <p>Votre commande a bien été enregistrée.</p>

          <h3>Détails de la commande</h3>
          <ul>
            <li><strong>Téléphone :</strong> ${orderData.phone}</li>
            <li><strong>Adresse :</strong> ${orderData.address}, ${orderData.city}</li>
            <li><strong>Mode de paiement :</strong> ${orderData.paymentMethod}</li>
          </ul>

          <p>Nous vous contacterons très rapidement pour la livraison.</p>

          <br />
          <p><strong>Volailles d’Or</strong><br/>Qualité – Fraîcheur – Confiance</p>
        </div>
        `,
      );

      // 3️⃣ EMAIL ADMIN
      await this.mailService.sendMail(
        process.env.ADMIN_EMAIL!,
        '🛒 Nouvelle commande reçue – Volailles d’Or',
        `
        <div style="font-family: Arial, sans-serif;">
          <h2>Nouvelle commande 📦</h2>

          <h3>Client</h3>
          <ul>
            <li><strong>Nom :</strong> ${fullName}</li>
            <li><strong>Email :</strong> ${orderData.email}</li>
            <li><strong>Téléphone :</strong> ${orderData.phone}</li>
          </ul>

          <h3>Livraison</h3>
          <ul>
            <li><strong>Adresse :</strong> ${orderData.address}, ${orderData.city}</li>
            <li><strong>Notes :</strong> ${orderData.notes || 'Aucune'}</li>
          </ul>

          <h3>Paiement</h3>
          <p>${orderData.paymentMethod}</p>
        </div>
        `,
      );

      return {
        success: true,
        message: 'Commande enregistrée et emails envoyés avec succès',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Erreur lors du traitement de la commande',
      );
    }
  }
}
