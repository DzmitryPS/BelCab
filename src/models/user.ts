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
    firstName?: string;
  
    @Column({ nullable: true })
    lastName?: string;
  
    @Column({ nullable: true })
    address?: string;
  
    @Column({ nullable: true })
    phoneNumber?: string;
  
    @Column({ unique: true })
    email!: string;
  
    @Column({ default: false })
    isAdmin?: boolean;
  
    getDataForFront(): UserData {
      return {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        address: this.address,
        phoneNumber: this.phoneNumber,
        email: this.email,
        isAdmin: this.isAdmin
      };
    }
  }