import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from '../../shared/enums/activity.enum.js';
import { ExperienceLevel } from '../../shared/enums/experience-level.enum.js';
import { Availability } from '../../shared/enums/availability.enum.js';
import { GeoPoint } from '../types/user.types.js';

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

  @Column({ type: 'enum', enum: Activity, nullable: true })
  activity: Activity | null;

  @Column({ type: 'enum', enum: ExperienceLevel, nullable: true })
  experienceLevel: ExperienceLevel | null;

  @Column({ type: 'enum', enum: Availability, nullable: true })
  availability: Availability | null;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: GeoPoint | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gymName: string | null;

  @Column({ type: 'varchar', array: true, default: '{}' })
  disciplines: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', array: true, default: '{}' })
  photos: string[];

  @Column({ type: 'int', default: 10 })
  searchDistanceKm: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
