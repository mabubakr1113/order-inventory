import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { OnEvent } from '@nestjs/event-emitter';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return this.orderService.findAll();
  }

  @OnEvent('order_processed')
  async handleOrderProcessed(payload: { orderId: string; status: string }) {
    await this.orderService.handleOrderProcessed(payload);
  }
}
