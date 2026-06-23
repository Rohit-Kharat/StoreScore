import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';
import { Store } from '../../stores/entities/store.entity';

export enum UserRole {
  ADMIN = 'admin',
  NORMAL = 'normal',
  OWNER = 'owner',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string; // Hashed password, optional in JSON returns (we will select/exclude it)

  @Column({ length: 400 })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  // If the user is a Store Owner, they can manage/own a store.
  // One-to-one relation from User to Store (Store has the ownerId FK)
  @OneToOne(() => Store, (store) => store.owner)
  store?: Store;
}
