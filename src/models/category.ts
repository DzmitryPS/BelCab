import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from "typeorm";
  import { CategoryData } from "../types";
import { SubCategory } from "./subCategory";
  
  @Entity()
  export class Category {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ nullable: false })
    name!: string;

    @OneToMany(() => SubCategory, subCategory => subCategory.category, {onDelete: "SET NULL"})
    subCategories!: SubCategory[];
  
    getDataForFront(): CategoryData {
      return {
        id: this.id,
        name: this.name,
        subCategories: this.subCategories
      };
    }
  }