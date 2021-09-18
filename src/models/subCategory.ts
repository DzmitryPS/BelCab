import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Product } from ".";
import { SubCategoryData } from "../types";
import { Category } from "./category";

@Entity()
export class SubCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    name!: string;

    @ManyToOne(() => Category, category => category.subCategories)
    category!: Category;

    @ManyToMany(() => Product)
    @JoinTable()
    products?: Product[]

    getDataForFront(): SubCategoryData {
        return {
            id: this.id,
            category: this.category,
            products: this.products
        
    };
}
  }