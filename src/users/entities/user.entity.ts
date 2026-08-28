import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @Column({ type: 'varchar', nullable: true })
  activity: string;

  @Column({ type: 'varchar', nullable: true })
  experienceLevel: string;
  @Column({ type: 'varchar', nullable: true })
  availability: string;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true, })
  location: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
