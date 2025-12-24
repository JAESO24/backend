// src/contact/dto/create-contact.dto.ts
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContactDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    phone?: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    message: string;
}
