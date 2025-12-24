import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  paymentMethod: string;

  notes?: string;
}
