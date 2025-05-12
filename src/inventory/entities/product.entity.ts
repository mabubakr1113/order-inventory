import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  productId: string;

  @Column()
  stock: number;
}
