// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) { }

  create(dto: CreateOrderDto) {
    const order = this.orderRepo.create(dto);
    return this.orderRepo.save(order);
  }

  findAll() {
    return this.orderRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }
    return order;
  }
}
