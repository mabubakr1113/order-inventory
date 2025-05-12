import { Controller, Get } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InventoryService } from './inventory.service';
import { Product } from './entities/product.entity';
import { InventoryOrderCreatedDto } from './dto/inventory-order-created.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getProducts(): Promise<Product[]> {
    return this.inventoryService.findAll();
  }

  @OnEvent('order_created')
  async handleOrderCreatedEvent(order: InventoryOrderCreatedDto) {
    await this.inventoryService.adjustStockForOrder(order);
  }
}
