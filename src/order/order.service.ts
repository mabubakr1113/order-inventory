import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const order = this.orderRepository.create(createOrderDto);
      await this.orderRepository.save(order);
      this.eventEmitter.emit('order_created', { ...order, orderId: order.id });
      return order;
    } catch {
      throw new InternalServerErrorException('Could not create order.');
    }
  }

  async handleOrderProcessed(payload: { orderId: string; status: string }) {
    const order = await this.orderRepository.findOneBy({ id: payload.orderId });
    if (!order) {
      throw new NotFoundException(
        `Order with ID "${payload.orderId}" not found`,
      );
    }
    try {
      await this.orderRepository.update(payload.orderId, {
        status: payload.status,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new InternalServerErrorException('Could not update order status.');
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      return this.orderRepository.find();
    } catch {
      throw new InternalServerErrorException('Could not retrieve orders.');
    }
  }
}
