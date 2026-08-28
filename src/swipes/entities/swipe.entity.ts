import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity.js";

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

  @Column({ type: 'varchar', length: 10 })
  action: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
