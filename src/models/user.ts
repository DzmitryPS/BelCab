import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { DefaultDocumentData, UserData } from "../types";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: false })
  isAdmin?: boolean;

  @Column({ nullable: false, default: false })
  isSubscribed?: boolean;

  @Column({ nullable: true })
  password!: string;

  getDataForFront(): UserData {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      phoneNumber: this.phoneNumber,
      email: this.email,
      isSubscribed: this.isSubscribed
    };
  }
}