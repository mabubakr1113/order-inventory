import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order, 'orderConnection')
    private orderRepository: Repository<Order>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    await this.orderRepository.save(order);
    this.eventEmitter.emit('order_created', { ...order, orderId: order.id });
    return order;
  }

  async handleOrderProcessed(payload: { orderId: string; status: string }) {
    await this.orderRepository.update(payload.orderId, {
      status: payload.status,
    });
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }
}
