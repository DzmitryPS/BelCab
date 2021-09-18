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


  @Column({ default: false })
  isAdmin?: boolean;

  @Column({ nullable: true })
  password!: string;

  getDataForFront(): UserData {
    return {
      id: this.id,
      name: this.name,
    };
  }
}