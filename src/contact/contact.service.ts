// src/contact/contact.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
    create(data: any) {
        console.log('📩 Nouveau message:', data);

        // PLUS TARD :
        // - enregistrer en DB
        // - envoyer email
        // - envoyer WhatsApp

        return { success: true, message: 'Message reçu' };
    }
}
