import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // ✅ Charge le fichier .env
    ConfigModule.forRoot({
      isGlobal: true, // accessible partout sans réimporter
      envFilePath: '.env',
    }),

    // ✅ Utilisation correcte des variables .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASS', ''),
        database: config.get('DB_NAME', 'volaillesdor'),
        autoLoadEntities: true,
        synchronize: true, // ❌ false en prod
        charset: 'utf8mb4',
      }),
    }),
  
    OrdersModule,
  ],
})
export class AppModule {}
