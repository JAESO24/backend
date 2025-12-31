import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
    @IsString()
    @IsNotEmpty({ message: 'Le nom est obligatoire' })
    name: string;

    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'L’email est obligatoire' })
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsNotEmpty({ message: 'Le sujet est obligatoire' })
    subject: string;

    @IsString()
    @IsNotEmpty({ message: 'Le message est obligatoire' })
    message: string;
}