// src/orders/dto/create-order.dto.ts
import {
  IsNotEmpty,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  paymentMethod: string;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
