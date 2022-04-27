import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import CreditCardBrand from './CreditCardBrand';

@Entity('credit_cards')
export default class CreditCards {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  closing_day: number;

  @Column()
  due_date: number;

  @Column()
  brand_id: string;

  @ManyToOne(() => CreditCardBrand)
  @JoinColumn({ name: 'brand_id' })
  credit_card_brand!: CreditCardBrand;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
