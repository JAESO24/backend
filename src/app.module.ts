import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'volaillesdor',
      autoLoadEntities: true,
      synchronize: true, // ❌ false en production
      charset: 'utf8mb4',
    }),
    OrdersModule,
  ],
})
export class AppModule { }
