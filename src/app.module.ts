import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './order/order.module';
import { InventoryModule } from './inventory/inventory.module';
import { AuthModule } from './auth/auth.module';
import { Order } from './order/entities/order.entity';
import { Product } from './inventory/entities/product.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      name: 'orderConnection',
      type: 'sqlite',
      database: 'db/order.db',
      entities: [Order],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'inventoryConnection',
      type: 'sqlite',
      database: 'db/inventory.db',
      entities: [Product],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    OrderModule,
    InventoryModule,
  ],
})
export class AppModule {}
