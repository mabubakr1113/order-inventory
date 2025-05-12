import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Product } from './entities/product.entity';
import { InventoryOrderCreatedDto } from './dto/inventory-order-created.dto';

@Injectable()
export class InventoryService implements OnModuleInit {
  constructor(
    @InjectRepository(Product, 'inventoryConnection')
    private productRepository: Repository<Product>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async onModuleInit() {
    await this.seedProducts();
  }

  private async seedProducts() {
    const products = [
      { productId: '1', stock: 10 },
      { productId: '2', stock: 5 },
    ];

    for (const productData of products) {
      const existing = await this.productRepository.findOneBy({
        productId: productData.productId,
      });

      if (!existing) {
        await this.productRepository.save(
          this.productRepository.create(productData),
        );
      }
    }
  }

  async handleOrderCreated(order: InventoryOrderCreatedDto): Promise<void> {
    const product = await this.productRepository.findOneBy({
      productId: order.productId,
    });

    const result = {
      orderId: order.orderId,
      status: 'cancelled',
    };

    if (product && product.stock >= order.quantity) {
      product.stock -= order.quantity;
      await this.productRepository.save(product);
      result.status = 'confirmed';
    }

    this.eventEmitter.emit('order_processed', result);
  }
}
