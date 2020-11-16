import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserType } from '../enums/UserType';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({type: "enum", enum: UserType, default: UserType.STUDENT })
  type: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  modifiedDate: Date;

}
