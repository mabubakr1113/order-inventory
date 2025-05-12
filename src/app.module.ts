import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { Order } from './order/entities/order.entity';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      name: 'orderConnection',
      type: 'sqlite',
      database: 'order.db',
      entities: [Order],
      synchronize: true,
    }),
    AuthModule,
    OrderModule,
  ],
})
export class AppModule {}
