import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ default: 'created' })
  status: string;
}
