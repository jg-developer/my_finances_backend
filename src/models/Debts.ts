import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import Categories from './Categories';

@Entity('debts')
export default class Debts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  observation: string;

  @Column()
  date: Date;

  @Column()
  value: number;

  @Column()
  installments: number;

  @Column()
  payment_type: string;

  @Column()
  category_id: string;

  @ManyToOne(() => Categories)
  @JoinColumn({ name: 'category_id' })
  category!: Categories;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
