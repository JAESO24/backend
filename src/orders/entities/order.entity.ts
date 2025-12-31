// src/orders/entities/order.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    paymentMethod: string;

    @Column({ type: 'int' })
    total: number;

    @OneToMany(() => OrderItem, (item) => item.order, {
        cascade: true,
        eager: true,
    })
    items: OrderItem[];

    @CreateDateColumn()
    createdAt: Date;
}
