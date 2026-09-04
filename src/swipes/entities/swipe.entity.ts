import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { SwipeAction } from '../swipe-action.enum.js';

@Entity('swipes')
@Index(['swiper', 'swiped'], { unique: true })
export class Swipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'swiper_id' })
  swiper: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'swiped_id' })
  swiped: User;

  @Column({ type: 'enum', enum: SwipeAction })
  action: SwipeAction;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
