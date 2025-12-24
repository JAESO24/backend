// src/contact/contact.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly service: ContactService) { }

    @Post()
    sendMessage(@Body() dto: CreateContactDto) {
        return this.service.create(dto);
    }
}
