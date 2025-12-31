// src/orders/entities/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'int' })
    price: number;

    @Column({ type: 'int' })
    quantity: number;

    @ManyToOne(() => Order, (order) => order.items, {
        onDelete: 'CASCADE',
    })
    order: Order;
}
